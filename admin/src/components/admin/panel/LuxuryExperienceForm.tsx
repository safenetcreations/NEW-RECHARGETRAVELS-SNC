import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, X } from 'lucide-react';
import type { LuxuryExperience, LuxuryExperienceFormData, ExperienceCategory } from '@/types/cms';

interface LuxuryExperienceFormProps {
    experience?: LuxuryExperience;
    onSubmit: (data: LuxuryExperienceFormData) => Promise<void>;
    onCancel: () => void;
}

const categoryOptions: { value: ExperienceCategory; label: string }[] = [
    { value: 'luxury-safari', label: 'Luxury Safari' },
    { value: 'photography-tours', label: 'Photography Tours' },
    { value: 'cultural-immersion', label: 'Cultural Immersion' },
    { value: 'wellness-retreats', label: 'Wellness Retreats' },
    { value: 'adventure-expeditions', label: 'Adventure Expeditions' },
    { value: 'marine-adventures', label: 'Marine Adventures' },
    { value: 'culinary-journeys', label: 'Culinary Journeys' },
    { value: 'romantic-escapes', label: 'Romantic Escapes' },
    { value: 'family-adventures', label: 'Family Adventures' },
    { value: 'exclusive-access', label: 'Exclusive Access' },
];

const LuxuryExperienceForm: React.FC<LuxuryExperienceFormProps> = ({
    experience,
    onSubmit,
    onCancel,
}) => {
    const [formData, setFormData] = useState<LuxuryExperienceFormData>({
        title: experience?.title || '',
        subtitle: experience?.subtitle || '',
        category: experience?.category || 'luxury-safari',
        heroImage: experience?.heroImage || '',
        heroVideo: experience?.heroVideo || '',
        gallery: experience?.gallery || [],
        shortDescription: experience?.shortDescription || '',
        fullDescription: experience?.fullDescription || '',
        highlights: experience?.highlights || [],
        inclusions: experience?.inclusions || [],
        exclusions: experience?.exclusions || [],
        itinerary: experience?.itinerary || [],
        duration: experience?.duration || '',
        groupSize: experience?.groupSize || '',
        price: experience?.price || {
            amount: 0,
            currency: 'USD',
            per: 'person',
            seasonal: [],
        },
        availability: experience?.availability || {
            type: 'daily',
            minimumNotice: 24,
            blackoutDates: [],
            seasonalAvailability: [],
        },
        locations: experience?.locations || [],
        startingPoint: experience?.startingPoint || '',
        difficulty: experience?.difficulty || 'easy',
        ageRestrictions: experience?.ageRestrictions || '',
        requirements: experience?.requirements || [],
        cancellationPolicy: experience?.cancellationPolicy || '',
        testimonials: experience?.testimonials || [],
        seo: experience?.seo || {
            metaTitle: '',
            metaDescription: '',
            keywords: [],
        },
        status: experience?.status || 'draft',
        featured: experience?.featured || false,
        popular: experience?.popular || false,
        new: experience?.new || false,
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
        } finally {
            setLoading(false);
        }
    };

    const addHighlight = () => {
        setFormData(prev => ({
            ...prev,
            highlights: [...prev.highlights, ''],
        }));
    };

    const updateHighlight = (index: number, value: string) => {
        const newHighlights = [...formData.highlights];
        newHighlights[index] = value;
        setFormData(prev => ({ ...prev, highlights: newHighlights }));
    };

    const removeHighlight = (index: number) => {
        setFormData(prev => ({
            ...prev,
            highlights: prev.highlights.filter((_, i) => i !== index),
        }));
    };

    const addExclusion = () => {
        setFormData(prev => ({
            ...prev,
            exclusions: [...prev.exclusions, ''],
        }));
    };

    const updateExclusion = (index: number, value: string) => {
        const newExclusions = [...formData.exclusions];
        newExclusions[index] = value;
        setFormData(prev => ({ ...prev, exclusions: newExclusions }));
    };

    const removeExclusion = (index: number) => {
        setFormData(prev => ({
            ...prev,
            exclusions: prev.exclusions.filter((_, i) => i !== index),
        }));
    };

    const addLocation = () => {
        setFormData(prev => ({
            ...prev,
            locations: [
                ...prev.locations,
                { name: '', coordinates: { lat: 0, lng: 0 }, description: '' },
            ],
        }));
    };

    const updateLocation = (index: number, field: string, value: any) => {
        const newLocations = [...formData.locations];
        if (field === 'lat' || field === 'lng') {
            newLocations[index].coordinates = {
                ...newLocations[index].coordinates,
                [field]: parseFloat(value) || 0,
            };
        } else {
            newLocations[index] = { ...newLocations[index], [field]: value };
        }
        setFormData(prev => ({ ...prev, locations: newLocations }));
    };

    const removeLocation = (index: number) => {
        setFormData(prev => ({
            ...prev,
            locations: prev.locations.filter((_, i) => i !== index),
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                    {experience ? 'Edit Experience' : 'Create New Experience'}
                </h2>
                <Button type="button" variant="ghost" onClick={onCancel}>
                    <X className="w-5 h-5" />
                </Button>
            </div>

            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing</TabsTrigger>
                    <TabsTrigger value="logistics">Logistics</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>

                {/* BASIC INFO TAB */}
                <TabsContent value="basic" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Title */}
                            <div>
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    required
                                    placeholder="e.g., Private Yala Safari Experience"
                                />
                            </div>

                            {/* Subtitle */}
                            <div>
                                <Label htmlFor="subtitle">Subtitle *</Label>
                                <Input
                                    id="subtitle"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                                    required
                                    placeholder="e.g., Exclusive Wildlife Encounters in Sri Lanka's Premier National Park"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <Label htmlFor="category">Category *</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value: ExperienceCategory) =>
                                        setFormData(prev => ({ ...prev, category: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoryOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Hero Image */}
                            <div>
                                <Label htmlFor="heroImage">Hero Image URL *</Label>
                                <Input
                                    id="heroImage"
                                    type="url"
                                    value={formData.heroImage}
                                    onChange={(e) => setFormData(prev => ({ ...prev, heroImage: e.target.value }))}
                                    required
                                    placeholder="https://images.unsplash.com/..."
                                />
                                {formData.heroImage && (
                                    <img
                                        src={formData.heroImage}
                                        alt="Preview"
                                        className="mt-2 w-full h-40 object-cover rounded"
                                    />
                                )}
                            </div>

                            {/* Hero Video (Optional) */}
                            <div>
                                <Label htmlFor="heroVideo">Hero Video URL (Optional)</Label>
                                <Input
                                    id="heroVideo"
                                    type="url"
                                    value={formData.heroVideo || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, heroVideo: e.target.value }))}
                                    placeholder="https://youtube.com/..."
                                />
                            </div>

                            {/* Duration & Group Size */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="duration">Duration *</Label>
                                    <Input
                                        id="duration"
                                        value={formData.duration}
                                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                        required
                                        placeholder="e.g., 6-8 hours"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="groupSize">Group Size *</Label>
                                    <Input
                                        id="groupSize"
                                        value={formData.groupSize}
                                        onChange={(e) => setFormData(prev => ({ ...prev, groupSize: e.target.value }))}
                                        required
                                        placeholder="e.g., Up to 6 people"
                                    />
                                </div>
                            </div>

                            {/* Status Flags */}
                            <div className="space-y-2">
                                <Label>Status & Flags</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={formData.featured}
                                            onCheckedChange={(checked) =>
                                                setFormData(prev => ({ ...prev, featured: checked }))
                                            }
                                        />
                                        <Label>Featured</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={formData.popular}
                                            onCheckedChange={(checked) =>
                                                setFormData(prev => ({ ...prev, popular: checked }))
                                            }
                                        />
                                        <Label>Popular</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={formData.new}
                                            onCheckedChange={(checked) =>
                                                setFormData(prev => ({ ...prev, new: checked }))
                                            }
                                        />
                                        <Label>New</Label>
                                    </div>
                                    <div>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(value: 'draft' | 'published' | 'archived') =>
                                                setFormData(prev => ({ ...prev, status: value }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="published">Published</SelectItem>
                                                <SelectItem value="archived">Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CONTENT TAB */}
                <TabsContent value="content" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Description & Highlights</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Short Description */}
                            <div>
                                <Label htmlFor="shortDescription">Short Description *</Label>
                                <Textarea
                                    id="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                                    required
                                    rows={3}
                                    placeholder="Brief description for cards and previews"
                                />
                            </div>

                            {/* Full Description */}
                            <div>
                                <Label htmlFor="fullDescription">Full Description *</Label>
                                <Textarea
                                    id="fullDescription"
                                    value={formData.fullDescription}
                                    onChange={(e) => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
                                    required
                                    rows={6}
                                    placeholder="Detailed description of the experience"
                                />
                            </div>

                            {/* Highlights */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Label>Highlights</Label>
                                    <Button type="button" size="sm" onClick={addHighlight}>
                                        <Plus className="w-4 h-4 mr-1" /> Add Highlight
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {formData.highlights.map((highlight, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={highlight}
                                                onChange={(e) => updateHighlight(index, e.target.value)}
                                                placeholder="e.g., Private luxury 4x4 safari vehicle"
                                            />
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => removeHighlight(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Exclusions */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Label>Exclusions (What's NOT included)</Label>
                                    <Button type="button" size="sm" onClick={addExclusion}>
                                        <Plus className="w-4 h-4 mr-1" /> Add Exclusion
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {formData.exclusions.map((exclusion, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={exclusion}
                                                onChange={(e) => updateExclusion(index, e.target.value)}
                                                placeholder="e.g., Park entrance fees"
                                            />
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => removeExclusion(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cancellation Policy */}
                            <div>
                                <Label htmlFor="cancellationPolicy">Cancellation Policy *</Label>
                                <Textarea
                                    id="cancellationPolicy"
                                    value={formData.cancellationPolicy}
                                    onChange={(e) => setFormData(prev => ({ ...prev, cancellationPolicy: e.target.value }))}
                                    required
                                    rows={2}
                                    placeholder="e.g., Free cancellation up to 48 hours before..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* PRICING TAB */}
                <TabsContent value="pricing" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="priceAmount">Price *</Label>
                                    <Input
                                        id="priceAmount"
                                        type="number"
                                        value={formData.price.amount}
                                        onChange={(e) =>
                                            setFormData(prev => ({
                                                ...prev,
                                                price: { ...prev.price, amount: parseFloat(e.target.value) || 0 },
                                            }))
                                        }
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="priceCurrency">Currency *</Label>
                                    <Select
                                        value={formData.price.currency}
                                        onValueChange={(value) =>
                                            setFormData(prev => ({
                                                ...prev,
                                                price: { ...prev.price, currency: value },
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="EUR">EUR</SelectItem>
                                            <SelectItem value="LKR">LKR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="pricePer">Per *</Label>
                                    <Select
                                        value={formData.price.per}
                                        onValueChange={(value) =>
                                            setFormData(prev => ({
                                                ...prev,
                                                price: { ...prev.price, per: value },
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="person">Person</SelectItem>
                                            <SelectItem value="group">Group</SelectItem>
                                            <SelectItem value="vehicle">Vehicle</SelectItem>
                                            <SelectItem value="day">Day</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* LOGISTICS TAB */}
                <TabsContent value="logistics" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Locations & Availability</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Locations */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Label>Locations *</Label>
                                    <Button type="button" size="sm" onClick={addLocation}>
                                        <Plus className="w-4 h-4 mr-1" /> Add Location
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {formData.locations.map((location, index) => (
                                        <Card key={index}>
                                            <CardContent className="pt-4 space-y-2">
                                                <Input
                                                    value={location.name}
                                                    onChange={(e) => updateLocation(index, 'name', e.target.value)}
                                                    placeholder="Location name (e.g., Yala National Park)"
                                                />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Input
                                                        type="number"
                                                        step="0.0001"
                                                        value={location.coordinates.lat}
                                                        onChange={(e) => updateLocation(index, 'lat', e.target.value)}
                                                        placeholder="Latitude"
                                                    />
                                                    <Input
                                                        type="number"
                                                        step="0.0001"
                                                        value={location.coordinates.lng}
                                                        onChange={(e) => updateLocation(index, 'lng', e.target.value)}
                                                        placeholder="Longitude"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={location.description || ''}
                                                        onChange={(e) => updateLocation(index, 'description', e.target.value)}
                                                        placeholder="Description (optional)"
                                                    />
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => removeLocation(index)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Starting Point */}
                            <div>
                                <Label htmlFor="startingPoint">Starting Point</Label>
                                <Input
                                    id="startingPoint"
                                    value={formData.startingPoint || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, startingPoint: e.target.value }))}
                                    placeholder="e.g., Tissamaharama hotels"
                                />
                            </div>

                            {/* Difficulty */}
                            <div>
                                <Label htmlFor="difficulty">Difficulty Level</Label>
                                <Select
                                    value={formData.difficulty || 'easy'}
                                    onValueChange={(value: 'easy' | 'moderate' | 'challenging') =>
                                        setFormData(prev => ({ ...prev, difficulty: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="easy">Easy</SelectItem>
                                        <SelectItem value="moderate">Moderate</SelectItem>
                                        <SelectItem value="challenging">Challenging</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Availability Type & Notice */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="availabilityType">Availability Type *</Label>
                                    <Select
                                        value={formData.availability.type}
                                        onValueChange={(value: any) =>
                                            setFormData(prev => ({
                                                ...prev,
                                                availability: { ...prev.availability, type: value },
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="seasonal">Seasonal</SelectItem>
                                            <SelectItem value="on-request">On Request</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="minimumNotice">Minimum Notice (hours) *</Label>
                                    <Input
                                        id="minimumNotice"
                                        type="number"
                                        value={formData.availability.minimumNotice}
                                        onChange={(e) =>
                                            setFormData(prev => ({
                                                ...prev,
                                                availability: {
                                                    ...prev.availability,
                                                    minimumNotice: parseInt(e.target.value) || 0,
                                                },
                                            }))
                                        }
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SEO TAB */}
                <TabsContent value="seo" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>SEO Optimization</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="seoTitle">Meta Title *</Label>
                                <Input
                                    id="seoTitle"
                                    value={formData.seo.metaTitle}
                                    onChange={(e) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            seo: { ...prev.seo, metaTitle: e.target.value },
                                        }))
                                    }
                                    required
                                    placeholder="SEO-optimized title (60 characters max)"
                                    maxLength={60}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.seo.metaTitle.length}/60 characters
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="seoDescription">Meta Description *</Label>
                                <Textarea
                                    id="seoDescription"
                                    value={formData.seo.metaDescription}
                                    onChange={(e) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            seo: { ...prev.seo, metaDescription: e.target.value },
                                        }))
                                    }
                                    required
                                    rows={3}
                                    placeholder="SEO description (160 characters max)"
                                    maxLength={160}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.seo.metaDescription.length}/160 characters
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="seoKeywords">Keywords (comma-separated) *</Label>
                                <Input
                                    id="seoKeywords"
                                    value={formData.seo.keywords.join(', ')}
                                    onChange={(e) =>
                                        setFormData(prev => ({
                                            ...prev,
                                            seo: {
                                                ...prev.seo,
                                                keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean),
                                            },
                                        }))
                                    }
                                    placeholder="e.g., yala safari, sri lanka wildlife, luxury safari"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : experience ? 'Update Experience' : 'Create Experience'}
                </Button>
            </div>
        </form>
    );
};

export default LuxuryExperienceForm;
