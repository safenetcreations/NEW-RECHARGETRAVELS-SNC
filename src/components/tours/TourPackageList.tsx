
import React, { useState } from 'react';
import { useTourPackages } from '@/hooks/useTourPackages';
import TourPackageCard from './TourPackageCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { TourPackage } from '@/types/tour-package';
import { Search, FilterX } from 'lucide-react';

const TourPackageList: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: 'all',
    luxury_level: 'all',
    min_price: 0,
    max_price: 10000,
    search: ''
  });
  
  const { tourPackages, isLoading, error } = useTourPackages(filters);
  
  const handleViewDetails = (tourPackage: TourPackage) => {
    navigate(`/tours/${tourPackage.id}`);
  };
  
  const handleBookNow = (tourPackage: TourPackage) => {
    navigate(`/booking?tourId=${tourPackage.id}`);
  };
  
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      luxury_level: 'all',
      min_price: 0,
      max_price: 10000,
      search: ''
    });
  };
  
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'wildlife', label: 'Wildlife' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'beach', label: 'Beach' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'wellness', label: 'Wellness' },
    { value: 'tea', label: 'Tea Country' }
  ];
  
  const luxuryOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'semi-luxury', label: 'Semi-Luxury' },
    { value: 'budget', label: 'Budget' }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="search"
                placeholder="Search tours..."
                className="pl-9"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="luxury">Luxury Level</Label>
            <Select
              value={filters.luxury_level}
              onValueChange={(value) => handleFilterChange('luxury_level', value)}
            >
              <SelectTrigger id="luxury">
                <SelectValue placeholder="Select luxury level" />
              </SelectTrigger>
              <SelectContent>
                {luxuryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex justify-between">
              <Label>Price Range</Label>
              <span className="text-sm text-gray-500">
                ${filters.min_price} - ${filters.max_price}
              </span>
            </div>
            <Slider
              defaultValue={[filters.min_price, filters.max_price]}
              max={10000}
              step={100}
              onValueChange={(value) => {
                handleFilterChange('min_price', value[0]);
                handleFilterChange('max_price', value[1]);
              }}
              className="my-4"
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={handleResetFilters}
          >
            <FilterX className="h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </div>
      
      {/* Results Summary */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isLoading ? 'Loading tours...' : `${tourPackages.length} Tours Found`}
        </h2>
        <p className="text-gray-600">
          Discover amazing Sri Lanka tour packages tailored to your preferences
        </p>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 p-4 rounded-md text-red-700 mb-6">
          Error loading tour packages: {error}
        </div>
      )}
      
      {/* Tour Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tourPackages.map((tourPackage) => (
            <TourPackageCard 
              key={tourPackage.id} 
              tourPackage={tourPackage} 
              onViewDetails={handleViewDetails}
              onBookNow={handleBookNow}
            />
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {!isLoading && !error && tourPackages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tours found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default TourPackageList;
