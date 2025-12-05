/**
 * Vehicle Comparison Tool Component
 * Allows customers to compare multiple vehicles side-by-side
 */
import React, { useState, useEffect } from 'react';
import {
  Car,
  X,
  Plus,
  Check,
  Fuel,
  Users,
  Briefcase,
  Gauge,
  Settings,
  Shield,
  Star,
  MapPin,
  Calendar,
  Heart,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Vehicle type for comparison
interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  images: string[];

  // Specs
  seats: number;
  doors: number;
  transmission: 'automatic' | 'manual';
  fuelType: string;
  engineCapacity: string;
  mileage: string;
  luggageCapacity: number;

  // Features
  features: string[];
  hasAC: boolean;
  hasGPS: boolean;
  hasBluetooth: boolean;
  hasUSB: boolean;
  hasChildSeat: boolean;

  // Pricing
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  securityDeposit: number;

  // Rating
  rating: number;
  reviewCount: number;

  // Location
  location: string;
  ownerId: string;
  ownerName: string;
}

interface VehicleComparisonToolProps {
  availableVehicles: Vehicle[];
  initialVehicles?: string[];
  maxCompare?: number;
  onBookVehicle?: (vehicleId: string) => void;
}

const COMPARISON_CATEGORIES = [
  { id: 'basics', label: 'Basic Info', icon: Car },
  { id: 'specs', label: 'Specifications', icon: Gauge },
  { id: 'features', label: 'Features', icon: Settings },
  { id: 'pricing', label: 'Pricing', icon: Briefcase },
  { id: 'extras', label: 'Extras', icon: Shield }
];

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  'Air Conditioning': <span>❄️</span>,
  'GPS Navigation': <span>🗺️</span>,
  'Bluetooth': <span>📱</span>,
  'USB Charging': <span>🔌</span>,
  'Child Seat': <span>👶</span>,
  'Sunroof': <span>☀️</span>,
  'Leather Seats': <span>💺</span>,
  'Reverse Camera': <span>📷</span>,
  'Cruise Control': <span>🚀</span>,
  'Parking Sensors': <span>📡</span>
};

export const VehicleComparisonTool: React.FC<VehicleComparisonToolProps> = ({
  availableVehicles,
  initialVehicles = [],
  maxCompare = 4,
  onBookVehicle
}) => {
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>(initialVehicles);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['basics', 'specs', 'pricing']);
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  const vehicles = selectedVehicles
    .map(id => availableVehicles.find(v => v.id === id))
    .filter((v): v is Vehicle => v !== undefined);

  const addVehicle = (vehicleId: string) => {
    if (selectedVehicles.length < maxCompare && !selectedVehicles.includes(vehicleId)) {
      setSelectedVehicles([...selectedVehicles, vehicleId]);
    }
    setShowAddDialog(false);
  };

  const removeVehicle = (vehicleId: string) => {
    setSelectedVehicles(selectedVehicles.filter(id => id !== vehicleId));
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const formatPrice = (amount: number) => {
    return `LKR ${amount.toLocaleString()}`;
  };

  const getBestValue = (values: (number | undefined)[], lowerIsBetter: boolean = true): number | null => {
    const valid = values.filter((v): v is number => v !== undefined);
    if (valid.length === 0) return null;
    return lowerIsBetter ? Math.min(...valid) : Math.max(...valid);
  };

  const isBestValue = (value: number | undefined, best: number | null, lowerIsBetter: boolean = true): boolean => {
    if (value === undefined || best === null) return false;
    return value === best;
  };

  const filteredAvailableVehicles = availableVehicles.filter(v => {
    if (selectedVehicles.includes(v.id)) return false;
    const query = searchQuery.toLowerCase();
    return (
      v.name.toLowerCase().includes(query) ||
      v.brand.toLowerCase().includes(query) ||
      v.model.toLowerCase().includes(query) ||
      v.type.toLowerCase().includes(query)
    );
  });

  // Calculate best values for highlighting
  const bestDailyRate = getBestValue(vehicles.map(v => v.dailyRate));
  const bestSeats = getBestValue(vehicles.map(v => v.seats), false);
  const bestRating = getBestValue(vehicles.map(v => v.rating), false);
  const bestLuggage = getBestValue(vehicles.map(v => v.luggageCapacity), false);

  const ComparisonRow = ({
    label,
    values,
    highlight = false,
    renderValue,
    tooltip
  }: {
    label: string;
    values: (string | number | boolean | undefined)[];
    highlight?: boolean;
    renderValue?: (value: any, index: number) => React.ReactNode;
    tooltip?: string;
  }) => (
    <div className="grid grid-cols-[200px_repeat(var(--cols),1fr)] border-b hover:bg-muted/50 transition-colors"
         style={{ '--cols': vehicles.length } as React.CSSProperties}>
      <div className="p-3 flex items-center gap-2 font-medium text-sm border-r bg-muted/30">
        {label}
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3 h-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-[200px]">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {values.map((value, index) => (
        <div
          key={index}
          className={`p-3 text-sm text-center flex items-center justify-center ${
            highlight && highlightDifferences ? 'bg-green-50' : ''
          }`}
        >
          {renderValue ? renderValue(value, index) : (
            typeof value === 'boolean' ? (
              value ? <Check className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5 text-gray-300" />
            ) : (
              value ?? '-'
            )
          )}
        </div>
      ))}
    </div>
  );

  if (selectedVehicles.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Car className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Compare Vehicles</h3>
          <p className="text-muted-foreground text-center mb-4 max-w-md">
            Select up to {maxCompare} vehicles to compare their features, pricing, and specifications side by side
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicles to Compare
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Vehicle Comparison</h2>
          <p className="text-muted-foreground">
            Comparing {vehicles.length} vehicle{vehicles.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={highlightDifferences}
              onChange={(e) => setHighlightDifferences(e.target.checked)}
              className="rounded"
            />
            Highlight differences
          </label>
          {selectedVehicles.length < maxCompare && (
            <Button variant="outline" onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          {/* Vehicle Headers */}
          <div className="grid grid-cols-[200px_repeat(var(--cols),1fr)] border-b bg-muted"
               style={{ '--cols': vehicles.length } as React.CSSProperties}>
            <div className="p-4 font-medium border-r">Vehicle</div>
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-4 relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                  onClick={() => removeVehicle(vehicle.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="text-center">
                  <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    {vehicle.images?.[0] ? (
                      <img
                        src={vehicle.images[0]}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold">{vehicle.name}</h3>
                  <p className="text-sm text-muted-foreground">{vehicle.brand} {vehicle.model}</p>
                  <Badge variant="outline" className="mt-2">{vehicle.type}</Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Categories */}
          {COMPARISON_CATEGORIES.map((category) => {
            const isExpanded = expandedCategories.includes(category.id);
            const Icon = category.icon;

            return (
              <div key={category.id}>
                {/* Category Header */}
                <button
                  className="w-full grid grid-cols-[200px_1fr] border-b bg-muted/50 hover:bg-muted transition-colors"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="p-3 flex items-center gap-2 font-medium text-sm border-r">
                    <Icon className="w-4 h-4" />
                    {category.label}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 ml-auto" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    )}
                  </div>
                  <div></div>
                </button>

                {/* Category Content */}
                {isExpanded && (
                  <div>
                    {category.id === 'basics' && (
                      <>
                        <ComparisonRow
                          label="Year"
                          values={vehicles.map(v => v.year)}
                        />
                        <ComparisonRow
                          label="Rating"
                          values={vehicles.map(v => v.rating)}
                          renderValue={(value, index) => (
                            <div className={`flex items-center gap-1 ${
                              isBestValue(value, bestRating, false) ? 'text-yellow-600 font-medium' : ''
                            }`}>
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {value?.toFixed(1)} ({vehicles[index].reviewCount})
                            </div>
                          )}
                        />
                        <ComparisonRow
                          label="Location"
                          values={vehicles.map(v => v.location)}
                          renderValue={(value) => (
                            <span className="flex items-center gap-1 text-xs">
                              <MapPin className="w-3 h-3" />
                              {value}
                            </span>
                          )}
                        />
                      </>
                    )}

                    {category.id === 'specs' && (
                      <>
                        <ComparisonRow
                          label="Seats"
                          values={vehicles.map(v => v.seats)}
                          renderValue={(value) => (
                            <span className={`flex items-center gap-1 ${
                              isBestValue(value, bestSeats, false) ? 'text-green-600 font-medium' : ''
                            }`}>
                              <Users className="w-4 h-4" />
                              {value}
                            </span>
                          )}
                        />
                        <ComparisonRow
                          label="Doors"
                          values={vehicles.map(v => v.doors)}
                        />
                        <ComparisonRow
                          label="Transmission"
                          values={vehicles.map(v => v.transmission === 'automatic' ? 'Automatic' : 'Manual')}
                        />
                        <ComparisonRow
                          label="Fuel Type"
                          values={vehicles.map(v => v.fuelType)}
                          renderValue={(value) => (
                            <span className="flex items-center gap-1">
                              <Fuel className="w-4 h-4" />
                              {value}
                            </span>
                          )}
                        />
                        <ComparisonRow
                          label="Engine"
                          values={vehicles.map(v => v.engineCapacity)}
                        />
                        <ComparisonRow
                          label="Mileage"
                          values={vehicles.map(v => v.mileage)}
                          tooltip="Fuel efficiency in km/L"
                        />
                        <ComparisonRow
                          label="Luggage Capacity"
                          values={vehicles.map(v => v.luggageCapacity)}
                          renderValue={(value) => (
                            <span className={`flex items-center gap-1 ${
                              isBestValue(value, bestLuggage, false) ? 'text-green-600 font-medium' : ''
                            }`}>
                              <Briefcase className="w-4 h-4" />
                              {value} bags
                            </span>
                          )}
                        />
                      </>
                    )}

                    {category.id === 'features' && (
                      <>
                        <ComparisonRow
                          label="Air Conditioning"
                          values={vehicles.map(v => v.hasAC)}
                        />
                        <ComparisonRow
                          label="GPS Navigation"
                          values={vehicles.map(v => v.hasGPS)}
                        />
                        <ComparisonRow
                          label="Bluetooth"
                          values={vehicles.map(v => v.hasBluetooth)}
                        />
                        <ComparisonRow
                          label="USB Charging"
                          values={vehicles.map(v => v.hasUSB)}
                        />
                        <ComparisonRow
                          label="Child Seat Available"
                          values={vehicles.map(v => v.hasChildSeat)}
                        />
                        <ComparisonRow
                          label="Additional Features"
                          values={vehicles.map(v => v.features?.length || 0)}
                          renderValue={(value, index) => (
                            <div className="text-xs">
                              {vehicles[index].features?.slice(0, 3).map((f, i) => (
                                <Badge key={i} variant="outline" className="mr-1 mb-1">
                                  {FEATURE_ICONS[f] || '✓'} {f}
                                </Badge>
                              ))}
                              {(vehicles[index].features?.length || 0) > 3 && (
                                <Badge variant="secondary">
                                  +{(vehicles[index].features?.length || 0) - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                        />
                      </>
                    )}

                    {category.id === 'pricing' && (
                      <>
                        <ComparisonRow
                          label="Daily Rate"
                          values={vehicles.map(v => v.dailyRate)}
                          renderValue={(value) => (
                            <span className={`font-medium ${
                              isBestValue(value, bestDailyRate) ? 'text-green-600' : ''
                            }`}>
                              {formatPrice(value)}/day
                            </span>
                          )}
                        />
                        <ComparisonRow
                          label="Weekly Rate"
                          values={vehicles.map(v => v.weeklyRate)}
                          renderValue={(value) => (
                            <span>{formatPrice(value)}/week</span>
                          )}
                        />
                        <ComparisonRow
                          label="Monthly Rate"
                          values={vehicles.map(v => v.monthlyRate)}
                          renderValue={(value) => (
                            <span>{formatPrice(value)}/month</span>
                          )}
                        />
                        <ComparisonRow
                          label="Security Deposit"
                          values={vehicles.map(v => v.securityDeposit)}
                          renderValue={(value) => (
                            <span className="text-muted-foreground">{formatPrice(value)}</span>
                          )}
                          tooltip="Refundable deposit required at pickup"
                        />
                      </>
                    )}

                    {category.id === 'extras' && (
                      <>
                        <ComparisonRow
                          label="Owner"
                          values={vehicles.map(v => v.ownerName)}
                        />
                        <ComparisonRow
                          label="Insurance Included"
                          values={vehicles.map(() => true)}
                        />
                        <ComparisonRow
                          label="Roadside Assistance"
                          values={vehicles.map(() => true)}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Action Row */}
          <div className="grid grid-cols-[200px_repeat(var(--cols),1fr)] border-t bg-muted/30"
               style={{ '--cols': vehicles.length } as React.CSSProperties}>
            <div className="p-4 font-medium border-r flex items-center">Book Now</div>
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-4 flex flex-col items-center gap-2">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{formatPrice(vehicle.dailyRate)}</p>
                  <p className="text-sm text-muted-foreground">per day</p>
                </div>
                <Button
                  className="w-full"
                  onClick={() => onBookVehicle?.(vehicle.id)}
                >
                  Book Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Add Vehicle Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Vehicle to Compare</DialogTitle>
            <DialogDescription>
              Select a vehicle to add to the comparison ({maxCompare - selectedVehicles.length} slots remaining)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-2 gap-3">
                {filteredAvailableVehicles.map((vehicle) => (
                  <Card
                    key={vehicle.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => addVehicle(vehicle.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {vehicle.images?.[0] ? (
                            <img
                              src={vehicle.images[0]}
                              alt={vehicle.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{vehicle.name}</h4>
                          <p className="text-sm text-muted-foreground">{vehicle.brand} {vehicle.model}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{vehicle.type}</Badge>
                            <span className="text-sm font-medium text-primary">
                              {formatPrice(vehicle.dailyRate)}/day
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-sm">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {vehicle.rating?.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredAvailableVehicles.length === 0 && (
                  <div className="col-span-2 py-8 text-center text-muted-foreground">
                    No vehicles found matching your search
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Floating comparison button for vehicle listings
interface CompareButtonProps {
  vehicleId: string;
  vehicleName: string;
  isInComparison: boolean;
  onToggle: (vehicleId: string) => void;
  comparisonCount: number;
  maxCompare: number;
}

export const CompareButton: React.FC<CompareButtonProps> = ({
  vehicleId,
  vehicleName,
  isInComparison,
  onToggle,
  comparisonCount,
  maxCompare
}) => {
  const canAdd = comparisonCount < maxCompare;

  return (
    <Button
      variant={isInComparison ? 'default' : 'outline'}
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        if (isInComparison || canAdd) {
          onToggle(vehicleId);
        }
      }}
      disabled={!isInComparison && !canAdd}
      className="gap-1"
    >
      {isInComparison ? (
        <>
          <Check className="w-3 h-3" />
          Comparing
        </>
      ) : (
        <>
          <Plus className="w-3 h-3" />
          Compare
        </>
      )}
    </Button>
  );
};

// Floating comparison bar for mobile/bottom of screen
interface ComparisonBarProps {
  selectedVehicles: Vehicle[];
  onRemove: (vehicleId: string) => void;
  onCompare: () => void;
  onClear: () => void;
}

export const ComparisonBar: React.FC<ComparisonBarProps> = ({
  selectedVehicles,
  onRemove,
  onCompare,
  onClear
}) => {
  if (selectedVehicles.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            {selectedVehicles.length} vehicle{selectedVehicles.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            {selectedVehicles.map((vehicle) => (
              <div key={vehicle.id} className="relative group">
                <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                  {vehicle.images?.[0] ? (
                    <img
                      src={vehicle.images[0]}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemove(vehicle.id)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClear}>
            Clear All
          </Button>
          <Button size="sm" onClick={onCompare} disabled={selectedVehicles.length < 2}>
            Compare ({selectedVehicles.length})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleComparisonTool;
