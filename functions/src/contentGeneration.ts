import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

// Generate blog content using AI
export const generateBlogContent = functions.https.onCall(async (data, context) => {
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
  } catch (error: any) {
    console.error('Error generating content:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Generate SEO content
export const generateSEOContent = functions.https.onCall(async (data, context) => {
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
  } catch (error: any) {
    console.error('Error generating SEO:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Schedule social media posts
export const scheduleSocialPost = functions.https.onCall(async (data, context) => {
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
      scheduledPosts.push({ id: postRef.id, ...postData });
    }

    return {
      success: true,
      scheduledPosts
    };
  } catch (error: any) {
    console.error('Error scheduling posts:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Helper function to schedule social media posts
async function scheduleSocialMediaPosts(data: any): Promise<void> {
  await scheduleSocialPost(data, {} as any);
}

// Format post content based on platform
function formatPostContent(platform: string, title: string, excerpt: string, articleId: string): string {
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
function getScheduledTime(platform: string): Date {
  const now = new Date();
  const schedulingMap: Record<string, number> = {
    'twitter': 0.25, // 15 minutes
    'facebook': 0.5, // 30 minutes
    'instagram': 1, // 1 hour
    'linkedin': 2, // 2 hours
  };

  const hoursDelay = schedulingMap[platform] || 1;
  return new Date(now.getTime() + (hoursDelay * 60 * 60 * 1000));
}
