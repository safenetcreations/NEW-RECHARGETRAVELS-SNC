import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUpload from '@/components/ui/image-upload';
import { Plus, Trash, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Types matching the frontend service
interface HeroSlide {
    id: string;
    image: string;
    title: string;
    subtitle: string;
    description: string;
}

interface VehiclePricing {
    id: string; // economy, sedan, suv, etc.
    name: string;
    basePrice: number; // USD
    pricePerKm: number; // USD
    passengers: number;
    luggage: number;
}

interface TransferExtra {
    id: string;
    name: string;
    description: string;
    priceUSD: number;
    icon: string;
    isIncluded?: boolean;
}

interface Feature {
    icon: string;
    title: string;
    description: string;
    highlight: string;
}

interface PopularRoute {
    destination: string;
    price: number;
    duration: string;
    distance: number;
}

interface SEOData {
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
}

interface PageContent {
    heroSlides: HeroSlide[];
    vehiclePricing: VehiclePricing[];
    transferExtras: TransferExtra[];
    features: Feature[];
    popularRoutes: PopularRoute[];
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
}

const DEFAULT_VEHICLES: VehiclePricing[] = [
    { id: 'economy', name: 'Economy Sedan', basePrice: 11, pricePerKm: 0.25, passengers: 3, luggage: 2 },
    { id: 'sedan', name: 'Premium Sedan', basePrice: 14, pricePerKm: 0.31, passengers: 3, luggage: 3 },
    { id: 'suv', name: 'SUV', basePrice: 23, pricePerKm: 0.47, passengers: 5, luggage: 4 },
    { id: 'van', name: 'Mini Van', basePrice: 20, pricePerKm: 0.41, passengers: 8, luggage: 6 },
    { id: 'luxury', name: 'Luxury Vehicle', basePrice: 47, pricePerKm: 0.78, passengers: 3, luggage: 3 },
    { id: 'luxury-suv', name: 'Luxury SUV', basePrice: 63, pricePerKm: 0.94, passengers: 5, luggage: 5 },
    { id: 'coach', name: 'Mini Coach', basePrice: 38, pricePerKm: 0.63, passengers: 15, luggage: 15 },
];

const DEFAULT_EXTRAS: TransferExtra[] = [
    { id: 'meet-greet', name: 'VIP Meet & Greet', description: 'Driver waits at arrivals with name board', priceUSD: 0, icon: 'UserCheck', isIncluded: true },
    { id: 'child-seat', name: 'Child Seat', description: 'Baby/toddler car seat (per seat)', priceUSD: 5, icon: 'Baby' },
    { id: 'wifi-device', name: 'Portable WiFi', description: 'High-speed 4G hotspot device', priceUSD: 8, icon: 'Wifi' },
    { id: 'flower-welcome', name: 'Flower Welcome', description: 'Traditional garland greeting', priceUSD: 10, icon: 'Flower2' },
    { id: 'cold-towels', name: 'Cold Towels & Water', description: 'Refreshing cold towels and bottled water', priceUSD: 5, icon: 'Droplets' },
    { id: 'local-sim', name: 'Local SIM Card', description: 'Pre-activated SIM with 10GB data', priceUSD: 16, icon: 'Smartphone' },
    { id: 'porter', name: 'Porter Service', description: 'Luggage assistance at airport', priceUSD: 5, icon: 'Luggage' },
    { id: 'fast-track', name: 'Fast Track Immigration', description: 'VIP clearance service (subject to availability)', priceUSD: 47, icon: 'Zap' },
];

const AirportTransfersContentManager = () => {
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<PageContent>({
        heroSlides: [],
        vehiclePricing: DEFAULT_VEHICLES,
        transferExtras: DEFAULT_EXTRAS,
        features: [],
        popularRoutes: [],
        seoTitle: 'Airport Transfers Sri Lanka - Recharge Travels',
        seoDescription: 'Premium airport transfers to and from Colombo Airport.',
        seoKeywords: ['airport transfer', 'sri lanka', 'colombo', 'taxi']
    });

    const loadContent = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'page-content', 'airport-transfers');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as PageContent;
                // Merge with defaults to ensure all fields exist
                setContent({
                    ...content,
                    ...data,
                    vehiclePricing: data.vehiclePricing || DEFAULT_VEHICLES,
                    transferExtras: data.transferExtras || DEFAULT_EXTRAS
                });
                toast.success('Content loaded successfully');
            } else {
                toast.info('No existing content found, using defaults.');
            }
        } catch (error) {
            console.error('Error loading content:', error);
            toast.error('Failed to load content');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContent();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'page-content', 'airport-transfers');
            await setDoc(docRef, content, { merge: true });
            toast.success('Content saved successfully! Changes are live.');
        } catch (error) {
            console.error('Error saving content:', error);
            toast.error('Failed to save content');
        } finally {
            setLoading(false);
        }
    };

    // --- Hero Slides Helpers ---
    const addHeroSlide = () => {
        setContent(prev => ({
            ...prev,
            heroSlides: [
                ...prev.heroSlides,
                { id: Date.now().toString(), image: '', title: 'New Slide', subtitle: 'Subtitle', description: '' }
            ]
        }));
    };

    const updateHeroSlide = (index: number, field: keyof HeroSlide, value: string) => {
        const newSlides = [...content.heroSlides];
        newSlides[index] = { ...newSlides[index], [field]: value };
        setContent(prev => ({ ...prev, heroSlides: newSlides }));
    };

    const removeHeroSlide = (index: number) => {
        const newSlides = [...content.heroSlides];
        newSlides.splice(index, 1);
        setContent(prev => ({ ...prev, heroSlides: newSlides }));
    };

    // --- Vehicle Pricing Helpers ---
    const updateVehiclePrice = (index: number, field: keyof VehiclePricing, value: string | number) => {
        const newPricing = [...content.vehiclePricing];
        newPricing[index] = { ...newPricing[index], [field]: value };
        setContent(prev => ({ ...prev, vehiclePricing: newPricing }));
    };

    // --- Extras Helpers ---
    const updateExtra = (index: number, field: keyof TransferExtra, value: any) => {
        const newExtras = [...content.transferExtras];
        newExtras[index] = { ...newExtras[index], [field]: value };
        setContent(prev => ({ ...prev, transferExtras: newExtras }));
    };

    const addExtra = () => {
        setContent(prev => ({
            ...prev,
            transferExtras: [
                ...prev.transferExtras,
                { id: `extra-${Date.now()}`, name: 'New Service', description: 'Description...', priceUSD: 10, icon: 'Sparkles', isIncluded: false }
            ]
        }));
    };

    const removeExtra = (index: number) => {
        const newExtras = [...content.transferExtras];
        newExtras.splice(index, 1);
        setContent(prev => ({ ...prev, transferExtras: newExtras }));
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Airport Transfer Pages</h2>
                    <p className="text-gray-500">Manage content, pricing, and images for the Airport Transfers page.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={loadContent} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="hero" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                    <TabsTrigger value="hero" className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 rounded-none px-0 py-3 bg-transparent font-medium text-gray-500">Hero Section</TabsTrigger>
                    <TabsTrigger value="pricing" className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 rounded-none px-0 py-3 bg-transparent font-medium text-gray-500">Vehicle Pricing</TabsTrigger>
                    <TabsTrigger value="extras" className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 rounded-none px-0 py-3 bg-transparent font-medium text-gray-500">Additional Services</TabsTrigger>
                    <TabsTrigger value="seo" className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 rounded-none px-0 py-3 bg-transparent font-medium text-gray-500">SEO Settings</TabsTrigger>
                </TabsList>

                {/* --- Hero Section Tab --- */}
                <TabsContent value="hero" className="pt-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Hero Slides</h3>
                        <Button onClick={addHeroSlide} size="sm" variant="outline" className="border-dashed">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Slide
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {content.heroSlides.map((slide, index) => (
                            <Card key={slide.id} className="overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="md:col-span-1">
                                            <Label>Slide Image</Label>
                                            <div className="mt-2">
                                                <ImageUpload
                                                    value={slide.image}
                                                    onChange={(url) => updateHeroSlide(index, 'image', url)}
                                                    onRemove={() => updateHeroSlide(index, 'image', '')}
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-4">
                                            <div className="flex justify-between">
                                                <Label className="text-base font-semibold">Slide #{index + 1}</Label>
                                                <Button variant="ghost" size="sm" onClick={() => removeHeroSlide(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"><Trash className="w-4 h-4" /></Button>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Title</Label>
                                                <Input value={slide.title} onChange={(e) => updateHeroSlide(index, 'title', e.target.value)} placeholder="e.g. Premium Transfers" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Subtitle</Label>
                                                <Input value={slide.subtitle} onChange={(e) => updateHeroSlide(index, 'subtitle', e.target.value)} placeholder="e.g. Your Journey Begins Here" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Description (Optional)</Label>
                                                <Textarea value={slide.description} onChange={(e) => updateHeroSlide(index, 'description', e.target.value)} placeholder="Brief description..." />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {content.heroSlides.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed rounded-xl bg-gray-50">
                                <p className="text-gray-500">No slides configured. Add one to get started.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* --- Vehicle Pricing Tab --- */}
                <TabsContent value="pricing" className="pt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Vehicle Pricing Configuration</CardTitle>
                            <CardDescription>
                                Adjust the base rates and per-kilometer pricing for each vehicle class (USD).
                                These settings directly affect the price calculator on the website.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {content.vehiclePricing.map((vehicle, index) => (
                                    <div key={vehicle.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-b pb-6 last:border-0 last:pb-0">
                                        <div className="md:col-span-3">
                                            <Label>Vehicle Name</Label>
                                            <Input value={vehicle.name} onChange={(e) => updateVehiclePrice(index, 'name', e.target.value)} className="font-semibold" />
                                            <div className="text-xs text-gray-400 mt-1 uppercase">ID: {vehicle.id}</div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <Label>Base Price ($)</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={vehicle.basePrice}
                                                onChange={(e) => updateVehiclePrice(index, 'basePrice', parseFloat(e.target.value))}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <Label>Price Per KM ($)</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={vehicle.pricePerKm}
                                                onChange={(e) => updateVehiclePrice(index, 'pricePerKm', parseFloat(e.target.value))}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <Label>Passengers</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={vehicle.passengers}
                                                onChange={(e) => updateVehiclePrice(index, 'passengers', parseInt(e.target.value))}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <Label>Luggage</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={vehicle.luggage}
                                                onChange={(e) => updateVehiclePrice(index, 'luggage', parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- Extras Tab --- */}
                <TabsContent value="extras" className="pt-6 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Additional Services & Add-ons</CardTitle>
                                <CardDescription>Manage the extra services offered during booking (e.g., Child Seats, SIM Cards).</CardDescription>
                            </div>
                            <Button onClick={addExtra} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Service
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {content.transferExtras.map((extra, index) => (
                                    <div key={extra.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start border p-4 rounded-lg bg-gray-50/50">
                                        <div className="md:col-span-4 space-y-3">
                                            <div>
                                                <Label>Service Name</Label>
                                                <Input value={extra.name} onChange={(e) => updateExtra(index, 'name', e.target.value)} className="font-medium" placeholder="e.g. Child Seat" />
                                            </div>
                                            <div>
                                                <Label>Description</Label>
                                                <Textarea value={extra.description} onChange={(e) => updateExtra(index, 'description', e.target.value)} placeholder="Brief description..." rows={2} />
                                            </div>
                                        </div>

                                        <div className="md:col-span-3 space-y-3">
                                            <div>
                                                <Label>Price (USD)</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                                    <Input type="number" min="0" className="pl-6" value={extra.priceUSD} onChange={(e) => updateExtra(index, 'priceUSD', parseFloat(e.target.value))} />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 pt-8">
                                                <input
                                                    type="checkbox"
                                                    id={`included-${index}`}
                                                    checked={extra.isIncluded || false}
                                                    onChange={(e) => updateExtra(index, 'isIncluded', e.target.checked)}
                                                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <Label htmlFor={`included-${index}`} className="text-sm text-gray-700 cursor-pointer">Free / Included</Label>
                                            </div>
                                        </div>

                                        <div className="md:col-span-4 space-y-3">
                                            <div>
                                                <Label>Icon Name</Label>
                                                <Input value={extra.icon} onChange={(e) => updateExtra(index, 'icon', e.target.value)} placeholder="e.g. Baby, Wifi, Zap" />
                                                <p className="text-xs text-gray-500 mt-1">Available: UserCheck, Baby, Wifi, Flower2, Droplets, Smartphone, Luggage, Zap</p>
                                            </div>
                                            <div>
                                                <Label>ID (Unique)</Label>
                                                <Input value={extra.id} onChange={(e) => updateExtra(index, 'id', e.target.value)} className="font-mono text-xs" />
                                            </div>
                                        </div>

                                        <div className="md:col-span-1 flex justify-end pt-8">
                                            <Button variant="ghost" size="icon" onClick={() => removeExtra(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {content.transferExtras.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">No extras defined. Add one to get started.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- SEO Tab --- */}
                <TabsContent value="seo" className="pt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>SEO Settings</CardTitle>
                            <CardDescription>Manage how the page appears in search engines.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Page Title</Label>
                                <Input
                                    value={content.seoTitle}
                                    onChange={(e) => setContent(prev => ({ ...prev, seoTitle: e.target.value }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Meta Description</Label>
                                <Textarea
                                    value={content.seoDescription}
                                    onChange={(e) => setContent(prev => ({ ...prev, seoDescription: e.target.value }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Keywords (comma separated)</Label>
                                <Input
                                    value={content.seoKeywords.join(', ')}
                                    onChange={(e) => setContent(prev => ({ ...prev, seoKeywords: e.target.value.split(',').map(k => k.trim()) }))}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
};

export default AirportTransfersContentManager;
