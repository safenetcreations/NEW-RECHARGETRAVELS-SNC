"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleSocialPost = exports.generateSEOContent = exports.generateBlogContent = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
// Generate blog content using AI
exports.generateBlogContent = functions.https.onCall(async (data, context) => {
    const { topic, categoryId, keywords, autoPublish } = data;
    try {
        // Here you would integrate with your AI service (OpenAI, Gemini, etc.)
        // For now, creating a placeholder article
        const articleData = {
            title: topic,
            categoryId,
            keywords,
            content: `Generated content for: ${topic}`,
            excerpt: `Learn about ${topic} in Sri Lanka`,
            status: 'published',
            publishedAt: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            author: 'AI Content Generator',
            seo: {
                metaTitle: topic,
                metaDescription: `Comprehensive guide about ${topic} in Sri Lanka`,
                keywords: keywords
            }
        };
        const articleRef = await db.collection('articles').add(articleData);
        // If autoPublish is true, schedule social media posts
        if (autoPublish) {
            await scheduleSocialMediaPosts({
                articleId: articleRef.id,
                title: topic,
                excerpt: articleData.excerpt,
                category: categoryId
            });
        }
        return {
            success: true,
            articleId: articleRef.id,
            article: articleData
        };
    }
    catch (error) {
        console.error('Error generating content:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
// Generate SEO content
exports.generateSEOContent = functions.https.onCall(async (data, context) => {
    const { articleId, title, content } = data;
    try {
        // Here you would integrate with your AI service for SEO generation
        const seoData = {
            metaTitle: `${title} | Recharge Travels Sri Lanka`,
            metaDescription: `Discover ${title}. Expert travel guide with tips, recommendations and insider knowledge.`,
            keywords: ['sri lanka', 'travel', 'tourism', title.toLowerCase()],
            schema: {
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: title,
                author: 'Recharge Travels',
                publisher: {
                    '@type': 'Organization',
                    name: 'Recharge Travels Sri Lanka'
                }
            }
        };
        // Update the article with SEO data
        await db.collection('articles').doc(articleId).update({
            seo: seoData,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return {
            success: true,
            seo: seoData
        };
    }
    catch (error) {
        console.error('Error generating SEO:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
// Schedule social media posts
exports.scheduleSocialPost = functions.https.onCall(async (data, context) => {
    const { articleId, title, excerpt, category } = data;
    try {
        const platforms = ['facebook', 'instagram', 'twitter', 'linkedin'];
        const scheduledPosts = [];
        for (const platform of platforms) {
            const postData = {
                articleId,
                platform,
                content: formatPostContent(platform, title, excerpt, articleId),
                scheduledFor: getScheduledTime(platform),
                status: 'scheduled',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            };
            const postRef = await db.collection('socialPosts').add(postData);
            scheduledPosts.push(Object.assign({ id: postRef.id }, postData));
        }
        return {
            success: true,
            scheduledPosts
        };
    }
    catch (error) {
        console.error('Error scheduling posts:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
// Helper function to schedule social media posts
async function scheduleSocialMediaPosts(data) {
    await (0, exports.scheduleSocialPost)(data, {});
}
// Format post content based on platform
function formatPostContent(platform, title, excerpt, articleId) {
    const url = `https://www.rechargetravels.com/blog/${articleId}`;
    switch (platform) {
        case 'twitter':
            return `${title}\n\n${excerpt.substring(0, 200)}...\n\n${url} #SriLanka #Travel`;
        case 'facebook':
        case 'linkedin':
            return `${title}\n\n${excerpt}\n\nRead more: ${url}\n\n#SriLanka #TravelGuide #Tourism`;
        case 'instagram':
            return `${title} 🌴\n\n${excerpt}\n\nLink in bio for full article!\n\n#SriLanka #Travel #Wanderlust #TravelGram`;
        default:
            return `${title}\n\n${excerpt}\n\n${url}`;
    }
}
// Get scheduled time based on platform
function getScheduledTime(platform) {
    const now = new Date();
    const schedulingMap = {
        'twitter': 0.25,
        'facebook': 0.5,
        'instagram': 1,
        'linkedin': 2, // 2 hours
    };
    const hoursDelay = schedulingMap[platform] || 1;
    return new Date(now.getTime() + (hoursDelay * 60 * 60 * 1000));
}
//# sourceMappingURL=contentGeneration.js.map