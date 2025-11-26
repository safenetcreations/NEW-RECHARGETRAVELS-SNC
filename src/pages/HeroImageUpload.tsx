import React from 'react';
import SimpleHeroImageManager from '@/components/admin/SimpleHeroImageManager';

export default function HeroImageUpload() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Configure Hero Background Images</h1>
        <SimpleHeroImageManager />
      </div>
    </div>
  );
}