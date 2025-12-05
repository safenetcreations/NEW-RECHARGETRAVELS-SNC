import React, { useState, useEffect } from 'react';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
    Zap,
    Battery,
    Gauge,
    Shield,
    Plus,
    Trash2,
    Edit,
    Save,
    X,
    Leaf,
    MapPin,
    Settings,
} from 'lucide-react';

interface EScooter {
    id?: string;
    model: string;
    brand: string;
    image: string;
    price: number;
    range: string;
    maxRange: string;
    maxSpeed: string;
    motor: string;
    motorType: string;
    battery: string;
    batteryType: string;
    charger?: string;
    chargingTime?: string;
    chargingCycles: string;
    originalPrice: string;
    featured: boolean;
    seating: string;
    seatHeight?: string;
    saddleLength?: string;
    dimensions: string;
    tires: string;
    brakes: string;
    shockAbsorption: string;
    dashboard: string;
    headlight: string;
    specialFeatures: string[];
    description: string;
    location: string;
    isActive: boolean;
    createdAt?: any;
    updatedAt?: any;
}

const defaultScooter: EScooter = {
    model: '',
    brand: 'Yadea',
    image: '',
    price: 20,
    range: '',
    maxRange: '',
    maxSpeed: '',
    motor: '',
    motorType: 'Hub Motor',
    battery: '',
    batteryType: 'Graphene Battery',
    charger: '',
    chargingTime: '',
    chargingCycles: '800-1000',
    originalPrice: '',
    featured: false,
    seating: '2 Seats',
    seatHeight: '',
    saddleLength: '',
    dimensions: '',
    tires: '',
    brakes: '',
    shockAbsorption: 'Hydraulic',
    dashboard: 'LED Digital Tube',
    headlight: 'LED',
    specialFeatures: [],
    description: '',
    location: 'Jaffna',
    isActive: true,
};

const EScootersManager: React.FC = () => {
    const { toast } = useToast();
    const [scooters, setScooters] = useState<EScooter[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingScooter, setEditingScooter] = useState<EScooter | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newFeature, setNewFeature] = useState('');

    // Fetch scooters from Firebase
    const fetchScooters = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, 'eScooters'));
            const scootersData: EScooter[] = [];
            querySnapshot.forEach((doc) => {
                scootersData.push({ id: doc.id, ...doc.data() } as EScooter);
            });
            setScooters(scootersData);
        } catch (error) {
            console.error('Error fetching scooters:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch e-scooters',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScooters();
    }, []);

    // Save scooter (create or update)
    const handleSave = async () => {
        if (!editingScooter) return;

        try {
            if (editingScooter.id) {
                // Update existing
                const scooterRef = doc(db, 'eScooters', editingScooter.id);
                await updateDoc(scooterRef, {
                    ...editingScooter,
                    updatedAt: serverTimestamp(),
                });
                toast({
                    title: 'Success',
                    description: 'E-Scooter updated successfully',
                });
            } else {
                // Create new
                await addDoc(collection(db, 'eScooters'), {
                    ...editingScooter,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
                toast({
                    title: 'Success',
                    description: 'E-Scooter added successfully',
                });
            }
            setEditingScooter(null);
            setIsAddingNew(false);
            fetchScooters();
        } catch (error) {
            console.error('Error saving scooter:', error);
            toast({
                title: 'Error',
                description: 'Failed to save e-scooter',
                variant: 'destructive',
            });
        }
    };

    // Delete scooter
    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this e-scooter?')) return;

        try {
            await deleteDoc(doc(db, 'eScooters', id));
            toast({
                title: 'Success',
                description: 'E-Scooter deleted successfully',
            });
            fetchScooters();
        } catch (error) {
            console.error('Error deleting scooter:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete e-scooter',
                variant: 'destructive',
            });
        }
    };

    // Add special feature
    const addFeature = () => {
        if (newFeature.trim() && editingScooter) {
            setEditingScooter({
                ...editingScooter,
                specialFeatures: [...editingScooter.specialFeatures, newFeature.trim()],
            });
            setNewFeature('');
        }
    };

    // Remove special feature
    const removeFeature = (index: number) => {
        if (editingScooter) {
            const updatedFeatures = [...editingScooter.specialFeatures];
            updatedFeatures.splice(index, 1);
            setEditingScooter({
                ...editingScooter,
                specialFeatures: updatedFeatures,
            });
        }
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            E-Scooters Manager
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Manage Yadea electric scooters available for rent in Jaffna
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingScooter(defaultScooter);
                            setIsAddingNew(true);
                        }}
                        className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add E-Scooter
                    </Button>
                </div>
            </div>

            {/* Scooters Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scooters.map((scooter) => (
                        <Card key={scooter.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-green-100">
                                {scooter.image && (
                                    <img
                                        src={scooter.image}
                                        alt={scooter.model}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                {scooter.featured && (
                                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        FEATURED
                                    </div>
                                )}
                                <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${scooter.isActive ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                                    }`}>
                                    {scooter.isActive ? 'Active' : 'Inactive'}
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{scooter.model}</h3>
                                    <span className="text-2xl font-bold text-emerald-600">${scooter.price}/day</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-3">{scooter.brand}</p>

                                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <Gauge className="w-3 h-3" /> {scooter.maxSpeed}
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <Battery className="w-3 h-3" /> {scooter.maxRange}
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <Zap className="w-3 h-3" /> {scooter.motor}
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <MapPin className="w-3 h-3" /> {scooter.location}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEditingScooter(scooter)}
                                        className="flex-1"
                                    >
                                        <Edit className="w-4 h-4 mr-1" /> Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => scooter.id && handleDelete(scooter.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {scooters.length === 0 && !loading && (
                        <div className="col-span-full text-center py-12">
                            <Zap className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No E-Scooters Added</h3>
                            <p className="text-gray-500 mb-4">Add your first Yadea e-scooter to get started</p>
                            <Button
                                onClick={() => {
                                    setEditingScooter(defaultScooter);
                                    setIsAddingNew(true);
                                }}
                                className="bg-gradient-to-r from-emerald-500 to-green-500"
                            >
                                <Plus className="w-4 h-4 mr-2" /> Add First E-Scooter
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Edit/Add Modal */}
            {editingScooter && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Zap className="w-5 h-5 text-emerald-500" />
                                {isAddingNew ? 'Add New E-Scooter' : `Edit ${editingScooter.model}`}
                            </h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setEditingScooter(null);
                                    setIsAddingNew(false);
                                }}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Settings className="w-4 h-4" /> Basic Information
                                </h3>

                                <div>
                                    <Label>Model Name</Label>
                                    <Input
                                        value={editingScooter.model}
                                        onChange={(e) => setEditingScooter({ ...editingScooter, model: e.target.value })}
                                        placeholder="e.g., Yadea T9"
                                    />
                                </div>

                                <div>
                                    <Label>Brand</Label>
                                    <Input
                                        value={editingScooter.brand}
                                        onChange={(e) => setEditingScooter({ ...editingScooter, brand: e.target.value })}
                                        placeholder="e.g., Yadea Abans"
                                    />
                                </div>

                                <div>
                                    <Label>Image URL</Label>
                                    <Input
                                        value={editingScooter.image}
                                        onChange={(e) => setEditingScooter({ ...editingScooter, image: e.target.value })}
                                        placeholder="/yadea-t9.jpg or https://..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Rental Price (USD/day)</Label>
                                        <Input
                                            type="number"
                                            value={editingScooter.price}
                                            onChange={(e) => setEditingScooter({ ...editingScooter, price: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <Label>Original Price (LKR)</Label>
                                        <Input
                                            value={editingScooter.originalPrice}
                                            onChange={(e) => setEditingScooter({ ...editingScooter, originalPrice: e.target.value })}
                                            placeholder="LKR 599,950"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label>Location</Label>
                                    <Input
                                        value={editingScooter.location}
                                        onChange={(e) => setEditingScooter({ ...editingScooter, location: e.target.value })}
                                        placeholder="Jaffna"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={editingScooter.featured}
                                            onCheckedChange={(checked) => setEditingScooter({ ...editingScooter, featured: checked })}
                                        />
                                        <Label>Featured</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={editingScooter.isActive}
                                            onCheckedChange={(checked) => setEditingScooter({ ...editingScooter, isActive: checked })}
                                        />
                                        <Label>Active</Label>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Specs */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Zap className="w-4 h-4" /> Performance
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Motor</Label>
                                        <Input
                                            value={editingScooter.motor}
                                            onChange={(e) => setEditingScooter({ ...editingScooter, motor: e.target.value })}
                                            placeholder="2000W Hub Motor"
                                        />
                                    </div>
                                    <div>
                                        <Label>Motor Type</Label>
                                        <Input
                                            value={editingScooter.motorType}
                                            onChange={(e) => setEditingScooter({ ...editingScooter, motorType: e.target.value })}
                                            placeholder="Hub Motor"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Max Speed</Label>
                                        <Input
                                            value={editingScooter.maxSpeed}
                                            onChange={(e) => setEditingScooter({ ...editingScooter, maxSpeed: e.target.value })}
                                            placeholder="60 km/h"
                                        />
                                    </div>
                                    <div>
                                        <Label>Max Range</Label>
                                        <Input
                                            value={editingScooter.maxRange}
                                            onChange={(e) => setEditingScooter({ ...editingScooter, maxRange: e.target.value })}
                                            placeholder="100+ km"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Daily Range</Label>
                                        <Input
                                            value={editingScooter.range}
                                            onChange={(e) => setEditingScooter({ ...editingScooter, range: e.target.value })}
                                            placeholder="70+ km"
                                        />
                                    </div>
                                    <div>
                                        <Label>Seating</Label>
                                        <Input
                                            value={editingScooter.seating}
                                            onChange={(e) => setEditingScooter({ ...editingScooter, seating: e.target.value })}
                                            placeholder="2 Seats"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Battery */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Battery className="w-4 h-4" /> Battery & Charging
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Battery</Label>
                                        <Input
                                            value={editingScooter.battery}
                                            onChange={(e) => setEditingScooter({ ...editingScooter, battery: e.target.value })}
                                            placeholder="72V 38Ah"
                                        />
                                    </div>
                                    <div>
                                        <Label>Battery Type</Label>
                                        <Input
                                            value={editingScooter.batteryType}
                                            onChange={(e) => setEditingScooter({ ...editingScooter, batteryType: e.target.value })}
                                            placeholder="Graphene Battery"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Charger</Label>
                                        <Input
                                            value={editingScooter.charger || ''}
                                            onChange={(e) => setEditingScooter({ ...editingScooter, charger: e.target.value })}
                                            placeholder="72V 4A"
                                        />
                                    </div>
                                    <div>
                                        <Label>Charging Time</Label>
                                        <Input
                                            value={editingScooter.chargingTime || ''}
                                            onChange={(e) => setEditingScooter({ ...editingScooter, chargingTime: e.target.value })}
                                            placeholder="8 hours"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label>Charging Cycles</Label>
                                    <Input
                                        value={editingScooter.chargingCycles}
                                        onChange={(e) => setEditingScooter({ ...editingScooter, chargingCycles: e.target.value })}
                                        placeholder="800-1000"
                                    />
                                </div>
                            </div>

                            {/* Physical Specs */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Shield className="w-4 h-4" /> Physical Specs
                                </h3>

                                <div>
                                    <Label>Dimensions (L x W x H)</Label>
                                    <Input
                                        value={editingScooter.dimensions}
                                        onChange={(e) => setEditingScooter({ ...editingScooter, dimensions: e.target.value })}
                                        placeholder="1860 x 715 x 1070 mm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Tires</Label>
                                        <Input
                                            value={editingScooter.tires}
                                            onChange={(e) => setEditingScooter({ ...editingScooter, tires: e.target.value })}
                                            placeholder="F: 90/90-12 | R: 100/80-12"
                                        />
                                    </div>
                                    <div>
                                        <Label>Brakes</Label>
                                        <Input
                                            value={editingScooter.brakes}
                                            onChange={(e) => setEditingScooter({ ...editingScooter, brakes: e.target.value })}
                                            placeholder="Disc/Disc"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Shock Absorption</Label>
                                        <Input
                                            value={editingScooter.shockAbsorption}
                                            onChange={(e) => setEditingScooter({ ...editingScooter, shockAbsorption: e.target.value })}
                                            placeholder="Hydraulic"
                                        />
                                    </div>
                                    <div>
                                        <Label>Dashboard</Label>
                                        <Input
                                            value={editingScooter.dashboard}
                                            onChange={(e) => setEditingScooter({ ...editingScooter, dashboard: e.target.value })}
                                            placeholder="LED Digital Tube"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label>Headlight</Label>
                                    <Input
                                        value={editingScooter.headlight}
                                        onChange={(e) => setEditingScooter({ ...editingScooter, headlight: e.target.value })}
                                        placeholder="LED Adjustable"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2 space-y-4">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Leaf className="w-4 h-4" /> Description & Features
                                </h3>

                                <div>
                                    <Label>Description</Label>
                                    <Textarea
                                        value={editingScooter.description}
                                        onChange={(e) => setEditingScooter({ ...editingScooter, description: e.target.value })}
                                        placeholder="Enter a detailed description..."
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label>Special Features</Label>
                                    <div className="flex gap-2 mb-2">
                                        <Input
                                            value={newFeature}
                                            onChange={(e) => setNewFeature(e.target.value)}
                                            placeholder="Add a feature..."
                                            onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                                        />
                                        <Button type="button" onClick={addFeature} size="sm">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {editingScooter.specialFeatures.map((feature, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm"
                                            >
                                                {feature}
                                                <button
                                                    onClick={() => removeFeature(index)}
                                                    className="hover:text-red-500"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setEditingScooter(null);
                                    setIsAddingNew(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isAddingNew ? 'Add E-Scooter' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EScootersManager;
