
import { supabaseCMS } from '@/lib/firebase-services';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export class SitemapGenerator {
  private static baseUrl = 'https://www.rechargetravels.com';

  static async generateMainSitemap(): Promise<string> {
    const urls: SitemapUrl[] = [
      {
        loc: this.baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 1.0
      },
      {
        loc: `${this.baseUrl}/destinations`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.9
      },
      {
        loc: `${this.baseUrl}/tours`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        loc: `${this.baseUrl}/articles`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.8
      },
      {
        loc: `${this.baseUrl}/hotels`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7
      },
      {
        loc: `${this.baseUrl}/about`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.6
      },
      {
        loc: `${this.baseUrl}/contact`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.5
      }
    ];

    return this.generateSitemapXML(urls);
  }

  static async generateDestinationsSitemap(): Promise<string> {
    // Static destination pages that are hardcoded in the app
    const staticDestinations = [
      'colombo', 'kandy', 'galle', 'sigiriya', 'ella', 'nuwaraeliya', 'jaffna',
      'delft-island', 'mullaitivu', 'hatton', 'trincomalee', 'arugam-bay', 'mirissa', 'weligama', 'bentota',
      'dambulla', 'hikkaduwa', 'mannar', 'polonnaruwa', 'anuradhapura', 'kalpitiya',
      'adams-peak', 'wadduwa', 'matara', 'tangalle', 'negombo', 'badulla',
      'ratnapura', 'puttalam', 'hambantota', 'vavuniya', 'kurunegala', 'batticaloa'
    ];

    const staticUrls: SitemapUrl[] = staticDestinations.map(slug => ({
      loc: `${this.baseUrl}/destinations/${slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly' as const,
      priority: 0.8
    }));

    try {
      const { data: destinations } = await supabaseCMS
        .from('destination')
        .select('slug, updated_at')
        .eq('published', true);

      const dbUrls: SitemapUrl[] = (destinations || []).map(dest => ({
        loc: `${this.baseUrl}/destinations/${dest.slug}`,
        lastmod: dest.updated_at,
        changefreq: 'weekly' as const,
        priority: 0.8
      }));

      // Combine static and database destinations, removing duplicates
      const allUrls = [...staticUrls];
      dbUrls.forEach(dbUrl => {
        if (!allUrls.find(u => u.loc === dbUrl.loc)) {
          allUrls.push(dbUrl);
        }
      });

      return this.generateSitemapXML(allUrls);
    } catch (error) {
      console.error('Error generating destinations sitemap:', error);
      // Return static destinations even if database fails
      return this.generateSitemapXML(staticUrls);
    }
  }

  static async generateArticlesSitemap(): Promise<string> {
    try {
      const { data: articles } = await supabaseCMS
        .from('article')
        .select('slug, updated_at')
        .eq('published', true);

      const urls: SitemapUrl[] = (articles || []).map(article => ({
        loc: `${this.baseUrl}/articles/${article.slug}`,
        lastmod: article.updated_at,
        changefreq: 'monthly',
        priority: 0.7
      }));

      return this.generateSitemapXML(urls);
    } catch (error) {
      console.error('Error generating articles sitemap:', error);
      return this.generateSitemapXML([]);
    }
  }

  static async generateToursSitemap(): Promise<string> {
    const staticTourUrls: SitemapUrl[] = [
      {
        loc: `${this.baseUrl}/tours/wildlife-tours`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        loc: `${this.baseUrl}/tours/cultural-heritage`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        loc: `${this.baseUrl}/tours/beach-tours`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        loc: `${this.baseUrl}/tours/hill-country`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        loc: `${this.baseUrl}/safari-package-builder`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.9
      }
    ];

    return this.generateSitemapXML(staticTourUrls);
  }

  private static generateSitemapXML(urls: SitemapUrl[]): string {
    const urlElements = urls.map(url => {
      let urlXml = `    <url>\n        <loc>${url.loc}</loc>\n`;
      
      if (url.lastmod) {
        urlXml += `        <lastmod>${url.lastmod}</lastmod>\n`;
      }
      
      if (url.changefreq) {
        urlXml += `        <changefreq>${url.changefreq}</changefreq>\n`;
      }
      
      if (url.priority !== undefined) {
        urlXml += `        <priority>${url.priority}</priority>\n`;
      }
      
      urlXml += `    </url>`;
      return urlXml;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
  }

  static generateSitemapIndex(): string {
    const sitemaps = [
      {
        loc: `${this.baseUrl}/sitemap.xml`,
        lastmod: new Date().toISOString()
      },
      {
        loc: `${this.baseUrl}/sitemap-destinations.xml`,
        lastmod: new Date().toISOString()
      },
      {
        loc: `${this.baseUrl}/sitemap-articles.xml`,
        lastmod: new Date().toISOString()
      },
      {
        loc: `${this.baseUrl}/sitemap-tours.xml`,
        lastmod: new Date().toISOString()
      }
    ];

    const sitemapElements = sitemaps.map(sitemap => 
      `    <sitemap>\n        <loc>${sitemap.loc}</loc>\n        <lastmod>${sitemap.lastmod}</lastmod>\n    </sitemap>`
    ).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapElements}
</sitemapindex>`;
  }
}
