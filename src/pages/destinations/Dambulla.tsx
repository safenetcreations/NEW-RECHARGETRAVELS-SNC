import React from 'react';
import DestinationPage from '@/components/DestinationPage';
import { destinationConfigs } from '@/utils/createDestinationPage';

const Dambulla = () => {
  return <DestinationPage config={destinationConfigs.dambulla} />;
};

export default Dambulla;