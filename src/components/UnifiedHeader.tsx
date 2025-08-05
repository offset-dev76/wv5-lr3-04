import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WeatherWidget from './WeatherWidget';
import { Clock } from 'lucide-react';
interface UnifiedHeaderProps {
  focused: boolean;
  focusedIndex: number;
  onWeatherChange: (condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy') => void;
}
type NavItem = {
  name: string;
  path: string;
  type: 'nav';
};
type TimeItem = {
  name: string;
  type: 'time';
};
type WeatherItem = {
  name: string;
  type: 'weather';
};
type HeaderItem = NavItem | TimeItem | WeatherItem;
const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  focused,
  focusedIndex,
  onWeatherChange
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  const navItems: NavItem[] = [{
    name: 'Home',
    path: '/',
    type: 'nav'
  }, {
    name: 'Apps',
    path: '/apps',
    type: 'nav'
  }, {
    name: 'Restaurant',
    path: '/restaurant',
    type: 'nav'
  }];
  const allItems: HeaderItem[] = [...navItems, {
    name: getCurrentTime(),
    type: 'time'
  }, {
    name: 'Weather',
    type: 'weather'
  }];
  const handleNavClick = (path: string) => {
    navigate(path);
  };
  return <div className="flex justify-center w-full p-6 md:p-8">
      <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-full shadow-2xl py-[4px] px-[4px]">
        <div className="flex items-center space-x-2">
          {allItems.map((item, index) => {
          const isActive = item.type === 'nav' && 'path' in item && location.pathname === item.path;
          const isFocused = focused && focusedIndex === index;
          if (item.type === 'weather') {
            return <div key="weather" className={`
                    h-10 flex items-center transition-all duration-300 rounded-full px-3
                    ${isFocused ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'}
                  `}>
                  <WeatherWidget onWeatherChange={onWeatherChange} />
                </div>;
          }
          if (item.type === 'time') {
            return <div key="time" className={`
                    h-10 flex items-center text-gray-300 transition-all duration-300 rounded-full px-3
                    ${isFocused ? 'bg-white/20 shadow-lg text-white' : 'hover:bg-white/10 hover:text-white'}
                  `}>
                  <Clock size={16} className="mr-2" />
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {getCurrentTime()}
                  </span>
                </div>;
          }

          // Navigation items - must be nav type here
          if (item.type === 'nav') {
            return <button key={item.path} onClick={() => handleNavClick(item.path)} className={`
                    h-10 text-sm font-medium transition-all duration-300 rounded-full px-4 flex items-center whitespace-nowrap
                    ${isActive || isFocused ? 'bg-white/20 text-white shadow-lg text-shadow-glow' : 'text-gray-300 hover:text-white hover:bg-white/10'}
                  `}>
                  {item.name}
                </button>;
          }
          return null;
        })}
        </div>
      </div>
    </div>;
};
export default UnifiedHeader;