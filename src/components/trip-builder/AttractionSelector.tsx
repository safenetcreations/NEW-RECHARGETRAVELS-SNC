import React from 'react';
import { Check, Clock, DollarSign, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface Attraction {
    id: string;
    name: string;
    price: number;
    duration: number; // minutes
    description: string;
    category: 'Nature' | 'Culture' | 'Adventure' | 'Relaxation';
}

interface AttractionSelectorProps {
    attractions: Attraction[];
    selectedIds: string[];
    onToggle: (id: string) => void;
}

const AttractionSelector: React.FC<AttractionSelectorProps> = ({ attractions, selectedIds, onToggle }) => {
    if (!attractions || attractions.length === 0) {
        return <div className="text-sm text-gray-500 italic p-2">No specific attractions listed for this location.</div>;
    }

    return (
        <div className="space-y-2 mt-2">
            <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Available Experiences</h5>
            <div className="grid grid-cols-1 gap-2">
                {attractions.map((attraction) => {
                    const isSelected = selectedIds.includes(attraction.id);
                    return (
                        <div
                            key={attraction.id}
                            className={`
                                relative flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer
                                ${isSelected
                                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                                    : 'bg-white border-gray-100 hover:border-blue-100 hover:bg-gray-50'
                                }
                            `}
                            onClick={() => onToggle(attraction.id)}
                        >
                            <div className={`
                                flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition-colors
                                ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}
                            `}>
                                {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h6 className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                        {attraction.name}
                                    </h6>
                                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-5 bg-white">
                                        {attraction.category}
                                    </Badge>
                                </div>

                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {attraction.description}
                                </p>

                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{Math.floor(attraction.duration / 60)}h {attraction.duration % 60 > 0 ? `${attraction.duration % 60}m` : ''}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        <span>${attraction.price}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AttractionSelector;
