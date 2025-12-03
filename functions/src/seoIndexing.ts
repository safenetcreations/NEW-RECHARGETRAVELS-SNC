import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const SITE_URL = 'https://www.rechargetravels.com';

// Generate dynamic sitemap for news articles
export const generateNewsSitemap = functions
  .region('asia-south1')
  .https.onRequest(async (req, res) => {
    try {
      // Fetch all news articles (simple query - no index needed)
      const newsSnapshot = await db.collection('tourismNews')
        .limit(500)
        .get();

      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
`;

      // Add main news page
      sitemap += `  <url>
    <loc>${SITE_URL}/news</loc>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
`;

      // Filter active articles and sort by date in memory
      const articles = newsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as any))
        .filter((article: any) => article.isActive !== false)
        .sort((a: any, b: any) => {
          const aTime = a.publishedAt?.toDate?.()?.getTime() || 0;
          const bTime = b.publishedAt?.toDate?.()?.getTime() || 0;
          return bTime - aTime;
        });

      // Add each news article
      articles.forEach((article: any) => {
        const pubDate = article.publishedAt?.toDate?.() || new Date();
        
        sitemap += `  <url>
    <loc>${SITE_URL}/news#${article.id}</loc>
    <lastmod>${pubDate.toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <news:news>
      <news:publication>
        <news:name>Recharge Travels</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate.toISOString()}</news:publication_date>
      <news:title>${escapeXml(article.title || '')}</news:title>
      <news:keywords>${(article.tags || []).join(', ')}</news:keywords>
    </news:news>
  </url>
`;
      });

      sitemap += '</urlset>';

      res.set('Content-Type', 'application/xml');
      res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      res.status(200).send(sitemap);

    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

// Ping search engines when new content is added
export const pingSearchEngines = functions
  .region('asia-south1')
  .firestore.document('tourismNews/{articleId}')
  .onCreate(async (snap, context) => {
    const sitemapUrl = `${SITE_URL}/api/news-sitemap.xml`;
    
    const pingUrls = [
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    ];

    console.log('Pinging search engines for new content...');

    for (const url of pingUrls) {
      try {
        const response = await fetch(url);
        console.log(`Pinged ${url}: ${response.status}`);
      } catch (error) {
        console.error(`Error pinging ${url}:`, error);
      }
    }

    // Update last ping timestamp
    await db.collection('settings').doc('seo').set({
      lastPing: admin.firestore.Timestamp.now(),
      articlesCount: (await db.collection('tourismNews').count().get()).data().count
    }, { merge: true });

    return null;
  });

// Generate robots.txt with sitemap references
export const generateRobotsTxt = functions
  .region('asia-south1')
  .https.onRequest(async (req, res) => {
    const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/api/news-sitemap.xml

# News Section - Crawl frequently
User-agent: Googlebot
Allow: /news
Allow: /connect-with-us

# Crawl delay for respectful crawling
Crawl-delay: 1
`;

    res.set('Content-Type', 'text/plain');
    res.status(200).send(robotsTxt);
  });

// Helper function to escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// IndexNow API - Instant indexing for Bing, Yandex, etc.
export const submitToIndexNow = functions
  .region('asia-south1')
  .https.onCall(async (data, context) => {
    const urls = [
      `${SITE_URL}/news`,
      `${SITE_URL}/connect-with-us`,
    ];

    // Add recent news article URLs
    const recentNews = await db.collection('tourismNews')
      .orderBy('fetchedAt', 'desc')
      .limit(10)
      .get();

    recentNews.forEach(doc => {
      urls.push(`${SITE_URL}/news#${doc.id}`);
    });

    // IndexNow submission (you'll need to add your API key)
    const indexNowKey = functions.config().indexnow?.key || '';
    
    if (indexNowKey) {
      try {
        const response = await fetch('https://api.indexnow.org/indexnow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            host: 'www.rechargetravels.com',
            key: indexNowKey,
            keyLocation: `${SITE_URL}/${indexNowKey}.txt`,
            urlList: urls
          })
        });
        
        console.log('IndexNow response:', response.status);
        return { success: true, urlsSubmitted: urls.length };
      } catch (error) {
        console.error('IndexNow error:', error);
        return { success: false, error: 'IndexNow submission failed' };
      }
    }

    return { success: false, error: 'IndexNow key not configured' };
  });

// Daily SEO report - tracks indexing status
export const dailySeoReport = functions
  .region('asia-south1')
  .pubsub
  .schedule('0 8 * * *') // Run at 8 AM daily
  .timeZone('Asia/Colombo')
  .onRun(async () => {
    const stats = {
      date: new Date().toISOString(),
      totalArticles: (await db.collection('tourismNews').count().get()).data().count,
      activeArticles: (await db.collection('tourismNews').where('isActive', '==', true).count().get()).data().count,
      last24hArticles: 0
    };

    // Count articles from last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentSnapshot = await db.collection('tourismNews')
      .where('fetchedAt', '>=', admin.firestore.Timestamp.fromDate(yesterday))
      .count()
      .get();
    
    stats.last24hArticles = recentSnapshot.data().count;

    // Save report
    await db.collection('seoReports').add(stats);

    console.log('Daily SEO Report:', stats);
    return null;
  });
