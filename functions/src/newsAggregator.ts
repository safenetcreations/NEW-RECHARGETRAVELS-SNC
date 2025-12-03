import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Parser from 'rss-parser';

// Initialize if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const parser = new Parser({
  customFields: {
    item: ['media:content', 'media:thumbnail', 'enclosure']
  },
  timeout: 15000, // 15 second timeout per feed
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; RechargeBot/1.0; +https://rechargetravels.com)',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
  }
});

// Sri Lanka Tourism News Sources - RSS Feeds
const NEWS_SOURCES = [
  // === GOVERNMENT & OFFICIAL SOURCES ===
  {
    id: 'sltda',
    name: 'Sri Lanka Tourism (SLTDA)',
    url: 'https://www.srilanka.travel/feed/',
    category: 'government',
    priority: 1
  },
  {
    id: 'sltpb',
    name: 'Sri Lanka Tourism Promotion',
    url: 'https://www.sltpb.org/feed/',
    category: 'government',
    priority: 1
  },
  {
    id: 'gov',
    name: 'Government News',
    url: 'https://www.news.lk/rss.xml',
    category: 'government',
    priority: 1
  },
  
  // === MAJOR NEWS OUTLETS ===
  {
    id: 'dailymirror',
    name: 'Daily Mirror - Travel',
    url: 'https://www.dailymirror.lk/RSS_Feeds/travel-rss/247',
    category: 'media',
    priority: 1
  },
  {
    id: 'dailymirror_business',
    name: 'Daily Mirror - Business',
    url: 'https://www.dailymirror.lk/RSS_Feeds/business-rss/215',
    category: 'business',
    priority: 2
  },
  {
    id: 'sundaytimes',
    name: 'Sunday Times - Travel',
    url: 'https://www.sundaytimes.lk/rss/travel.xml',
    category: 'media',
    priority: 1
  },
  {
    id: 'island',
    name: 'The Island',
    url: 'https://island.lk/feed/',
    category: 'media',
    priority: 2
  },
  {
    id: 'adaderana',
    name: 'Ada Derana',
    url: 'https://www.adaderana.lk/rss.php',
    category: 'media',
    priority: 1
  },
  {
    id: 'newsfirst',
    name: 'NewsFirst',
    url: 'https://www.newsfirst.lk/feed/',
    category: 'media',
    priority: 1
  },
  {
    id: 'ceylontoday',
    name: 'Ceylon Today',
    url: 'https://ceylontoday.lk/feed/',
    category: 'media',
    priority: 2
  },
  {
    id: 'colombogazette',
    name: 'Colombo Gazette',
    url: 'https://colombogazette.com/feed/',
    category: 'media',
    priority: 2
  },
  
  // === BUSINESS & ECONOMY ===
  {
    id: 'economynext',
    name: 'EconomyNext',
    url: 'https://economynext.com/feed/',
    category: 'business',
    priority: 2
  },
  {
    id: 'ft',
    name: 'Daily FT',
    url: 'https://www.ft.lk/rss/1',
    category: 'business',
    priority: 2
  },
  {
    id: 'lankabusinessonline',
    name: 'Lanka Business Online',
    url: 'https://www.lankabusinessonline.com/feed/',
    category: 'business',
    priority: 2
  },
  
  // === TRAVEL & HOSPITALITY ===
  {
    id: 'roar',
    name: 'Roar Media',
    url: 'https://roar.media/english/feed/',
    category: 'media',
    priority: 2
  },
  {
    id: 'pulse',
    name: 'Pulse.lk',
    url: 'https://www.pulse.lk/feed/',
    category: 'media',
    priority: 2
  }
];

// Tourism-related keywords to filter relevant news
// Now includes travel advisories, weather, and general Sri Lanka news relevant to travelers
const TOURISM_KEYWORDS = [
  // Core tourism terms
  'tourism', 'tourist', 'travel', 'hotel', 'resort', 'airline', 'flight',
  'visa', 'airport', 'beach', 'heritage', 'wildlife', 'safari', 'whale',
  'dolphin', 'elephant', 'sigiriya', 'kandy', 'galle', 'colombo', 'negombo',
  'mirissa', 'ella', 'nuwara eliya', 'arugam', 'trincomalee', 'jaffna',
  'temple', 'monastery', 'buddhist', 'pilgrimage', 'ayurveda', 'spa',
  'cruise', 'yacht', 'diving', 'surfing', 'hiking', 'trekking',
  'ministry of tourism', 'sltda', 'tourism board', 'foreign tourist',
  'arrival', 'visitor', 'traveler', 'backpacker', 'luxury', 'boutique',
  'eco tourism', 'sustainable', 'adventure', 'cultural', 'heritage site',
  'unesco', 'world heritage', 'national park', 'reservation',
  'sri lanka', 'ceylon', 'pearl of indian ocean',
  // Travel advisories & safety (important for travelers)
  'travel advisory', 'safety', 'weather warning', 'flood', 'cyclone',
  'road closure', 'expressway', 'train service', 'railway',
  'emergency', 'disaster', 'evacuation', 'relief',
  // Transport
  'bandaranaike', 'katunayake', 'mattala', 'ratmalana',
  'srilankan airlines', 'transport', 'bus service',
  // Economy & business affecting tourism
  'exchange rate', 'currency', 'economy', 'investment',
  // Events & festivals
  'perahera', 'vesak', 'poson', 'festival', 'celebration',
  // General locations travelers visit
  'polonnaruwa', 'anuradhapura', 'dambulla', 'bentota', 'hikkaduwa',
  'unawatuna', 'tangalle', 'yala', 'udawalawe', 'minneriya', 'wilpattu'
];

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  source: string;
  sourceId: string;
  sourceUrl: string;
  url: string;
  imageUrl: string | null;
  publishedAt: admin.firestore.Timestamp;
  fetchedAt: admin.firestore.Timestamp;
  category: string;
  tags: string[];
  relevanceScore: number;
  isActive: boolean;
}

// Calculate relevance score based on keyword matches
function calculateRelevance(title: string, content: string): { score: number; tags: string[] } {
  const text = `${title} ${content}`.toLowerCase();
  const matchedTags: string[] = [];
  let score = 0;

  for (const keyword of TOURISM_KEYWORDS) {
    if (text.includes(keyword.toLowerCase())) {
      score += keyword.split(' ').length; // Multi-word keywords get higher score
      matchedTags.push(keyword);
    }
  }

  return { score, tags: [...new Set(matchedTags)] };
}

// Extract image from RSS item
function extractImage(item: any): string | null {
  // Try different image fields
  if (item['media:content']?.$.url) return item['media:content'].$.url;
  if (item['media:thumbnail']?.$.url) return item['media:thumbnail'].$.url;
  if (item.enclosure?.url) return item.enclosure.url;
  
  // Try to extract from content
  const imgMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
  if (imgMatch) return imgMatch[1];
  
  return null;
}

// Generate unique ID for article using hash to avoid collisions
function generateArticleId(url: string): string {
  // Use a simple hash function to create unique IDs from URLs
  const crypto = require('crypto');
  return crypto.createHash('md5').update(url).digest('hex');
}

// Fetch news from a single source
async function fetchFromSource(source: typeof NEWS_SOURCES[0]): Promise<NewsArticle[]> {
  const articles: NewsArticle[] = [];
  
  try {
    console.log(`Fetching from ${source.name}...`);
    const feed = await parser.parseURL(source.url);
    
    for (const item of feed.items.slice(0, 20)) { // Get latest 20 items per source
      if (!item.title || !item.link) continue;
      
      const content = item.contentSnippet || item.content || '';
      const { score, tags } = calculateRelevance(item.title, content);

      // Include all articles from priority 1 sources, or if they have tourism relevance
      // This ensures we always get some content from major news sources
      const isPrioritySource = source.priority === 1;
      if (score < 1 && !isPrioritySource) continue;
      
      const articleId = generateArticleId(item.link);
      
      // Check if article already exists
      const existing = await db.collection('tourismNews').doc(articleId).get();
      if (existing.exists) continue;
      
      const article: NewsArticle = {
        id: articleId,
        title: item.title,
        content: content.substring(0, 2000), // Limit content length
        summary: content.substring(0, 300),
        source: source.name,
        sourceId: source.id,
        sourceUrl: source.url,
        url: item.link,
        imageUrl: extractImage(item),
        publishedAt: admin.firestore.Timestamp.fromDate(
          item.pubDate ? new Date(item.pubDate) : new Date()
        ),
        fetchedAt: admin.firestore.Timestamp.now(),
        category: source.category,
        tags,
        relevanceScore: score,
        isActive: true
      };
      
      articles.push(article);
    }
    
    console.log(`Found ${articles.length} new articles from ${source.name}`);
  } catch (error) {
    console.error(`Error fetching from ${source.name}:`, error);
  }
  
  return articles;
}

// Main aggregator function - parallelized for better performance
async function aggregateNews(): Promise<{ total: number; sources: number }> {
  console.log('Starting news aggregation...');

  // Fetch from all sources in parallel (batch of 5 at a time to avoid rate limiting)
  const batchSize = 5;
  let totalArticles = 0;
  let successfulSources = 0;

  for (let i = 0; i < NEWS_SOURCES.length; i += batchSize) {
    const batch = NEWS_SOURCES.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(source => fetchFromSource(source))
    );

    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      const source = batch[j];

      if (result.status === 'fulfilled' && result.value.length > 0) {
        try {
          // Save articles to Firestore
          const firestoreBatch = db.batch();
          for (const article of result.value) {
            const ref = db.collection('tourismNews').doc(article.id);
            firestoreBatch.set(ref, article);
          }
          await firestoreBatch.commit();

          totalArticles += result.value.length;
          successfulSources++;
          console.log(`Saved ${result.value.length} articles from ${source.name}`);
        } catch (error) {
          console.error(`Failed to save articles from ${source.name}:`, error);
        }
      } else if (result.status === 'rejected') {
        console.error(`Failed to fetch from ${source.name}:`, result.reason);
      }
    }
  }

  // Update last fetch timestamp
  await db.collection('settings').doc('newsAggregator').set({
    lastFetch: admin.firestore.Timestamp.now(),
    totalArticles,
    successfulSources,
    lastFetchDate: new Date().toISOString()
  }, { merge: true });

  console.log(`Aggregation complete: ${totalArticles} articles from ${successfulSources} sources`);

  return { total: totalArticles, sources: successfulSources };
}

// Runtime options for longer timeout and more memory
const runtimeOpts: functions.RuntimeOptions = {
  timeoutSeconds: 300, // 5 minutes timeout
  memory: '512MB'
};

// Scheduled function - Runs at 9 AM Sri Lanka time (3:30 AM UTC)
export const morningNewsAggregator = functions
  .region('asia-south1')
  .runWith(runtimeOpts)
  .pubsub
  .schedule('30 3 * * *') // 3:30 AM UTC = 9:00 AM Sri Lanka
  .timeZone('Asia/Colombo')
  .onRun(async () => {
    console.log('Running morning news aggregation (9 AM Sri Lanka time)');
    return aggregateNews();
  });

// Scheduled function - Runs at 6 PM Sri Lanka time (12:30 PM UTC)
export const eveningNewsAggregator = functions
  .region('asia-south1')
  .runWith(runtimeOpts)
  .pubsub
  .schedule('30 12 * * *') // 12:30 PM UTC = 6:00 PM Sri Lanka
  .timeZone('Asia/Colombo')
  .onRun(async () => {
    console.log('Running evening news aggregation (6 PM Sri Lanka time)');
    return aggregateNews();
  });

// HTTP trigger for manual fetch (public access with rate limiting)
export const manualNewsFetch = functions
  .region('asia-south1')
  .runWith(runtimeOpts)
  .https.onCall(async (_data, context) => {
    // Rate limiting: Check last fetch time
    const settingsDoc = await db.collection('settings').doc('newsAggregator').get();
    const settings = settingsDoc.data();

    if (settings?.lastFetch) {
      const lastFetchTime = settings.lastFetch.toDate();
      const now = new Date();
      const minutesSinceLastFetch = (now.getTime() - lastFetchTime.getTime()) / (1000 * 60);

      // Allow fetch only if more than 5 minutes since last fetch
      if (minutesSinceLastFetch < 5) {
        const waitMinutes = Math.ceil(5 - minutesSinceLastFetch);
        return {
          total: settings.totalArticles || 0,
          sources: settings.successfulSources || 0,
          cached: true,
          message: `News was fetched recently. Next fetch available in ${waitMinutes} minutes.`
        };
      }
    }

    console.log('Manual news fetch triggered by:', context.auth?.uid || 'anonymous');
    return aggregateNews();
  });

// Get news sources configuration
export const getNewsSources = functions
  .region('asia-south1')
  .https.onCall(async () => {
    return NEWS_SOURCES;
  });

// Force refresh - clears lastFetch to allow immediate re-fetch and activates all articles
export const forceNewsRefresh = functions
  .region('asia-south1')
  .runWith(runtimeOpts)
  .https.onCall(async () => {
    console.log('Force refresh triggered');

    // Reset lastFetch to allow immediate re-fetch
    await db.collection('settings').doc('newsAggregator').set({
      lastFetch: null
    }, { merge: true });

    // Activate all existing articles
    const snapshot = await db.collection('tourismNews').get();
    const batch = db.batch();
    let activated = 0;

    snapshot.docs.forEach(doc => {
      if (doc.data().isActive === false) {
        batch.update(doc.ref, { isActive: true });
        activated++;
      }
    });

    if (activated > 0) {
      await batch.commit();
    }

    console.log(`Activated ${activated} articles, total ${snapshot.size} articles in database`);

    // Now run the aggregation
    const result = await aggregateNews();

    return {
      ...result,
      activated,
      totalInDatabase: snapshot.size
    };
  });

// Get news stats
export const getNewsStats = functions
  .region('asia-south1')
  .https.onCall(async () => {
    const snapshot = await db.collection('tourismNews').get();
    const settings = await db.collection('settings').doc('newsAggregator').get();

    const stats = {
      totalArticles: snapshot.size,
      activeArticles: snapshot.docs.filter(d => d.data().isActive !== false).length,
      lastFetch: settings.data()?.lastFetch?.toDate() || null,
      sources: {} as Record<string, number>
    };

    snapshot.docs.forEach(doc => {
      const source = doc.data().source || 'Unknown';
      stats.sources[source] = (stats.sources[source] || 0) + 1;
    });

    return stats;
  });

// Clear all news and re-fetch fresh - use sparingly!
export const clearAndRefreshNews = functions
  .region('asia-south1')
  .runWith(runtimeOpts)
  .https.onCall(async () => {
    console.log('Clearing all news and re-fetching fresh...');

    // Delete all existing news
    const snapshot = await db.collection('tourismNews').get();
    const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log(`Deleted ${snapshot.size} existing articles`);

    // Reset settings
    await db.collection('settings').doc('newsAggregator').set({
      lastFetch: null,
      totalArticles: 0,
      successfulSources: 0
    });

    // Now fetch fresh news
    const result = await aggregateNews();

    return {
      ...result,
      deleted: snapshot.size,
      message: `Cleared ${snapshot.size} old articles and fetched ${result.total} new articles`
    };
  });
