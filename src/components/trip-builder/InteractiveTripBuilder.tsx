import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { MapPin, Plus, X, GripVertical, Calculator, Clock, Moon, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TripMap from './TripMap';
import AttractionSelector, { Attraction } from './AttractionSelector';
import { useToast } from '@/hooks/use-toast';

// Types
export interface Destination {
    id: string;
    name: string;
    lat: number;
    lng: number;
    description?: string;
    attractions: Attraction[];
    selectedAttractions: string[];
}

export interface TripStats {
    totalDistance: number; // in km
    totalTime: number; // in minutes
    suggestedNights: number;
    estimatedPrice: number;
    attractionCost: number;
}

// Mock Data for Attractions
const MOCK_ATTRACTIONS: Record<string, Attraction[]> = {
    'colombo': [
        { id: 'gangaramaya', name: 'Gangaramaya Temple', price: 5, duration: 60, description: 'Famous Buddhist temple with eclectic architecture.', category: 'Culture' },
        { id: 'lotus-tower', name: 'Lotus Tower', price: 20, duration: 90, description: 'Tallest self-supported structure in South Asia.', category: 'Adventure' },
        { id: 'national-museum', name: 'National Museum', price: 10, duration: 120, description: 'Largest museum in Sri Lanka.', category: 'Culture' },
    ],
    'kandy': [
        { id: 'temple-tooth', name: 'Temple of the Tooth', price: 15, duration: 90, description: 'Sacred Buddhist temple housing the relic of the tooth of the Buddha.', category: 'Culture' },
        { id: 'botanical-gardens', name: 'Royal Botanical Gardens', price: 10, duration: 120, description: 'Renowned for its collection of orchids.', category: 'Nature' },
        { id: 'kandy-lake', name: 'Kandy Lake Walk', price: 0, duration: 45, description: 'Scenic walk around the lake.', category: 'Relaxation' },
    ],
    'ella': [
        { id: 'nine-arch', name: 'Nine Arch Bridge', price: 0, duration: 60, description: 'Iconic colonial-era railway bridge.', category: 'Culture' },
        { id: 'little-adams-peak', name: 'Little Adam\'s Peak', price: 0, duration: 90, description: 'Easy hike with stunning views.', category: 'Adventure' },
        { id: 'ravana-falls', name: 'Ravana Falls', price: 0, duration: 30, description: 'Popular waterfall near the road.', category: 'Nature' },
    ],
    'galle': [
        { id: 'galle-fort', name: 'Galle Fort', price: 0, duration: 120, description: 'UNESCO World Heritage site.', category: 'Culture' },
        { id: 'lighthouse', name: 'Galle Lighthouse', price: 0, duration: 30, description: 'Historic lighthouse within the fort.', category: 'Culture' },
        { id: 'maritime-museum', name: 'Maritime Museum', price: 5, duration: 60, description: 'Museum showcasing maritime history.', category: 'Culture' },
    ],
    'sigiriya': [
        { id: 'lion-rock', name: 'Sigiriya Lion Rock', price: 30, duration: 180, description: 'Ancient rock fortress.', category: 'Culture' },
        { id: 'pidurangala', name: 'Pidurangala Rock', price: 5, duration: 120, description: 'Hiking spot with views of Sigiriya.', category: 'Adventure' },
    ],
    'nuwara-eliya': [
        { id: 'gregory-lake', name: 'Gregory Lake', price: 2, duration: 60, description: 'Lake with boat rides and parks.', category: 'Relaxation' },
        { id: 'tea-factory', name: 'Tea Factory Visit', price: 5, duration: 60, description: 'Learn about tea production.', category: 'Culture' },
    ],
    'yala': [
        { id: 'safari', name: 'Yala Safari', price: 60, duration: 240, description: 'Jeep safari to see leopards and elephants.', category: 'Nature' },
    ]
};

// Initial Data
const INITIAL_DESTINATIONS: Destination[] = [
    { id: 'colombo', name: 'Colombo', lat: 6.9271, lng: 79.8612, description: 'Commercial Capital', attractions: MOCK_ATTRACTIONS['colombo'] || [], selectedAttractions: [] },
    { id: 'kandy', name: 'Kandy', lat: 7.2906, lng: 80.6337, description: 'Cultural Capital', attractions: MOCK_ATTRACTIONS['kandy'] || [], selectedAttractions: [] },
    { id: 'ella', name: 'Ella', lat: 6.8667, lng: 81.0466, description: 'Scenic Hill Country', attractions: MOCK_ATTRACTIONS['ella'] || [], selectedAttractions: [] },
];

const DEMO_DESTINATIONS: Record<string, Omit<Destination, 'selectedAttractions'>> = {
    'galle': { id: 'galle', name: 'Galle', lat: 6.0535, lng: 80.2210, description: 'Historic Fort', attractions: MOCK_ATTRACTIONS['galle'] || [] },
    'sigiriya': { id: 'sigiriya', name: 'Sigiriya', lat: 7.9570, lng: 80.7603, description: 'Lion Rock', attractions: MOCK_ATTRACTIONS['sigiriya'] || [] },
    'nuwara eliya': { id: 'nuwara-eliya', name: 'Nuwara Eliya', lat: 6.9497, lng: 80.7891, description: 'Little England', attractions: MOCK_ATTRACTIONS['nuwara-eliya'] || [] },
    'yala': { id: 'yala', name: 'Yala', lat: 6.3716, lng: 81.5168, description: 'Wildlife Park', attractions: MOCK_ATTRACTIONS['yala'] || [] },
};

const InteractiveTripBuilder: React.FC = () => {
    const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
    const [stats, setStats] = useState<TripStats>({ totalDistance: 0, totalTime: 0, suggestedNights: 0, estimatedPrice: 0, attractionCost: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedDest, setExpandedDest] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const { toast } = useToast();
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const [quoteForm, setQuoteForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock function to calculate stats - in a real app this would use Google Maps Distance Matrix API
    useEffect(() => {
        const calculateStats = () => {
            if (destinations.length < 1) {
                setStats({ totalDistance: 0, totalTime: 0, suggestedNights: 0, estimatedPrice: 0, attractionCost: 0 });
                return;
            }

            // 1. Calculate Travel Distance & Time
            let distance = 0;
            for (let i = 0; i < destinations.length - 1; i++) {
                const d1 = destinations[i];
                const d2 = destinations[i + 1];
                // Haversine formula approximation
                const R = 6371; // km
                const dLat = (d2.lat - d1.lat) * Math.PI / 180;
                const dLng = (d2.lng - d1.lng) * Math.PI / 180;
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(d1.lat * Math.PI / 180) * Math.cos(d2.lat * Math.PI / 180) *
                    Math.sin(dLng / 2) * Math.sin(dLng / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                distance += R * c;
            }

            // Add 20% for road curvature
            const roadDistance = Math.round(distance * 1.2);

            // Assume average speed of 40km/h (Sri Lanka roads are slow)
            const travelTimeMinutes = Math.round((roadDistance / 40) * 60);

            // 2. Calculate Attraction Costs & Time
            let attractionCost = 0;
            let attractionTime = 0;

            destinations.forEach(dest => {
                dest.selectedAttractions.forEach(attrId => {
                    const attraction = dest.attractions.find(a => a.id === attrId);
                    if (attraction) {
                        attractionCost += attraction.price;
                        attractionTime += attraction.duration;
                    }
                });
            });

            const totalTimeMinutes = travelTimeMinutes + attractionTime;

            // Suggest 1 night for every 6 hours of total activity (travel + sightseeing)
            // But ensure at least 1 night per 300km if time is low (long distance driving fatigue)
            const nightsByTime = Math.floor(totalTimeMinutes / 360);
            const nightsByDistance = Math.floor(roadDistance / 250);
            const nights = Math.max(nightsByTime, nightsByDistance);

            // Pricing: Base $50 + $0.60 per km + $100 per night + Attraction Costs
            const basePrice = 50 + (roadDistance * 0.60) + (nights * 100);
            const totalPrice = basePrice + attractionCost;

            setStats({
                totalDistance: roadDistance,
                totalTime: totalTimeMinutes,
                suggestedNights: nights,
                estimatedPrice: Math.round(totalPrice),
                attractionCost: attractionCost
            });
        };

        calculateStats();
    }, [destinations]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(destinations);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setDestinations(items);
    };

    const removeDestination = (id: string) => {
        if (destinations.length <= 1) {
            // Allow removing down to 1, but maybe warn if 0? Actually 1 is fine for a "trip" start point.
            // But usually a trip needs 2 points. Let's keep 2 as min for a "route".
            // If user wants to just see 1 place, that's fine too.
            // Let's stick to the previous logic of min 2 for now to keep it simple, or relax it.
            // The previous code had min 2.
        }
        if (destinations.length <= 1) {
            toast({
                title: "Minimum Destinations",
                description: "Keep at least one destination to start building.",
                variant: "destructive"
            });
            return;
        }
        setDestinations(destinations.filter(d => d.id !== id));
    };

    const addDestination = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real implementation, this would use Google Places Autocomplete
        // For now, we'll just add a mock destination if it matches known ones or generic
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            toast({
                title: "Add a destination",
                description: "Type a destination name like Galle, Sigiriya, Nuwara Eliya, or Yala.",
                variant: "destructive"
            });
            return;
        }

        const demoDestination = DEMO_DESTINATIONS[query];

        if (!demoDestination) {
            toast({
                title: "Location Not Found",
                description: "Try Galle, Sigiriya, Nuwara Eliya, or Yala for this demo.",
                variant: "destructive"
            });
            return;
        }

        if (destinations.find(d => d.id === demoDestination.id)) {
            toast({
                title: "Already Added",
                description: `${demoDestination.name} is already in your itinerary.`,
            });
            return;
        }

        setDestinations([...destinations, { ...demoDestination, selectedAttractions: [] }]);
        setSearchQuery('');
        toast({
            title: "Added",
            description: `${demoDestination.name} added to itinerary.`,
        });
    };

    const toggleAttraction = (destinationId: string, attractionId: string) => {
        setDestinations(destinations.map(dest => {
            if (dest.id === destinationId) {
                const isSelected = dest.selectedAttractions.includes(attractionId);
                return {
                    ...dest,
                    selectedAttractions: isSelected
                        ? dest.selectedAttractions.filter(id => id !== attractionId)
                        : [...dest.selectedAttractions, attractionId]
                };
            }
            return dest;
        }));
    };

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const handleQuoteInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setQuoteForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleQuoteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!quoteForm.name || !quoteForm.email) {
            toast({
                title: "Missing information",
                description: "Please add at least your name and email.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const itineraryDestinations = destinations.map((dest, index) => ({
                order: index + 1,
                id: dest.id,
                name: dest.name,
                selectedAttractions: dest.selectedAttractions,
            }));

            const routeSummary = destinations.map(d => d.name).join(' → ');
            const nightsPart = stats.suggestedNights > 0
                ? `${stats.suggestedNights} night${stats.suggestedNights > 1 ? 's' : ''}`
                : null;
            const parts = [
                routeSummary,
                nightsPart,
                stats.estimatedPrice ? `$${stats.estimatedPrice}` : null,
            ].filter(Boolean) as string[];
            const humanSummary = parts.join(' • ');

            const requestData = {
                bookingType: "custom_trip",
                customerName: quoteForm.name,
                customerEmail: quoteForm.email,
                customerPhone: quoteForm.phone,
                message: quoteForm.message || "No special requests",
                totalDistanceKm: stats.totalDistance,
                totalTimeMinutes: stats.totalTime,
                suggestedNights: stats.suggestedNights,
                estimatedPrice: stats.estimatedPrice,
                attractionCost: stats.attractionCost,
                itinerary: itineraryDestinations,
                summary: humanSummary,
                createdAt: Timestamp.now(),
                status: "pending",
                source: "website-trip-builder",
            };

            await addDoc(collection(db, "booking_requests"), requestData);

            toast({
                title: "Quote request sent",
                description: "Our team will review your itinerary and contact you shortly.",
            });

            setIsQuoteOpen(false);
            setQuoteForm({
                name: '',
                email: '',
                phone: '',
                message: '',
            });
            setCurrentStep(1);
        } catch (error) {
            console.error(error);
            toast({
                title: "Something went wrong",
                description: "We could not send your request. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-16 bg-gradient-to-b from-white to-blue-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">Plan Your Journey</Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Interactive Trip Builder</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Drag and drop destinations to customize your perfect Sri Lankan adventure.
                        Select attractions to get accurate time and cost estimates.
                        For this demo, try Colombo, Kandy, Ella, Galle, Sigiriya, Nuwara Eliya, or Yala.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[700px]">
                    {/* Left Panel: Itinerary Builder */}
                    <Card className="lg:col-span-1 flex flex-col h-full shadow-xl border-blue-100">
                        <CardHeader className="bg-white border-b border-gray-100 pb-4">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-blue-600" />
                                Your Itinerary
                            </CardTitle>
                            <CardDescription>Drag to reorder stops & select activities</CardDescription>
                            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-semibold">
                                        {currentStep}
                                    </span>
                                    <span>
                                        {currentStep === 1 && 'Step 1: Plan your route'}
                                        {currentStep === 2 && 'Step 2: Choose experiences'}
                                        {currentStep === 3 && 'Step 3: Review & request quote'}
                                    </span>
                                </div>
                                <span className="text-[11px] text-gray-400">Step {currentStep} of 3</span>
                            </div>

                            <form onSubmit={addDestination} className="flex gap-2 mt-4">
                                <Input
                                    placeholder="Add destination (e.g., Galle)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardHeader>

                        <CardContent className="flex-1 overflow-hidden p-0">
                            <ScrollArea className="h-full p-4">
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="destinations">
                                        {(provided) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                                {destinations.map((dest, index) => (
                                                    <Draggable key={dest.id} draggableId={dest.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className={`rounded-lg border transition-all group
                                                                    ${snapshot.isDragging ? 'bg-blue-50 border-blue-300 shadow-lg z-50' : 'bg-white border-gray-200 hover:border-blue-200'}
                                                                `}
                                                            >
                                                                {/* Destination Header */}
                                                                <div className="flex items-center gap-3 p-3">
                                                                    <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                                                                        <GripVertical className="h-5 w-5" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpandedDest(expandedDest === dest.id ? null : dest.id)}>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                                                                                {index + 1}
                                                                            </span>
                                                                            <h4 className="font-medium text-gray-900 truncate">{dest.name}</h4>
                                                                        </div>
                                                                        {dest.description && (
                                                                            <p className="text-xs text-gray-500 ml-8 truncate">{dest.description}</p>
                                                                        )}
                                                                        {dest.selectedAttractions.length > 0 && (
                                                                            <div className="ml-8 mt-1 flex gap-1 flex-wrap">
                                                                                <Badge variant="secondary" className="text-[10px] h-4 px-1">
                                                                                    +{dest.selectedAttractions.length} Activities
                                                                                </Badge>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-gray-400"
                                                                        onClick={() => setExpandedDest(expandedDest === dest.id ? null : dest.id)}
                                                                    >
                                                                        {expandedDest === dest.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                                    </Button>

                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        onClick={() => removeDestination(dest.id)}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>

                                                                {/* Attractions Selection (Collapsible) */}
                                                                {expandedDest === dest.id && (
                                                                    <div className="px-3 pb-3 pt-0 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                                                                        <AttractionSelector
                                                                            attractions={dest.attractions}
                                                                            selectedIds={dest.selectedAttractions}
                                                                            onToggle={(attrId) => toggleAttraction(dest.id, attrId)}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </ScrollArea>
                        </CardContent>

                        {/* Trip Stats Footer */}
                        <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Distance</span>
                                    <span className="font-semibold text-sm">{stats.totalDistance} km</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Duration</span>
                                    <span className="font-semibold text-sm">{formatTime(stats.totalTime)}</span>
                                </div>
                            </div>

                            {stats.suggestedNights > 0 && (
                                <div className="flex justify-between items-center text-sm text-amber-700 bg-amber-50 p-2 rounded">
                                    <div className="flex items-center gap-2">
                                        <Moon className="h-4 w-4" />
                                        <span>Suggested Stays</span>
                                    </div>
                                    <span className="font-semibold">{stats.suggestedNights} Nights</span>
                                </div>
                            )}

                            <div className="pt-2 mt-2 border-t border-gray-200">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-600 text-xs">Activities Cost</span>
                                    <span className="text-gray-900 text-xs font-medium">${stats.attractionCost}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-900 font-medium">Est. Total Price</span>
                                    <span className="text-2xl font-bold text-blue-700">${stats.estimatedPrice}</span>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1 text-right">*Includes vehicle, driver, fuel & entry fees</p>
                            </div>
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                                onClick={() => {
                                    if (currentStep < 3) {
                                        setCurrentStep(currentStep + 1);
                                        return;
                                    }
                                    setIsQuoteOpen(true);
                                }}
                            >
                                {currentStep === 1 && 'Next: Choose experiences'}
                                {currentStep === 2 && 'Next: Review & request quote'}
                                {currentStep === 3 && 'Request Quote for this Trip'}
                            </Button>
                        </div>
                    </Card>

                    {/* Right Panel: Map */}
                    <div className="lg:col-span-2 h-full rounded-xl overflow-hidden shadow-xl border border-gray-200 relative">
                        <TripMap destinations={destinations} />
                    </div>
                </div>
            </div>

            <Dialog open={isQuoteOpen} onOpenChange={setIsQuoteOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Request a Quote for Your Trip</DialogTitle>
                        <DialogDescription>
                            Share your contact details and any special requests. Our team will follow up with a personalized quote.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-3 mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">Trip summary</span>
                            <span className="text-gray-900 font-semibold">${stats.estimatedPrice}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
                            {destinations.map((dest, index) => (
                                <span key={dest.id} className="inline-flex items-center gap-1">
                                    <span className="h-4 w-4 rounded-full bg-blue-100 text-blue-700 text-[10px] flex items-center justify-center font-semibold">
                                        {index + 1}
                                    </span>
                                    <span>{dest.name}</span>
                                </span>
                            ))}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-gray-600">
                            <span>Distance: {stats.totalDistance} km</span>
                            <span>Duration: {formatTime(stats.totalTime)}</span>
                            {stats.suggestedNights > 0 && (
                                <span>Suggested nights: {stats.suggestedNights}</span>
                            )}
                        </div>
                    </div>
                    <form onSubmit={handleQuoteSubmit} className="space-y-4 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="quote-name">Name</Label>
                                <Input
                                    id="quote-name"
                                    name="name"
                                    value={quoteForm.name}
                                    onChange={handleQuoteInputChange}
                                    placeholder="Your full name"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="quote-email">Email</Label>
                                <Input
                                    id="quote-email"
                                    name="email"
                                    type="email"
                                    value={quoteForm.email}
                                    onChange={handleQuoteInputChange}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="quote-phone">Phone / WhatsApp</Label>
                            <Input
                                id="quote-phone"
                                name="phone"
                                value={quoteForm.phone}
                                onChange={handleQuoteInputChange}
                                placeholder="+94 77 123 4567"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="quote-message">Trip details or special requests</Label>
                            <Textarea
                                id="quote-message"
                                name="message"
                                value={quoteForm.message}
                                onChange={handleQuoteInputChange}
                                placeholder="Preferred dates, group size, budget, special interests..."
                                rows={4}
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsQuoteOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Quote Request'
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    );
};

export default InteractiveTripBuilder;
