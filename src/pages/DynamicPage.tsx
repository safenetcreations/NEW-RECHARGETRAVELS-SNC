import React from 'react';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const DynamicPage: React.FC = () => {
  return (
    <>
      <Header />
      <DynamicPageRenderer />
      <Footer />
    </>
  );
};

export default DynamicPage; 