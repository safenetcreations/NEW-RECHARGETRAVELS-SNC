import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Clock, User } from 'lucide-react';
import { cmsService } from '@/services/cmsService';
import { TravelGuideSection, TravelGuideFormData } from '@/types/cms';
import TravelGuideForm from './TravelGuideForm';

const TravelGuideManager: React.FC = () => {
    const [sections, setSections] = useState<TravelGuideSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingSection, setEditingSection] = useState<TravelGuideSection | null>(null);

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            setLoading(true);
            const data = await cmsService.travelGuide.getAll();
            setSections(data);
        } catch (error) {
            console.error('Error fetching travel guide sections:', error);
            toast.error('Failed to fetch travel guide sections');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSection = async (data: TravelGuideFormData) => {
        try {
            const response = await cmsService.travelGuide.create(data);
            if (response.success) {
                toast.success('Section created successfully');
                fetchSections();
                setShowCreateForm(false);
            } else {
                toast.error(response.error || 'Failed to create section');
            }
        } catch (error) {
            console.error('Error creating section:', error);
            toast.error('Failed to create section');
        }
    };

    const handleUpdateSection = async (id: string, updates: Partial<TravelGuideFormData>) => {
        try {
            const response = await cmsService.travelGuide.update(id, updates);
            if (response.success) {
                toast.success('Section updated successfully');
                fetchSections();
                setEditingSection(null);
            } else {
                toast.error(response.error || 'Failed to update section');
            }
        } catch (error) {
            console.error('Error updating section:', error);
            toast.error('Failed to update section');
        }
    };

    const handleDeleteSection = async (id: string) => {
        if (!confirm('Are you sure you want to delete this section?')) return;

        try {
            const response = await cmsService.travelGuide.delete(id);
            if (response.success) {
                toast.success('Section deleted successfully');
                fetchSections();
            } else {
                toast.error(response.error || 'Failed to delete section');
            }
        } catch (error) {
            console.error('Error deleting section:', error);
            toast.error('Failed to delete section');
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
            {showCreateForm || editingSection ? (
                <TravelGuideForm
                    section={editingSection}
                    onSubmit={editingSection ? (data) => handleUpdateSection(editingSection.id, data) : handleCreateSection}
                    onCancel={() => {
                        setShowCreateForm(false);
                        setEditingSection(null);
                    }}
                />
            ) : (
                <>
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Travel Guide</h2>
                            <p className="text-gray-600">Manage travel guide sections on your homepage</p>
                        </div>
                        <Button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Section
                        </Button>
                    </div>

                    {/* Sections List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sections.map((section) => (
                            <Card key={section.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="relative h-40 w-full mb-4">
                                        <img src={section.image} alt={section.title} className="rounded-t-lg object-cover w-full h-full" />
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg font-semibold line-clamp-2">
                                            {section.title}
                                        </CardTitle>
                                        <Badge variant={section.isActive ? "default" : "secondary"}>
                                            {section.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    <Badge variant="outline" className="mt-2">{section.category}</Badge>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {section.content}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        {section.readTime && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Clock className="w-4 h-4 mr-2" />
                                                {section.readTime}
                                            </div>
                                        )}
                                        {section.author && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <User className="w-4 h-4 mr-2" />
                                                {section.author}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setEditingSection(section)}
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDeleteSection(section.id)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {sections.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-12">
                                <p className="text-gray-500">No travel guide sections found.</p>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
};

export default TravelGuideManager;
