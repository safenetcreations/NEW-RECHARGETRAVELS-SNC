import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Plus, X, Clock, Moon, ChevronDown, ChevronUp, Loader2,
    Mountain, Waves, TreePine, Landmark, Bird,
    Coffee, Sparkles, ArrowRight, ArrowLeft, Check,
    Send, DollarSign, Compass, Map, Route, Building2,
    Search, Star, Hotel
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import TripMap from './TripMap';
import { useToast } from '@/hooks/use-toast';

// Types
export interface Attraction {
    id: string;
    name: string;
    price: number;
    duration: number;
    description: string;
    category: 'Nature' | 'Culture' | 'Adventure' | 'Relaxation' | 'Wildlife' | 'Food';
    image?: string;
}

export interface Destination {
    id: string;
    name: string;
    lat: number;
    lng: number;
    description?: string;
    image: string;
    category: string;
    icon: string;
    attractions: Attraction[];
    selectedAttractions: string[];
}

export interface TripStats {
    totalDistance: number;
    totalTime: number;
    suggestedNights: number;
    estimatedPrice: number;
    attractionCost: number;
}

// Comprehensive Sri Lankan Destinations Data
const ALL_DESTINATIONS: Omit<Destination, 'selectedAttractions'>[] = [
    // Beaches
    {
        id: 'mirissa',
        name: 'Mirissa',
        lat: 5.9483,
        lng: 80.4716,
        description: 'Whale Watching Paradise',
        image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&h=300&fit=crop',
        category: 'beach',
        icon: '🏖️',
        attractions: [
            { id: 'whale-watching', name: 'Whale Watching Tour', price: 45, duration: 240, description: 'See majestic blue whales and dolphins', category: 'Wildlife' },
            { id: 'mirissa-beach', name: 'Mirissa Beach Relaxation', price: 0, duration: 180, description: 'Enjoy golden sands and sunsets', category: 'Relaxation' },
            { id: 'coconut-tree-hill', name: 'Coconut Tree Hill', price: 0, duration: 45, description: 'Iconic photo spot with palm trees', category: 'Nature' },
            { id: 'secret-beach', name: 'Secret Beach', price: 0, duration: 120, description: 'Hidden gem with calm waters', category: 'Nature' },
        ]
    },
    {
        id: 'unawatuna',
        name: 'Unawatuna',
        lat: 6.0174,
        lng: 80.2497,
        description: 'Best Beach in Sri Lanka',
        image: 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=400&h=300&fit=crop',
        category: 'beach',
        icon: '🌴',
        attractions: [
            { id: 'unawatuna-beach', name: 'Unawatuna Beach', price: 0, duration: 180, description: 'Crystal clear waters and coral reefs', category: 'Relaxation' },
            { id: 'japanese-peace-pagoda', name: 'Japanese Peace Pagoda', price: 0, duration: 60, description: 'Beautiful white temple with ocean views', category: 'Culture' },
            { id: 'jungle-beach', name: 'Jungle Beach', price: 0, duration: 120, description: 'Secluded beach surrounded by jungle', category: 'Nature' },
        ]
    },
    {
        id: 'bentota',
        name: 'Bentota',
        lat: 6.4271,
        lng: 79.9978,
        description: 'Water Sports Haven',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
        category: 'beach',
        icon: '🏄',
        attractions: [
            { id: 'water-sports', name: 'Water Sports Package', price: 50, duration: 180, description: 'Jet ski, banana boat, and more', category: 'Adventure' },
            { id: 'turtle-hatchery', name: 'Turtle Conservation', price: 5, duration: 60, description: 'See baby sea turtles', category: 'Wildlife' },
            { id: 'brief-garden', name: 'Brief Garden', price: 10, duration: 90, description: 'Beautiful landscape garden', category: 'Nature' },
        ]
    },
    // Cultural Sites
    {
        id: 'sigiriya',
        name: 'Sigiriya',
        lat: 7.9570,
        lng: 80.7603,
        description: 'Ancient Lion Rock Fortress',
        image: 'https://images.unsplash.com/photo-1586613835341-99f93b93809c?w=400&h=300&fit=crop',
        category: 'culture',
        icon: '🦁',
        attractions: [
            { id: 'lion-rock', name: 'Sigiriya Lion Rock', price: 30, duration: 180, description: 'UNESCO World Heritage ancient fortress', category: 'Culture' },
            { id: 'pidurangala', name: 'Pidurangala Rock', price: 5, duration: 120, description: 'Best sunrise view of Sigiriya', category: 'Adventure' },
            { id: 'sigiriya-museum', name: 'Sigiriya Museum', price: 5, duration: 45, description: 'Learn about ancient history', category: 'Culture' },
        ]
    },
    {
        id: 'kandy',
        name: 'Kandy',
        lat: 7.2906,
        lng: 80.6337,
        description: 'Cultural Capital of Sri Lanka',
        image: 'https://images.unsplash.com/photo-1588598198321-4c8c6d733293?w=400&h=300&fit=crop',
        category: 'culture',
        icon: '🏛️',
        attractions: [
            { id: 'temple-tooth', name: 'Temple of the Tooth', price: 15, duration: 90, description: 'Sacred Buddhist temple with Buddha\'s tooth relic', category: 'Culture' },
            { id: 'botanical-gardens', name: 'Royal Botanical Gardens', price: 10, duration: 120, description: 'Beautiful orchid collection and giant trees', category: 'Nature' },
            { id: 'kandy-lake', name: 'Kandy Lake Walk', price: 0, duration: 45, description: 'Scenic walk around the lake', category: 'Relaxation' },
            { id: 'cultural-show', name: 'Kandyan Dance Show', price: 15, duration: 90, description: 'Traditional Sri Lankan dance performance', category: 'Culture' },
        ]
    },
    {
        id: 'polonnaruwa',
        name: 'Polonnaruwa',
        lat: 7.9403,
        lng: 81.0188,
        description: 'Ancient Kingdom Ruins',
        image: 'https://images.unsplash.com/photo-1590123715937-e3ae9d56c618?w=400&h=300&fit=crop',
        category: 'culture',
        icon: '🏰',
        attractions: [
            { id: 'gal-vihara', name: 'Gal Vihara', price: 25, duration: 60, description: 'Beautiful rock-carved Buddha statues', category: 'Culture' },
            { id: 'royal-palace', name: 'Royal Palace Ruins', price: 0, duration: 90, description: 'Ancient palace complex', category: 'Culture' },
            { id: 'parakrama-samudra', name: 'Parakrama Samudra', price: 0, duration: 45, description: 'Ancient man-made lake', category: 'Nature' },
        ]
    },
    {
        id: 'anuradhapura',
        name: 'Anuradhapura',
        lat: 8.3114,
        lng: 80.4037,
        description: 'Sacred Buddhist City',
        image: 'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?w=400&h=300&fit=crop',
        category: 'culture',
        icon: '🙏',
        attractions: [
            { id: 'sri-maha-bodhi', name: 'Sri Maha Bodhi Tree', price: 0, duration: 60, description: 'Sacred fig tree from Buddha\'s original tree', category: 'Culture' },
            { id: 'ruwanwelisaya', name: 'Ruwanwelisaya Stupa', price: 0, duration: 45, description: 'Massive white stupa', category: 'Culture' },
            { id: 'thuparamaya', name: 'Thuparamaya', price: 0, duration: 30, description: 'First stupa built in Sri Lanka', category: 'Culture' },
        ]
    },
    {
        id: 'galle',
        name: 'Galle',
        lat: 6.0535,
        lng: 80.2210,
        description: 'Historic Dutch Fort',
        image: 'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?w=400&h=300&fit=crop',
        category: 'culture',
        icon: '🏰',
        attractions: [
            { id: 'galle-fort', name: 'Galle Fort Walk', price: 0, duration: 120, description: 'UNESCO World Heritage Dutch colonial fort', category: 'Culture' },
            { id: 'lighthouse', name: 'Galle Lighthouse', price: 0, duration: 30, description: 'Historic white lighthouse', category: 'Culture' },
            { id: 'maritime-museum', name: 'Maritime Museum', price: 5, duration: 60, description: 'Maritime history exhibits', category: 'Culture' },
            { id: 'fort-shopping', name: 'Fort Shopping & Cafes', price: 0, duration: 90, description: 'Boutiques, galleries and cafes', category: 'Relaxation' },
        ]
    },
    // Hill Country
    {
        id: 'ella',
        name: 'Ella',
        lat: 6.8667,
        lng: 81.0466,
        description: 'Scenic Mountain Village',
        image: 'https://images.unsplash.com/photo-1571296251827-6e6ce8929b48?w=400&h=300&fit=crop',
        category: 'mountain',
        icon: '⛰️',
        attractions: [
            { id: 'nine-arch', name: 'Nine Arch Bridge', price: 0, duration: 60, description: 'Iconic colonial-era railway bridge', category: 'Culture' },
            { id: 'little-adams-peak', name: 'Little Adam\'s Peak', price: 0, duration: 90, description: 'Easy hike with stunning views', category: 'Adventure' },
            { id: 'ravana-falls', name: 'Ravana Falls', price: 0, duration: 30, description: 'Beautiful waterfall by the road', category: 'Nature' },
            { id: 'ella-rock', name: 'Ella Rock Hike', price: 0, duration: 180, description: 'Challenging hike with panoramic views', category: 'Adventure' },
            { id: 'train-ride', name: 'Scenic Train Ride', price: 5, duration: 180, description: 'Most beautiful train journey in the world', category: 'Adventure' },
        ]
    },
    {
        id: 'nuwara-eliya',
        name: 'Nuwara Eliya',
        lat: 6.9497,
        lng: 80.7891,
        description: 'Little England Tea Country',
        image: 'https://images.unsplash.com/photo-1590502160462-58b41354f588?w=400&h=300&fit=crop',
        category: 'tea',
        icon: '🍵',
        attractions: [
            { id: 'tea-factory', name: 'Tea Factory Tour', price: 5, duration: 90, description: 'Learn tea production and taste Ceylon tea', category: 'Culture' },
            { id: 'gregory-lake', name: 'Gregory Lake', price: 2, duration: 60, description: 'Boat rides and lakeside walks', category: 'Relaxation' },
            { id: 'hakgala-gardens', name: 'Hakgala Botanical Gardens', price: 10, duration: 90, description: 'Beautiful highland gardens', category: 'Nature' },
            { id: 'horton-plains', name: 'Horton Plains & World\'s End', price: 25, duration: 240, description: 'Stunning cliff viewpoint', category: 'Adventure' },
        ]
    },
    {
        id: 'adams-peak',
        name: 'Adam\'s Peak',
        lat: 6.8095,
        lng: 80.4994,
        description: 'Sacred Sunrise Pilgrimage',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        category: 'mountain',
        icon: '🌅',
        attractions: [
            { id: 'peak-climb', name: 'Adam\'s Peak Night Climb', price: 0, duration: 360, description: 'Climb for sacred footprint & sunrise', category: 'Adventure' },
        ]
    },
    // Wildlife
    {
        id: 'yala',
        name: 'Yala',
        lat: 6.3716,
        lng: 81.5168,
        description: 'Best Leopard Spotting',
        image: 'https://images.unsplash.com/photo-1574870111867-089730e5a72b?w=400&h=300&fit=crop',
        category: 'wildlife',
        icon: '🐆',
        attractions: [
            { id: 'yala-safari', name: 'Yala Safari (Half Day)', price: 60, duration: 240, description: 'See leopards, elephants, and more', category: 'Wildlife' },
            { id: 'yala-full-safari', name: 'Yala Safari (Full Day)', price: 100, duration: 480, description: 'Full day wildlife adventure', category: 'Wildlife' },
        ]
    },
    {
        id: 'udawalawe',
        name: 'Udawalawe',
        lat: 6.4389,
        lng: 80.8886,
        description: 'Elephant Paradise',
        image: 'https://images.unsplash.com/photo-1581852017103-68ac65514cf3?w=400&h=300&fit=crop',
        category: 'wildlife',
        icon: '🐘',
        attractions: [
            { id: 'udawalawe-safari', name: 'Udawalawe Safari', price: 45, duration: 240, description: 'Best place to see wild elephants', category: 'Wildlife' },
            { id: 'elephant-transit', name: 'Elephant Transit Home', price: 5, duration: 60, description: 'Orphaned baby elephant feeding', category: 'Wildlife' },
        ]
    },
    {
        id: 'minneriya',
        name: 'Minneriya',
        lat: 8.0348,
        lng: 80.8972,
        description: 'The Gathering of Elephants',
        image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&h=300&fit=crop',
        category: 'wildlife',
        icon: '🐘',
        attractions: [
            { id: 'gathering', name: 'The Elephant Gathering Safari', price: 50, duration: 240, description: 'See 300+ elephants together (Aug-Sep)', category: 'Wildlife' },
        ]
    },
    // Cities
    {
        id: 'colombo',
        name: 'Colombo',
        lat: 6.9271,
        lng: 79.8612,
        description: 'Vibrant Capital City',
        image: 'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?w=400&h=300&fit=crop',
        category: 'city',
        icon: '🏙️',
        attractions: [
            { id: 'gangaramaya', name: 'Gangaramaya Temple', price: 5, duration: 60, description: 'Famous Buddhist temple', category: 'Culture' },
            { id: 'lotus-tower', name: 'Lotus Tower', price: 20, duration: 90, description: 'Tallest tower in South Asia', category: 'Adventure' },
            { id: 'national-museum', name: 'National Museum', price: 10, duration: 120, description: 'Sri Lanka\'s history and art', category: 'Culture' },
            { id: 'galle-face', name: 'Galle Face Green', price: 0, duration: 60, description: 'Ocean-side promenade', category: 'Relaxation' },
            { id: 'pettah-market', name: 'Pettah Market', price: 0, duration: 120, description: 'Bustling local market experience', category: 'Culture' },
            { id: 'colombo-food-tour', name: 'Street Food Tour', price: 25, duration: 180, description: 'Taste authentic Sri Lankan cuisine', category: 'Food' },
        ]
    },
    // Nature
    {
        id: 'sinharaja',
        name: 'Sinharaja',
        lat: 6.4167,
        lng: 80.4500,
        description: 'UNESCO Rainforest',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop',
        category: 'nature',
        icon: '🌳',
        attractions: [
            { id: 'rainforest-trek', name: 'Rainforest Trek', price: 20, duration: 240, description: 'Guided walk in ancient rainforest', category: 'Nature' },
            { id: 'bird-watching', name: 'Bird Watching Tour', price: 25, duration: 180, description: 'See endemic bird species', category: 'Wildlife' },
        ]
    },
    {
        id: 'arugam-bay',
        name: 'Arugam Bay',
        lat: 6.8406,
        lng: 81.8356,
        description: 'Surfer\'s Paradise',
        image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=300&fit=crop',
        category: 'beach',
        icon: '🏄',
        attractions: [
            { id: 'surfing-lesson', name: 'Surfing Lessons', price: 25, duration: 120, description: 'Learn to surf on famous waves', category: 'Adventure' },
            { id: 'kumana-safari', name: 'Kumana Bird Sanctuary', price: 35, duration: 240, description: 'Amazing bird watching safari', category: 'Wildlife' },
            { id: 'beach-relax', name: 'Beach Day', price: 0, duration: 180, description: 'Relax on pristine beaches', category: 'Relaxation' },
        ]
    },
    {
        id: 'trincomalee',
        name: 'Trincomalee',
        lat: 8.5874,
        lng: 81.2152,
        description: 'East Coast Gem',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        category: 'beach',
        icon: '🐋',
        attractions: [
            { id: 'nilaveli', name: 'Nilaveli Beach', price: 0, duration: 180, description: 'Pristine white sand beach', category: 'Relaxation' },
            { id: 'pigeon-island', name: 'Pigeon Island Snorkeling', price: 15, duration: 180, description: 'Coral reefs and tropical fish', category: 'Adventure' },
            { id: 'whale-watching-trinco', name: 'Whale Watching', price: 40, duration: 240, description: 'See blue whales and dolphins', category: 'Wildlife' },
            { id: 'koneswaram', name: 'Koneswaram Temple', price: 0, duration: 60, description: 'Hindu temple on cliff edge', category: 'Culture' },
        ]
    },
    // Northern Region
    {
        id: 'jaffna',
        name: 'Jaffna',
        lat: 9.6615,
        lng: 80.0255,
        description: 'Cultural Northern Capital',
        image: 'https://images.unsplash.com/photo-1590123715937-e3ae9d56c618?w=400&h=300&fit=crop',
        category: 'culture',
        icon: '🛕',
        attractions: [
            { id: 'nallur-temple', name: 'Nallur Kandaswamy Temple', price: 0, duration: 90, description: 'Iconic Hindu temple with grand gopuram', category: 'Culture' },
            { id: 'jaffna-fort', name: 'Jaffna Fort', price: 0, duration: 60, description: 'Historic Dutch colonial fort', category: 'Culture' },
            { id: 'nagadeepa-temple', name: 'Nagadeepa Purana Viharaya', price: 0, duration: 180, description: 'Sacred Buddhist temple on island', category: 'Culture' },
            { id: 'casuarina-beach', name: 'Casuarina Beach', price: 0, duration: 120, description: 'Beautiful northern beach', category: 'Relaxation' },
            { id: 'jaffna-library', name: 'Jaffna Public Library', price: 0, duration: 45, description: 'Restored historic library', category: 'Culture' },
            { id: 'delft-island', name: 'Delft Island Day Trip', price: 10, duration: 360, description: 'Wild horses and Dutch ruins', category: 'Adventure' },
        ]
    },
    {
        id: 'mullaitivu',
        name: 'Mullaitivu',
        lat: 9.2671,
        lng: 80.8142,
        description: 'Serene Northern Beaches',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
        category: 'beach',
        icon: '🌊',
        attractions: [
            { id: 'mullaitivu-beach', name: 'Mullaitivu Beach', price: 0, duration: 180, description: 'Pristine untouched northern coastline', category: 'Relaxation' },
            { id: 'war-memorial', name: 'War Memorial', price: 0, duration: 60, description: 'Historical significance and memorial site', category: 'Culture' },
            { id: 'nanthi-kadal-lagoon', name: 'Nanthi Kadal Lagoon', price: 0, duration: 120, description: 'Scenic lagoon and bird watching', category: 'Nature' },
            { id: 'maritime-museum-multi', name: 'Maritime Museum', price: 5, duration: 90, description: 'Local maritime history', category: 'Culture' },
        ]
    },
];

// Category Labels with Colors
const CATEGORIES = [
    { id: 'all', label: 'All Places', icon: <Compass className="w-4 h-4" />, color: 'bg-gray-100 text-gray-700' },
    { id: 'beach', label: 'Beaches', icon: <Waves className="w-4 h-4" />, color: 'bg-blue-100 text-blue-700' },
    { id: 'culture', label: 'Culture', icon: <Landmark className="w-4 h-4" />, color: 'bg-amber-100 text-amber-700' },
    { id: 'mountain', label: 'Mountains', icon: <Mountain className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-700' },
    { id: 'wildlife', label: 'Wildlife', icon: <Bird className="w-4 h-4" />, color: 'bg-orange-100 text-orange-700' },
    { id: 'tea', label: 'Tea Country', icon: <Coffee className="w-4 h-4" />, color: 'bg-green-100 text-green-700' },
    { id: 'city', label: 'Cities', icon: <Building2 className="w-4 h-4" />, color: 'bg-purple-100 text-purple-700' },
    { id: 'nature', label: 'Nature', icon: <TreePine className="w-4 h-4" />, color: 'bg-teal-100 text-teal-700' },
];

const HOTEL_RATINGS = [
    { stars: 2, label: '2 Star', description: 'Budget Friendly', priceMultiplier: 1.0 },
    { stars: 3, label: '3 Star', description: 'Comfortable Stay', priceMultiplier: 1.3 },
    { stars: 4, label: '4 Star', description: 'Premium Comfort', priceMultiplier: 1.8 },
    { stars: 5, label: '5 Star', description: '5 Star Deluxe', priceMultiplier: 2.5 },
];

interface TripPreset {
    id: string;
    label: string;
    description: string;
    stops: string[];
}

const TRIP_PRESETS: TripPreset[] = [
    {
        id: 'classic_7_day',
        label: '7-Day Classic Highlights',
        description: 'Colombo → Sigiriya → Kandy → Ella → Mirissa',
        stops: ['colombo', 'sigiriya', 'kandy', 'ella', 'mirissa'],
    },
    {
        id: 'tea_hills_and_safari',
        label: 'Tea Hills & Safari',
        description: 'Colombo → Kandy → Nuwara Eliya → Ella → Yala → Mirissa',
        stops: ['colombo', 'kandy', 'nuwara-eliya', 'ella', 'yala', 'mirissa'],
    },
    {
        id: 'east_coast_escape',
        label: 'East Coast Escape',
        description: 'Sigiriya → Trincomalee → Arugam Bay → Ella',
        stops: ['sigiriya', 'trincomalee', 'arugam-bay', 'ella'],
    },
];

const InteractiveTripBuilder: React.FC = () => {
    const [selectedDestinations, setSelectedDestinations] = useState<Destination[]>([]);
    const [stats, setStats] = useState<TripStats>({ totalDistance: 0, totalTime: 0, suggestedNights: 0, estimatedPrice: 0, attractionCost: 0 });
    const [activeCategory, setActiveCategory] = useState('all');
    const [currentStep, setCurrentStep] = useState(1);
    const [expandedDest, setExpandedDest] = useState<string | null>(null);
    const { toast } = useToast();
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const [quoteForm, setQuoteForm] = useState({ name: '', email: '', phone: '', message: '', travelers: '2', dates: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isSavingPlan, setIsSavingPlan] = useState(false);
    const [savedPlanId, setSavedPlanId] = useState<string | null>(null);

    // New state for search and hotel rating
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedHotelRating, setSelectedHotelRating] = useState(3); // Default 3-star

    // Filter destinations by category and search query
    const filteredDestinations = useMemo(() => {
        let results = ALL_DESTINATIONS;

        // Filter by category
        if (activeCategory !== 'all') {
            results = results.filter(d => d.category === activeCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            results = results.filter(d =>
                d.name.toLowerCase().includes(query) ||
                d.description?.toLowerCase().includes(query) ||
                d.attractions.some(a => a.name.toLowerCase().includes(query))
            );
        }

        return results;
    }, [activeCategory, searchQuery]);

    // Calculate Stats
    useEffect(() => {
        if (selectedDestinations.length < 1) {
            setStats({ totalDistance: 0, totalTime: 0, suggestedNights: 0, estimatedPrice: 0, attractionCost: 0 });
            return;
        }

        let distance = 0;
        for (let i = 0; i < selectedDestinations.length - 1; i++) {
            const d1 = selectedDestinations[i];
            const d2 = selectedDestinations[i + 1];
            const R = 6371;
            const dLat = (d2.lat - d1.lat) * Math.PI / 180;
            const dLng = (d2.lng - d1.lng) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(d1.lat * Math.PI / 180) * Math.cos(d2.lat * Math.PI / 180) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            distance += R * c;
        }

        const roadDistance = Math.round(distance * 1.2);
        const travelTimeMinutes = Math.round((roadDistance / 40) * 60);

        let attractionCost = 0;
        let attractionTime = 0;

        selectedDestinations.forEach(dest => {
            dest.selectedAttractions.forEach(attrId => {
                const attraction = dest.attractions.find(a => a.id === attrId);
                if (attraction) {
                    attractionCost += attraction.price;
                    attractionTime += attraction.duration;
                }
            });
        });

        const totalTimeMinutes = travelTimeMinutes + attractionTime;
        const nightsByTime = Math.floor(totalTimeMinutes / 360);
        const nightsByDistance = Math.floor(roadDistance / 250);
        const nights = Math.max(nightsByTime, nightsByDistance, selectedDestinations.length > 1 ? 1 : 0);

        // Get hotel price multiplier
        const hotelMultiplier = HOTEL_RATINGS.find(h => h.stars === selectedHotelRating)?.priceMultiplier || 1.3;
        const basePrice = 50 + (roadDistance * 0.60) + (nights * 100 * hotelMultiplier);
        const totalPrice = basePrice + attractionCost;

        setStats({
            totalDistance: roadDistance,
            totalTime: totalTimeMinutes,
            suggestedNights: nights,
            estimatedPrice: Math.round(totalPrice),
            attractionCost: attractionCost
        });
    }, [selectedDestinations, selectedHotelRating]);

    const addDestination = (dest: Omit<Destination, 'selectedAttractions'>) => {
        if (selectedDestinations.find(d => d.id === dest.id)) {
            toast({ title: "Already added!", description: `${dest.name} is in your trip.` });
            return;
        }
        setSelectedDestinations([...selectedDestinations, { ...dest, selectedAttractions: [] }]);
        toast({ title: `Added ${dest.name}!`, description: "Click to select activities." });
    };

    const applyPreset = (presetId: string) => {
        const preset = TRIP_PRESETS.find((p) => p.id === presetId);
        if (!preset) return;

        const destinations = preset.stops
            .map((id) => ALL_DESTINATIONS.find((d) => d.id === id))
            .filter((d): d is Omit<Destination, 'selectedAttractions'> => Boolean(d));

        if (destinations.length === 0) {
            toast({
                title: 'Preset not available',
                description: 'Please pick places manually.',
                variant: 'destructive',
            });
            return;
        }

        setSelectedDestinations(destinations.map((d) => ({ ...d, selectedAttractions: [] })));
        setExpandedDest(null);
        setCurrentStep(2);
        setSavedPlanId(null);
        toast({
            title: preset.label,
            description: 'We pre-filled a popular route. You can tweak places and activities.',
        });
    };

    const removeDestination = (id: string) => {
        setSelectedDestinations(selectedDestinations.filter(d => d.id !== id));
    };

    const toggleAttraction = (destinationId: string, attractionId: string) => {
        setSelectedDestinations(selectedDestinations.map(dest => {
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
        return hours > 0 ? `${hours}h ${mins > 0 ? mins + 'm' : ''}` : `${mins}m`;
    };

    const handleQuoteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!quoteForm.name || !quoteForm.email) {
            toast({ title: "Missing info", description: "Please add name and email.", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);

        try {
            const itinerary = selectedDestinations.map((dest, index) => ({
                order: index + 1,
                id: dest.id,
                name: dest.name,
                selectedAttractions: dest.selectedAttractions,
            }));

            await addDoc(collection(db, "booking_requests"), {
                bookingType: "custom_trip",
                customerName: quoteForm.name,
                customerEmail: quoteForm.email,
                customerPhone: quoteForm.phone,
                numberOfTravelers: quoteForm.travelers,
                preferredDates: quoteForm.dates,
                message: quoteForm.message || "No special requests",
                hotelRating: selectedHotelRating,
                hotelPreference: HOTEL_RATINGS.find(h => h.stars === selectedHotelRating)?.description || 'Comfortable Stay',
                totalDistanceKm: stats.totalDistance,
                totalTimeMinutes: stats.totalTime,
                suggestedNights: stats.suggestedNights,
                estimatedPrice: stats.estimatedPrice,
                attractionCost: stats.attractionCost,
                itinerary,
                summary: selectedDestinations.map(d => d.name).join(' → '),
                createdAt: Timestamp.now(),
                status: "pending",
                source: "website-trip-builder",
            });

            toast({ title: "Quote Request Sent!", description: "We'll contact you within 24 hours." });
            setIsQuoteOpen(false);
            setQuoteForm({ name: '', email: '', phone: '', message: '', travelers: '2', dates: '' });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Please try again.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSavePlan = async () => {
        if (selectedDestinations.length === 0) {
            toast({
                title: 'No trip yet',
                description: 'Add at least one destination before saving your plan.',
                variant: 'destructive',
            });
            return;
        }

        setIsSavingPlan(true);
        try {
            const itinerary = selectedDestinations.map((dest, index) => ({
                order: index + 1,
                id: dest.id,
                name: dest.name,
                selectedAttractions: dest.selectedAttractions,
            }));

            const docRef = await addDoc(collection(db, 'trip_plans'), {
                summary: selectedDestinations.map((d) => d.name).join(' → '),
                hotelRating: selectedHotelRating,
                stats,
                itinerary,
                destinations: selectedDestinations.map((d) => ({
                    id: d.id,
                    name: d.name,
                    lat: d.lat,
                    lng: d.lng,
                    image: d.image,
                    category: d.category,
                    icon: d.icon,
                    selectedAttractions: d.selectedAttractions,
                })),
                createdAt: Timestamp.now(),
                source: 'website-trip-builder',
            });

            setSavedPlanId(docRef.id);
            toast({
                title: 'Trip plan saved',
                description: `Your plan ID is ${docRef.id}. You can share this ID with our team.`,
            });
        } catch (error) {
            console.error(error);
            toast({ title: 'Error saving trip', description: 'Please try again.', variant: 'destructive' });
        } finally {
            setIsSavingPlan(false);
        }
    };

    return (
        <section className="py-12 bg-gradient-to-b from-teal-50 via-white to-amber-50 min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-2 rounded-full mb-4 shadow-lg"
                    >
                        <Map className="w-5 h-5" />
                        <span className="font-semibold">Plan Your Dream Trip</span>
                        <Sparkles className="w-4 h-4" />
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                        Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">Sri Lanka Adventure</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Simply click on places you want to visit. We'll calculate the best route, suggest activities, and give you an instant price estimate!
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md">
                        {[1, 2, 3].map((step) => (
                            <React.Fragment key={step}>
                                <button
                                    onClick={() => setCurrentStep(step)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${currentStep === step
                                            ? 'bg-teal-600 text-white shadow-lg'
                                            : currentStep > step
                                                ? 'bg-teal-100 text-teal-700'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}
                                >
                                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                                        {currentStep > step ? <Check className="w-4 h-4" /> : step}
                                    </span>
                                    <span className="hidden sm:inline">
                                        {step === 1 && 'Choose Places'}
                                        {step === 2 && 'Select Activities'}
                                        {step === 3 && 'Get Quote'}
                                    </span>
                                </button>
                                {step < 3 && <ArrowRight className="w-4 h-4 text-gray-300" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Destination Picker / Activities */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Step 1: Choose Destinations */}
                        {currentStep === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                {/* Search Bar */}
                                <div className="mb-6">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search places... (e.g., Ella, beach, safari, temple)"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-12 pr-4 py-6 text-lg rounded-2xl border-2 border-gray-200 focus:border-teal-500 bg-white shadow-sm"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                    {searchQuery && (
                                        <p className="text-sm text-gray-500 mt-2 ml-2">
                                            Found {filteredDestinations.length} place{filteredDestinations.length !== 1 ? 's' : ''} matching "{searchQuery}"
                                        </p>
                                    )}
                                </div>

                                {/* Quick Suggested Trips */}
                                <div className="mb-6">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Or start with a suggested route:
                                    </p>
                                    <div className="flex gap-3 overflow-x-auto pb-1">
                                        {TRIP_PRESETS.map((preset) => (
                                            <button
                                                key={preset.id}
                                                type="button"
                                                onClick={() => applyPreset(preset.id)}
                                                className="flex-shrink-0 px-4 py-3 rounded-xl bg-white border border-teal-100 shadow-sm hover:border-teal-300 hover:shadow-md transition-all text-left"
                                            >
                                                <div className="text-xs uppercase tracking-wide text-teal-600 mb-1">
                                                    {preset.label}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {preset.description}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Hotel Star Rating Selector */}
                                <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Hotel className="w-5 h-5 text-amber-600" />
                                        <h3 className="font-semibold text-gray-800">Select Your Hotel Preference</h3>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {HOTEL_RATINGS.map((hotel) => (
                                            <button
                                                key={hotel.stars}
                                                onClick={() => setSelectedHotelRating(hotel.stars)}
                                                className={`p-3 rounded-xl transition-all text-center ${selectedHotelRating === hotel.stars
                                                        ? 'bg-amber-500 text-white shadow-lg scale-105'
                                                        : 'bg-white hover:bg-amber-100 text-gray-700 border border-amber-200'
                                                    }`}
                                            >
                                                <div className="flex justify-center gap-0.5 mb-1">
                                                    {[...Array(hotel.stars)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${selectedHotelRating === hotel.stars
                                                                    ? 'text-white fill-white'
                                                                    : 'text-amber-500 fill-amber-500'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="font-semibold text-sm">{hotel.label}</div>
                                                <div className={`text-xs mt-0.5 ${selectedHotelRating === hotel.stars ? 'text-amber-100' : 'text-gray-500'
                                                    }`}>
                                                    {hotel.description}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Category Filters */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${activeCategory === cat.id
                                                    ? 'bg-teal-600 text-white shadow-lg scale-105'
                                                    : cat.color + ' hover:scale-105'
                                                }`}
                                        >
                                            {cat.icon}
                                            <span className="text-sm">{cat.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Destination Cards Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {filteredDestinations.map((dest) => {
                                        const isSelected = selectedDestinations.find(d => d.id === dest.id);
                                        return (
                                            <motion.div
                                                key={dest.id}
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => addDestination(dest)}
                                                className={`relative cursor-pointer rounded-2xl overflow-hidden shadow-lg transition-all group ${isSelected ? 'ring-4 ring-teal-500 ring-offset-2' : ''
                                                    }`}
                                            >
                                                <div className="aspect-[4/3] relative">
                                                    <img
                                                        src={dest.image}
                                                        alt={dest.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                                    {/* Icon Badge */}
                                                    <div className="absolute top-3 left-3 text-2xl">{dest.icon}</div>

                                                    {/* Selected Check */}
                                                    {isSelected && (
                                                        <div className="absolute top-3 right-3 bg-teal-500 text-white rounded-full p-1.5 shadow-lg">
                                                            <Check className="w-4 h-4" />
                                                        </div>
                                                    )}

                                                    {/* Content */}
                                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                                        <h3 className="text-white font-bold text-lg leading-tight">{dest.name}</h3>
                                                        <p className="text-white/80 text-xs mt-1">{dest.description}</p>
                                                        <div className="flex items-center gap-1 mt-2">
                                                            <Badge className="bg-white/20 text-white text-[10px] border-0">
                                                                {dest.attractions.length} activities
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {/* Hover Add Button */}
                                                    {!isSelected && (
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                                            <div className="bg-white text-teal-600 rounded-full p-3 shadow-xl">
                                                                <Plus className="w-8 h-8" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Select Activities */}
                        {currentStep === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-amber-500" />
                                        Select Activities at Each Stop
                                    </h3>

                                    {selectedDestinations.length === 0 ? (
                                        <div className="text-center py-12">
                                            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500">No destinations selected yet.</p>
                                            <Button
                                                onClick={() => setCurrentStep(1)}
                                                className="mt-4 bg-teal-600 hover:bg-teal-700"
                                            >
                                                <ArrowLeft className="w-4 h-4 mr-2" />
                                                Go Back to Choose Places
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {selectedDestinations.map((dest, index) => (
                                                <div
                                                    key={dest.id}
                                                    className="border rounded-xl overflow-hidden bg-gray-50"
                                                >
                                                    {/* Destination Header */}
                                                    <div
                                                        className="flex items-center gap-4 p-4 bg-white cursor-pointer"
                                                        onClick={() => setExpandedDest(expandedDest === dest.id ? null : dest.id)}
                                                    >
                                                        <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden">
                                                            <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">
                                                                    {index + 1}
                                                                </span>
                                                                <h4 className="font-bold text-gray-900">{dest.icon} {dest.name}</h4>
                                                            </div>
                                                            {dest.selectedAttractions.length > 0 && (
                                                                <Badge className="mt-1 bg-teal-100 text-teal-700 border-0">
                                                                    {dest.selectedAttractions.length} activities selected
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-gray-400"
                                                        >
                                                            {expandedDest === dest.id ? <ChevronUp /> : <ChevronDown />}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={(e) => { e.stopPropagation(); removeDestination(dest.id); }}
                                                            className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </Button>
                                                    </div>

                                                    {/* Activities List */}
                                                    <AnimatePresence>
                                                        {expandedDest === dest.id && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="px-4 pb-4"
                                                            >
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                                                    {dest.attractions.map((attr) => {
                                                                        const isSelected = dest.selectedAttractions.includes(attr.id);
                                                                        return (
                                                                            <div
                                                                                key={attr.id}
                                                                                onClick={() => toggleAttraction(dest.id, attr.id)}
                                                                                className={`p-4 rounded-xl cursor-pointer transition-all ${isSelected
                                                                                        ? 'bg-teal-50 border-2 border-teal-500 shadow-md'
                                                                                        : 'bg-white border-2 border-transparent hover:border-teal-200'
                                                                                    }`}
                                                                            >
                                                                                <div className="flex items-start gap-3">
                                                                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-teal-500 border-teal-500' : 'border-gray-300'
                                                                                        }`}>
                                                                                        {isSelected && <Check className="w-4 h-4 text-white" />}
                                                                                    </div>
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <h5 className="font-semibold text-gray-900 text-sm">{attr.name}</h5>
                                                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{attr.description}</p>
                                                                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                                                                            <span className="flex items-center gap-1">
                                                                                                <Clock className="w-3 h-3" />
                                                                                                {formatTime(attr.duration)}
                                                                                            </span>
                                                                                            <span className="flex items-center gap-1">
                                                                                                <DollarSign className="w-3 h-3" />
                                                                                                ${attr.price}
                                                                                            </span>
                                                                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                                                                                {attr.category}
                                                                                            </Badge>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Review & Quote */}
                        {currentStep === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <Route className="w-5 h-5 text-teal-600" />
                                        Your Trip Summary
                                    </h3>

                                    {selectedDestinations.length === 0 ? (
                                        <div className="text-center py-12">
                                            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500">No destinations selected yet.</p>
                                            <Button
                                                onClick={() => setCurrentStep(1)}
                                                className="mt-4 bg-teal-600 hover:bg-teal-700"
                                            >
                                                Start Planning
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Trip Route Visual */}
                                            <div className="flex items-center gap-2 flex-wrap mb-6 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl">
                                                {selectedDestinations.map((dest, index) => (
                                                    <React.Fragment key={dest.id}>
                                                        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                                                            <span className="text-lg">{dest.icon}</span>
                                                            <span className="font-medium">{dest.name}</span>
                                                            {dest.selectedAttractions.length > 0 && (
                                                                <Badge className="bg-teal-100 text-teal-700 text-[10px] border-0">
                                                                    {dest.selectedAttractions.length}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        {index < selectedDestinations.length - 1 && (
                                                            <ArrowRight className="w-5 h-5 text-teal-400 flex-shrink-0" />
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </div>

                                            {/* Hotel Rating Display */}
                                            <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Hotel className="w-5 h-5 text-amber-600" />
                                                        <span className="font-medium text-gray-700">Hotel Preference:</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex gap-0.5">
                                                            {[...Array(selectedHotelRating)].map((_, i) => (
                                                                <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                            ))}
                                                        </div>
                                                        <span className="font-semibold text-amber-700">
                                                            {HOTEL_RATINGS.find(h => h.stars === selectedHotelRating)?.description}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quick Stats */}
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                                <div className="bg-blue-50 rounded-xl p-4 text-center">
                                                    <Route className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                                                    <div className="text-2xl font-bold text-blue-700">{stats.totalDistance}</div>
                                                    <div className="text-xs text-blue-600">Kilometers</div>
                                                </div>
                                                <div className="bg-purple-50 rounded-xl p-4 text-center">
                                                    <Clock className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                                                    <div className="text-2xl font-bold text-purple-700">{formatTime(stats.totalTime)}</div>
                                                    <div className="text-xs text-purple-600">Total Duration</div>
                                                </div>
                                                <div className="bg-amber-50 rounded-xl p-4 text-center">
                                                    <Moon className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                                                    <div className="text-2xl font-bold text-amber-700">{stats.suggestedNights}</div>
                                                    <div className="text-xs text-amber-600">Nights</div>
                                                </div>
                                                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                                                    <DollarSign className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                                                    <div className="text-2xl font-bold text-emerald-700">${stats.estimatedPrice}</div>
                                                    <div className="text-xs text-emerald-600">Est. Total</div>
                                                </div>
                                            </div>

                                            {/* Activities Summary */}
                                            <div className="mb-6">
                                                <h4 className="font-semibold text-gray-700 mb-3">Selected Activities:</h4>
                                                <div className="space-y-2">
                                                    {selectedDestinations.map(dest => (
                                                        <div key={dest.id}>
                                                            {dest.selectedAttractions.length > 0 && (
                                                                <div className="flex items-start gap-2">
                                                                    <span className="text-sm font-medium text-gray-700">{dest.icon} {dest.name}:</span>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {dest.selectedAttractions.map(attrId => {
                                                                            const attr = dest.attractions.find(a => a.id === attrId);
                                                                            return attr && (
                                                                                <Badge key={attrId} variant="outline" className="text-xs">
                                                                                    {attr.name}
                                                                                </Badge>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <Button
                                                onClick={() => setIsQuoteOpen(true)}
                                                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg"
                                            >
                                                <Send className="w-5 h-5 mr-2" />
                                                Get Your Free Quote
                                            </Button>
                                            <p className="text-center text-sm text-gray-500 mt-2">
                                                No payment required. Our team will contact you within 24 hours.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right: Your Trip Panel + Map */}
                    <div className="space-y-4">
                        {/* Trip Summary Card */}
                        <Card className="shadow-xl border-0 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <MapPin className="w-5 h-5" />
                                    Your Trip ({selectedDestinations.length} stops)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                {selectedDestinations.length === 0 ? (
                                    <p className="text-gray-500 text-center py-6">
                                        Click on destinations to add them to your trip!
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {selectedDestinations.map((dest, index) => (
                                            <div
                                                key={dest.id}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                                            >
                                                <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">
                                                    {index + 1}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-gray-900 text-sm">{dest.icon} {dest.name}</div>
                                                    {dest.selectedAttractions.length > 0 && (
                                                        <div className="text-xs text-gray-500">
                                                            {dest.selectedAttractions.length} activities
                                                        </div>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeDestination(dest.id)}
                                                    className="h-8 w-8 text-gray-400 hover:text-red-500"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Stats Summary & Save Plan */}
                                {selectedDestinations.length > 0 && (
                                    <>
                                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Distance</span>
                                                <span className="font-medium">{stats.totalDistance} km</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Duration</span>
                                                <span className="font-medium">{formatTime(stats.totalTime)}</span>
                                            </div>
                                            {stats.suggestedNights > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Suggested Nights</span>
                                                    <span className="font-medium">{stats.suggestedNights}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-sm items-center">
                                                <span className="text-gray-600">Hotel</span>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(selectedHotelRating)].map((_, i) => (
                                                        <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-lg pt-2 border-t mt-2">
                                                <span className="font-semibold text-gray-900">Est. Price</span>
                                                <span className="font-bold text-teal-600">${stats.estimatedPrice}</span>
                                            </div>
                                            {stats.attractionCost > 0 && (
                                                <div className="text-[11px] text-gray-500 mt-1">
                                                    Approx. ${Math.max(stats.estimatedPrice - stats.attractionCost, 0)} for
                                                    transport & stays + ${stats.attractionCost} for activities.
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 flex flex-col gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleSavePlan}
                                                disabled={isSavingPlan}
                                            >
                                                {isSavingPlan ? 'Saving trip...' : 'Save this trip plan'}
                                            </Button>
                                            {savedPlanId && (
                                                <p className="text-[11px] text-gray-500 break-all">
                                                    Saved as plan ID: {savedPlanId}. Share this ID with our team when
                                                    you're ready to book.
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Next Step Button */}
                                {selectedDestinations.length > 0 && currentStep < 3 && (
                                    <Button
                                        onClick={() => setCurrentStep(currentStep + 1)}
                                        className="w-full mt-4 bg-teal-600 hover:bg-teal-700"
                                    >
                                        {currentStep === 1 ? 'Choose Activities' : 'Review & Get Quote'}
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Map - Larger Size */}
                        <Card className="shadow-xl border-0 overflow-hidden h-[500px]">
                            <TripMap destinations={selectedDestinations} />
                        </Card>
                    </div>
                </div>
            </div>

            {/* Quote Dialog */}
            <Dialog open={isQuoteOpen} onOpenChange={setIsQuoteOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Send className="w-5 h-5 text-teal-600" />
                            Get Your Free Quote
                        </DialogTitle>
                        <DialogDescription>
                            Share your details and we'll send you a personalized quote within 24 hours.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Trip Summary in Dialog */}
                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 mb-4">
                        <div className="flex items-center flex-wrap gap-2 text-sm">
                            {selectedDestinations.map((dest, i) => (
                                <React.Fragment key={dest.id}>
                                    <span className="font-medium">{dest.icon} {dest.name}</span>
                                    {i < selectedDestinations.length - 1 && <ArrowRight className="w-3 h-3 text-gray-400" />}
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                            <span>{stats.totalDistance} km</span>
                            <span>{stats.suggestedNights} nights</span>
                            <span className="flex items-center gap-1">
                                {[...Array(selectedHotelRating)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                                ))}
                            </span>
                            <span className="font-bold text-teal-600">${stats.estimatedPrice}</span>
                        </div>
                    </div>

                    <form onSubmit={handleQuoteSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Your Name *</Label>
                                <Input
                                    id="name"
                                    value={quoteForm.name}
                                    onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={quoteForm.email}
                                    onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="phone">Phone / WhatsApp</Label>
                                <Input
                                    id="phone"
                                    value={quoteForm.phone}
                                    onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                            <div>
                                <Label htmlFor="travelers">Number of Travelers</Label>
                                <Input
                                    id="travelers"
                                    type="number"
                                    min="1"
                                    value={quoteForm.travelers}
                                    onChange={(e) => setQuoteForm({ ...quoteForm, travelers: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="dates">Preferred Travel Dates</Label>
                            <Input
                                id="dates"
                                value={quoteForm.dates}
                                onChange={(e) => setQuoteForm({ ...quoteForm, dates: e.target.value })}
                                placeholder="e.g., Dec 15-25, 2024"
                            />
                        </div>
                        <div>
                            <Label htmlFor="message">Special Requests (optional)</Label>
                            <Textarea
                                id="message"
                                value={quoteForm.message}
                                onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                                placeholder="Tell us about your travel style, interests, or any special requirements..."
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsQuoteOpen(false)} className="flex-1">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-teal-600 hover:bg-teal-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Quote Request
                                    </>
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
