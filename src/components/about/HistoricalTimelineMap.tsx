
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, MapPin, Calendar, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface HistoricalPeriod {
  year: number;
  title: string;
  description: string;
  keyEvents: string[];
  mapStyle: string;
  colorScheme: string;
  landmarks: Array<{
    name: string;
    x: number;
    y: number;
    description: string;
  }>;
}

const historicalPeriods: HistoricalPeriod[] = [
  {
    year: 1500,
    title: "Ancient Ceylon - Kingdom Era",
    description: "The island of Ceylon with ancient kingdoms of Kandy, Kotte, and Jaffna. Spice trade routes connected the island to the world.",
    keyEvents: [
      "Kingdoms of Kandy, Kotte, and Jaffna flourish",
      "Spice trade brings international merchants",
      "Buddhist and Hindu temples dominate landscape",
      "Traditional irrigation systems sustain agriculture"
    ],
    mapStyle: "ancient",
    colorScheme: "from-amber-100 to-orange-200",
    landmarks: [
      { name: "Kandy Kingdom", x: 50, y: 45, description: "Mountain kingdom, last to fall to colonizers" },
      { name: "Kotte Kingdom", x: 45, y: 55, description: "Powerful coastal kingdom" },
      { name: "Jaffna Kingdom", x: 48, y: 15, description: "Northern Tamil kingdom" }
    ]
  },
  {
    year: 1600,
    title: "Portuguese Ceylon (1505-1658)",
    description: "Portuguese establish coastal control, introducing Christianity and European architecture. Fortresses built along the coast.",
    keyEvents: [
      "Portuguese establish first European foothold",
      "Coastal fortresses constructed",
      "Christianity introduced",
      "Cinnamon trade monopolized"
    ],
    mapStyle: "portuguese",
    colorScheme: "from-red-100 to-yellow-200",
    landmarks: [
      { name: "Colombo Fort", x: 42, y: 55, description: "Portuguese administrative center" },
      { name: "Galle Fort", x: 38, y: 65, description: "Strategic coastal fortress" },
      { name: "Negombo", x: 40, y: 52, description: "Cinnamon trading post" }
    ]
  },
  {
    year: 1700,
    title: "Dutch Ceylon (1658-1796)",
    description: "Dutch East India Company takes control, expanding inland. Canal systems and plantation agriculture developed.",
    keyEvents: [
      "Dutch East India Company dominance",
      "Extensive canal network built",
      "Plantation agriculture expanded",
      "Legal and administrative systems established"
    ],
    mapStyle: "dutch",
    colorScheme: "from-blue-100 to-orange-200",
    landmarks: [
      { name: "Dutch Colombo", x: 42, y: 55, description: "Colonial administrative capital" },
      { name: "Canal Network", x: 40, y: 50, description: "Dutch engineering marvel" },
      { name: "Cinnamon Gardens", x: 43, y: 54, description: "Spice cultivation center" }
    ]
  },
  {
    year: 1815,
    title: "British Ceylon (1796-1948)",
    description: "British rule unifies the island. Tea plantations transform the highlands. Railway system connects the country.",
    keyEvents: [
      "Last Kingdom of Kandy falls to British",
      "Tea plantations established in hill country",
      "Railway network built",
      "English education system introduced"
    ],
    mapStyle: "british",
    colorScheme: "from-green-100 to-blue-200",
    landmarks: [
      { name: "Colombo Port", x: 42, y: 55, description: "Major British naval base" },
      { name: "Kandy", x: 50, y: 45, description: "Last kingdom conquered 1815" },
      { name: "Nuwara Eliya", x: 52, y: 48, description: "Hill station and tea country" },
      { name: "Railway Lines", x: 46, y: 50, description: "Connecting highlands to coast" }
    ]
  },
  {
    year: 1948,
    title: "Independent Ceylon (1948-1972)",
    description: "Ceylon gains independence from Britain. Democratic governance established while maintaining Commonwealth ties.",
    keyEvents: [
      "Independence achieved February 4, 1948",
      "Democratic constitution adopted",
      "Sinhala Only Act passed (1956)",
      "Economic diversification begins"
    ],
    mapStyle: "independence",
    colorScheme: "from-yellow-100 to-red-200",
    landmarks: [
      { name: "Parliament", x: 43, y: 55, description: "Seat of independent government" },
      { name: "University of Ceylon", x: 44, y: 54, description: "Higher education expansion" },
      { name: "Colombo Plan", x: 42, y: 55, description: "Regional development initiative" }
    ]
  },
  {
    year: 1972,
    title: "Republic of Sri Lanka (1972-1990)",
    description: "Ceylon becomes the Republic of Sri Lanka. New constitution and economic policies reshape the nation.",
    keyEvents: [
      "Becomes Republic of Sri Lanka (1972)",
      "New constitution adopted",
      "Economic liberalization begins",
      "Ethnic tensions escalate"
    ],
    mapStyle: "republic",
    colorScheme: "from-orange-100 to-green-200",
    landmarks: [
      { name: "Sri Jayawardenepura", x: 44, y: 56, description: "New administrative capital" },
      { name: "Free Trade Zones", x: 40, y: 52, description: "Industrial development" },
      { name: "Mahaweli Project", x: 55, y: 40, description: "Major irrigation scheme" }
    ]
  },
  {
    year: 2024,
    title: "Modern Sri Lanka - Digital Age",
    description: "Contemporary Sri Lanka emerges as a digital hub and tourist destination, balancing tradition with modernity.",
    keyEvents: [
      "Tourism industry flourishes",
      "Technology sector grows",
      "Infrastructure modernization",
      "Cultural heritage preservation"
    ],
    mapStyle: "modern",
    colorScheme: "from-blue-100 to-purple-200",
    landmarks: [
      { name: "Colombo City", x: 42, y: 55, description: "Modern commercial capital" },
      { name: "Hambantota Port", x: 48, y: 68, description: "New deep-water port" },
      { name: "Tech Parks", x: 44, y: 54, description: "IT and innovation hubs" },
      { name: "Cultural Triangle", x: 52, y: 35, description: "UNESCO World Heritage sites" }
    ]
  }
];

const HistoricalTimelineMap = () => {
  const [currentPeriodIndex, setCurrentPeriodIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [selectedLandmark, setSelectedLandmark] = useState<any>(null);

  const currentPeriod = historicalPeriods[currentPeriodIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentPeriodIndex((prev) => 
          prev < historicalPeriods.length - 1 ? prev + 1 : 0
        );
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePeriodClick = (index: number) => {
    setCurrentPeriodIndex(index);
    setIsAutoPlaying(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const resetTimeline = () => {
    setCurrentPeriodIndex(0);
    setIsAutoPlaying(false);
  };

  const getMapBackground = (style: string) => {
    const styles = {
      ancient: 'bg-gradient-to-br from-amber-50 to-orange-100',
      portuguese: 'bg-gradient-to-br from-red-50 to-yellow-100',
      dutch: 'bg-gradient-to-br from-blue-50 to-orange-100',
      british: 'bg-gradient-to-br from-green-50 to-blue-100',
      independence: 'bg-gradient-to-br from-yellow-50 to-red-100',
      republic: 'bg-gradient-to-br from-orange-50 to-green-100',
      modern: 'bg-gradient-to-br from-blue-50 to-purple-100'
    };
    return styles[style as keyof typeof styles] || styles.ancient;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Timeline Controls */}
      <div className="flex justify-center items-center space-x-4 p-4 bg-white rounded-lg shadow-lg">
        <Button
          onClick={resetTimeline}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </Button>
        
        <Button
          onClick={toggleAutoPlay}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
        >
          {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isAutoPlaying ? 'Pause' : 'Auto Play'}</span>
        </Button>

        <div className="flex items-center space-x-2 text-green-800">
          <Calendar className="w-4 h-4" />
          <span className="font-bold text-lg">{currentPeriod.year} AD</span>
        </div>
      </div>

      {/* Interactive Timeline */}
      <div className="relative">
        <div className="flex justify-between items-center w-full p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg shadow-lg overflow-x-auto">
          {historicalPeriods.map((period, index) => (
            <button
              key={period.year}
              onClick={() => handlePeriodClick(index)}
              className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 min-w-[120px] ${
                index === currentPeriodIndex
                  ? 'bg-green-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-green-50 hover:shadow-md'
              }`}
            >
              <span className="font-bold text-sm">{period.year}</span>
              <span className="text-xs text-center mt-1 leading-tight">
                {period.title.split(' - ')[1] || period.title.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Map and Story Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Interactive Map */}
        <Card className="overflow-hidden shadow-2xl">
          <CardContent className="p-0">
            <div className={`relative w-full h-96 ${getMapBackground(currentPeriod.mapStyle)} transition-all duration-1000`}>
              {/* Sri Lanka Accurate Outline */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
              >
                {/* Accurate Sri Lanka Island Outline */}
                <path
                  d="M 30 15 
                     C 32 12, 36 10, 40 12
                     C 44 11, 48 10, 52 12
                     C 56 11, 60 12, 62 15
                     C 64 18, 65 22, 64 26
                     C 63 30, 62 34, 60 38
                     C 58 42, 56 46, 54 50
                     C 52 54, 50 58, 48 62
                     C 46 66, 44 70, 42 72
                     C 40 74, 38 75, 36 74
                     C 34 73, 32 71, 30 68
                     C 28 65, 26 62, 25 58
                     C 24 54, 24 50, 25 46
                     C 26 42, 27 38, 28 34
                     C 29 30, 29 26, 29 22
                     C 29 18, 29.5 16.5, 30 15 Z"
                  fill="rgba(34, 197, 94, 0.4)"
                  stroke="rgb(34, 197, 94)"
                  strokeWidth="0.8"
                  className="transition-all duration-1000"
                />
                
                {/* Northern Peninsula (Jaffna) */}
                <path
                  d="M 46 10 C 47 9, 49 9, 50 10 C 51 11, 50 12, 49 12 C 48 12, 47 11, 46 10 Z"
                  fill="rgba(34, 197, 94, 0.4)"
                  stroke="rgb(34, 197, 94)"
                  strokeWidth="0.5"
                  className="transition-all duration-1000"
                />
                
                {/* Adam's Bridge (small islands) */}
                <circle cx="45" cy="8" r="0.5" fill="rgba(34, 197, 94, 0.6)" />
                <circle cx="47" cy="7" r="0.3" fill="rgba(34, 197, 94, 0.6)" />
                <circle cx="49" cy="6" r="0.3" fill="rgba(34, 197, 94, 0.6)" />
                
                {/* Historical Landmarks */}
                {currentPeriod.landmarks.map((landmark, idx) => (
                  <g key={idx}>
                    <circle
                      cx={landmark.x}
                      cy={landmark.y}
                      r="1.5"
                      fill="rgb(239, 68, 68)"
                      stroke="white"
                      strokeWidth="0.5"
                      className="cursor-pointer hover:r-2 transition-all duration-200 animate-pulse"
                      onClick={() => setSelectedLandmark(landmark)}
                    />
                    <text
                      x={landmark.x}
                      y={landmark.y - 2.5}
                      fontSize="1.8"
                      fill="rgb(127, 29, 29)"
                      textAnchor="middle"
                      className="font-bold pointer-events-none"
                      style={{ textShadow: '1px 1px 2px white' }}
                    >
                      {landmark.name}
                    </text>
                  </g>
                ))}
                
                {/* Decorative elements based on period */}
                {currentPeriod.mapStyle === 'ancient' && (
                  <>
                    <circle cx="50" cy="45" r="0.8" fill="gold" opacity="0.7" />
                    <text x="50" y="47" fontSize="1" fill="darkgoldenrod" textAnchor="middle">⛩️</text>
                  </>
                )}
                
                {currentPeriod.mapStyle === 'portuguese' && (
                  <>
                    <rect x="41" y="54" width="2" height="2" fill="darkred" opacity="0.8" />
                    <text x="42" y="56" fontSize="1" fill="darkred" textAnchor="middle">🏰</text>
                  </>
                )}
                
                {currentPeriod.mapStyle === 'dutch' && (
                  <>
                    <path d="M39 49 L41 51 L39 53 L37 51 Z" fill="orange" opacity="0.8" />
                    <text x="39" y="52" fontSize="1" fill="darkorange" textAnchor="middle">🚢</text>
                  </>
                )}
                
                {currentPeriod.mapStyle === 'british' && (
                  <>
                    <path d="M46 48 L54 50 M50 46 L52 52" stroke="darkgreen" strokeWidth="0.5" opacity="0.8" />
                    <text x="50" y="50" fontSize="1" fill="darkgreen" textAnchor="middle">🚂</text>
                  </>
                )}
                
                {currentPeriod.mapStyle === 'modern' && (
                  <>
                    <circle cx="42" cy="55" r="1" fill="blue" opacity="0.6" />
                    <text x="42" y="56" fontSize="1" fill="darkblue" textAnchor="middle">🏙️</text>
                  </>
                )}
              </svg>

              {/* Period Title Overlay */}
              <div className="absolute top-4 left-4 bg-black/70 text-white p-3 rounded-lg backdrop-blur-sm">
                <h3 className="font-bold text-lg">{currentPeriod.title}</h3>
                <p className="text-sm opacity-90">{currentPeriod.year} AD</p>
              </div>

              {/* Landmark Detail Popup */}
              {selectedLandmark && (
                <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-64 border-2 border-green-200 backdrop-blur-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-green-800">{selectedLandmark.name}</h4>
                    <button
                      onClick={() => setSelectedLandmark(null)}
                      className="text-gray-500 hover:text-gray-700 text-lg"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">{selectedLandmark.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Historical Story Panel */}
        <Card className="shadow-2xl">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Book className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-green-800">
                  {currentPeriod.title}
                </h2>
              </div>

              <div className={`p-4 rounded-lg bg-gradient-to-br ${currentPeriod.colorScheme}`}>
                <p className="text-gray-800 leading-relaxed text-base">
                  {currentPeriod.description}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-lg text-green-700 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Key Historical Events
                </h3>
                <ul className="space-y-2">
                  {currentPeriod.keyEvents.map((event, idx) => (
                    <li 
                      key={idx}
                      className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm border-l-4 border-green-500"
                    >
                      <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                      <span className="text-gray-700">{event}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Progress Indicator */}
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-1000 rounded-full"
                  style={{ width: `${((currentPeriodIndex + 1) / historicalPeriods.length) * 100}%` }}
                ></div>
              </div>
              
              <p className="text-center text-sm text-gray-600">
                Period {currentPeriodIndex + 1} of {historicalPeriods.length} • {currentPeriod.year} AD
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HistoricalTimelineMap;
