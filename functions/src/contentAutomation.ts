import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { format } from 'date-fns';

const db = admin.firestore();

// Daily content automation function (replaces Supabase daily-content-automation)
export const dailyContentAutomation = functions.pubsub
  .schedule('0 9 * * *') // Run at 9 AM daily
  .timeZone('Asia/Colombo')
  .onRun(async (context) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const results: any[] = [];

    try {
      // Get today's content from calendar
      const scheduledContent = await db.collection('contentCalendar')
        .where('targetDate', '==', today)
        .where('status', '==', 'planned')
        .orderBy('priority', 'desc')
        .get();

      const contentToGenerate: any[] = scheduledContent.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // If no scheduled content, generate random content
      if (contentToGenerate.length === 0) {
        const categoriesSnapshot = await db.collection('categories')
          .where('isBlogCategory', '==', true)
          .get();

        const categories: any[] = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Topic pools for each category
        const topicsByCategory: Record<string, string[]> = {
          'Destinations & Regions': [
            'Hidden Waterfalls in Ella - A Complete Guide',
            'Discovering Ancient Polonnaruwa - UNESCO World Heritage Site',
            'Mirissa Beach - The Ultimate Guide to Sri Lanka\'s Whale Watching Capital',
            'Nuwara Eliya - Little England in the Hills',
            'Unawatuna Bay - Paradise Found in Southern Sri Lanka'
          ],
          'Wildlife & Nature': [
            'Leopard Spotting in Wilpattu National Park',
            'Elephant Gathering at Minneriya - Nature\'s Greatest Show',
            'Blue Whale Watching Off Sri Lanka\'s Coast',
            'Bird Watching Paradise - Sinharaja Forest Reserve',
            'Turtle Conservation in Kosgoda - Protecting Ancient Mariners'
          ],
          'Culture & Traditions': [
            'Vesak Festival - Celebrating Buddha\'s Life in Sri Lanka',
            'Traditional Kandyan Dancing - Ancient Arts Alive',
            'Mask Making in Ambalangoda - Cultural Craft Heritage',
            'Buddhist Meditation Retreats in Ancient Temples',
            'Perahera Festival - The Grand Procession of Kandy'
          ],
          'Food & Cuisine': [
            'Street Food Adventures in Colombo - A Foodie\'s Guide',
            'Traditional Hoppers - Sri Lanka\'s Beloved Breakfast',
            'Spice Garden Tours - From Farm to Table',
            'Ceylon Tea Tasting in the Hill Country',
            'Fresh Seafood Delights Along the Coast'
          ],
          'Adventure & Activities': [
            'Rock Climbing at Ella Rock - Adventure in the Hills',
            'Surfing in Arugam Bay - Riding Perfect Waves',
            'White Water Rafting in Kitulgala - Jungle Adventure',
            'Scuba Diving in Pigeon Island - Underwater Paradise',
            'Cycling Through Tea Plantations - Eco-Friendly Exploration'
          ]
        };

        // Select 2 random categories and topics
        const randomCategories = categories.sort(() => Math.random() - 0.5).slice(0, 2);
        
        for (const category of randomCategories) {
          const topics = topicsByCategory[category.name] || [`Exploring ${category.name} in Sri Lanka`];
          const randomTopic = topics[Math.floor(Math.random() * topics.length)];
          
          contentToGenerate.push({
            id: `auto-${Date.now()}-${category.id}`,
            categoryId: category.id,
            topic: randomTopic,
            keywords: category.seoKeywords || [`sri lanka ${category.name.toLowerCase()}`],
            targetDate: today,
            status: 'planned',
            priority: 1,
            contentBrief: `Automated daily content for ${category.name}`,
            category: category
          });
        }
      }

      // Generate content for each scheduled item (limit to 2 posts per day)
      for (const item of contentToGenerate.slice(0, 2)) {
        try {
          // Update status to generating
          if (!item.id.startsWith('auto-')) {
            await db.collection('contentCalendar').doc(item.id).update({
              status: 'generating'
            });
          }

          // Call content generation function
          const articleData = await generateBlogContent({
            topic: item.topic,
            categoryId: item.categoryId,
            keywords: item.keywords || [],
            autoPublish: true
          });

          // Update content calendar with article ID
          if (!item.id.startsWith('auto-') && articleData.articleId) {
            await db.collection('contentCalendar').doc(item.id).update({
              status: 'published',
              articleId: articleData.articleId
            });
          }

          results.push({
            topic: item.topic,
            category: item.category?.name,
            articleId: articleData.articleId,
            status: 'success'
          });

        } catch (error: any) {
          console.error(`Error generating content for "${item.topic}":`, error);
          
          // Update status to failed
          if (!item.id.startsWith('auto-')) {
            await db.collection('contentCalendar').doc(item.id).update({
              status: 'failed'
            });
          }

          results.push({
            topic: item.topic,
            category: item.category?.name,
            status: 'failed',
            error: error.message
          });
        }
      }

      // Schedule tomorrow's content if none exists
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = format(tomorrow, 'yyyy-MM-dd');

      const tomorrowContent = await db.collection('contentCalendar')
        .where('targetDate', '==', tomorrowDate)
        .get();

      if (tomorrowContent.empty) {
        // Auto-schedule content for tomorrow
        const categoriesSnapshot = await db.collection('categories')
          .where('isBlogCategory', '==', true)
          .get();

        const categories: any[] = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const randomCategories = categories.sort(() => Math.random() - 0.5).slice(0, 2);

        const topicsPool = [
          'Hidden Gems Off the Beaten Path',
          'Local Traditions and Cultural Experiences',
          'Best Photography Spots for Instagram',
          'Budget Travel Tips and Tricks',
          'Luxury Experiences Worth the Splurge',
          'Family-Friendly Adventures',
          'Solo Traveler\'s Paradise',
          'Romantic Getaway Ideas',
          'Adventure Sports and Activities',
          'Sustainable Tourism Practices'
        ];

        const batch = db.batch();
        
        for (const category of randomCategories) {
          const baseTopic = topicsPool[Math.floor(Math.random() * topicsPool.length)];
          const topic = `${baseTopic} in ${category.name}`;
          
          const docRef = db.collection('contentCalendar').doc();
          batch.set(docRef, {
            categoryId: category.id,
            topic: topic,
            keywords: category.seoKeywords || [`sri lanka ${category.name.toLowerCase()}`],
            targetDate: tomorrowDate,
            status: 'planned',
            priority: 1,
            contentBrief: `Auto-scheduled content for ${category.name}`,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
        
        await batch.commit();
      }

      console.log(`Daily content automation completed. Generated ${results.length} pieces of content.`);
      return results;

    } catch (error) {
      console.error('Daily automation error:', error);
      throw error;
    }
  });

// Helper function to generate blog content
async function generateBlogContent(data: any): Promise<any> {
  // This would integrate with your AI service (OpenAI, Gemini, etc.)
  // For now, returning mock data
  const articleRef = await db.collection('articles').add({
    title: data.topic,
    categoryId: data.categoryId,
    keywords: data.keywords,
    status: 'published',
    publishedAt: admin.firestore.FieldValue.serverTimestamp(),
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // If autoPublish is true, schedule social media posts
  if (data.autoPublish) {
    await scheduleSocialMediaPosts({
      articleId: articleRef.id,
      title: data.topic,
      excerpt: `Discover the beauty of Sri Lanka with our latest article about ${data.topic}`,
      category: data.categoryId
    });
  }

  return {
    articleId: articleRef.id,
    success: true
  };
}

// Schedule social media posts
async function scheduleSocialMediaPosts(data: any): Promise<void> {
  const platforms = ['facebook', 'instagram', 'twitter', 'linkedin'];
  const batch = db.batch();

  for (const platform of platforms) {
    const postRef = db.collection('socialPosts').doc();
    batch.set(postRef, {
      articleId: data.articleId,
      platform: platform,
      content: `New article: ${data.title}\n\n${data.excerpt}\n\nRead more: https://www.rechargetravels.com/blog/${data.articleId}`,
      scheduledFor: getScheduledTime(platform),
      status: 'scheduled',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  await batch.commit();
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
