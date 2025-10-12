
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface POIFeature {
  type: string;
  properties: {
    name: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}

interface InfoPanelProps {
  selectedPoi: POIFeature;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose: () => void;
  streetViewRef: React.RefObject<HTMLDivElement>;
  geminiContent: string;
  wikipediaContent: string;
  youtubeContent: any[];
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  selectedPoi,
  activeTab,
  onTabChange,
  onClose,
  streetViewRef,
  geminiContent,
  wikipediaContent,
  youtubeContent
}) => {
  return (
    <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-20 transform transition-transform duration-300">
      <div className="flex flex-col h-full">
        {/* Panel Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 truncate">
            {selectedPoi.properties.name || 'Location Details'}
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <X className="w-6 h-6 text-gray-600" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="p-4 border-b">
          <div className="grid grid-cols-4 gap-1 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'dive-in', label: 'Dive In' },
              { key: 'insights', label: '✨ Insights' },
              { key: 'history', label: 'History' },
              { key: 'videos', label: 'Videos' }
            ].map(tab => (
              <Button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`p-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-gray-900 font-semibold'
                    : 'bg-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-grow overflow-y-auto p-4">
          {activeTab === 'dive-in' && (
            <div
              ref={streetViewRef}
              className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center"
            >
              <p className="text-gray-500">Loading Street View...</p>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600 whitespace-pre-wrap">{geminiContent}</p>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600">{wikipediaContent}</p>
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="grid grid-cols-2 gap-4">
              {youtubeContent.length > 0 ? (
                youtubeContent.map((item, index) => (
                  <a
                    key={index}
                    href={`https://www.youtube.com/watch?v=${item.id.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={item.snippet.thumbnails.medium.url}
                        alt={item.snippet.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-xs font-medium text-gray-700 mt-2 truncate group-hover:text-blue-600">
                      {item.snippet.title}
                    </p>
                  </a>
                ))
              ) : (
                <p className="text-gray-500 col-span-2">No recent videos found nearby.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
