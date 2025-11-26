import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TravelGuideSection, TravelGuideFormData } from '@/types/cms';

interface TravelGuideFormProps {
    section: TravelGuideSection | null;
    onSubmit: (data: TravelGuideFormData) => void;
    onCancel: () => void;
}

const TravelGuideForm: React.FC<TravelGuideFormProps> = ({ section, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<TravelGuideFormData>({
        title: '',
        content: '',
        image: '',
        category: '',
        readTime: '',
        author: '',
        order: 0,
        isActive: true,
    });

    useEffect(() => {
        if (section) {
            setFormData({
                title: section.title,
                content: section.content,
                image: section.image,
                category: section.category,
                readTime: section.readTime || '',
                author: section.author || '',
                order: section.order,
                isActive: section.isActive,
            });
        }
    }, [section]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: Number(value) }));
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label>Title</Label>
                <Input name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div>
                <Label>Content / Description</Label>
                <Textarea name="content" value={formData.content} onChange={handleChange} required className="h-32" />
            </div>

            <div>
                <Label>Image URL</Label>
                <Input name="image" value={formData.image} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Category</Label>
                    <Input name="category" value={formData.category} onChange={handleChange} required />
                </div>
                <div>
                    <Label>Read Time (e.g., 5 min read)</Label>
                    <Input name="readTime" value={formData.readTime} onChange={handleChange} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Author</Label>
                    <Input name="author" value={formData.author} onChange={handleChange} />
                </div>
                <div>
                    <Label>Order</Label>
                    <Input name="order" type="number" value={formData.order} onChange={handleNumberChange} />
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                />
                <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Submit</Button>
            </div>
        </form>
    );
};

export default TravelGuideForm;
