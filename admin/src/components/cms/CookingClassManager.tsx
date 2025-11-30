import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CookingClassData {
    id: string;
    slug: string;
    name: string;
    heroImageURL: string;
    seo: {
        title: string;
        description: string;
        keywords: string;
    };
    introParagraph: string;
    highlights: Array<{ icon: string; title: string; blurb60: string }>;
    cookingClasses: Array<{
        name: string;
        duration: string;
        price: string;
        highlights: string[];
        included: string[];
        level: string;
        maxParticipants: number;
    }>;
    popularDishes: Array<{
        name: string;
        type: string;
        difficulty: string;
        description: string;
        keyIngredients: string[];
    }>;
    gallery: Array<{ url: string; caption: string }>;
    faqs: Array<{ question: string; answer: string }>;
    stats: Array<{ icon: string; label: string; value: string }>;
    contact: {
        phone: string;
        email: string;
        website: string;
    };
}

const CookingClassManager = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('general');

    const [formData, setFormData] = useState<CookingClassData>({
        id: 'cooking-class-sri-lanka',
        slug: 'cooking-class-sri-lanka',
        name: '',
        heroImageURL: '',
        seo: { title: '', description: '', keywords: '' },
        introParagraph: '',
        highlights: [],
        cookingClasses: [],
        popularDishes: [],
        gallery: [],
        faqs: [],
        stats: [],
        contact: { phone: '', email: '', website: '' }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const docRef = doc(db, 'experiences', 'cooking-class-sri-lanka');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setFormData(docSnap.data() as CookingClassData);
            } else {
                // Initialize with default data if not exists
                console.log('Document not found, using defaults');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast({
                title: "Error",
                description: "Failed to fetch cooking class data",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const docRef = doc(db, 'experiences', 'cooking-class-sri-lanka');
            await setDoc(docRef, {
                ...formData,
                updatedAt: Timestamp.now()
            }, { merge: true });

            toast({
                title: "Success",
                description: "Cooking class data saved successfully"
            });
        } catch (error) {
            console.error('Error saving data:', error);
            toast({
                title: "Error",
                description: "Failed to save data",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (file: File, path: string) => {
        try {
            const storageRef = ref(storage, `experiences/cooking-class/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            return url;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Cooking Class Management</h2>
                <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="general">General & SEO</TabsTrigger>
                    <TabsTrigger value="highlights">Highlights</TabsTrigger>
                    <TabsTrigger value="packages">Packages</TabsTrigger>
                    <TabsTrigger value="dishes">Dishes</TabsTrigger>
                    <TabsTrigger value="gallery">Gallery</TabsTrigger>
                    <TabsTrigger value="faqs">FAQs</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader><CardTitle>General Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Page Title</Label>
                                <Input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Intro Paragraph</Label>
                                <Textarea
                                    value={formData.introParagraph}
                                    onChange={e => setFormData({ ...formData, introParagraph: e.target.value })}
                                    rows={4}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Hero Image URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={formData.heroImageURL}
                                        onChange={e => setFormData({ ...formData, heroImageURL: e.target.value })}
                                    />
                                    <Input
                                        type="file"
                                        className="w-[200px]"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const url = await handleImageUpload(file, 'hero');
                                                setFormData({ ...formData, heroImageURL: url });
                                            }
                                        }}
                                    />
                                </div>
                                {formData.heroImageURL && (
                                    <img src={formData.heroImageURL} alt="Hero" className="h-40 object-cover rounded" />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>SEO Settings</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Meta Title</Label>
                                <Input
                                    value={formData.seo.title}
                                    onChange={e => setFormData({ ...formData, seo: { ...formData.seo, title: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Meta Description</Label>
                                <Textarea
                                    value={formData.seo.description}
                                    onChange={e => setFormData({ ...formData, seo: { ...formData.seo, description: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Keywords</Label>
                                <Input
                                    value={formData.seo.keywords}
                                    onChange={e => setFormData({ ...formData, seo: { ...formData.seo, keywords: e.target.value } })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="highlights" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Highlights</CardTitle>
                                <Button onClick={() => setFormData({
                                    ...formData,
                                    highlights: [...formData.highlights, { icon: 'Star', title: '', blurb60: '' }]
                                })}>
                                    <Plus className="h-4 w-4 mr-2" /> Add Highlight
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.highlights.map((highlight, index) => (
                                <div key={index} className="border p-4 rounded space-y-2">
                                    <div className="flex justify-between">
                                        <h4 className="font-medium">Highlight {index + 1}</h4>
                                        <Button variant="ghost" size="sm" onClick={() => {
                                            const newHighlights = [...formData.highlights];
                                            newHighlights.splice(index, 1);
                                            setFormData({ ...formData, highlights: newHighlights });
                                        }}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            placeholder="Title"
                                            value={highlight.title}
                                            onChange={e => {
                                                const newHighlights = [...formData.highlights];
                                                newHighlights[index].title = e.target.value;
                                                setFormData({ ...formData, highlights: newHighlights });
                                            }}
                                        />
                                        <Input
                                            placeholder="Icon Name (e.g. Star, UtensilsCrossed)"
                                            value={highlight.icon}
                                            onChange={e => {
                                                const newHighlights = [...formData.highlights];
                                                newHighlights[index].icon = e.target.value;
                                                setFormData({ ...formData, highlights: newHighlights });
                                            }}
                                        />
                                    </div>
                                    <Textarea
                                        placeholder="Description"
                                        value={highlight.blurb60}
                                        onChange={e => {
                                            const newHighlights = [...formData.highlights];
                                            newHighlights[index].blurb60 = e.target.value;
                                            setFormData({ ...formData, highlights: newHighlights });
                                        }}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="packages" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Cooking Packages</CardTitle>
                                <Button onClick={() => setFormData({
                                    ...formData,
                                    cookingClasses: [...formData.cookingClasses, {
                                        name: '', duration: '', price: '', highlights: [], included: [], level: 'Beginner', maxParticipants: 8
                                    }]
                                })}>
                                    <Plus className="h-4 w-4 mr-2" /> Add Package
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.cookingClasses.map((pkg, index) => (
                                <div key={index} className="border p-4 rounded space-y-4">
                                    <div className="flex justify-between">
                                        <h4 className="font-medium">Package {index + 1}</h4>
                                        <Button variant="ghost" size="sm" onClick={() => {
                                            const newPackages = [...formData.cookingClasses];
                                            newPackages.splice(index, 1);
                                            setFormData({ ...formData, cookingClasses: newPackages });
                                        }}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            placeholder="Package Name"
                                            value={pkg.name}
                                            onChange={e => {
                                                const newPackages = [...formData.cookingClasses];
                                                newPackages[index].name = e.target.value;
                                                setFormData({ ...formData, cookingClasses: newPackages });
                                            }}
                                        />
                                        <Input
                                            placeholder="Price"
                                            value={pkg.price}
                                            onChange={e => {
                                                const newPackages = [...formData.cookingClasses];
                                                newPackages[index].price = e.target.value;
                                                setFormData({ ...formData, cookingClasses: newPackages });
                                            }}
                                        />
                                        <Input
                                            placeholder="Duration"
                                            value={pkg.duration}
                                            onChange={e => {
                                                const newPackages = [...formData.cookingClasses];
                                                newPackages[index].duration = e.target.value;
                                                setFormData({ ...formData, cookingClasses: newPackages });
                                            }}
                                        />
                                        <Input
                                            placeholder="Level"
                                            value={pkg.level}
                                            onChange={e => {
                                                const newPackages = [...formData.cookingClasses];
                                                newPackages[index].level = e.target.value;
                                                setFormData({ ...formData, cookingClasses: newPackages });
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Label>Highlights (comma separated)</Label>
                                        <Textarea
                                            value={pkg.highlights.join(', ')}
                                            onChange={e => {
                                                const newPackages = [...formData.cookingClasses];
                                                newPackages[index].highlights = e.target.value.split(',').map(s => s.trim());
                                                setFormData({ ...formData, cookingClasses: newPackages });
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Label>Included (comma separated)</Label>
                                        <Textarea
                                            value={pkg.included.join(', ')}
                                            onChange={e => {
                                                const newPackages = [...formData.cookingClasses];
                                                newPackages[index].included = e.target.value.split(',').map(s => s.trim());
                                                setFormData({ ...formData, cookingClasses: newPackages });
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="dishes" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Popular Dishes</CardTitle>
                                <Button onClick={() => setFormData({
                                    ...formData,
                                    popularDishes: [...formData.popularDishes, {
                                        name: '', type: '', difficulty: 'Medium', description: '', keyIngredients: []
                                    }]
                                })}>
                                    <Plus className="h-4 w-4 mr-2" /> Add Dish
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.popularDishes.map((dish, index) => (
                                <div key={index} className="border p-4 rounded space-y-4">
                                    <div className="flex justify-between">
                                        <h4 className="font-medium">Dish {index + 1}</h4>
                                        <Button variant="ghost" size="sm" onClick={() => {
                                            const newDishes = [...formData.popularDishes];
                                            newDishes.splice(index, 1);
                                            setFormData({ ...formData, popularDishes: newDishes });
                                        }}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            placeholder="Dish Name"
                                            value={dish.name}
                                            onChange={e => {
                                                const newDishes = [...formData.popularDishes];
                                                newDishes[index].name = e.target.value;
                                                setFormData({ ...formData, popularDishes: newDishes });
                                            }}
                                        />
                                        <Input
                                            placeholder="Type (e.g. Curry, Dessert)"
                                            value={dish.type}
                                            onChange={e => {
                                                const newDishes = [...formData.popularDishes];
                                                newDishes[index].type = e.target.value;
                                                setFormData({ ...formData, popularDishes: newDishes });
                                            }}
                                        />
                                    </div>
                                    <Textarea
                                        placeholder="Description"
                                        value={dish.description}
                                        onChange={e => {
                                            const newDishes = [...formData.popularDishes];
                                            newDishes[index].description = e.target.value;
                                            setFormData({ ...formData, popularDishes: newDishes });
                                        }}
                                    />
                                    <div>
                                        <Label>Key Ingredients (comma separated)</Label>
                                        <Input
                                            value={dish.keyIngredients.join(', ')}
                                            onChange={e => {
                                                const newDishes = [...formData.popularDishes];
                                                newDishes[index].keyIngredients = e.target.value.split(',').map(s => s.trim());
                                                setFormData({ ...formData, popularDishes: newDishes });
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="gallery" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Gallery</CardTitle>
                                <Button onClick={() => setFormData({
                                    ...formData,
                                    gallery: [...formData.gallery, { url: '', caption: '' }]
                                })}>
                                    <Plus className="h-4 w-4 mr-2" /> Add Image
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {formData.gallery.map((img, index) => (
                                    <div key={index} className="border p-4 rounded space-y-2">
                                        <div className="flex justify-between">
                                            <h4 className="font-medium">Image {index + 1}</h4>
                                            <Button variant="ghost" size="sm" onClick={() => {
                                                const newGallery = [...formData.gallery];
                                                newGallery.splice(index, 1);
                                                setFormData({ ...formData, gallery: newGallery });
                                            }}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Image URL"
                                                value={img.url}
                                                onChange={e => {
                                                    const newGallery = [...formData.gallery];
                                                    newGallery[index].url = e.target.value;
                                                    setFormData({ ...formData, gallery: newGallery });
                                                }}
                                            />
                                            <Input
                                                type="file"
                                                className="w-[100px]"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const url = await handleImageUpload(file, 'gallery');
                                                        const newGallery = [...formData.gallery];
                                                        newGallery[index].url = url;
                                                        setFormData({ ...formData, gallery: newGallery });
                                                    }
                                                }}
                                            />
                                        </div>
                                        {img.url && <img src={img.url} alt="Preview" className="h-32 object-cover rounded w-full" />}
                                        <Input
                                            placeholder="Caption"
                                            value={img.caption}
                                            onChange={e => {
                                                const newGallery = [...formData.gallery];
                                                newGallery[index].caption = e.target.value;
                                                setFormData({ ...formData, gallery: newGallery });
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="faqs" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>FAQs</CardTitle>
                                <Button onClick={() => setFormData({
                                    ...formData,
                                    faqs: [...formData.faqs, { question: '', answer: '' }]
                                })}>
                                    <Plus className="h-4 w-4 mr-2" /> Add FAQ
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.faqs.map((faq, index) => (
                                <div key={index} className="border p-4 rounded space-y-2">
                                    <div className="flex justify-between">
                                        <h4 className="font-medium">FAQ {index + 1}</h4>
                                        <Button variant="ghost" size="sm" onClick={() => {
                                            const newFaqs = [...formData.faqs];
                                            newFaqs.splice(index, 1);
                                            setFormData({ ...formData, faqs: newFaqs });
                                        }}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                    <Input
                                        placeholder="Question"
                                        value={faq.question}
                                        onChange={e => {
                                            const newFaqs = [...formData.faqs];
                                            newFaqs[index].question = e.target.value;
                                            setFormData({ ...formData, faqs: newFaqs });
                                        }}
                                    />
                                    <Textarea
                                        placeholder="Answer"
                                        value={faq.answer}
                                        onChange={e => {
                                            const newFaqs = [...formData.faqs];
                                            newFaqs[index].answer = e.target.value;
                                            setFormData({ ...formData, faqs: newFaqs });
                                        }}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CookingClassManager;
