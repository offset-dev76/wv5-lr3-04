import { useState, useEffect, useCallback } from 'react';

export type RestaurantFocusSection = 'nav' | 'categories' | 'menu-items' | 'place-order' | 'ai-button';

interface RestaurantNavigationState {
  currentSection: RestaurantFocusSection;
  focusedIndex: number;
}

export const useRestaurantNavigation = (
  categoriesCount: number,
  menuItemsCount: number,
  navItemsCount: number = 4
) => {
  const [navigation, setNavigation] = useState<RestaurantNavigationState>({
    currentSection: 'categories',
    focusedIndex: 0,
  });

  const scrollToFocusedItem = useCallback((containerId: string, index: number) => {
    const container = document.getElementById(containerId);
    const item = container?.children[index] as HTMLElement;
    if (container && item) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      
      // For vertical scrolling in menu items
      if (itemRect.top < containerRect.top || itemRect.bottom > containerRect.bottom) {
        item.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, []);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    setNavigation((prevNavigation) => {
      const { currentSection, focusedIndex } = prevNavigation;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (currentSection === 'nav') {
            return { currentSection: 'categories', focusedIndex: 0 };
          } else if (currentSection === 'categories' && focusedIndex < categoriesCount - 1) {
            return { currentSection, focusedIndex: focusedIndex + 1 };
          } else if (currentSection === 'menu-items' && focusedIndex < menuItemsCount - 1) {
            const newIndex = focusedIndex + 1;
            setTimeout(() => scrollToFocusedItem('menu-items-container', newIndex), 0);
            return { currentSection, focusedIndex: newIndex };
          }
          break;

        case 'ArrowUp':
          event.preventDefault();
          if (currentSection === 'categories' && focusedIndex > 0) {
            return { currentSection, focusedIndex: focusedIndex - 1 };
          } else if (currentSection === 'categories' && focusedIndex === 0) {
            return { currentSection: 'nav', focusedIndex: 0 };
          } else if (currentSection === 'menu-items' && focusedIndex > 0) {
            const newIndex = focusedIndex - 1;
            setTimeout(() => scrollToFocusedItem('menu-items-container', newIndex), 0);
            return { currentSection, focusedIndex: newIndex };
          } else if (currentSection === 'place-order') {
            return { currentSection: 'menu-items', focusedIndex: 0 };
          }
          break;

        case 'ArrowLeft':
          event.preventDefault();
          if (currentSection === 'ai-button') {
            return { currentSection: 'nav', focusedIndex: navItemsCount - 1 };
          } else if (currentSection === 'nav' && focusedIndex > 0) {
            return { currentSection, focusedIndex: focusedIndex - 1 };
          } else if (currentSection === 'menu-items') {
            return { currentSection: 'categories', focusedIndex: 0 };
          } else if (currentSection === 'place-order') {
            return { currentSection: 'menu-items', focusedIndex: 0 };
          }
          break;

        case 'ArrowRight':
          event.preventDefault();
          if (currentSection === 'nav' && focusedIndex < navItemsCount - 1) {
            return { currentSection, focusedIndex: focusedIndex + 1 };
          } else if (currentSection === 'nav' && focusedIndex === navItemsCount - 1) {
            return { currentSection: 'ai-button', focusedIndex: 0 };
          } else if (currentSection === 'categories') {
            return { currentSection: 'menu-items', focusedIndex: 0 };
          } else if (currentSection === 'menu-items') {
            return { currentSection: 'place-order', focusedIndex: 0 };
          }
          break;

        case 'Enter':
          event.preventDefault();
          if (currentSection === 'nav') {
            const navElement = document.querySelector(`#navigation-bar button:nth-child(${focusedIndex + 1})`) as HTMLElement;
            if (navElement) navElement.click();
          } else if (currentSection === 'ai-button') {
            const aiButton = document.getElementById('ai-orb-button');
            if (aiButton) aiButton.click();
          } else if (currentSection === 'categories') {
            const categoryElement = document.querySelector(`#categories-container > *:nth-child(${focusedIndex + 1})`) as HTMLElement;
            if (categoryElement) categoryElement.click();
          } else if (currentSection === 'menu-items') {
            const menuElement = document.querySelector(`#menu-items-container > *:nth-child(${focusedIndex + 1})`) as HTMLElement;
            if (menuElement) menuElement.click();
          } else if (currentSection === 'place-order') {
            const orderButton = document.getElementById('place-order-button');
            if (orderButton) orderButton.click();
          }
          break;
      }
      return prevNavigation;
    });
  }, [categoriesCount, menuItemsCount, navItemsCount, scrollToFocusedItem]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return navigation;
};