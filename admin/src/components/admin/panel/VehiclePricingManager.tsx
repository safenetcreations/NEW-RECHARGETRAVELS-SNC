import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Car, Plus, Pencil, Trash2, Save, X, Users, DollarSign, Calendar, Percent, Tag, Clock, TrendingUp, RefreshCw } from 'lucide-react';

interface SeasonalPricing {
    id?: string;
    name: string;
    startDate: string;
    endDate: string;
    percentageChange: number; // positive for increase, negative for discount
    isActive: boolean;
    appliesTo: 'all' | string[]; // 'all' or array of category slugs
}

interface PromoCode {
    id?: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minDays: number;
    maxUses: number;
    usedCount: number;
    validFrom: string;
    validUntil: string;
    isActive: boolean;
    applicableCategories: string[];
}

interface Driver {
    id?: string;
    name: string;
    phone: string;
    email: string;
    licenseNumber: string;
    licenseExpiry: string;
    photo: string;
    status: 'available' | 'on_trip' | 'off_duty';
    rating: number;
    totalTrips: number;
    languages: string[];
    isActive: boolean;
}

const PricingAndDriversManager: React.FC = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<'pricing' | 'promos' | 'drivers'>('pricing');
    const [loading, setLoading] = useState(true);

    const [seasonalPricing, setSeasonalPricing] = useState<SeasonalPricing[]>([]);
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);

    const [editingPricing, setEditingPricing] = useState<SeasonalPricing | null>(null);
    const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { loadAllData(); }, []);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [pricingSnap, promosSnap, driversSnap] = await Promise.all([
                getDocs(collection(db, 'vehicleSeasonalPricing')),
                getDocs(collection(db, 'vehiclePromoCodes')),
                getDocs(query(collection(db, 'vehicleDrivers'), orderBy('name')))
            ]);
            setSeasonalPricing(pricingSnap.docs.map(d => ({ id: d.id, ...d.data() })) as SeasonalPricing[]);
            setPromoCodes(promosSnap.docs.map(d => ({ id: d.id, ...d.data() })) as PromoCode[]);
            setDrivers(driversSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Driver[]);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
        }
        setLoading(false);
    };

    // Seasonal Pricing CRUD
    const savePricing = async (pricing: SeasonalPricing) => {
        try {
            const { id, ...data } = pricing;
            if (id) {
                await updateDoc(doc(db, 'vehicleSeasonalPricing', id), data);
            } else {
                await addDoc(collection(db, 'vehicleSeasonalPricing'), data);
            }
            toast({ title: 'Success', description: 'Seasonal pricing saved' });
            await loadAllData();
            setEditingPricing(null);
            setShowForm(false);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
        }
    };

    // Promo Code CRUD
    const savePromo = async (promo: PromoCode) => {
        try {
            const { id, ...data } = promo;
            if (id) {
                await updateDoc(doc(db, 'vehiclePromoCodes', id), data);
            } else {
                await addDoc(collection(db, 'vehiclePromoCodes'), { ...data, usedCount: 0 });
            }
            toast({ title: 'Success', description: 'Promo code saved' });
            await loadAllData();
            setEditingPromo(null);
            setShowForm(false);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
        }
    };

    // Driver CRUD
    const saveDriver = async (driver: Driver) => {
        try {
            const { id, ...data } = driver;
            if (id) {
                await updateDoc(doc(db, 'vehicleDrivers', id), data);
            } else {
                await addDoc(collection(db, 'vehicleDrivers'), { ...data, totalTrips: 0, rating: 5.0 });
            }
            toast({ title: 'Success', description: 'Driver saved' });
            await loadAllData();
            setEditingDriver(null);
            setShowForm(false);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
        }
    };

    const deleteItem = async (collection_name: string, id: string) => {
        if (!confirm('Delete this item?')) return;
        try {
            await deleteDoc(doc(db, collection_name, id));
            toast({ title: 'Deleted' });
            await loadAllData();
        } catch (error) {
            toast({ title: 'Error', variant: 'destructive' });
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 animate-spin text-amber-500" /></div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-amber-500" />
                    Pricing, Promos & Drivers
                </h1>
                <p className="text-gray-500 mt-1">Manage seasonal pricing, promo codes, and driver assignments</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b pb-4">
                {[
                    { id: 'pricing', label: 'Seasonal Pricing', icon: TrendingUp },
                    { id: 'promos', label: 'Promo Codes', icon: Tag },
                    { id: 'drivers', label: 'Drivers', icon: Users },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id as any); setShowForm(false); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${activeTab === tab.id ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        <tab.icon className="w-4 h-4" />{tab.label}
                    </button>
                ))}
            </div>

            {/* Seasonal Pricing Tab */}
            {activeTab === 'pricing' && (
                <div className="space-y-6">
                    <div className="flex justify-between">
                        <h2 className="text-xl font-semibold">Seasonal Pricing Rules</h2>
                        <Button onClick={() => { setEditingPricing({ name: '', startDate: '', endDate: '', percentageChange: 0, isActive: true, appliesTo: 'all' }); setShowForm(true); }}>
                            <Plus className="w-4 h-4 mr-2" />Add Season
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {seasonalPricing.map((p) => (
                            <div key={p.id} className="bg-white rounded-xl p-4 border shadow-sm flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold">{p.name}</h3>
                                    <p className="text-sm text-gray-500">{p.startDate} to {p.endDate}</p>
                                    <span className={`text-sm font-bold ${p.percentageChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {p.percentageChange >= 0 ? '+' : ''}{p.percentageChange}%
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <span className={`px-2 py-1 rounded text-xs ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                        {p.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <Button variant="outline" size="sm" onClick={() => { setEditingPricing(p); setShowForm(true); }}><Pencil className="w-4 h-4" /></Button>
                                    <Button variant="destructive" size="sm" onClick={() => deleteItem('vehicleSeasonalPricing', p.id!)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        ))}
                        {seasonalPricing.length === 0 && <p className="text-center text-gray-500 py-8">No seasonal pricing rules. Add peak/off-peak seasons.</p>}
                    </div>

                    {showForm && editingPricing && (
                        <PricingForm pricing={editingPricing} onSave={savePricing} onClose={() => { setShowForm(false); setEditingPricing(null); }} />
                    )}
                </div>
            )}

            {/* Promo Codes Tab */}
            {activeTab === 'promos' && (
                <div className="space-y-6">
                    <div className="flex justify-between">
                        <h2 className="text-xl font-semibold">Promo Codes</h2>
                        <Button onClick={() => { setEditingPromo({ code: '', discountType: 'percentage', discountValue: 10, minDays: 1, maxUses: 100, usedCount: 0, validFrom: '', validUntil: '', isActive: true, applicableCategories: [] }); setShowForm(true); }}>
                            <Plus className="w-4 h-4 mr-2" />Add Promo
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {promoCodes.map((p) => (
                            <div key={p.id} className="bg-white rounded-xl p-4 border shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <code className="bg-amber-100 text-amber-800 px-2 py-1 rounded font-bold">{p.code}</code>
                                    <span className={`px-2 py-1 rounded text-xs ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                        {p.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-amber-600">
                                    {p.discountType === 'percentage' ? `${p.discountValue}% OFF` : `$${p.discountValue} OFF`}
                                </p>
                                <p className="text-xs text-gray-500">Min {p.minDays} days • Used {p.usedCount}/{p.maxUses}</p>
                                <p className="text-xs text-gray-500">{p.validFrom} to {p.validUntil}</p>
                                <div className="flex gap-2 mt-3">
                                    <Button variant="outline" size="sm" onClick={() => { setEditingPromo(p); setShowForm(true); }}>Edit</Button>
                                    <Button variant="destructive" size="sm" onClick={() => deleteItem('vehiclePromoCodes', p.id!)}>Delete</Button>
                                </div>
                            </div>
                        ))}
                        {promoCodes.length === 0 && <p className="text-center text-gray-500 py-8 col-span-full">No promo codes. Create discount codes for customers.</p>}
                    </div>

                    {showForm && editingPromo && (
                        <PromoForm promo={editingPromo} onSave={savePromo} onClose={() => { setShowForm(false); setEditingPromo(null); }} />
                    )}
                </div>
            )}

            {/* Drivers Tab */}
            {activeTab === 'drivers' && (
                <div className="space-y-6">
                    <div className="flex justify-between">
                        <h2 className="text-xl font-semibold">Drivers</h2>
                        <Button onClick={() => { setEditingDriver({ name: '', phone: '', email: '', licenseNumber: '', licenseExpiry: '', photo: '', status: 'available', rating: 5, totalTrips: 0, languages: ['English', 'Sinhala'], isActive: true }); setShowForm(true); }}>
                            <Plus className="w-4 h-4 mr-2" />Add Driver
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {drivers.map((d) => (
                            <div key={d.id} className="bg-white rounded-xl p-4 border shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        {d.photo ? <img src={d.photo} alt={d.name} className="w-full h-full object-cover" /> : <Users className="w-6 h-6 text-gray-400" />}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{d.name}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded ${d.status === 'available' ? 'bg-green-100 text-green-800' : d.status === 'on_trip' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                                            {d.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>📞 {d.phone}</p>
                                    <p>⭐ {d.rating} ({d.totalTrips} trips)</p>
                                    <p>🗣️ {d.languages.join(', ')}</p>
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <Button variant="outline" size="sm" onClick={() => { setEditingDriver(d); setShowForm(true); }}>Edit</Button>
                                    <Button variant="destructive" size="sm" onClick={() => deleteItem('vehicleDrivers', d.id!)}>Delete</Button>
                                </div>
                            </div>
                        ))}
                        {drivers.length === 0 && <p className="text-center text-gray-500 py-8 col-span-full">No drivers. Add drivers for with-driver bookings.</p>}
                    </div>

                    {showForm && editingDriver && (
                        <DriverForm driver={editingDriver} onSave={saveDriver} onClose={() => { setShowForm(false); setEditingDriver(null); }} />
                    )}
                </div>
            )}
        </div>
    );
};

// Form Components
const PricingForm: React.FC<{ pricing: SeasonalPricing; onSave: (p: SeasonalPricing) => void; onClose: () => void }> = ({ pricing, onSave, onClose }) => {
    const [data, setData] = useState(pricing);
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
                <h2 className="text-xl font-semibold mb-4">{pricing.id ? 'Edit' : 'Add'} Seasonal Pricing</h2>
                <div className="space-y-4">
                    <div><Label>Season Name</Label><Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="e.g., Peak Season, Christmas" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Start Date</Label><Input type="date" value={data.startDate} onChange={(e) => setData({ ...data, startDate: e.target.value })} /></div>
                        <div><Label>End Date</Label><Input type="date" value={data.endDate} onChange={(e) => setData({ ...data, endDate: e.target.value })} /></div>
                    </div>
                    <div><Label>Price Change (%)</Label><Input type="number" value={data.percentageChange} onChange={(e) => setData({ ...data, percentageChange: parseFloat(e.target.value) })} placeholder="+20 for increase, -15 for discount" /></div>
                    <div className="flex items-center gap-2"><Switch checked={data.isActive} onCheckedChange={(c) => setData({ ...data, isActive: c })} /><Label>Active</Label></div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => onSave(data)}><Save className="w-4 h-4 mr-2" />Save</Button>
                </div>
            </div>
        </div>
    );
};

const PromoForm: React.FC<{ promo: PromoCode; onSave: (p: PromoCode) => void; onClose: () => void }> = ({ promo, onSave, onClose }) => {
    const [data, setData] = useState(promo);
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
                <h2 className="text-xl font-semibold mb-4">{promo.id ? 'Edit' : 'Add'} Promo Code</h2>
                <div className="space-y-4">
                    <div><Label>Code</Label><Input value={data.code} onChange={(e) => setData({ ...data, code: e.target.value.toUpperCase() })} placeholder="e.g., SUMMER20" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Discount Type</Label>
                            <select className="w-full border rounded-lg p-2" value={data.discountType} onChange={(e) => setData({ ...data, discountType: e.target.value as any })}>
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                            </select>
                        </div>
                        <div><Label>Value</Label><Input type="number" value={data.discountValue} onChange={(e) => setData({ ...data, discountValue: parseFloat(e.target.value) })} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Min Days</Label><Input type="number" value={data.minDays} onChange={(e) => setData({ ...data, minDays: parseInt(e.target.value) })} /></div>
                        <div><Label>Max Uses</Label><Input type="number" value={data.maxUses} onChange={(e) => setData({ ...data, maxUses: parseInt(e.target.value) })} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Valid From</Label><Input type="date" value={data.validFrom} onChange={(e) => setData({ ...data, validFrom: e.target.value })} /></div>
                        <div><Label>Valid Until</Label><Input type="date" value={data.validUntil} onChange={(e) => setData({ ...data, validUntil: e.target.value })} /></div>
                    </div>
                    <div className="flex items-center gap-2"><Switch checked={data.isActive} onCheckedChange={(c) => setData({ ...data, isActive: c })} /><Label>Active</Label></div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => onSave(data)}><Save className="w-4 h-4 mr-2" />Save</Button>
                </div>
            </div>
        </div>
    );
};

const DriverForm: React.FC<{ driver: Driver; onSave: (d: Driver) => void; onClose: () => void }> = ({ driver, onSave, onClose }) => {
    const [data, setData] = useState(driver);
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">{driver.id ? 'Edit' : 'Add'} Driver</h2>
                <div className="space-y-4">
                    <div><Label>Full Name</Label><Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>Phone</Label><Input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} /></div>
                        <div><Label>Email</Label><Input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label>License Number</Label><Input value={data.licenseNumber} onChange={(e) => setData({ ...data, licenseNumber: e.target.value })} /></div>
                        <div><Label>License Expiry</Label><Input type="date" value={data.licenseExpiry} onChange={(e) => setData({ ...data, licenseExpiry: e.target.value })} /></div>
                    </div>
                    <div><Label>Photo URL</Label><Input value={data.photo} onChange={(e) => setData({ ...data, photo: e.target.value })} placeholder="https://..." /></div>
                    <div><Label>Status</Label>
                        <select className="w-full border rounded-lg p-2" value={data.status} onChange={(e) => setData({ ...data, status: e.target.value as any })}>
                            <option value="available">Available</option>
                            <option value="on_trip">On Trip</option>
                            <option value="off_duty">Off Duty</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2"><Switch checked={data.isActive} onCheckedChange={(c) => setData({ ...data, isActive: c })} /><Label>Active</Label></div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => onSave(data)}><Save className="w-4 h-4 mr-2" />Save</Button>
                </div>
            </div>
        </div>
    );
};

export default PricingAndDriversManager;
