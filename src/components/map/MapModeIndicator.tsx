
import React from 'react';
import { Shield } from 'lucide-react';

interface MapModeIndicatorProps {
  mode: 'demo' | 'secure';
}

export const MapModeIndicator = ({ mode }: MapModeIndicatorProps) => (
  <div className="absolute top-2 right-2 z-10 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center">
    <Shield className="h-3 w-3 mr-1" />
    {mode === 'demo' ? 'Demo Mode' : 'Secure Mode'}
  </div>
);
