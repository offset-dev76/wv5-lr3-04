import { useState, useEffect, useCallback } from 'react';
import { useAIOrbFocus } from './useAIOrbFocus';

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
  const { isFocused: isAIFocused, setFocused: setAIFocused } = useAIOrbFocus();
  
  const [navigation, setNavigation] = useState<RestaurantNavigationState>({
    currentSection: isAIFocused ? 'ai-button' : 'categories',
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
            setAIFocused(false);
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
            setAIFocused(true);
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
            // Trigger navigation click in UnifiedHeader - use the same approach as main navigation
            const headerButtons = document.querySelectorAll('.bg-black\\/30 button, .bg-black\\/30 .cursor-pointer');
            const targetButton = headerButtons[focusedIndex] as HTMLElement;
            if (targetButton) targetButton.click();
          } else if (currentSection === 'ai-button') {
            const aiButton = document.getElementById('ai-orb-button');
            if (aiButton) aiButton.click();
          } else if (currentSection === 'categories') {
            const categoryElement = document.querySelector(`#categories-container > *:nth-child(${focusedIndex + 1})`) as HTMLElement;
            if (categoryElement) categoryElement.click();
          } else if (currentSection === 'menu-items') {
            // Fix: Find the correct menu item by counting through all categories
            let currentIndex = 0;
            const categories = ["Pizza", "Salads", "Main Course", "Pasta", "Burgers", "Dessert", "Appetizers"];
            for (const category of categories) {
              const categoryItems = document.querySelectorAll(`#category-section-${category.toLowerCase()} .cursor-pointer`);
              if (focusedIndex < currentIndex + categoryItems.length) {
                const targetItem = categoryItems[focusedIndex - currentIndex] as HTMLElement;
                if (targetItem) targetItem.click();
                break;
              }
              currentIndex += categoryItems.length;
            }
          } else if (currentSection === 'place-order') {
            const orderButton = document.getElementById('place-order-button');
            if (orderButton) orderButton.click();
          }
          break;
      }
      return prevNavigation;
    });
  }, [categoriesCount, menuItemsCount, navItemsCount, scrollToFocusedItem, setAIFocused]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return navigation;
};