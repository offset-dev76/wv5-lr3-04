import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Play, Info } from 'lucide-react';
import type { CarouselApi } from '@/components/ui/carousel';
interface CarouselItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}
const carouselItems: CarouselItem[] = [{
  id: 1,
  title: "The Latest Blockbuster",
  description: "Experience the most thrilling adventure of the year with stunning visuals and an epic storyline.",
  image: "/lovable-uploads/ef5a1f6f-4ce1-4183-9610-66d923750591.png",
  category: "Action & Adventure"
}, {
  id: 2,
  title: "Trending Drama Series",
  description: "Dive into compelling characters and emotional storytelling in this critically acclaimed series.",
  image: "/lovable-uploads/8acfad30-aa90-4edd-b779-aafd43058584.png",
  category: "Drama"
}, {
  id: 3,
  title: "Comedy Special",
  description: "Laugh out loud with the funniest content available on your smart TV platform.",
  image: "/lovable-uploads/ada582c7-709e-480e-8494-1461b602567c.png",
  category: "Comedy"
}];
const TVCarousel: React.FC = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const autoScrollRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!api) return;

    // Auto-scroll every 5 seconds
    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        api.scrollNext();
      }, 5000);
    };

    const stopAutoScroll = () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };

    // Start auto-scroll
    startAutoScroll();

    // Listen for manual navigation to restart auto-scroll timer
    api.on('select', () => {
      stopAutoScroll();
      startAutoScroll();
    });

    // Keyboard navigation support
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle if carousel section is focused
      const navigation = (window as any).currentNavigation;
      if (navigation?.currentSection === 'carousel') {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          stopAutoScroll();
          api.scrollPrev();
          startAutoScroll();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          stopAutoScroll();
          api.scrollNext();
          startAutoScroll();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      stopAutoScroll();
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [api]);

  return <Carousel className="w-full opacity-92 focus-within:opacity-100 transition-opacity duration-300" setApi={setApi}>
      <CarouselContent>
        {carouselItems.map(item => <CarouselItem key={item.id}>
            <Card className="relative overflow-hidden border-none bg-transparent">
              <div className="relative h-[500px] w-full">
                {/* Background image with fade effect */}
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover opacity-0 animate-fade-in"
                  style={{ animationDuration: '1s', animationFillMode: 'forwards' }}
                />
                
                {/* Gradient overlay - also fades with image */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent opacity-0 animate-fade-in" 
                     style={{ animationDuration: '1s', animationFillMode: 'forwards' }} />
                
                {/* Content - always 100% opacity */}
                <div className="absolute bottom-0 left-0 p-8 text-white max-w-lg opacity-100">
                  <h2 className="text-5xl md:text-6xl font-black mb-4">{item.title}</h2>
                  <p className="text-gray-300 mb-6 text-lg">{item.description}</p>
                  <div className="flex gap-4">
                    <button className="bg-white text-black px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors">
                      <Play size={20} fill="currentColor" />
                      Play Now
                    </button>
                    <button className="bg-gray-600/80 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-600 transition-colors">
                      <Info size={20} />
                      More Info
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </CarouselItem>)}
      </CarouselContent>
      
      <CarouselPrevious data-carousel-prev />
      <CarouselNext data-carousel-next />
    </Carousel>;
};
export default TVCarousel;