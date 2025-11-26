import React from 'react';
import DestinationPage from '@/components/DestinationPage';
import { destinationConfigs } from '@/utils/createDestinationPage';

const Bentota = () => {
  return <DestinationPage config={destinationConfigs.bentota} />;
};

export default Bentota;