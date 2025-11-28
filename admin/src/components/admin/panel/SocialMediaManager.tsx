import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
    Youtube,
    Instagram,
    Facebook,
    Send,
    MessageCircle,
    Save,
    Plus,
    Trash2,
    ExternalLink,
    RefreshCw,
} from 'lucide-react';

interface SocialMediaConfig {
    youtube: {
        enabled: boolean;
        channelId: string;
        channelName: string;
        livestreamTitle: string;
        livestreamDescription: string;
        livestreamUrl: string;
        subscribersCount: string;
        featuredVideoId: string; // New field for the featured video
    };
    instagram: {
        enabled: boolean;
        username: string;
        profileUrl: string;
        followersCount: string;
        postsCount: string;
    };
    facebook: {
        enabled: boolean;
        pageUrl: string;
        pageName: string;
        followersCount: string;
    };
    tiktok: {
        enabled: boolean;
        username: string;
        profileUrl: string;
        followersCount: string;
    };
    whatsapp: {
        enabled: boolean;
        phoneNumber: string;
        businessName: string;
        welcomeMessage: string;
    };
    telegram: {
        enabled: boolean;
        channelUrl: string;
        channelName: string;
        membersCount: string;
    };
}

const defaultConfig: SocialMediaConfig = {
    youtube: {
        enabled: true,
        channelId: 'UCWxBfcDkOVklKDRW0ljpV0w',
        channelName: 'Recharge Travels',
        livestreamTitle: 'Live from Sri Lanka',
        livestreamDescription: 'Experience the beauty of Sri Lanka with us',
        livestreamUrl: 'https://www.youtube.com/watch?v=q_f-b3Cst8Q',
        subscribersCount: '10K+',
        featuredVideoId: '92Np5UkerSQ', // Default to current Car van hire video
    },
    instagram: {
        enabled: true,
        username: 'rechargetravels',
        profileUrl: 'https://instagram.com/rechargetravels',
        followersCount: '25K+',
        postsCount: '500+',
    },
    facebook: {
        enabled: true,
        pageUrl: 'https://facebook.com/rechargetravels',
        pageName: 'Recharge Travels',
        followersCount: '15K+',
    },
    tiktok: {
        enabled: true,
        username: 'rechargetravels',
        profileUrl: 'https://tiktok.com/@rechargetravels',
        followersCount: '30K+',
    },
    whatsapp: {
        enabled: true,
        phoneNumber: '+94771234567',
        businessName: 'Recharge Travels',
        welcomeMessage: 'Hello! Welcome to Recharge Travels. How can we help you plan your perfect Sri Lankan adventure?',
    },
    telegram: {
        enabled: true,
        channelUrl: 'https://t.me/rechargetravels',
        channelName: 'Recharge Travels',
        membersCount: '5K+',
    },
};

const SocialMediaManager: React.FC = () => {
    const [config, setConfig] = useState<SocialMediaConfig>(defaultConfig);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            setLoading(true);
            const docRef = doc(db, 'settings', 'socialMedia');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setConfig({ ...defaultConfig, ...docSnap.data() as SocialMediaConfig });
            }
        } catch (error) {
            console.error('Error loading social media config:', error);
            toast.error('Failed to load social media configuration');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const docRef = doc(db, 'settings', 'socialMedia');
            await setDoc(docRef, config, { merge: true });
            toast.success('Social media configuration saved successfully!');
        } catch (error) {
            console.error('Error saving social media config:', error);
            toast.error('Failed to save social media configuration');
        } finally {
            setSaving(false);
        }
    };

    const updateField = (platform: keyof SocialMediaConfig, field: string, value: any) => {
        setConfig((prev) => ({
            ...prev,
            [platform]: {
                ...prev[platform],
                [field]: value,
            },
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Social Media Management</h2>
                    <p className="text-gray-600 mt-1">Manage all your social media integrations and content</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            {/* YouTube Section */}
            <Card className="border-red-200">
                <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500 rounded-lg">
                                <Youtube className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <CardTitle>YouTube Live Broadcasting</CardTitle>
                                <CardDescription>Manage your YouTube channel and live streams</CardDescription>
                            </div>
                        </div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={config.youtube.enabled}
                                onChange={(e) => updateField('youtube', 'enabled', e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm font-medium">Enabled</span>
                        </label>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Channel ID</Label>
                            <Input
                                value={config.youtube.channelId}
                                onChange={(e) => updateField('youtube', 'channelId', e.target.value)}
                                placeholder="UCWxBfcDkOVklKDRW0ljpV0w"
                            />
                        </div>
                        <div>
                            <Label>Channel Name</Label>
                            <Input
                                value={config.youtube.channelName}
                                onChange={(e) => updateField('youtube', 'channelName', e.target.value)}
                                placeholder="Recharge Travels"
                            />
                        </div>
                        <div>
                            <Label>Subscribers Count</Label>
                            <Input
                                value={config.youtube.subscribersCount}
                                onChange={(e) => updateField('youtube', 'subscribersCount', e.target.value)}
                                placeholder="10K+"
                            />
                        </div>
                        <div>
                            <Label>Livestream URL</Label>
                            <Input
                                value={config.youtube.livestreamUrl}
                                onChange={(e) => updateField('youtube', 'livestreamUrl', e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Featured Video ID</Label>
                        <Input
                            value={config.youtube.featuredVideoId}
                            onChange={(e) => updateField('youtube', 'featuredVideoId', e.target.value)}
                            placeholder="92Np5UkerSQ"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Enter the video ID (from the URL: https://youtu.be/<strong>92Np5UkerSQ</strong> or https://www.youtube.com/watch?v=<strong>92Np5UkerSQ</strong>)
                        </p>
                    </div>
                    <div>
                        <Label>Livestream Title</Label>
                        <Input
                            value={config.youtube.livestreamTitle}
                            onChange={(e) => updateField('youtube', 'livestreamTitle', e.target.value)}
                            placeholder="Live from Sri Lanka"
                        />
                    </div>
                    <div>
                        <Label>Livestream Description</Label>
                        <Textarea
                            value={config.youtube.livestreamDescription}
                            onChange={(e) => updateField('youtube', 'livestreamDescription', e.target.value)}
                            placeholder="Experience the beauty of Sri Lanka with us"
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Instagram Section */}
            <Card className="border-pink-200">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                                <Instagram className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <CardTitle>Instagram</CardTitle>
                                <CardDescription>Connect your Instagram profile</CardDescription>
                            </div>
                        </div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={config.instagram.enabled}
                                onChange={(e) => updateField('instagram', 'enabled', e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm font-medium">Enabled</span>
                        </label>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Username</Label>
                            <Input
                                value={config.instagram.username}
                                onChange={(e) => updateField('instagram', 'username', e.target.value)}
                                placeholder="@rechargetravels"
                            />
                        </div>
                        <div>
                            <Label>Profile URL</Label>
                            <Input
                                value={config.instagram.profileUrl}
                                onChange={(e) => updateField('instagram', 'profileUrl', e.target.value)}
                                placeholder="https://instagram.com/rechargetravels"
                            />
                        </div>
                        <div>
                            <Label>Followers Count</Label>
                            <Input
                                value={config.instagram.followersCount}
                                onChange={(e) => updateField('instagram', 'followersCount', e.target.value)}
                                placeholder="25K+"
                            />
                        </div>
                        <div>
                            <Label>Posts Count</Label>
                            <Input
                                value={config.instagram.postsCount}
                                onChange={(e) => updateField('instagram', 'postsCount', e.target.value)}
                                placeholder="500+"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Facebook Section */}
            <Card className="border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Facebook className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <CardTitle>Facebook</CardTitle>
                                <CardDescription>Connect your Facebook page</CardDescription>
                            </div>
                        </div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={config.facebook.enabled}
                                onChange={(e) => updateField('facebook', 'enabled', e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm font-medium">Enabled</span>
                        </label>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Page Name</Label>
                            <Input
                                value={config.facebook.pageName}
                                onChange={(e) => updateField('facebook', 'pageName', e.target.value)}
                                placeholder="Recharge Travels"
                            />
                        </div>
                        <div>
                            <Label>Page URL</Label>
                            <Input
                                value={config.facebook.pageUrl}
                                onChange={(e) => updateField('facebook', 'pageUrl', e.target.value)}
                                placeholder="https://facebook.com/rechargetravels"
                            />
                        </div>
                        <div>
                            <Label>Followers Count</Label>
                            <Input
                                value={config.facebook.followersCount}
                                onChange={(e) => updateField('facebook', 'followersCount', e.target.value)}
                                placeholder="15K+"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* TikTok Section */}
            <Card className="border-gray-200">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-black rounded-lg">
                                <Send className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <CardTitle>TikTok</CardTitle>
                                <CardDescription>Connect your TikTok profile</CardDescription>
                            </div>
                        </div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={config.tiktok.enabled}
                                onChange={(e) => updateField('tiktok', 'enabled', e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm font-medium">Enabled</span>
                        </label>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Username</Label>
                            <Input
                                value={config.tiktok.username}
                                onChange={(e) => updateField('tiktok', 'username', e.target.value)}
                                placeholder="@rechargetravels"
                            />
                        </div>
                        <div>
                            <Label>Profile URL</Label>
                            <Input
                                value={config.tiktok.profileUrl}
                                onChange={(e) => updateField('tiktok', 'profileUrl', e.target.value)}
                                placeholder="https://tiktok.com/@rechargetravels"
                            />
                        </div>
                        <div>
                            <Label>Followers Count</Label>
                            <Input
                                value={config.tiktok.followersCount}
                                onChange={(e) => updateField('tiktok', 'followersCount', e.target.value)}
                                placeholder="30K+"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* WhatsApp Section */}
            <Card className="border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500 rounded-lg">
                                <MessageCircle className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <CardTitle>WhatsApp Business</CardTitle>
                                <CardDescription>Configure WhatsApp Business integration</CardDescription>
                            </div>
                        </div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={config.whatsapp.enabled}
                                onChange={(e) => updateField('whatsapp', 'enabled', e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm font-medium">Enabled</span>
                        </label>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Business Name</Label>
                            <Input
                                value={config.whatsapp.businessName}
                                onChange={(e) => updateField('whatsapp', 'businessName', e.target.value)}
                                placeholder="Recharge Travels"
                            />
                        </div>
                        <div>
                            <Label>Phone Number</Label>
                            <Input
                                value={config.whatsapp.phoneNumber}
                                onChange={(e) => updateField('whatsapp', 'phoneNumber', e.target.value)}
                                placeholder="+94771234567"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Welcome Message</Label>
                        <Textarea
                            value={config.whatsapp.welcomeMessage}
                            onChange={(e) => updateField('whatsapp', 'welcomeMessage', e.target.value)}
                            placeholder="Hello! Welcome to Recharge Travels..."
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Telegram Section */}
            <Card className="border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500 rounded-lg">
                                <Send className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <CardTitle>Telegram</CardTitle>
                                <CardDescription>Connect your Telegram channel</CardDescription>
                            </div>
                        </div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={config.telegram.enabled}
                                onChange={(e) => updateField('telegram', 'enabled', e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm font-medium">Enabled</span>
                        </label>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Channel Name</Label>
                            <Input
                                value={config.telegram.channelName}
                                onChange={(e) => updateField('telegram', 'channelName', e.target.value)}
                                placeholder="Recharge Travels"
                            />
                        </div>
                        <div>
                            <Label>Channel URL</Label>
                            <Input
                                value={config.telegram.channelUrl}
                                onChange={(e) => updateField('telegram', 'channelUrl', e.target.value)}
                                placeholder="https://t.me/rechargetravels"
                            />
                        </div>
                        <div>
                            <Label>Members Count</Label>
                            <Input
                                value={config.telegram.membersCount}
                                onChange={(e) => updateField('telegram', 'membersCount', e.target.value)}
                                placeholder="5K+"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={saving} size="lg" className="bg-purple-600 hover:bg-purple-700">
                    <Save className="h-5 w-5 mr-2" />
                    {saving ? 'Saving...' : 'Save All Changes'}
                </Button>
            </div>
        </div>
    );
};

export default SocialMediaManager;
