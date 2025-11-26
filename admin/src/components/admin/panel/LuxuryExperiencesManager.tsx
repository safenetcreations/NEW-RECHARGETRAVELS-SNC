import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { cmsService } from '@/services/cmsService';
import { LuxuryExperience, LuxuryExperienceFormData } from '@/types/cms';
import LuxuryExperienceForm from './LuxuryExperienceForm';

const LuxuryExperiencesManager: React.FC = () => {
    const [experiences, setExperiences] = useState<LuxuryExperience[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingExperience, setEditingExperience] = useState<LuxuryExperience | null>(null);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            setLoading(true);
            const data = await cmsService.luxuryExperiences.getAll();
            setExperiences(data);
        } catch (error) {
            console.error('Error fetching experiences:', error);
            toast.error('Failed to fetch experiences');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateExperience = async (data: LuxuryExperienceFormData) => {
        try {
            const response = await cmsService.luxuryExperiences.create(data);
            if (response.success) {
                toast.success('Experience created successfully');
                fetchExperiences();
                setShowCreateForm(false);
            } else {
                toast.error(response.error || 'Failed to create experience');
            }
        } catch (error) {
            console.error('Error creating experience:', error);
            toast.error('Failed to create experience');
        }
    };

    const handleUpdateExperience = async (id: string, updates: Partial<LuxuryExperienceFormData>) => {
        try {
            const response = await cmsService.luxuryExperiences.update(id, updates);
            if (response.success) {
                toast.success('Experience updated successfully');
                fetchExperiences();
                setEditingExperience(null);
            } else {
                toast.error(response.error || 'Failed to update experience');
            }
        } catch (error) {
            console.error('Error updating experience:', error);
            toast.error('Failed to update experience');
        }
    };

    const handleDeleteExperience = async (id: string) => {
        if (!confirm('Are you sure you want to delete this experience?')) return;

        try {
            const response = await cmsService.luxuryExperiences.delete(id);
            if (response.success) {
                toast.success('Experience deleted successfully');
                fetchExperiences();
            } else {
                toast.error(response.error || 'Failed to delete experience');
            }
        } catch (error) {
            console.error('Error deleting experience:', error);
            toast.error('Failed to delete experience');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {showCreateForm || editingExperience ? (
                <LuxuryExperienceForm
                    experience={editingExperience}
                    onSubmit={editingExperience ? (data) => handleUpdateExperience(editingExperience.id, data) : handleCreateExperience}
                    onCancel={() => {
                        setShowCreateForm(false);
                        setEditingExperience(null);
                    }}
                />
            ) : (
                <>
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Luxury Experiences</h2>
                            <p className="text-gray-600">Manage luxury experiences on your homepage</p>
                        </div>
                        <Button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Experience
                        </Button>
                    </div>

                    {/* Experiences List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {experiences.map((experience) => (
                            <Card key={experience.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                                        <img
                                            src={experience.heroImage}
                                            alt={experience.title}
                                            className="w-full h-full object-cover"
                                        />
                                        {experience.featured && (
                                            <Badge className="absolute top-2 right-2 bg-amber-500">
                                                Featured
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-start gap-2">
                                        <CardTitle className="text-lg font-semibold line-clamp-2">
                                            {experience.title}
                                        </CardTitle>
                                        <Badge variant={
                                            experience.status === 'published' ? 'default' :
                                                experience.status === 'draft' ? 'secondary' :
                                                    'outline'
                                        }>
                                            {experience.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{experience.subtitle}</p>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {experience.shortDescription}
                                    </p>

                                    <div className="space-y-2 mb-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">Category:</span>
                                            <Badge variant="outline" className="capitalize">
                                                {experience.category.replace('-', ' ')}
                                            </Badge>
                                        </div>
                                        <div className="text-gray-600">
                                            <span className="font-semibold">Duration:</span> {experience.duration}
                                        </div>
                                        <div className="text-gray-600">
                                            <span className="font-semibold">Price:</span> {experience.price.currency} ${experience.price.amount} per {experience.price.per}
                                        </div>
                                        <div className="text-gray-600">
                                            <span className="font-semibold">Location:</span> {experience.locations[0]?.name || 'N/A'}
                                        </div>
                                        {experience.popular && (
                                            <Badge variant="outline" className="bg-blue-50">
                                                Popular
                                            </Badge>
                                        )}
                                        {experience.new && (
                                            <Badge variant="outline" className="bg-green-50">
                                                New
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setEditingExperience(experience)}
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDeleteExperience(experience.id)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {experiences.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-12">
                                <p className="text-gray-500">No luxury experiences found.</p>
                                <p className="text-sm text-gray-400 mt-2">Click "Add New Experience" to create your first experience.</p>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
};

export default LuxuryExperiencesManager;
