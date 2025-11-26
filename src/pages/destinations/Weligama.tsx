import React from 'react';
import DestinationPage from '@/components/DestinationPage';
import { destinationConfigs } from '@/utils/createDestinationPage';

const Weligama = () => {
  return <DestinationPage config={destinationConfigs.weligama} />;
};

export default Weligama;