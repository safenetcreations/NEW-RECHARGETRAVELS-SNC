
import React from 'react';
import { Helmet } from 'react-helmet-async';
import CulturalHeritage from '@/components/admin/cultural/CulturalHeritage';

const CulturalHeritageAdmin: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Cultural Heritage Admin - Recharge Travels</title>
        <meta name="description" content="Manage cultural heritage tours, sites, and settings" />
      </Helmet>

      <CulturalHeritage />
    </>
  );
};

export default CulturalHeritageAdmin;
