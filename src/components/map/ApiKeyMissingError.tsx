
import React from 'react';
import { MapPin } from 'lucide-react';

interface ApiKeyMissingErrorProps {
  height: string;
}

export const ApiKeyMissingError = ({ height }: ApiKeyMissingErrorProps) => (
  <div className="w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border-2 border-dashed border-blue-300" style={{ height }}>
    <div className="text-center p-8 max-w-md">
      <MapPin className="h-16 w-16 text-blue-500 mx-auto mb-6" />
      <h3 className="text-2xl font-bold text-blue-800 mb-4">Interactive Map Coming Soon</h3>
      <p className="text-blue-700 text-lg mb-4">
        We're setting up our interactive wildlife map to show you amazing destinations across Sri Lanka.
      </p>
      <div className="mt-6 text-sm text-left text-gray-600 bg-white/80 p-4 rounded-lg">
        <p className="mb-2"><strong>What you'll see:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>🐆 Wildlife hotspots and national parks</li>
          <li>🏖️ Beautiful beaches and coastal areas</li>
          <li>🛕 Cultural sites and ancient temples</li>
          <li>💧 Stunning waterfalls and natural wonders</li>
          <li>📸 Photo galleries and live information</li>
        </ul>
      </div>
      <p className="text-blue-600 text-sm mt-4 font-medium">
        Check back soon for the full interactive experience!
      </p>
    </div>
  </div>
);
