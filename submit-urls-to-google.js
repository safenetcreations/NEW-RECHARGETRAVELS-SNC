#!/usr/bin/env node
/**
 * Sitemap and URL List Generator for Recharge Travels
 * Simple script to generate sitemap.xml and urls.txt
 */

import fs from 'fs';

// List of all destination page URLs
const DESTINATION_URLS = [
    // Main pages
    'https://www.rechargetravels.com/',
    'https://www.rechargetravels.com/destinations',
    'https://www.rechargetravels.com/about',
    'https://www.rechargetravels.com/contact',
    'https://www.rechargetravels.com/connect-with-us',
    'https://www.rechargetravels.com/faq',

    // Destination pages
    'https://www.rechargetravels.com/destinations/colombo',
    'https://www.rechargetravels.com/destinations/kandy',
    'https://www.rechargetravels.com/destinations/galle',
    'https://www.rechargetravels.com/destinations/sigiriya',
    'https://www.rechargetravels.com/destinations/ella',
    'https://www.rechargetravels.com/destinations/nuwara-eliya',
    'https://www.rechargetravels.com/destinations/mirissa',
    'https://www.rechargetravels.com/destinations/arugam-bay',
    'https://www.rechargetravels.com/destinations/trincomalee',
    'https://www.rechargetravels.com/destinations/jaffna',
    'https://www.rechargetravels.com/destinations/negombo',
    'https://www.rechargetravels.com/destinations/bentota',
    'https://www.rechargetravels.com/destinations/hikkaduwa',
    'https://www.rechargetravels.com/destinations/weligama',
    'https://www.rechargetravels.com/destinations/anuradhapura',
    'https://www.rechargetravels.com/destinations/polonnaruwa',
    'https://www.rechargetravels.com/destinations/dambulla',
    'https://www.rechargetravels.com/destinations/adams-peak',
    'https://www.rechargetravels.com/destinations/kalpitiya',
    'https://www.rechargetravels.com/destinations/mannar',
    'https://www.rechargetravels.com/destinations/vavuniya',
    'https://www.rechargetravels.com/destinations/batticaloa',
    'https://www.rechargetravels.com/destinations/badulla',
    'https://www.rechargetravels.com/destinations/ratnapura',
    'https://www.rechargetravels.com/destinations/kurunegala',
    'https://www.rechargetravels.com/destinations/puttalam',
    'https://www.rechargetravels.com/destinations/hambantota',
    'https://www.rechargetravels.com/destinations/matara',
    'https://www.rechargetravels.com/destinations/tangalle',
    'https://www.rechargetravels.com/destinations/wadduwa',

    // Tour pages
    'https://www.rechargetravels.com/tours/cultural',
    'https://www.rechargetravels.com/tours/beach',
    'https://www.rechargetravels.com/tours/wildlife',
    'https://www.rechargetravels.com/tours/hill-country',
    'https://www.rechargetravels.com/tours/ramayana',
    'https://www.rechargetravels.com/tours/culinary',
    'https://www.rechargetravels.com/tours/photography',
    'https://www.rechargetravels.com/tours/ecotourism',
];

/**
 * Generate sitemap.xml
 */
function generateSitemap() {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${DESTINATION_URLS.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === 'https://www.rechargetravels.com/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync('sitemap.xml', sitemap);
    console.log('✅ sitemap.xml generated successfully!');
    console.log(`📊 Total URLs: ${DESTINATION_URLS.length}`);
    console.log('\n📝 Next steps:');
    console.log('1. Copy sitemap.xml to your dist folder:');
    console.log('   cp sitemap.xml dist/');
    console.log('2. Deploy to Firebase:');
    console.log('   firebase deploy --only hosting');
    console.log('3. Submit to Google Search Console:');
    console.log('   https://search.google.com/search-console');
    console.log('   Go to Sitemaps → Add: sitemap.xml\n');
}

/**
 * Generate URL list for manual submission
 */
function generateUrlList() {
    const urlList = DESTINATION_URLS.join('\n');
    fs.writeFileSync('urls.txt', urlList);
    console.log('✅ urls.txt generated!');
    console.log('📋 Use this file to batch submit URLs to Google Search Console\n');
}

// Main execution
const args = process.argv.slice(2);

if (args.includes('--help')) {
    console.log(`
🔍 Sitemap Generator for Recharge Travels

Usage:
  node submit-urls-to-google.js            Generate sitemap and URL list
  node submit-urls-to-google.js --sitemap  Generate sitemap.xml only
  node submit-urls-to-google.js --urls     Generate urls.txt only
  node submit-urls-to-google.js --help     Show this help

Files Generated:
  - sitemap.xml: XML sitemap for search engines
  - urls.txt: Plain text list of all URLs

Total Destination Pages: ${DESTINATION_URLS.length}
  `);
} else if (args.includes('--urls')) {
    generateUrlList();
} else if (args.includes('--sitemap')) {
    generateSitemap();
} else {
    // Generate both by default
    generateSitemap();
    generateUrlList();
}

export { DESTINATION_URLS, generateSitemap, generateUrlList };
