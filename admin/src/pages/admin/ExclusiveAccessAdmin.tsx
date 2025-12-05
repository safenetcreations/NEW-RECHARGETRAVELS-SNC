import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
    Plus,
    Trash2,
    Edit3,
    Save,
    Image as ImageIcon,
    KeyRound,
    Loader2,
    Eye,
    EyeOff,
    Church,
    Palette,
    BookOpen,
    TreeDeciduous,
    RefreshCw,
    ExternalLink,
    Upload,
    X,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import {
    getExclusiveAccessHero,
    updateExclusiveAccessHero,
    getExperienceCategories,
    addExperienceCategory,
    updateExperienceCategory,
    deleteExperienceCategory,
    getExclusiveExperiences,
    addExclusiveExperience,
    updateExclusiveExperience,
    deleteExclusiveExperience,
    initializeExclusiveAccessData,
    ExclusiveAccessHero,
    ExperienceCategory,
    ExclusiveExperience,
    DEFAULT_HERO
} from '@/services/exclusiveAccessService';
import { firebaseStorageService } from '@/services/firebaseStorageService';

const ICON_OPTIONS = [
    { value: 'Church', label: 'Sacred/Religious' },
    { value: 'Palette', label: 'Art/Culture' },
    { value: 'BookOpen', label: 'Learning/Heritage' },
    { value: 'TreeDeciduous', label: 'Nature' },
    { value: 'Crown', label: 'Royalty/Luxury' },
    { value: 'Sparkles', label: 'Special/VIP' },
    { value: 'Landmark', label: 'Historical' },
    { value: 'GraduationCap', label: 'Educational' }
];

// Image Upload Component
interface ImageUploadProps {
    currentImage: string;
    onImageChange: (url: string) => void;
    folder?: string;
    label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onImageChange, folder = 'exclusive-access', label = 'Image' }) => {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (file: File) => {
        // Validate
        const validation = firebaseStorageService.validateImage(file);
        if (!validation.valid) {
            toast.error(validation.error || 'Invalid file');
            return;
        }

        setUploading(true);
        try {
            // Optimize image before upload
            const optimizedFile = await firebaseStorageService.optimizeImage(file, 1920, 1080, 0.85);
            const url = await firebaseStorageService.uploadImage(optimizedFile, folder);
            onImageChange(url);
            toast.success('Image uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileUpload(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
    };

    return (
        <div className="space-y-3">
            <Label>{label}</Label>

            {/* Current Image Preview */}
            {currentImage && (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border">
                    <img
                        src={currentImage}
                        alt="Current"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/800x450?text=Invalid+Image')}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Replace
                        </Button>
                    </div>
                </div>
            )}

            {/* Upload Zone */}
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${dragActive
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-300 hover:border-violet-400 hover:bg-violet-50/50'
                    }`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                {uploading ? (
                    <div className="flex items-center justify-center gap-2 text-violet-600">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Uploading...</span>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600">
                            <span className="font-medium text-violet-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
            />

            {/* URL Input (fallback) */}
            <div className="flex items-center gap-2">
                <Input
                    value={currentImage}
                    onChange={(e) => onImageChange(e.target.value)}
                    placeholder="Or paste image URL..."
                    className="flex-1 text-sm"
                />
            </div>
        </div>
    );
};

const ExclusiveAccessAdmin = () => {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Authentication check - redirect to login if not authenticated
    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-violet-500 mx-auto mb-4" />
                    <p className="text-gray-500">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Hero state
    const [hero, setHero] = useState<ExclusiveAccessHero>(DEFAULT_HERO);

    // Categories state
    const [categories, setCategories] = useState<ExperienceCategory[]>([]);
    const [editingCategory, setEditingCategory] = useState<ExperienceCategory | null>(null);
    const [newCategory, setNewCategory] = useState<Partial<ExperienceCategory>>({ name: '', icon: 'Church', tagline: '', order: 1, isActive: true });
    const [showCategoryDialog, setShowCategoryDialog] = useState(false);

    // Experiences state
    const [experiences, setExperiences] = useState<ExclusiveExperience[]>([]);
    const [editingExperience, setEditingExperience] = useState<ExclusiveExperience | null>(null);
    const [newExperience, setNewExperience] = useState<Partial<ExclusiveExperience>>({
        name: '', location: '', description: '', whatMakesItExclusive: '', image: '', categoryId: '', order: 1, isActive: true
    });
    const [showExperienceDialog, setShowExperienceDialog] = useState(false);

    // Fetch all data
    const fetchData = async () => {
        setLoading(true);
        try {
            const [heroData, categoriesData, experiencesData] = await Promise.all([
                getExclusiveAccessHero(),
                getExperienceCategories(),
                getExclusiveExperiences()
            ]);
            setHero(heroData);
            setCategories(categoriesData);
            setExperiences(experiencesData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Hero handlers
    const handleSaveHero = async () => {
        setSaving(true);
        try {
            const result = await updateExclusiveAccessHero({
                image: hero.image,
                title: hero.title,
                subtitle: hero.subtitle,
                description: hero.description,
                isActive: hero.isActive
            });
            if (result.success) {
                toast.success('Hero section updated successfully!');
            } else {
                toast.error(result.error || 'Failed to update hero');
            }
        } catch (error) {
            toast.error('Error saving hero section');
        } finally {
            setSaving(false);
        }
    };

    // Category handlers
    const handleSaveCategory = async () => {
        setSaving(true);
        try {
            if (editingCategory?.id) {
                const result = await updateExperienceCategory(editingCategory.id, editingCategory);
                if (result.success) {
                    toast.success('Category updated!');
                    setEditingCategory(null);
                    fetchData();
                } else {
                    toast.error(result.error || 'Failed to update');
                }
            } else {
                const result = await addExperienceCategory(newCategory as Omit<ExperienceCategory, 'id' | 'createdAt'>);
                if (result.success) {
                    toast.success('Category added!');
                    setNewCategory({ name: '', icon: 'Church', tagline: '', order: categories.length + 1, isActive: true });
                    setShowCategoryDialog(false);
                    fetchData();
                } else {
                    toast.error(result.error || 'Failed to add');
                }
            }
        } catch (error) {
            toast.error('Error saving category');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Are you sure? This will affect all experiences in this category.')) return;
        try {
            const result = await deleteExperienceCategory(id);
            if (result.success) {
                toast.success('Category deleted!');
                fetchData();
            } else {
                toast.error(result.error || 'Failed to delete');
            }
        } catch (error) {
            toast.error('Error deleting category');
        }
    };

    // Experience handlers
    const handleSaveExperience = async () => {
        setSaving(true);
        try {
            if (editingExperience?.id && !editingExperience.id.startsWith('default-')) {
                const result = await updateExclusiveExperience(editingExperience.id, editingExperience);
                if (result.success) {
                    toast.success('Experience updated!');
                    setEditingExperience(null);
                    fetchData();
                } else {
                    toast.error(result.error || 'Failed to update');
                }
            } else {
                const result = await addExclusiveExperience(newExperience as Omit<ExclusiveExperience, 'id' | 'createdAt' | 'updatedAt'>);
                if (result.success) {
                    toast.success('Experience added!');
                    setNewExperience({ name: '', location: '', description: '', whatMakesItExclusive: '', image: '', categoryId: '', order: 1, isActive: true });
                    setShowExperienceDialog(false);
                    fetchData();
                } else {
                    toast.error(result.error || 'Failed to add');
                }
            }
        } catch (error) {
            toast.error('Error saving experience');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteExperience = async (id: string) => {
        if (id.startsWith('default-')) {
            toast.error('Cannot delete default experiences. Add new ones to replace them.');
            return;
        }
        if (!confirm('Are you sure you want to delete this experience?')) return;
        try {
            const result = await deleteExclusiveExperience(id);
            if (result.success) {
                toast.success('Experience deleted!');
                fetchData();
            } else {
                toast.error(result.error || 'Failed to delete');
            }
        } catch (error) {
            toast.error('Error deleting experience');
        }
    };

    const handleInitializeData = async () => {
        if (!confirm('This will initialize default data in the database. Continue?')) return;
        setSaving(true);
        try {
            const result = await initializeExclusiveAccessData();
            if (result.success) {
                toast.success('Data initialized successfully!');
                fetchData();
            } else {
                toast.error(result.error || 'Failed to initialize');
            }
        } catch (error) {
            toast.error('Error initializing data');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-violet-500 mx-auto mb-4" />
                    <p className="text-gray-500">Loading Exclusive Access data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-xl border border-violet-100">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-violet-900">
                        <KeyRound className="w-6 h-6 text-violet-600" />
                        Exclusive Access Manager
                    </h1>
                    <p className="text-violet-600 text-sm mt-1">Manage hero section, categories, and exclusive experiences</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" onClick={fetchData} className="border-violet-200 text-violet-700 hover:bg-violet-50">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleInitializeData} disabled={saving} className="border-violet-200 text-violet-700 hover:bg-violet-50">
                        Initialize Defaults
                    </Button>
                    <a href="/experiences/luxury/exclusive-access" target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Page
                        </Button>
                    </a>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-0">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-violet-100 text-sm">Hero Status</p>
                            <p className="text-xl font-bold">{hero.isActive ? 'Active' : 'Inactive'}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-emerald-100 text-sm">Categories</p>
                            <p className="text-xl font-bold">{categories.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-500 to-amber-600 text-white border-0">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <KeyRound className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-orange-100 text-sm">Experiences</p>
                            <p className="text-xl font-bold">{experiences.length}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="hero" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-violet-50 p-1 rounded-xl">
                    <TabsTrigger value="hero" className="data-[state=active]:bg-white data-[state=active]:text-violet-700 rounded-lg">
                        Hero Section
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="data-[state=active]:bg-white data-[state=active]:text-violet-700 rounded-lg">
                        Categories ({categories.length})
                    </TabsTrigger>
                    <TabsTrigger value="experiences" className="data-[state=active]:bg-white data-[state=active]:text-violet-700 rounded-lg">
                        Experiences ({experiences.length})
                    </TabsTrigger>
                </TabsList>

                {/* HERO TAB */}
                <TabsContent value="hero" className="mt-6">
                    <Card>
                        <CardHeader className="border-b bg-gradient-to-r from-violet-50/50 to-transparent">
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-violet-600" />
                                Hero Section
                            </CardTitle>
                            <CardDescription>Configure the main hero banner for the Exclusive Access page</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 p-6">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-5">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Title</Label>
                                        <Input
                                            value={hero.title}
                                            onChange={(e) => setHero({ ...hero, title: e.target.value })}
                                            placeholder="Exclusive Access"
                                            className="mt-1.5"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Subtitle</Label>
                                        <Input
                                            value={hero.subtitle}
                                            onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                                            placeholder="Beyond the velvet rope"
                                            className="mt-1.5"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Description</Label>
                                        <Textarea
                                            value={hero.description}
                                            onChange={(e) => setHero({ ...hero, description: e.target.value })}
                                            rows={3}
                                            placeholder="Private temple blessings..."
                                            className="mt-1.5"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                        <Switch
                                            checked={hero.isActive}
                                            onCheckedChange={(checked) => setHero({ ...hero, isActive: checked })}
                                        />
                                        <div>
                                            <Label className="font-medium">Active Status</Label>
                                            <p className="text-xs text-gray-500">Toggle hero section visibility</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <ImageUpload
                                        currentImage={hero.image}
                                        onImageChange={(url) => setHero({ ...hero, image: url })}
                                        folder="exclusive-access/hero"
                                        label="Hero Background Image"
                                    />
                                </div>
                            </div>
                            <div className="pt-4 border-t">
                                <Button onClick={handleSaveHero} disabled={saving} className="w-full bg-violet-600 hover:bg-violet-700">
                                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Hero Section
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CATEGORIES TAB */}
                <TabsContent value="categories" className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between border-b">
                            <div>
                                <CardTitle>Experience Categories</CardTitle>
                                <CardDescription>Manage categories for grouping experiences</CardDescription>
                            </div>
                            <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Category
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Category</DialogTitle>
                                        <DialogDescription>Create a new category for exclusive experiences</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div>
                                            <Label>Category Name</Label>
                                            <Input
                                                value={newCategory.name || ''}
                                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                                placeholder="e.g., Sacred Privileges"
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <div>
                                            <Label>Tagline</Label>
                                            <Input
                                                value={newCategory.tagline || ''}
                                                onChange={(e) => setNewCategory({ ...newCategory, tagline: e.target.value })}
                                                placeholder="e.g., Where faith meets reverence"
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <div>
                                            <Label>Icon</Label>
                                            <Select value={newCategory.icon} onValueChange={(value) => setNewCategory({ ...newCategory, icon: value })}>
                                                <SelectTrigger className="mt-1.5">
                                                    <SelectValue placeholder="Select icon" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ICON_OPTIONS.map(opt => (
                                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Order</Label>
                                            <Input
                                                type="number"
                                                value={newCategory.order || 1}
                                                onChange={(e) => setNewCategory({ ...newCategory, order: parseInt(e.target.value) })}
                                                className="mt-1.5"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>Cancel</Button>
                                        <Button onClick={handleSaveCategory} disabled={saving} className="bg-violet-600 hover:bg-violet-700">
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Category'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                {categories.map((cat) => (
                                    <div key={cat.id || cat.name} className="flex items-center justify-between p-4 border rounded-xl hover:border-violet-200 hover:bg-violet-50/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                                                {cat.icon === 'Church' && <Church className="w-6 h-6 text-violet-600" />}
                                                {cat.icon === 'Palette' && <Palette className="w-6 h-6 text-violet-600" />}
                                                {cat.icon === 'BookOpen' && <BookOpen className="w-6 h-6 text-violet-600" />}
                                                {cat.icon === 'TreeDeciduous' && <TreeDeciduous className="w-6 h-6 text-violet-600" />}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{cat.name}</h4>
                                                <p className="text-sm text-gray-500">{cat.tagline}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={cat.isActive ? "default" : "secondary"} className={cat.isActive ? "bg-emerald-100 text-emerald-700" : ""}>
                                                {cat.isActive ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                                                {cat.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                            <Badge variant="outline" className="border-violet-200 text-violet-700">Order: {cat.order}</Badge>
                                            {cat.id && (
                                                <>
                                                    <Button variant="ghost" size="sm" onClick={() => setEditingCategory(cat)} className="text-violet-600 hover:text-violet-700 hover:bg-violet-50">
                                                        <Edit3 className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(cat.id!)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* EXPERIENCES TAB */}
                <TabsContent value="experiences" className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between border-b">
                            <div>
                                <CardTitle>Exclusive Experiences</CardTitle>
                                <CardDescription>Manage individual exclusive experiences</CardDescription>
                            </div>
                            <Dialog open={showExperienceDialog} onOpenChange={setShowExperienceDialog}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Experience
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Add New Experience</DialogTitle>
                                        <DialogDescription>Create a new exclusive experience</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Experience Name</Label>
                                                <Input
                                                    value={newExperience.name || ''}
                                                    onChange={(e) => setNewExperience({ ...newExperience, name: e.target.value })}
                                                    placeholder="e.g., Private Temple Blessing"
                                                    className="mt-1.5"
                                                />
                                            </div>
                                            <div>
                                                <Label>Location</Label>
                                                <Input
                                                    value={newExperience.location || ''}
                                                    onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                                                    placeholder="e.g., Temple of the Tooth, Kandy"
                                                    className="mt-1.5"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Category</Label>
                                            <Select value={newExperience.categoryId} onValueChange={(value) => setNewExperience({ ...newExperience, categoryId: value })}>
                                                <SelectTrigger className="mt-1.5">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(cat => (
                                                        <SelectItem key={cat.id || cat.name} value={cat.name}>{cat.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Description</Label>
                                            <Textarea
                                                value={newExperience.description || ''}
                                                onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                                                rows={3}
                                                placeholder="Describe the experience..."
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <div>
                                            <Label>What Makes It Exclusive</Label>
                                            <Textarea
                                                value={newExperience.whatMakesItExclusive || ''}
                                                onChange={(e) => setNewExperience({ ...newExperience, whatMakesItExclusive: e.target.value })}
                                                rows={2}
                                                placeholder="Why is this experience exclusive?"
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <ImageUpload
                                            currentImage={newExperience.image || ''}
                                            onImageChange={(url) => setNewExperience({ ...newExperience, image: url })}
                                            folder="exclusive-access/experiences"
                                            label="Experience Image"
                                        />
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Order</Label>
                                                <Input
                                                    type="number"
                                                    value={newExperience.order || 1}
                                                    onChange={(e) => setNewExperience({ ...newExperience, order: parseInt(e.target.value) })}
                                                    className="mt-1.5"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 pt-6">
                                                <Switch
                                                    checked={newExperience.isActive}
                                                    onCheckedChange={(checked) => setNewExperience({ ...newExperience, isActive: checked })}
                                                />
                                                <Label>Active</Label>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setShowExperienceDialog(false)}>Cancel</Button>
                                        <Button onClick={handleSaveExperience} disabled={saving} className="bg-violet-600 hover:bg-violet-700">
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Experience'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {experiences.map((exp) => (
                                    <div key={exp.id} className="border rounded-xl overflow-hidden hover:border-violet-200 hover:shadow-lg transition-all group">
                                        <div className="aspect-video relative">
                                            <img
                                                src={exp.image}
                                                alt={exp.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x225?text=No+Image')}
                                            />
                                            <div className="absolute top-2 right-2 flex gap-1">
                                                <Badge variant={exp.isActive ? "default" : "secondary"} className={`text-xs ${exp.isActive ? 'bg-emerald-500' : ''}`}>
                                                    {exp.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                </Badge>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
                                                <p className="text-xs text-violet-300 mb-1">{exp.location}</p>
                                                <h4 className="text-white font-semibold">{exp.name}</h4>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <Badge variant="outline" className="mb-2 text-xs border-violet-200 text-violet-600">{exp.categoryId}</Badge>
                                            <p className="text-xs text-gray-500 line-clamp-2">{exp.description}</p>
                                            <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t">
                                                <Button variant="ghost" size="sm" onClick={() => setEditingExperience(exp)} className="text-violet-600 hover:bg-violet-50">
                                                    <Edit3 className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteExperience(exp.id!)} className="text-red-500 hover:bg-red-50">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Edit Experience Dialog */}
            {editingExperience && (
                <Dialog open={!!editingExperience} onOpenChange={() => setEditingExperience(null)}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Experience</DialogTitle>
                            <DialogDescription>Update experience details</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Experience Name</Label>
                                    <Input
                                        value={editingExperience.name}
                                        onChange={(e) => setEditingExperience({ ...editingExperience, name: e.target.value })}
                                        className="mt-1.5"
                                    />
                                </div>
                                <div>
                                    <Label>Location</Label>
                                    <Input
                                        value={editingExperience.location}
                                        onChange={(e) => setEditingExperience({ ...editingExperience, location: e.target.value })}
                                        className="mt-1.5"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Category</Label>
                                <Select value={editingExperience.categoryId} onValueChange={(value) => setEditingExperience({ ...editingExperience, categoryId: value })}>
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id || cat.name} value={cat.name}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea
                                    value={editingExperience.description}
                                    onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })}
                                    rows={3}
                                    className="mt-1.5"
                                />
                            </div>
                            <div>
                                <Label>What Makes It Exclusive</Label>
                                <Textarea
                                    value={editingExperience.whatMakesItExclusive}
                                    onChange={(e) => setEditingExperience({ ...editingExperience, whatMakesItExclusive: e.target.value })}
                                    rows={2}
                                    className="mt-1.5"
                                />
                            </div>
                            <ImageUpload
                                currentImage={editingExperience.image}
                                onImageChange={(url) => setEditingExperience({ ...editingExperience, image: url })}
                                folder="exclusive-access/experiences"
                                label="Experience Image"
                            />
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Order</Label>
                                    <Input
                                        type="number"
                                        value={editingExperience.order}
                                        onChange={(e) => setEditingExperience({ ...editingExperience, order: parseInt(e.target.value) })}
                                        className="mt-1.5"
                                    />
                                </div>
                                <div className="flex items-center gap-2 pt-6">
                                    <Switch
                                        checked={editingExperience.isActive}
                                        onCheckedChange={(checked) => setEditingExperience({ ...editingExperience, isActive: checked })}
                                    />
                                    <Label>Active</Label>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingExperience(null)}>Cancel</Button>
                            <Button onClick={handleSaveExperience} disabled={saving} className="bg-violet-600 hover:bg-violet-700">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Edit Category Dialog */}
            {editingCategory && (
                <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>Update category details</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label>Category Name</Label>
                                <Input
                                    value={editingCategory.name}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                    className="mt-1.5"
                                />
                            </div>
                            <div>
                                <Label>Tagline</Label>
                                <Input
                                    value={editingCategory.tagline}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, tagline: e.target.value })}
                                    className="mt-1.5"
                                />
                            </div>
                            <div>
                                <Label>Icon</Label>
                                <Select value={editingCategory.icon} onValueChange={(value) => setEditingCategory({ ...editingCategory, icon: value })}>
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue placeholder="Select icon" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ICON_OPTIONS.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Order</Label>
                                <Input
                                    type="number"
                                    value={editingCategory.order}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, order: parseInt(e.target.value) })}
                                    className="mt-1.5"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={editingCategory.isActive}
                                    onCheckedChange={(checked) => setEditingCategory({ ...editingCategory, isActive: checked })}
                                />
                                <Label>Active</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingCategory(null)}>Cancel</Button>
                            <Button onClick={handleSaveCategory} disabled={saving} className="bg-violet-600 hover:bg-violet-700">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default ExclusiveAccessAdmin;
