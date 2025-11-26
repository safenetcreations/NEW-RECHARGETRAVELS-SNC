import React, { useState } from 'react';
import DiscoverHeroSection from './DiscoverHeroSection';
import CategoriesSection from './CategoriesSection';
import ToursSection from './ToursSection';

const DiscoverSriLanka: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    // Scroll to tours section
    document.getElementById('tours')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    // Scroll to tours section
    document.getElementById('tours')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFilterChange = (filter: string) => {
    setActiveCategory(filter);
  };

  const handleExploreDestinations = () => {
    // Scroll to destinations section
    document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="discover-sri-lanka">
      <DiscoverHeroSection 
        onSearch={handleSearch}
        onExploreDestinations={handleExploreDestinations}
      />
      
      <CategoriesSection 
        onCategorySelect={handleCategorySelect}
      />
      
      <ToursSection 
        activeFilter={activeCategory}
        searchQuery={searchQuery}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default DiscoverSriLanka;