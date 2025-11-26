import React from 'react';
import DestinationPage from '@/components/DestinationPage';
import { destinationConfigs } from '@/utils/createDestinationPage';

const Hikkaduwa = () => {
  return <DestinationPage config={destinationConfigs.hikkaduwa} />;
};

export default Hikkaduwa;