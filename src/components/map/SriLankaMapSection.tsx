
import React, { useState } from 'react';
import { Globe, Map, Info } from 'lucide-react';
import SriLankaInternationalMap from './SriLankaInternationalMap';

const SriLankaMapSection = () => {
  const [activeView, setActiveView] = useState<'international' | 'regional' | 'facts'>('international');

  return (
    <div className="w-full space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveView('international')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeView === 'international' 
              ? 'bg-white text-green-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          International View
        </button>
        <button
          onClick={() => setActiveView('regional')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeView === 'regional' 
              ? 'bg-white text-green-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Map className="w-4 h-4" />
          Regional Context
        </button>
        <button
          onClick={() => setActiveView('facts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            activeView === 'facts' 
              ? 'bg-white text-green-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Info className="w-4 h-4" />
          Strategic Facts
        </button>
      </div>

      {/* Map Views */}
      {activeView === 'international' && (
        <SriLankaInternationalMap height="600px" showNeighbors={true} showRoutes={true} />
      )}

      {activeView === 'regional' && (
        <SriLankaInternationalMap height="600px" showNeighbors={true} showRoutes={false} />
      )}

      {activeView === 'facts' && (
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 border-2 border-green-200">
          <h3 className="text-2xl font-bold text-green-800 mb-6">🌏 Sri Lanka's Strategic Position</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-bold text-green-700 mb-2">🗺️ Geographic Advantage</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Located at the crossroads of major sea routes</li>
                  <li>• Strategic position in the Indian Ocean</li>
                  <li>• Natural deep-water harbors</li>
                  <li>• Gateway between East and West</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-bold text-blue-700 mb-2">🚢 Maritime Heritage</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Ancient port cities like Galle and Trincomalee</li>
                  <li>• Historical trading hub for spices</li>
                  <li>• Connection point for Silk Road maritime routes</li>
                  <li>• Modern Colombo Port - regional hub</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-bold text-purple-700 mb-2">✈️ Air Connectivity</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Bandaranaike International Airport hub</li>
                  <li>• 4-hour flight to major Asian cities</li>
                  <li>• Direct connections to Europe and Middle East</li>
                  <li>• Growing cargo and transit hub</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-bold text-orange-700 mb-2">🏝️ Island Nation Benefits</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• 1,340 km of pristine coastline</li>
                  <li>• Diverse climate zones within small area</li>
                  <li>• Rich biodiversity and cultural heritage</li>
                  <li>• Year-round tourist destination</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-green-100 rounded-lg p-4">
            <h4 className="font-bold text-green-800 mb-2">🌟 Why Sri Lanka Matters Globally</h4>
            <p className="text-sm text-gray-700">
              Sri Lanka's unique position in the Indian Ocean makes it a crucial link in global trade routes. 
              The island has served as a bridge between cultures for over 2,000 years, from ancient spice traders 
              to modern shipping lanes. Today, it continues to be a vital hub for tourism, trade, and cultural exchange 
              in South Asia.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SriLankaMapSection;
