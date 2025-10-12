
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 border-4 border-amber-200 border-t-yellow-500 rounded-full animate-spin"></div>
        <h2 className="text-2xl font-semibold text-green-900">
          Loading Your Wildlife Adventure...
        </h2>
      </div>
    </div>
  );
};

export default LoadingScreen;
