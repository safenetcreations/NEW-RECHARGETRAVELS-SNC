import React from 'react';
import DestinationPage from '@/components/DestinationPage';
import { destinationConfigs } from '@/utils/createDestinationPage';

const NuwaraEliya = () => {
  return <DestinationPage config={destinationConfigs.nuwaraeliya} />;
};

export default NuwaraEliya;