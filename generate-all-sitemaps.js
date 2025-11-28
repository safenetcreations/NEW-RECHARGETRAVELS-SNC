#!/usr/bin/env node
/**
 * Complete Sitemap Generator for Recharge Travels
 * Generates comprehensive sitemap with ALL pages
 */

import fs from 'fs';

const BASE_URL = 'https://www.rechargetravels.com';

// ALL PAGES ORGANIZED BY SECTION
const PAGES = {
    // Main Pages
    main: [
        '/',
        '/about',
        '/contact',
        '/connect-with-us',
        '/faq',
        '/travel-guide',
    ],

    // Destinations (31 pages)
    destinations: [
        '/destinations',
        '/destinations/colombo',
        '/destinations/kandy',
        '/destinations/galle',
        '/destinations/sigiriya',
        '/destinations/ella',
        '/destinations/nuwara-eliya',
        '/destinations/mirissa',
        '/destinations/arugam-bay',
        '/destinations/trincomalee',
        '/destinations/jaffna',
        '/destinations/negombo',
        '/destinations/bentota',
        '/destinations/hikkaduwa',
        '/destinations/weligama',
        '/destinations/anuradhapura',
        '/destinations/polonnaruwa',
        '/destinations/dambulla',
        '/destinations/adams-peak',
        '/destinations/kalpitiya',
        '/destinations/mannar',
        '/destinations/vavuniya',
        '/destinations/batticaloa',
        '/destinations/badulla',
        '/destinations/ratnapura',
        '/destinations/kurunegala',
        '/destinations/puttalam',
        '/destinations/hambantota',
        '/destinations/matara',
        '/destinations/tangalle',
        '/destinations/wadduwa',
    ],

    // Tours (15 pages)
    tours: [
        '/tours',
        '/tours/cultural',
        '/tours/cultural-heritage',
        '/tours/beach',
        '/tours/wildlife',
        '/tours/wild',
        '/tours/hill-country',
        '/tours/ramayana',
        '/tours/culinary',
        '/tours/photography',
        '/tours/ecotourism',
        '/tours/luxury',
        '/tours/pilgrimage',
    ],

    // Transport (5 pages)
    transport: [
        '/transport',
        '/transport/airport-transfers',
        '/transport/group-transport',
        '/transport/private-tours',
        '/transport/car-rentals',
    ],

    // Experiences (15 pages)
    experiences: [
        '/experiences',
        '/experiences/ayurveda-wellness',
        '/experiences/cooking-class',
        '/experiences/whale-watching',
        '/experiences/hot-air-balloon-sigiriya',
        '/experiences/kalpitiya-kite-surfing',
        '/experiences/hikkaduwa-water-sports',
        '/experiences/tea-trails',
        '/experiences/train-journeys',
        '/experiences/jungle-camping',
        '/experiences/island-getaways',
        '/experiences/lagoon-safari',
        '/experiences/sea-cucumber-farming',
        '/experiences/pilgrimage-tours',
    ],

    // Hotels & Accommodation
    hotels: [
        '/hotels',
        '/hotels/luxury',
        '/hotels/budget',
        '/hotels/boutique',
    ],

    // Blog/Content
    blog: [
        '/blog',
    ],
};

// Calculate totals
const TOTAL_PAGES = Object.values(PAGES).flat().length;

/**
 * Generate XML entry for a URL
 */
function generateUrlEntry(path, priority = '0.8', changefreq = 'weekly') {
    const url = `${BASE_URL}${path}`;
    const lastmod = new Date().toISOString().split('T')[0];

    return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Generate complete sitemap.xml
 */
function generateMainSitemap() {
    const allUrls = [];

    // Main pages (highest priority)
    PAGES.main.forEach(path => {
        const priority = path === '/' ? '1.0' : '0.9';
        allUrls.push(generateUrlEntry(path, priority, 'daily'));
    });

    // Destinations (high priority)
    PAGES.destinations.forEach(path => {
        allUrls.push(generateUrlEntry(path, '0.9', 'weekly'));
    });

    // Tours (high priority)
    PAGES.tours.forEach(path => {
        allUrls.push(generateUrlEntry(path, '0.8', 'weekly'));
    });

    // Transport
    PAGES.transport.forEach(path => {
        allUrls.push(generateUrlEntry(path, '0.8', 'weekly'));
    });

    // Experiences
    PAGES.experiences.forEach(path => {
        allUrls.push(generateUrlEntry(path, '0.8', 'weekly'));
    });

    // Hotels
    PAGES.hotels.forEach(path => {
        allUrls.push(generateUrlEntry(path, '0.7', 'weekly'));
    });

    // Blog
    PAGES.blog.forEach(path => {
        allUrls.push(generateUrlEntry(path, '0.7', 'daily'));
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.join('\n')}
</urlset>`;

    fs.writeFileSync('sitemap.xml', sitemap);
    console.log(`✅ Main sitemap.xml generated!`);
    console.log(`📊 Total URLs: ${TOTAL_PAGES}\n`);
}

/**
 * Generate section-specific sitemaps
 */
function generateSectionSitemaps() {
    const sections = ['destinations', 'tours', 'transport', 'experiences'];

    sections.forEach(section => {
        const urls = PAGES[section].map(path => generateUrlEntry(path, '0.8', 'weekly'));

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

        const filename = `sitemap-${section}.xml`;
        fs.writeFileSync(filename, sitemap);
        console.log(`✅ ${filename} created (${PAGES[section].length} URLs)`);
    });
}

/**
 * Generate sitemap index
 */
function generateSitemapIndex() {
    const sections = ['destinations', 'tours', 'transport', 'experiences'];
    const lastmod = new Date().toISOString().split('T')[0];

    const sitemaps = [
        `  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`,
        ...sections.map(section => `  <sitemap>
    <loc>${BASE_URL}/sitemap-${section}.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`)
    ].join('\n');

    const index = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;

    fs.writeFileSync('sitemap_index.xml', index);
    console.log('\n✅ sitemap_index.xml generated!');
}

/**
 * Generate URL list files
 */
function generateUrlLists() {
    // All URLs
    const allUrls = Object.values(PAGES).flat().map(path => `${BASE_URL}${path}`);
    fs.writeFileSync('all-urls.txt', allUrls.join('\n'));
    console.log(`\n✅ all-urls.txt created (${allUrls.length} URLs)`);

    // Section-specific URL lists
    const sections = ['destinations', 'tours', 'transport', 'experiences'];
    sections.forEach(section => {
        const urls = PAGES[section].map(path => `${BASE_URL}${path}`);
        fs.writeFileSync(`urls-${section}.txt`, urls.join('\n'));
        console.log(`✅ urls-${section}.txt created (${urls.length} URLs)`);
    });
}

/**
 * Generate summary report
 */
function generateReport() {
    const report = `# 🗺️ Sitemap Generation Report
Generated: ${new Date().toLocaleString()}

## 📊 Total Pages: ${TOTAL_PAGES}

### Breakdown by Section:
- **Main Pages**: ${PAGES.main.length}
- **Destinations**: ${PAGES.destinations.length}
- **Tours**: ${PAGES.tours.length}
- **Transport**: ${PAGES.transport.length}
- **Experiences**: ${PAGES.experiences.length}
- **Hotels**: ${PAGES.hotels.length}
- **Blog**: ${PAGES.blog.length}

## 📄 Files Generated:

### Sitemaps:
1. ✅ **sitemap.xml** - Main sitemap (all ${TOTAL_PAGES} URLs)
2. ✅ **sitemap-destinations.xml** - Destinations only (${PAGES.destinations.length} URLs)
3. ✅ **sitemap-tours.xml** - Tours only (${PAGES.tours.length} URLs)
4. ✅ **sitemap-transport.xml** - Transport only (${PAGES.transport.length} URLs)
5. ✅ **sitemap-experiences.xml** - Experiences only (${PAGES.experiences.length} URLs)
6. ✅ **sitemap_index.xml** - Sitemap index file

### URL Lists:
1. ✅ **all-urls.txt** - All URLs (${TOTAL_PAGES} total)
2. ✅ **urls-destinations.txt** - Destinations URLs (${PAGES.destinations.length})
3. ✅ **urls-tours.txt** - Tours URLs (${PAGES.tours.length})
4. ✅ **urls-transport.txt** - Transport URLs (${PAGES.transport.length})
5. ✅ **urls-experiences.txt** - Experiences URLs (${PAGES.experiences.length})

## 🚀 Next Steps:

### Deploy Sitemaps:
\`\`\`bash
# Copy all sitemaps to dist
cp sitemap*.xml dist/
cp sitemap*.xml public/

# Deploy to Firebase
firebase deploy --only hosting:main
\`\`\`

### Submit to Google Search Console:

1. **Main Sitemap:**
   - Submit: \`sitemap.xml\`
   
2. **Or use Sitemap Index** (recommended for large sites):
   - Submit: \`sitemap_index.xml\`
   - This automatically includes all section sitemaps

### Manual URL Submission (Priority Pages):
Use the URL lists to manually submit high-priority pages:
- Transport pages: \`urls-transport.txt\`
- Tour pages: \`urls-tours.txt\`
- Experience pages: \`urls-experiences.txt\`

## 📍 Live URLs:
- Main: https://www.rechargetravels.com/sitemap.xml
- Index: https://www.rechargetravels.com/sitemap_index.xml
- Destinations: https://www.rechargetravels.com/sitemap-destinations.xml
- Tours: https://www.rechargetravels.com/sitemap-tours.xml
- Transport: https://www.rechargetravels.com/sitemap-transport.xml
- Experiences: https://www.rechargetravels.com/sitemap-experiences.xml

---
**Status**: ✅ Ready for submission to Google Search Console
`;

    fs.writeFileSync('SITEMAP_REPORT.md', report);
    console.log('\n✅ SITEMAP_REPORT.md created');
    console.log('\n📋 Full report saved to SITEMAP_REPORT.md\n');
}

// Main execution
const args = process.argv.slice(2);

console.log('🗺️  Recharge Travels - Complete Sitemap Generator\n');
console.log('='.repeat(60));

if (args.includes('--help')) {
    console.log(`
Usage:
  node generate-all-sitemaps.js              Generate everything
  node generate-all-sitemaps.js --main       Main sitemap only
  node generate-all-sitemaps.js --sections   Section sitemaps only
  node generate-all-sitemaps.js --help       Show this help

Generated Files:
  - sitemap.xml (main sitemap with all URLs)
  - sitemap-destinations.xml
  - sitemap-tours.xml
  - sitemap-transport.xml
  - sitemap-experiences.xml
  - sitemap_index.xml
  - all-urls.txt
  - urls-*.txt (section-specific)
  - SITEMAP_REPORT.md
  `);
} else if (args.includes('--main')) {
    generateMainSitemap();
} else if (args.includes('--sections')) {
    generateSectionSitemaps();
    generateSitemapIndex();
} else {
    // Generate everything
    generateMainSitemap();
    generateSectionSitemaps();
    generateSitemapIndex();
    generateUrlLists();
    generateReport();

    console.log('='.repeat(60));
    console.log('\n🎉 All sitemaps and files generated successfully!\n');
    console.log('📁 Next step: Deploy to website');
    console.log('   cp sitemap*.xml dist/ && firebase deploy --only hosting:main\n');
}

export { PAGES, generateMainSitemap, generateSectionSitemaps };
