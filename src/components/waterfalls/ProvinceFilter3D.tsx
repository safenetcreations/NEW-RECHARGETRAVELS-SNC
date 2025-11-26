
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin, Mountain, Filter, RotateCcw } from 'lucide-react';
import { getAllProvinces } from '@/data/locations/waterfalls';

interface ProvinceFilter3DProps {
  selectedProvince: string;
  heightRange: [number, number];
  onProvinceChange: (province: string) => void;
  onHeightRangeChange: (range: [number, number]) => void;
  onTogglePanorama: () => void;
  isPanoramaMode: boolean;
}

export function ProvinceFilter3D({
  selectedProvince,
  heightRange,
  onProvinceChange,
  onHeightRangeChange,
  onTogglePanorama,
  isPanoramaMode
}: ProvinceFilter3DProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const provinces = getAllProvinces();
  
  const resetFilters = () => {
    onProvinceChange('all');
    onHeightRangeChange([0, 300]);
  };

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-blue-200 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            
            {/* Province Filter */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Province
              </label>
              <Select value={selectedProvince} onValueChange={onProvinceChange}>
                <SelectTrigger className="w-full bg-white border-slate-300 hover:border-blue-400 transition-colors">
                  <SelectValue placeholder="Select Province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Provinces</SelectItem>
                  {provinces.map(province => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Height Range Filter */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Mountain className="w-4 h-4 inline mr-1" />
                Height Range: {heightRange[0]}m - {heightRange[1]}m
              </label>
              <div className="px-2">
                <Slider
                  value={heightRange}
                  onValueChange={(value) => onHeightRangeChange(value as [number, number])}
                  max={300}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="hover:bg-slate-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              
              <Button
                size="sm"
                onClick={onTogglePanorama}
                className={`transition-all duration-300 ${
                  isPanoramaMode
                    ? 'bg-gradient-to-r from-gold to-yellow-400 text-black hover:shadow-lg'
                    : 'bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700'
                }`}
              >
                <Globe className="w-4 h-4 mr-1" />
                {isPanoramaMode ? 'Exit Panorama' : 'Panorama Mode'}
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedProvince !== 'all' || heightRange[0] > 0 || heightRange[1] < 300) && (
            <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-200">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">Active filters:</span>
              
              {selectedProvince !== 'all' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {selectedProvince}
                </Badge>
              )}
              
              {(heightRange[0] > 0 || heightRange[1] < 300) && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {heightRange[0]}m - {heightRange[1]}m
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3D Globe Panorama Mode */}
      {isPanoramaMode && (
        <Card className="bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900 text-white border-blue-700 shadow-2xl">
          <CardContent className="p-6">
            <div className="relative h-96 bg-gradient-to-br from-blue-800/30 to-teal-800/30 rounded-lg overflow-hidden">
              {/* 3D Globe Background */}
              <div className="absolute inset-0 bg-gradient-radial from-blue-400/20 via-teal-500/10 to-transparent" />
              
              {/* Rotating Globe Effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 via-blue-500/20 to-teal-600/30 rounded-full animate-slow-pan" />
                  <div className="absolute inset-4 bg-gradient-to-br from-blue-600/40 via-teal-500/30 to-green-400/20 rounded-full animate-slow-pan animation-reverse" />
                  
                  {/* Waterfall Pins */}
                  {provinces.map((province, index) => (
                    <div
                      key={province}
                      className="absolute w-3 h-3 bg-gold rounded-full animate-pulse cursor-pointer hover:scale-150 transition-transform"
                      style={{
                        top: `${20 + index * 12}%`,
                        left: `${30 + (index % 3) * 20}%`,
                      }}
                      title={province}
                    />
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <div className="text-sm text-blue-200">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Interactive 3D Globe - Click pins to explore
                </div>
                <div className="text-sm text-blue-200">
                  {provinces.length} Provinces • 20 Waterfalls
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
