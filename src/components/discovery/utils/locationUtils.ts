
import { Home, Mountain, Palmtree, Star, Waves } from 'lucide-react';

export const getLocationIcon = (type: string) => {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    temple: Home,
    historical: Mountain,
    wildlife: Palmtree,
    colonial: Star,
    hiking: Mountain,
    beach: Waves
  };
  return iconMap[type] || Home;
};

export const getLocationColor = (type: string) => {
  const colorMap: { [key: string]: string } = {
    temple: 'text-yellow-400',
    historical: 'text-orange-400',
    wildlife: 'text-green-400',
    colonial: 'text-blue-400',
    hiking: 'text-purple-400',
    beach: 'text-cyan-400'
  };
  return colorMap[type] || 'text-gray-400';
};
