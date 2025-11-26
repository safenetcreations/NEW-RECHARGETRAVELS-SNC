
import React from 'react';
import TransferBookingForm from '../components/TransferBookingForm';

const TransferBookingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book Your Transfer
          </h1>
          <p className="text-xl text-gray-600">
            Professional transport services across Sri Lanka
          </p>
        </div>
        
        <div className="flex justify-center">
          <TransferBookingForm />
        </div>
      </div>
    </div>
  );
};

export default TransferBookingPage;
