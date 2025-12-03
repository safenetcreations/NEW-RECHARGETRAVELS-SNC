import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, Star, Eye, EyeOff } from 'lucide-react';
import {
    groupTransportHeroService,
    groupTransportVehiclesService,
    groupTransportFeaturesService,
    groupTransportBenefitsService,
    groupTransportSettingsService
} from '../../../src/services/cmsService';
import type {
    GroupTransportHeroSlide,
    GroupTransportVehicle,
    GroupTransportServiceFeature,
    GroupTransportBenefit,
    GroupTransportSettings
} from '../../../src/types/cms';

type Tab = 'hero' | 'vehicles' | 'features' | 'benefits' | 'settings';

const GroupTransportManagement = () => {
    const [activeTab, setActiveTab] = useState<Tab>('hero');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Hero Slides State
    const [heroSlides, setHeroSlides] = useState<GroupTransportHeroSlide[]>([]);
    const [editingHero, setEditingHero] = useState<string | null>(null);
    const [heroForm, setHeroForm] = useState({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        order: 0,
        isActive: true,
    });

    // Vehicles State
    const [vehicles, setVehicles] = useState<GroupTransportVehicle[]>([]);
    const [editingVehicle, setEditingVehicle] = useState<string | null>(null);
    const [vehicleForm, setVehicleForm] = useState({
        name: '',
        capacity: '',
        features: [''],
        price: '',
        image: '',
        popular: false,
        order: 0,
        isActive: true,
    });

    // Features State
    const [features, setFeatures] = useState<GroupTransportServiceFeature[]>([]);
    const [editingFeature, setEditingFeature] = useState<string | null>(null);
    const [featureForm, setFeatureForm] = useState({
        title: '',
        description: '',
        icon: 'Bus',
        highlight: '',
        order: 0,
        isActive: true,
    });

    // Benefits State
    const [benefits, setBenefits] = useState<GroupTransportBenefit[]>([]);
    const [editingBenefit, setEditingBenefit] = useState<string | null>(null);
    const [benefitForm, setBenefitForm] = useState({
        title: '',
        description: '',
        icon: 'Heart',
        order: 0,
        isActive: true,
    });

    // Settings State
    const [settings, setSettings] = useState<GroupTransportSettings | null>(null);
    const [settingsForm, setSettingsForm] = useState({
        trustIndicators: {
            rating: '4.8/5',
            reviews: '1,456',
            support: '24/7 Support',
        },
        popularRoutes: ['Corporate Events', 'School Tours', 'Wedding Transport', 'Airport Groups'],
        isActive: true,
    });

    // Icon options for dropdowns
    const iconOptions = [
        'Users', 'Bus', 'Calendar', 'Shield', 'Headphones', 'MapPin',
        'Clock', 'Luggage', 'Wifi', 'Music', 'Wind', 'Baby', 'Heart', 'Award'
    ];

    // Load data
    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            switch (activeTab) {
                case 'hero': {
                    const heroData = await groupTransportHeroService.getAll();
                    setHeroSlides(heroData);
                    break;
                }
                case 'vehicles': {
                    const vehiclesData = await groupTransportVehiclesService.getAll();
                    setVehicles(vehiclesData);
                    break;
                }
                case 'features': {
                    const featuresData = await groupTransportFeaturesService.getAll();
                    setFeatures(featuresData);
                    break;
                }
                case 'benefits': {
                    const benefitsData = await groupTransportBenefitsService.getAll();
                    setBenefits(benefitsData);
                    break;
                }
                case 'settings': {
                    const settingsData = await groupTransportSettingsService.getActive();
                    if (settingsData) {
                        setSettings(settingsData);
                        setSettingsForm({
                            trustIndicators: settingsData.trustIndicators,
                            popularRoutes: settingsData.popularRoutes,
                            isActive: settingsData.isActive,
                        });
                    }
                    break;
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
            setMessage({ type: 'error', text: 'Failed to load data' });
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    // Hero Slide Handlers
    const handleSaveHero = async () => {
        setLoading(true);
        try {
            if (editingHero) {
                await groupTransportHeroService.update(editingHero, heroForm);
                showMessage('success', 'Hero slide updated successfully!');
            } else {
                await groupTransportHeroService.create(heroForm);
                showMessage('success', 'Hero slide created successfully!');
            }
            resetHeroForm();
            loadData();
        } catch (error) {
            showMessage('error', 'Failed to save hero slide');
        } finally {
            setLoading(false);
        }
    };

    const handleEditHero = (slide: GroupTransportHeroSlide) => {
        setEditingHero(slide.id);
        setHeroForm({
            title: slide.title,
            subtitle: slide.subtitle,
            description: slide.description,
            image: slide.image,
            order: slide.order,
            isActive: slide.isActive,
        });
    };

    const handleDeleteHero = async (id: string) => {
        if (!confirm('Are you sure you want to delete this hero slide?')) return;
        setLoading(true);
        try {
            await groupTransportHeroService.delete(id);
            showMessage('success', 'Hero slide deleted successfully!');
            loadData();
        } catch (error) {
            showMessage('error', 'Failed to delete hero slide');
        } finally {
            setLoading(false);
        }
    };

    const resetHeroForm = () => {
        setEditingHero(null);
        setHeroForm({
            title: '',
            subtitle: '',
            description: '',
            image: '',
            order: 0,
            isActive: true,
        });
    };

    // Vehicle Handlers
    const handleSaveVehicle = async () => {
        setLoading(true);
        try {
            if (editingVehicle) {
                await groupTransportVehiclesService.update(editingVehicle, vehicleForm);
                showMessage('success', 'Vehicle updated successfully!');
            } else {
                await groupTransportVehiclesService.create(vehicleForm);
                showMessage('success', 'Vehicle created successfully!');
            }
            resetVehicleForm();
            loadData();
        } catch (error) {
            showMessage('error', 'Failed to save vehicle');
        } finally {
            setLoading(false);
        }
    };

    const handleEditVehicle = (vehicle: GroupTransportVehicle) => {
        setEditingVehicle(vehicle.id);
        setVehicleForm({
            name: vehicle.name,
            capacity: vehicle.capacity,
            features: vehicle.features,
            price: vehicle.price,
            image: vehicle.image,
            popular: vehicle.popular,
            order: vehicle.order,
            isActive: vehicle.isActive,
        });
    };

    const handleDeleteVehicle = async (id: string) => {
        if (!confirm('Are you sure you want to delete this vehicle?')) return;
        setLoading(true);
        try {
            await groupTransportVehiclesService.delete(id);
            showMessage('success', 'Vehicle deleted successfully!');
            loadData();
        } catch (error) {
            showMessage('error', 'Failed to delete vehicle');
        } finally {
            setLoading(false);
        }
    };

    const resetVehicleForm = () => {
        setEditingVehicle(null);
        setVehicleForm({
            name: '',
            capacity: '',
            features: [''],
            price: '',
            image: '',
            popular: false,
            order: 0,
            isActive: true,
        });
    };

    // Feature Handlers
    const handleSaveFeature = async () => {
        setLoading(true);
        try {
            if (editingFeature) {
                await groupTransportFeaturesService.update(editingFeature, featureForm);
                showMessage('success', 'Feature updated successfully!');
            } else {
                await groupTransportFeaturesService.create(featureForm);
                showMessage('success', 'Feature created successfully!');
            }
            resetFeatureForm();
            loadData();
        } catch (error) {
            showMessage('error', 'Failed to save feature');
        } finally {
            setLoading(false);
        }
    };

    const handleEditFeature = (feature: GroupTransportServiceFeature) => {
        setEditingFeature(feature.id);
        setFeatureForm({
            title: feature.title,
            description: feature.description,
            icon: feature.icon,
            highlight: feature.highlight,
            order: feature.order,
            isActive: feature.isActive,
        });
    };

    const handleDeleteFeature = async (id: string) => {
        if (!confirm('Are you sure you want to delete this feature?')) return;
        setLoading(true);
        try {
            await groupTransportFeaturesService.delete(id);
            showMessage('success', 'Feature deleted successfully!');
            loadData();
        } catch (error) {
            showMessage('error', 'Failed to delete feature');
        } finally {
            setLoading(false);
        }
    };

    const resetFeatureForm = () => {
        setEditingFeature(null);
        setFeatureForm({
            title: '',
            description: '',
            icon: 'Bus',
            highlight: '',
            order: 0,
            isActive: true,
        });
    };

    // Benefit Handlers  
    const handleSaveBenefit = async () => {
        setLoading(true);
        try {
            if (editingBenefit) {
                await groupTransportBenefitsService.update(editingBenefit, benefitForm);
                showMessage('success', 'Benefit updated successfully!');
            } else {
                await groupTransportBenefitsService.create(benefitForm);
                showMessage('success', 'Benefit created successfully!');
            }
            resetBenefitForm();
            loadData();
        } catch (error) {
            showMessage('error', 'Failed to save benefit');
        } finally {
            setLoading(false);
        }
    };

    const handleEditBenefit = (benefit: GroupTransportBenefit) => {
        setEditingBenefit(benefit.id);
        setBenefitForm({
            title: benefit.title,
            description: benefit.description,
            icon: benefit.icon,
            order: benefit.order,
            isActive: benefit.isActive,
        });
    };

    const handleDeleteBenefit = async (id: string) => {
        if (!confirm('Are you sure you want to delete this benefit?')) return;
        setLoading(true);
        try {
            await groupTransportBenefitsService.delete(id);
            showMessage('success', 'Benefit deleted successfully!');
            loadData();
        } catch (error) {
            showMessage('error', 'Failed to delete benefit');
        } finally {
            setLoading(false);
        }
    };

    const resetBenefitForm = () => {
        setEditingBenefit(null);
        setBenefitForm({
            title: '',
            description: '',
            icon: 'Heart',
            order: 0,
            isActive: true,
        });
    };

    // Settings Handlers
    const handleSaveSettings = async () => {
        setLoading(true);
        try {
            await groupTransportSettingsService.update('group-transport-settings', settingsForm);
            showMessage('success', 'Settings updated successfully!');
            loadData();
        } catch (error) {
            showMessage('error', 'Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Group Transport Management</h1>
                    <p className="text-gray-600">Manage all content for the Group Transport page</p>
                </div>

                {/* Message Banner */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                        {message.text}
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-4 px-6" aria-label="Tabs">
                            {[
                                { id: 'hero', label: 'Hero Slides' },
                                { id: 'vehicles', label: 'Vehicles' },
                                { id: 'features', label: 'Features' },
                                { id: 'benefits', label: 'Benefits' },
                                { id: 'settings', label: 'Settings' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as Tab)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                            ? 'border-green-500 text-green-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                                <p className="mt-4 text-gray-600">Loading...</p>
                            </div>
                        ) : (
                            <>
                                {/* Hero Slides Tab */}
                                {activeTab === 'hero' && (
                                    <div className="space-y-6">
                                        {/* Hero Form */}
                                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                {editingHero ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                                {editingHero ? 'Edit Hero Slide' : 'Add New Hero Slide'}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                                    <input
                                                        type="text"
                                                        value={heroForm.title}
                                                        onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        placeholder="Travel Together, Save Together"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                                    <input
                                                        type="text"
                                                        value={heroForm.subtitle}
                                                        onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        placeholder="Premium Group Transportation Solutions"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                    <textarea
                                                        value={heroForm.description}
                                                        onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                                                        rows={3}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        placeholder="Comfortable coaches and vans for families..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                                    <input
                                                        type="text"
                                                        value={heroForm.image}
                                                        onChange={(e) => setHeroForm({ ...heroForm, image: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        placeholder="https://images.unsplash.com/..."
                                                    />
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                                        <input
                                                            type="number"
                                                            value={heroForm.order}
                                                            onChange={(e) => setHeroForm({ ...heroForm, order: parseInt(e.target.value) })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                    <div className="flex items-end">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={heroForm.isActive}
                                                                onChange={(e) => setHeroForm({ ...heroForm, isActive: e.target.checked })}
                                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                            />
                                                            <span className="text-sm font-medium text-gray-700">Active</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={handleSaveHero}
                                                    disabled={loading}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    {editingHero ? 'Update' : 'Create'}
                                                </button>
                                                {editingHero && (
                                                    <button
                                                        onClick={resetHeroForm}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Hero List */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold">Existing Hero Slides ({heroSlides.length})</h3>
                                            {heroSlides.length === 0 ? (
                                                <p className="text-gray-500 text-center py-8">No hero slides yet. Create one above!</p>
                                            ) : (
                                                <div className="grid gap-4">
                                                    {heroSlides.map((slide) => (
                                                        <div key={slide.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition">
                                                            <div className="flex">
                                                                <div className="w-48 h-32 bg-gray-200 flex-shrink-0">
                                                                    <img
                                                                        src={slide.image}
                                                                        alt={slide.title}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="flex-1 p-4">
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <h4 className="font-semibold text-lg">{slide.title}</h4>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={`px-2 py-1 text-xs rounded-full ${slide.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                                                {slide.isActive ? <Eye className="inline w-3 h-3 mr-1" /> : <EyeOff className="inline w-3 h-3 mr-1" />}
                                                                                {slide.isActive ? 'Active' : 'Inactive'}
                                                                            </span>
                                                                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                                                Order: {slide.order}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-sm text-gray-600 mb-1">{slide.subtitle}</p>
                                                                    <p className="text-sm text-gray-500">{slide.description}</p>
                                                                    <div className="flex gap-2 mt-3">
                                                                        <button
                                                                            onClick={() => handleEditHero(slide)}
                                                                            className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                                                        >
                                                                            <Edit className="w-3 h-3" />
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteHero(slide.id)}
                                                                            className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                                                                        >
                                                                            <Trash2 className="w-3 h-3" />
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Vehicles Tab */}
                                {activeTab === 'vehicles' && (
                                    <div className="space-y-6">
                                        {/* Vehicle Form */}
                                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                {editingVehicle ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name</label>
                                                    <input
                                                        type="text"
                                                        value={vehicleForm.name}
                                                        onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        placeholder="Premium Van"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                                    <input
                                                        type="text"
                                                        value={vehicleForm.capacity}
                                                        onChange={(e) => setVehicleForm({ ...vehicleForm, capacity: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        placeholder="8-10 Passengers"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                                    <input
                                                        type="text"
                                                        value={vehicleForm.price}
                                                        onChange={(e) => setVehicleForm({ ...vehicleForm, price: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        placeholder="From $80/day"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                                    <input
                                                        type="text"
                                                        value={vehicleForm.image}
                                                        onChange={(e) => setVehicleForm({ ...vehicleForm, image: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        placeholder="https://images.unsplash.com/..."
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
                                                    <input
                                                        type="text"
                                                        value={vehicleForm.features.join(', ')}
                                                        onChange={(e) => setVehicleForm({ ...vehicleForm, features: e.target.value.split(',').map(f => f.trim()) })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        placeholder="Air Conditioning, Comfortable Seats, Luggage Space, USB Charging"
                                                    />
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                                        <input
                                                            type="number"
                                                            value={vehicleForm.order}
                                                            onChange={(e) => setVehicleForm({ ...vehicleForm, order: parseInt(e.target.value) })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                    <div className="flex items-end">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={vehicleForm.popular}
                                                                onChange={(e) => setVehicleForm({ ...vehicleForm, popular: e.target.checked })}
                                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                            />
                                                            <span className="text-sm font-medium text-gray-700">Popular</span>
                                                        </label>
                                                    </div>
                                                    <div className="flex items-end">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={vehicleForm.isActive}
                                                                onChange={(e) => setVehicleForm({ ...vehicleForm, isActive: e.target.checked })}
                                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                            />
                                                            <span className="text-sm font-medium text-gray-700">Active</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={handleSaveVehicle}
                                                    disabled={loading}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    {editingVehicle ? 'Update' : 'Create'}
                                                </button>
                                                {editingVehicle && (
                                                    <button
                                                        onClick={resetVehicleForm}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Vehicle List */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold">Existing Vehicles ({vehicles.length})</h3>
                                            {vehicles.length === 0 ? (
                                                <p className="text-gray-500 text-center py-8">No vehicles yet. Create one above!</p>
                                            ) : (
                                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {vehicles.map((vehicle) => (
                                                        <div key={vehicle.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition">
                                                            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                                                                <img
                                                                    src={vehicle.image}
                                                                    alt={vehicle.name}
                                                                    className="w-full h-48 object-cover"
                                                                />
                                                            </div>
                                                            <div className="p-4">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <h4 className="font-semibold text-lg">{vehicle.name}</h4>
                                                                    {vehicle.popular && (
                                                                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full flex items-center gap-1">
                                                                            <Star className="w-3 h-3" />
                                                                            Popular
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-600 mb-1">{vehicle.capacity}</p>
                                                                <p className="text-lg font-bold text-green-600 mb-2">{vehicle.price}</p>
                                                                <div className="space-y-1 mb-3">
                                                                    {vehicle.features.slice(0, 3).map((feature, idx) => (
                                                                        <p key={idx} className="text-xs text-gray-500">• {feature}</p>
                                                                    ))}
                                                                </div>
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <span className={`px-2 py-1 text-xs rounded-full ${vehicle.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                                        {vehicle.isActive ? 'Active' : 'Inactive'}
                                                                    </span>
                                                                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                                        Order: {vehicle.order}
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => handleEditVehicle(vehicle)}
                                                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                                                    >
                                                                        <Edit className="w-3 h-3" />
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteVehicle(vehicle.id)}
                                                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                                                                    >
                                                                        <Trash2 className="w-3 h-3" />
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Features Tab */}
                                {activeTab === 'features' && (
                                    <div className="space-y-6">
                                        {/* Feature Form */}
                                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                {editingFeature ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                                {editingFeature ? 'Edit Feature' : 'Add New Feature'}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                                    <input
                                                        type="text"
                                                        value={featureForm.title}
                                                        onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        placeholder="Professional Drivers"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                                                    <select
                                                        value={featureForm.icon}
                                                        onChange={(e) => setFeatureForm({ ...featureForm, icon: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    >
                                                        {iconOptions.map(icon => (
                                                            <option key={icon} value={icon}>{icon}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                    <textarea
                                                        value={featureForm.description}
                                                        onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                                                        rows={3}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        placeholder="Experienced, licensed drivers with excellent safety records"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Highlight</label>
                                                    <input
                                                        type="text"
                                                        value={featureForm.highlight}
                                                        onChange={(e) => setFeatureForm({ ...featureForm, highlight: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        placeholder="English speaking"
                                                    />
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                                        <input
                                                            type="number"
                                                            value={featureForm.order}
                                                            onChange={(e) => setFeatureForm({ ...featureForm, order: parseInt(e.target.value) })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                    <div className="flex items-end">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={featureForm.isActive}
                                                                onChange={(e) => setFeatureForm({ ...featureForm, isActive: e.target.checked })}
                                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                            />
                                                            <span className="text-sm font-medium text-gray-700">Active</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={handleSaveFeature}
                                                    disabled={loading}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    {editingFeature ? 'Update' : 'Create'}
                                                </button>
                                                {editingFeature && (
                                                    <button
                                                        onClick={resetFeatureForm}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Features List */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold">Existing Features ({features.length})</h3>
                                            {features.length === 0 ? (
                                                <p className="text-gray-500 text-center py-8">No features yet. Create one above!</p>
                                            ) : (
                                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {features.map((feature) => (
                                                        <div key={feature.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                                                    <span className="text-green-600 font-semibold">{feature.icon.charAt(0)}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`px-2 py-1 text-xs rounded-full ${feature.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                                        {feature.isActive ? 'Active' : 'Inactive'}
                                                                    </span>
                                                                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                                        {feature.order}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <h4 className="font-semibold text-lg mb-1">{feature.title}</h4>
                                                            <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                                                            <p className="text-xs text-green-600 font-medium mb-3">✓ {feature.highlight}</p>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleEditFeature(feature)}
                                                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                                                >
                                                                    <Edit className="w-3 h-3" />
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteFeature(feature.id)}
                                                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Benefits Tab */}
                                {activeTab === 'benefits' && (
                                    <div className="space-y-6">
                                        {/* Benefit Form */}
                                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                {editingBenefit ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                                {editingBenefit ? 'Edit Benefit' : 'Add New Benefit'}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                                    <input
                                                        type="text"
                                                        value={benefitForm.title}
                                                        onChange={(e) => setBenefitForm({ ...benefitForm, title: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        placeholder="Cost Effective"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                                                    <select
                                                        value={benefitForm.icon}
                                                        onChange={(e) => setBenefitForm({ ...benefitForm, icon: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    >
                                                        {['Heart', 'Wind', 'Users', 'Shield'].map(icon => (
                                                            <option key={icon} value={icon}>{icon}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                    <textarea
                                                        value={benefitForm.description}
                                                        onChange={(e) => setBenefitForm({ ...benefitForm, description: e.target.value })}
                                                        rows={3}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        placeholder="Save up to 60% compared to multiple cars"
                                                    />
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                                        <input
                                                            type="number"
                                                            value={benefitForm.order}
                                                            onChange={(e) => setBenefitForm({ ...benefitForm, order: parseInt(e.target.value) })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                    <div className="flex items-end">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={benefitForm.isActive}
                                                                onChange={(e) => setBenefitForm({ ...benefitForm, isActive: e.target.checked })}
                                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                            />
                                                            <span className="text-sm font-medium text-gray-700">Active</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={handleSaveBenefit}
                                                    disabled={loading}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    {editingBenefit ? 'Update' : 'Create'}
                                                </button>
                                                {editingBenefit && (
                                                    <button
                                                        onClick={resetBenefitForm}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Benefits List */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold">Existing Benefits ({benefits.length})</h3>
                                            {benefits.length === 0 ? (
                                                <p className="text-gray-500 text-center py-8">No benefits yet. Create one above!</p>
                                            ) : (
                                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    {benefits.map((benefit) => (
                                                        <div key={benefit.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition text-center">
                                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                                <span className="text-green-600 font-semibold text-xl">{benefit.icon.charAt(0)}</span>
                                                            </div>
                                                            <h4 className="font-semibold text-lg mb-1">{benefit.title}</h4>
                                                            <p className="text-sm text-gray-600 mb-3">{benefit.description}</p>
                                                            <div className="flex items-center justify-center gap-2 mb-3">
                                                                <span className={`px-2 py-1 text-xs rounded-full ${benefit.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                                    {benefit.isActive ? 'Active' : 'Inactive'}
                                                                </span>
                                                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                                    {benefit.order}
                                                                </span>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleEditBenefit(benefit)}
                                                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                                                >
                                                                    <Edit className="w-3 h-3" />
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteBenefit(benefit.id)}
                                                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Settings Tab */}
                                {activeTab === 'settings' && (
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                                            <div className="space-y-6">
                                                {/* Trust Indicators */}
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-3">Trust Indicators</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                                            <input
                                                                type="text"
                                                                value={settingsForm.trustIndicators.rating}
                                                                onChange={(e) => setSettingsForm({
                                                                    ...settingsForm,
                                                                    trustIndicators: { ...settingsForm.trustIndicators, rating: e.target.value }
                                                                })}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                                placeholder="4.8/5"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Reviews Count</label>
                                                            <input
                                                                type="text"
                                                                value={settingsForm.trustIndicators.reviews}
                                                                onChange={(e) => setSettingsForm({
                                                                    ...settingsForm,
                                                                    trustIndicators: { ...settingsForm.trustIndicators, reviews: e.target.value }
                                                                })}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                                placeholder="1,456"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Support Text</label>
                                                            <input
                                                                type="text"
                                                                value={settingsForm.trustIndicators.support}
                                                                onChange={(e) => setSettingsForm({
                                                                    ...settingsForm,
                                                                    trustIndicators: { ...settingsForm.trustIndicators, support: e.target.value }
                                                                })}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                                placeholder="24/7 Support"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Popular Routes */}
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-3">Popular Routes</h4>
                                                    <input
                                                        type="text"
                                                        value={settingsForm.popularRoutes.join(', ')}
                                                        onChange={(e) => setSettingsForm({
                                                            ...settingsForm,
                                                            popularRoutes: e.target.value.split(',').map(r => r.trim())
                                                        })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                        placeholder="Corporate Events, School Tours, Wedding Transport, Airport Groups"
                                                    />
                                                    <p className="text-sm text-gray-500 mt-1">Comma-separated list</p>
                                                </div>

                                                {/* Active Status */}
                                                <div>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={settingsForm.isActive}
                                                            onChange={(e) => setSettingsForm({ ...settingsForm, isActive: e.target.checked })}
                                                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">Active</span>
                                                    </label>
                                                </div>

                                                {/* Save Button */}
                                                <button
                                                    onClick={handleSaveSettings}
                                                    disabled={loading}
                                                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    Save Settings
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupTransportManagement;
