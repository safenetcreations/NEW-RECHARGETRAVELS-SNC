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
    Tv,
    Play,
    GripVertical,
    Linkedin,
    Twitter,
} from 'lucide-react';

// Pinterest icon component (not in lucide)
const PinterestIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
    </svg>
);

interface YouTubeTVVideo {
    id: string;
    url: string;
    title: string;
}

interface SocialMediaConfig {
    youtube: {
        enabled: boolean;
        channelId: string;
        channelName: string;
        livestreamTitle: string;
        livestreamDescription: string;
        livestreamUrl: string;
        subscribersCount: string;
        featuredVideoId: string;
        // YouTube TV Playlist - up to 5 videos that loop on the Connect With Us page
        tvPlaylist: YouTubeTVVideo[];
    };
    instagram: {
        enabled: boolean;
        username: string;
        profileUrl: string;
        followersCount: string;
        postsCount: string;
        postUrl: string;
    };
    facebook: {
        enabled: boolean;
        pageUrl: string;
        pageName: string;
        followersCount: string;
        postUrl: string;
    };
    tiktok: {
        enabled: boolean;
        username: string;
        profileUrl: string;
        followersCount: string;
    };
    linkedin: {
        enabled: boolean;
        companyUrl: string;
        companyName: string;
        followersCount: string;
        latestPostUrl: string;
    };
    pinterest: {
        enabled: boolean;
        username: string;
        profileUrl: string;
        followersCount: string;
        boardsCount: string;
    };
    twitter: {
        enabled: boolean;
        username: string;
        profileUrl: string;
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
    widgets: {
        facebookWidgetId: string;
        instagramWidgetId: string;
        tiktokWidgetId: string;
        allInOneWidgetId: string;
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
        featuredVideoId: '92Np5UkerSQ',
        tvPlaylist: [
            { id: '1', url: 'https://www.youtube.com/watch?v=92Np5UkerSQ', title: 'Recharge Travels Promo' },
        ],
    },
    instagram: {
        enabled: true,
        username: 'rechargetravels',
        profileUrl: 'https://instagram.com/rechargetravels',
        followersCount: '25K+',
        postsCount: '500+',
        postUrl: '',
    },
    facebook: {
        enabled: true,
        pageUrl: 'https://facebook.com/rechargetravels',
        pageName: 'Recharge Travels',
        followersCount: '15K+',
        postUrl: '',
    },
    tiktok: {
        enabled: true,
        username: 'rechargetravels',
        profileUrl: 'https://tiktok.com/@rechargetravels',
        followersCount: '30K+',
    },
    linkedin: {
        enabled: true,
        companyUrl: 'https://www.linkedin.com/company/rechargetravels',
        companyName: 'Recharge Travels',
        followersCount: '2K+',
        latestPostUrl: '',
    },
    pinterest: {
        enabled: true,
        username: 'rechargetravels',
        profileUrl: 'https://www.pinterest.com/rechargetravels',
        followersCount: '5K+',
        boardsCount: '20+',
    },
    twitter: {
        enabled: true,
        username: 'rechargetours',
        profileUrl: 'https://x.com/rechargetours',
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
    widgets: {
        facebookWidgetId: '',
        instagramWidgetId: '',
        tiktokWidgetId: '',
        allInOneWidgetId: '',
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

    // Helper function to extract video ID from YouTube URL
    const extractVideoId = (url: string): string | null => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
            /^([a-zA-Z0-9_-]{11})$/,
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    };

    // TV Playlist management functions
    const addTVVideo = () => {
        if ((config.youtube.tvPlaylist?.length || 0) >= 5) {
            toast.error('Maximum 5 videos allowed in TV playlist');
            return;
        }
        const newVideo: YouTubeTVVideo = {
            id: Date.now().toString(),
            url: '',
            title: '',
        };
        setConfig((prev) => ({
            ...prev,
            youtube: {
                ...prev.youtube,
                tvPlaylist: [...(prev.youtube.tvPlaylist || []), newVideo],
            },
        }));
    };

    const updateTVVideo = (videoId: string, field: keyof YouTubeTVVideo, value: string) => {
        setConfig((prev) => ({
            ...prev,
            youtube: {
                ...prev.youtube,
                tvPlaylist: (prev.youtube.tvPlaylist || []).map((video) =>
                    video.id === videoId ? { ...video, [field]: value } : video
                ),
            },
        }));
    };

    const removeTVVideo = (videoId: string) => {
        setConfig((prev) => ({
            ...prev,
            youtube: {
                ...prev.youtube,
                tvPlaylist: (prev.youtube.tvPlaylist || []).filter((video) => video.id !== videoId),
            },
        }));
    };

    const moveTVVideo = (index: number, direction: 'up' | 'down') => {
        const playlist = [...(config.youtube.tvPlaylist || [])];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= playlist.length) return;
        [playlist[index], playlist[newIndex]] = [playlist[newIndex], playlist[index]];
        setConfig((prev) => ({
            ...prev,
            youtube: {
                ...prev.youtube,
                tvPlaylist: playlist,
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

            {/* Live Feed Widgets Section */}
            <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500 rounded-lg">
                            <RefreshCw className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-emerald-800">🔴 Live Feed Widget IDs (Elfsight)</CardTitle>
                            <CardDescription className="text-emerald-600">
                                Get free widget IDs from elfsight.com for automatic live social feeds
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Facebook Widget ID</Label>
                            <Input
                                value={config.widgets?.facebookWidgetId || ''}
                                onChange={(e) => updateField('widgets', 'facebookWidgetId', e.target.value)}
                                placeholder="e.g., abc123def456"
                            />
                        </div>
                        <div>
                            <Label>Instagram Widget ID</Label>
                            <Input
                                value={config.widgets?.instagramWidgetId || ''}
                                onChange={(e) => updateField('widgets', 'instagramWidgetId', e.target.value)}
                                placeholder="e.g., xyz789ghi012"
                            />
                        </div>
                        <div>
                            <Label>TikTok Widget ID</Label>
                            <Input
                                value={config.widgets?.tiktokWidgetId || ''}
                                onChange={(e) => updateField('widgets', 'tiktokWidgetId', e.target.value)}
                                placeholder="e.g., tik123tok456"
                            />
                        </div>
                        <div>
                            <Label>All-in-One Social Wall</Label>
                            <Input
                                value={config.widgets?.allInOneWidgetId || ''}
                                onChange={(e) => updateField('widgets', 'allInOneWidgetId', e.target.value)}
                                placeholder="e.g., wall789abc123"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-emerald-600">Visit elfsight.com, create a free widget, and paste the ID here for automatic live feeds</p>
                </CardContent>
            </Card>

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

            {/* YouTube TV Playlist Section */}
            <Card className="border-red-300 bg-gradient-to-br from-red-50 to-orange-50">
                <CardHeader className="bg-gradient-to-r from-red-100 to-orange-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg">
                                <Tv className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    YouTube TV Display
                                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">HD</span>
                                </CardTitle>
                                <CardDescription>Add up to 5 YouTube videos to loop on the Connect With Us TV display</CardDescription>
                            </div>
                        </div>
                        <Button onClick={addTVVideo} size="sm" className="bg-red-600 hover:bg-red-700" disabled={(config.youtube.tvPlaylist?.length || 0) >= 5}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Video
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="bg-white/80 rounded-lg p-4 border border-red-200">
                        <p className="text-sm text-gray-600 mb-2">
                            <strong>How it works:</strong> Paste YouTube video URLs below. These videos will play in HD quality and loop continuously on the TV display on the Connect With Us page.
                        </p>
                        <p className="text-xs text-gray-500">
                            Supported formats: youtube.com/watch?v=VIDEO_ID, youtu.be/VIDEO_ID, or just the video ID
                        </p>
                    </div>

                    {(!config.youtube.tvPlaylist || config.youtube.tvPlaylist.length === 0) ? (
                        <div className="text-center py-8 border-2 border-dashed border-red-200 rounded-lg">
                            <Tv className="h-12 w-12 text-red-300 mx-auto mb-3" />
                            <p className="text-gray-500">No videos added yet</p>
                            <p className="text-sm text-gray-400">Click "Add Video" to add your first YouTube video</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {config.youtube.tvPlaylist.map((video, index) => {
                                const videoId = extractVideoId(video.url);
                                return (
                                    <div key={video.id} className="bg-white rounded-lg border border-red-200 p-4 shadow-sm">
                                        <div className="flex items-start gap-4">
                                            {/* Reorder buttons */}
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    onClick={() => moveTVVideo(index, 'up')}
                                                    disabled={index === 0}
                                                    className="p-1 hover:bg-red-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Move up"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                    </svg>
                                                </button>
                                                <div className="text-center text-xs font-bold text-red-600">{index + 1}</div>
                                                <button
                                                    onClick={() => moveTVVideo(index, 'down')}
                                                    disabled={index === config.youtube.tvPlaylist.length - 1}
                                                    className="p-1 hover:bg-red-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Move down"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Video thumbnail preview */}
                                            <div className="w-32 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                {videoId ? (
                                                    <img
                                                        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                                        alt="Video thumbnail"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <Play className="h-8 w-8" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Video inputs */}
                                            <div className="flex-1 space-y-2">
                                                <div>
                                                    <Label className="text-xs">Video URL</Label>
                                                    <Input
                                                        value={video.url}
                                                        onChange={(e) => updateTVVideo(video.id, 'url', e.target.value)}
                                                        placeholder="https://www.youtube.com/watch?v=... or video ID"
                                                        className="h-9"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs">Title (optional)</Label>
                                                    <Input
                                                        value={video.title}
                                                        onChange={(e) => updateTVVideo(video.id, 'title', e.target.value)}
                                                        placeholder="Video title for reference"
                                                        className="h-9"
                                                    />
                                                </div>
                                            </div>

                                            {/* Delete button */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeTVVideo(video.id)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Video preview link */}
                                        {videoId && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <a
                                                    href={`https://www.youtube.com/watch?v=${videoId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-red-600 hover:underline flex items-center gap-1"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    Preview on YouTube
                                                </a>
                                                <span className="text-xs text-gray-400">• Video ID: {videoId}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-red-200">
                        <p className="text-sm text-gray-500">
                            {config.youtube.tvPlaylist?.length || 0} / 5 videos
                        </p>
                        {(config.youtube.tvPlaylist?.length || 0) > 0 && (
                            <p className="text-sm text-green-600 flex items-center gap-1">
                                <Play className="h-4 w-4" />
                                Videos will play in HD and loop automatically
                            </p>
                        )}
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
                    <div className="mt-4">
                        <Label>Latest Post URL</Label>
                        <Input
                            value={config.instagram.postUrl || ''}
                            onChange={(e) => updateField('instagram', 'postUrl', e.target.value)}
                            placeholder="https://www.instagram.com/p/ABC123..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Paste the full URL of your Instagram post (e.g., https://www.instagram.com/p/ABC123/)
                        </p>
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
                    <div className="mt-4">
                        <Label>Latest Post Embed URL</Label>
                        <Input
                            value={config.facebook.postUrl || ''}
                            onChange={(e) => updateField('facebook', 'postUrl', e.target.value)}
                            placeholder="https://www.facebook.com/plugins/post.php?href=..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            To get this URL: Go to your Facebook post → Click "..." → Embed → Copy the URL from the iframe src attribute
                        </p>
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

            {/* LinkedIn Section */}
            <Card className="border-blue-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-700 rounded-lg">
                                <Linkedin className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <CardTitle>LinkedIn</CardTitle>
                                <CardDescription>Connect your LinkedIn company page</CardDescription>
                            </div>
                        </div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={config.linkedin?.enabled ?? true}
                                onChange={(e) => updateField('linkedin', 'enabled', e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm font-medium">Enabled</span>
                        </label>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Company Name</Label>
                            <Input
                                value={config.linkedin?.companyName || ''}
                                onChange={(e) => updateField('linkedin', 'companyName', e.target.value)}
                                placeholder="Recharge Travels"
                            />
                        </div>
                        <div>
                            <Label>Company URL</Label>
                            <Input
                                value={config.linkedin?.companyUrl || ''}
                                onChange={(e) => updateField('linkedin', 'companyUrl', e.target.value)}
                                placeholder="https://linkedin.com/company/rechargetravels"
                            />
                        </div>
                        <div>
                            <Label>Followers Count</Label>
                            <Input
                                value={config.linkedin?.followersCount || ''}
                                onChange={(e) => updateField('linkedin', 'followersCount', e.target.value)}
                                placeholder="2K+"
                            />
                        </div>
                        <div>
                            <Label>Latest Post Embed URL</Label>
                            <Input
                                value={config.linkedin?.latestPostUrl || ''}
                                onChange={(e) => updateField('linkedin', 'latestPostUrl', e.target.value)}
                                placeholder="LinkedIn post embed URL"
                            />
                            <p className="text-xs text-gray-500 mt-1">Paste the embed URL of your latest LinkedIn post</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pinterest Section */}
            <Card className="border-red-200">
                <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-600 rounded-lg">
                                <PinterestIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <CardTitle>Pinterest</CardTitle>
                                <CardDescription>Connect your Pinterest profile</CardDescription>
                            </div>
                        </div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={config.pinterest?.enabled ?? true}
                                onChange={(e) => updateField('pinterest', 'enabled', e.target.checked)}
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
                                value={config.pinterest?.username || ''}
                                onChange={(e) => updateField('pinterest', 'username', e.target.value)}
                                placeholder="rechargetravels"
                            />
                        </div>
                        <div>
                            <Label>Profile URL</Label>
                            <Input
                                value={config.pinterest?.profileUrl || ''}
                                onChange={(e) => updateField('pinterest', 'profileUrl', e.target.value)}
                                placeholder="https://pinterest.com/rechargetravels"
                            />
                        </div>
                        <div>
                            <Label>Followers Count</Label>
                            <Input
                                value={config.pinterest?.followersCount || ''}
                                onChange={(e) => updateField('pinterest', 'followersCount', e.target.value)}
                                placeholder="5K+"
                            />
                        </div>
                        <div>
                            <Label>Boards Count</Label>
                            <Input
                                value={config.pinterest?.boardsCount || ''}
                                onChange={(e) => updateField('pinterest', 'boardsCount', e.target.value)}
                                placeholder="20+"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Twitter/X Section */}
            <Card className="border-slate-300">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-black rounded-lg">
                                <Twitter className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <CardTitle>X / Twitter</CardTitle>
                                <CardDescription>Connect your Twitter profile - Latest tweets auto-display</CardDescription>
                            </div>
                        </div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={config.twitter?.enabled ?? true}
                                onChange={(e) => updateField('twitter', 'enabled', e.target.checked)}
                                className="rounded"
                            />
                            <span className="text-sm font-medium">Enabled</span>
                        </label>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Username (without @)</Label>
                            <Input
                                value={config.twitter?.username || ''}
                                onChange={(e) => updateField('twitter', 'username', e.target.value)}
                                placeholder="rechargetravels"
                            />
                            <p className="text-xs text-gray-500 mt-1">Your Twitter handle without the @ symbol</p>
                        </div>
                        <div>
                            <Label>Profile URL</Label>
                            <Input
                                value={config.twitter?.profileUrl || ''}
                                onChange={(e) => updateField('twitter', 'profileUrl', e.target.value)}
                                placeholder="https://twitter.com/rechargetravels"
                            />
                        </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Auto Live Feed:</strong> Your latest tweets will automatically display on the Connect With Us page using Twitter's timeline widget.
                        </p>
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
