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
exports.prerenderHealth = exports.prerender = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// Initialize if not already done
if (!admin.apps.length) {
    admin.initializeApp();
}
const SITE_URL = 'https://www.rechargetravels.com';
const COMPANY_NAME = 'Recharge Travels';
const COMPANY_PHONE = '+94 77 772 1999';
// Bot user agents that need pre-rendered content
const BOT_USER_AGENTS = [
    'googlebot',
    'bingbot',
    'yandexbot',
    'duckduckbot',
    'slurp',
    'baiduspider',
    'facebookexternalhit',
    'twitterbot',
    'linkedinbot',
    'whatsapp',
    'telegrambot',
    'applebot',
    'discordbot',
    'pinterest',
    'google-structured-data-testing-tool',
    'google-inspectiontool',
    'lighthouse',
    'pagespeed'
];
// Check if request is from a bot
function isBot(userAgent) {
    const ua = userAgent.toLowerCase();
    return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}
// Generate SEO data for each route
function getPageSEO(path) {
    const pages = {
        '/experiences': {
            title: 'Curated Experiences Sri Lanka | Safari, Wellness, Adventure Tours - Recharge Travels',
            description: 'Discover 50+ handcrafted luxury experiences in Sri Lanka. Safari, wellness retreats, culinary journeys, adventure expeditions, whale watching, hot air balloon rides, tea trails and cultural immersion tours. Book with 24/7 concierge support.',
            keywords: 'Sri Lanka experiences, luxury tours, safari Sri Lanka, wellness retreats, adventure tours, cultural tours, whale watching, hot air balloon Sigiriya, cooking class Sri Lanka, tea trails, train journeys',
            h1: 'Curated Luxury Experiences in Sri Lanka',
            content: `<section><h2>Safari & Wildlife</h2><p>Experience Sri Lanka's incredible wildlife with our curated safari packages. Visit Yala National Park, home to the highest density of leopards in the world, Udawalawe for elephant herds, and Wilpattu for pristine wilderness.</p></section>
<section><h2>Wellness & Ayurveda</h2><p>Rejuvenate with authentic Ayurvedic treatments at luxury wellness retreats. Our programs include traditional therapies, yoga, meditation, and holistic healing experiences.</p></section>
<section><h2>Adventure Activities</h2><p>From hot air balloon rides over Sigiriya to white water rafting in Kitulgala, hiking Adam's Peak, and diving in Trincomalee. Sri Lanka offers adventures for every thrill level.</p></section>
<section><h2>Cultural Immersion</h2><p>Learn to cook authentic Sri Lankan cuisine, visit ancient temples, explore UNESCO World Heritage sites, and experience local village life with our cultural tours.</p></section>`,
            schema: {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "Sri Lanka Luxury Experiences",
                "description": "Curated collection of 50+ luxury experiences in Sri Lanka",
                "url": `${SITE_URL}/experiences`,
                "provider": {
                    "@type": "TravelAgency",
                    "name": COMPANY_NAME,
                    "telephone": COMPANY_PHONE
                }
            }
        },
        '/tours': {
            title: 'Sri Lanka Tours & Holiday Packages | Cultural, Wildlife, Beach Tours - Recharge Travels',
            description: 'Explore Sri Lanka with our expertly crafted tour packages. Cultural heritage tours, wildlife safaris, beach holidays, adventure trips, and customized itineraries. Guaranteed best prices with 24/7 support.',
            keywords: 'Sri Lanka tours, holiday packages, cultural tours, wildlife safari, beach holidays, Colombo tours, Kandy tours, Sigiriya tours, Ella tours, customized tours',
            h1: 'Sri Lanka Tours & Holiday Packages',
            content: `<section><h2>Cultural Heritage Tours</h2><p>Explore Sri Lanka's 8 UNESCO World Heritage Sites including Sigiriya Rock Fortress, ancient cities of Anuradhapura and Polonnaruwa, Temple of the Sacred Tooth Relic in Kandy, and the Dutch Fort in Galle.</p></section>
<section><h2>Wildlife Safari Tours</h2><p>Experience world-class wildlife at Yala National Park (leopards), Udawalawe (elephants), Wilpattu (sloth bears), Minneriya (elephant gathering), and Sinharaja Rainforest (endemic birds).</p></section>
<section><h2>Beach Holiday Packages</h2><p>Relax on pristine beaches in Mirissa, Unawatuna, Bentota, Arugam Bay, and Trincomalee. Perfect for swimming, surfing, snorkeling, and whale watching.</p></section>
<section><h2>Adventure Tours</h2><p>Hike Adam's Peak, raft in Kitulgala, climb Ella Rock, explore Knuckles Mountain Range, and enjoy the scenic train journey from Ella to Kandy.</p></section>`,
            schema: {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Sri Lanka Tour Packages",
                "url": `${SITE_URL}/tours`,
                "numberOfItems": 50,
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Cultural Heritage Tour", "url": `${SITE_URL}/tours/cultural` },
                    { "@type": "ListItem", "position": 2, "name": "Wildlife Safari Tour", "url": `${SITE_URL}/tours/wildlife` },
                    { "@type": "ListItem", "position": 3, "name": "Beach Holiday Package", "url": `${SITE_URL}/tours/beach` }
                ]
            }
        },
        '/hotels': {
            title: 'Luxury Hotels Sri Lanka | Best Hotel Deals & Bookings - Recharge Travels',
            description: 'Book luxury hotels, boutique resorts, and eco-lodges across Sri Lanka. Best price guarantee on 500+ properties in Colombo, Kandy, Galle, Ella, and beach destinations. Instant confirmation.',
            keywords: 'Sri Lanka hotels, luxury hotels, boutique hotels, beach resorts, Colombo hotels, Kandy hotels, Galle hotels, Ella hotels, hotel booking Sri Lanka',
            h1: 'Luxury Hotels & Resorts in Sri Lanka',
            content: `<section><h2>Luxury Beach Resorts</h2><p>Stay at world-class beach resorts in Bentota, Mirissa, Tangalle, and Trincomalee. Enjoy private beaches, infinity pools, spa treatments, and water sports.</p></section>
<section><h2>Heritage Hotels</h2><p>Experience colonial charm at heritage properties in Galle Fort, Kandy, and Nuwara Eliya. Converted tea bungalows and plantation homes offer unique stays.</p></section>
<section><h2>Boutique Properties</h2><p>Discover intimate boutique hotels with personalized service across Sri Lanka. Perfect for couples and discerning travelers seeking authentic experiences.</p></section>
<section><h2>Eco Lodges</h2><p>Stay at sustainable eco-lodges near national parks and rainforests. Wake up to wildlife at your doorstep in Yala, Sinharaja, and Knuckles.</p></section>`,
            schema: {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Sri Lanka Hotels",
                "url": `${SITE_URL}/hotels`,
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Colombo Hotels", "url": `${SITE_URL}/hotels?city=colombo` },
                    { "@type": "ListItem", "position": 2, "name": "Kandy Hotels", "url": `${SITE_URL}/hotels?city=kandy` },
                    { "@type": "ListItem", "position": 3, "name": "Galle Hotels", "url": `${SITE_URL}/hotels?city=galle` }
                ]
            }
        },
        '/airport-transfers': {
            title: 'Airport Transfers Sri Lanka | Private Taxi from Colombo Airport - Recharge Travels',
            description: 'Book private airport transfers from Colombo Bandaranaike International Airport. Fixed prices, meet & greet, 24/7 service. Transfers to Kandy, Galle, Ella, Negombo, and all destinations.',
            keywords: 'Colombo airport transfer, airport taxi Sri Lanka, CMB airport pickup, private transfer Colombo, airport to Kandy, airport to Galle, airport to Negombo',
            h1: 'Private Airport Transfers in Sri Lanka',
            content: `<section><h2>Colombo Airport Transfers</h2><p>Professional meet & greet service at Bandaranaike International Airport. Our drivers track your flight and wait with your name sign. Fixed prices, no hidden charges.</p></section>
<section><h2>Popular Routes</h2><ul><li>Airport to Colombo City - from $35</li><li>Airport to Negombo - from $20</li><li>Airport to Kandy - from $85</li><li>Airport to Galle - from $95</li><li>Airport to Ella - from $150</li></ul></section>
<section><h2>Vehicle Options</h2><p>Choose from economy sedans, SUVs, luxury vehicles, and vans for groups. All vehicles are air-conditioned with professional English-speaking drivers.</p></section>`,
            schema: {
                "@context": "https://schema.org",
                "@type": "Service",
                "serviceType": "Airport Transfer Service",
                "name": "Sri Lanka Airport Transfers",
                "url": `${SITE_URL}/airport-transfers`,
                "provider": {
                    "@type": "TravelAgency",
                    "name": COMPANY_NAME,
                    "telephone": COMPANY_PHONE
                },
                "areaServed": {
                    "@type": "Country",
                    "name": "Sri Lanka"
                }
            }
        },
        '/train-booking': {
            title: 'Sri Lanka Train Tickets | Book Scenic Train Journeys - Recharge Travels',
            description: 'Book train tickets for Sri Lanka\'s most scenic railway journeys. Ella to Kandy, Colombo to Badulla, observation car tickets. Reserved seats on the world-famous blue train.',
            keywords: 'Sri Lanka train tickets, Ella train, Kandy train, scenic train journey, train booking Sri Lanka, observation car, blue train Sri Lanka',
            h1: 'Scenic Train Journeys in Sri Lanka',
            content: `<section><h2>World-Famous Routes</h2><p>Experience one of the most scenic train journeys in the world. The route from Kandy to Ella passes through tea plantations, misty mountains, waterfalls, and iconic Nine Arch Bridge.</p></section>
<section><h2>Ticket Classes</h2><ul><li>First Class - Reserved seats with AC</li><li>Second Class - Reserved seats</li><li>Third Class - Unreserved</li><li>Observation Car - Best views</li></ul></section>
<section><h2>Popular Routes</h2><ul><li>Ella to Kandy - 7 hours scenic journey</li><li>Colombo to Kandy - 3.5 hours through hills</li><li>Colombo to Badulla - Full day adventure</li><li>Nanu Oya to Ella - Tea country route</li></ul></section>`,
            schema: {
                "@context": "https://schema.org",
                "@type": "Service",
                "serviceType": "Train Ticket Booking",
                "name": "Sri Lanka Train Ticket Booking",
                "url": `${SITE_URL}/train-booking`,
                "provider": {
                    "@type": "TravelAgency",
                    "name": COMPANY_NAME
                }
            }
        }
    };
    // Handle destination pages
    if (path.startsWith('/destinations/')) {
        const destination = path.replace('/destinations/', '');
        const destName = destination.charAt(0).toUpperCase() + destination.slice(1).replace(/-/g, ' ');
        return {
            title: `${destName} Sri Lanka | Travel Guide, Things to Do, Hotels - Recharge Travels`,
            description: `Plan your trip to ${destName}, Sri Lanka. Discover attractions, best hotels, restaurants, and activities. Book tours and transfers with local experts.`,
            keywords: `${destName} Sri Lanka, ${destName} tourism, things to do in ${destName}, ${destName} hotels, ${destName} tours`,
            h1: `${destName} Travel Guide`,
            content: `<p>Discover the beauty of ${destName}, one of Sri Lanka's most captivating destinations. From cultural heritage to natural wonders, ${destName} offers unforgettable experiences for every traveler.</p>`,
            schema: {
                "@context": "https://schema.org",
                "@type": "TouristDestination",
                "name": destName,
                "description": `Travel guide to ${destName}, Sri Lanka`,
                "url": `${SITE_URL}${path}`
            }
        };
    }
    // Handle experience pages
    if (path.startsWith('/experiences/')) {
        const experience = path.replace('/experiences/', '');
        const expName = experience.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        return {
            title: `${expName} Sri Lanka | Book Now - Recharge Travels`,
            description: `Experience ${expName} in Sri Lanka. Book with the trusted local experts at Recharge Travels. Best prices guaranteed with 24/7 support.`,
            keywords: `${expName} Sri Lanka, book ${expName}, ${expName} tour, ${expName} experience`,
            h1: expName,
            content: `<p>Experience the best ${expName} in Sri Lanka with our expert guides and premium services. Contact us for personalized packages and group bookings.</p>`,
            schema: {
                "@context": "https://schema.org",
                "@type": "TouristAttraction",
                "name": expName,
                "url": `${SITE_URL}${path}`
            }
        };
    }
    // Default fallback
    return pages[path] || {
        title: 'Recharge Travels - Luxury Sri Lanka Tours & Travel Agency',
        description: 'Discover Sri Lanka with Recharge Travels. Luxury tours, wildlife safaris, cultural experiences, beach holidays, and personalized travel packages.',
        keywords: 'Sri Lanka travel, luxury tours, wildlife safari, cultural tours, beach holidays',
        h1: 'Recharge Travels - Your Sri Lanka Travel Partner',
        content: '<p>Welcome to Recharge Travels, your trusted partner for exploring the beauty of Sri Lanka.</p>',
        schema: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Recharge Travels",
            "url": SITE_URL
        }
    };
}
// Generate pre-rendered HTML for bots
function generatePrerenderHTML(path, seo) {
    const canonicalUrl = `${SITE_URL}${path}`;
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${seo.title}</title>
  <meta name="description" content="${seo.description}">
  <meta name="keywords" content="${seo.keywords}">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph -->
  <meta property="og:title" content="${seo.title}">
  <meta property="og:description" content="${seo.description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="https://i.imgur.com/AEnBWJf.jpeg">
  <meta property="og:site_name" content="${COMPANY_NAME}">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${seo.title}">
  <meta name="twitter:description" content="${seo.description}">

  <!-- Googlebot directives -->
  <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large">
  <meta name="robots" content="index, follow">

  <!-- Structured Data -->
  <script type="application/ld+json">${JSON.stringify(seo.schema)}</script>

  <!-- Organization Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "${COMPANY_NAME}",
    "url": "${SITE_URL}",
    "telephone": "${COMPANY_PHONE}",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "2847"
    }
  }
  </script>
</head>
<body>
  <header>
    <nav>
      <a href="/">${COMPANY_NAME}</a>
      <a href="/tours">Tours</a>
      <a href="/experiences">Experiences</a>
      <a href="/hotels">Hotels</a>
      <a href="/airport-transfers">Transfers</a>
      <a href="/train-booking">Train Booking</a>
      <a href="/contact">Contact</a>
    </nav>
  </header>

  <main>
    <h1>${seo.h1}</h1>
    ${seo.content}

    <section>
      <h2>Why Choose ${COMPANY_NAME}?</h2>
      <ul>
        <li>4.9/5 Rating from 2,847+ verified reviews</li>
        <li>TripAdvisor Certificate of Excellence</li>
        <li>24/7 Customer Support</li>
        <li>Best Price Guarantee</li>
        <li>Licensed Sri Lanka Tourism Operator</li>
      </ul>
    </section>

    <section>
      <h2>Contact Us</h2>
      <p>Phone: <a href="tel:+94777721999">${COMPANY_PHONE}</a></p>
      <p>Email: <a href="mailto:info@rechargetravels.com">info@rechargetravels.com</a></p>
      <p>WhatsApp: <a href="https://wa.me/94777721999">${COMPANY_PHONE}</a></p>
    </section>
  </main>

  <footer>
    <p>© 2025 ${COMPANY_NAME} & Tours Ltd. All rights reserved.</p>
    <p>Sri Lanka Tourism Licensed | SLTDA Registered</p>
    <nav>
      <a href="/about">About Us</a>
      <a href="/terms">Terms</a>
      <a href="/privacy">Privacy Policy</a>
      <a href="/sitemap.xml">Sitemap</a>
    </nav>
  </footer>
</body>
</html>`;
}
/**
 * Prerender function that serves static HTML to search engine bots
 * This helps with SEO for JavaScript-heavy SPA pages
 */
exports.prerender = functions
    .region('asia-south1')
    .https.onRequest(async (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    const path = req.path || '/';
    console.log(`Prerender request: ${path} | UA: ${userAgent.substring(0, 50)}...`);
    // Check if request is from a bot
    if (isBot(userAgent)) {
        console.log(`Bot detected: ${userAgent.substring(0, 100)}`);
        const seo = getPageSEO(path);
        const html = generatePrerenderHTML(path, seo);
        res.set('Content-Type', 'text/html; charset=utf-8');
        res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        res.set('X-Prerendered', 'true');
        res.status(200).send(html);
        return;
    }
    // For regular users, redirect to the SPA
    res.redirect(302, `${SITE_URL}${path}`);
});
/**
 * Health check endpoint for the prerender service
 */
exports.prerenderHealth = functions
    .region('asia-south1')
    .https.onRequest(async (req, res) => {
    res.json({
        status: 'healthy',
        service: 'prerender',
        timestamp: new Date().toISOString(),
        supportedRoutes: ['/experiences', '/tours', '/hotels', '/airport-transfers', '/train-booking', '/destinations/*', '/experiences/*']
    });
});
//# sourceMappingURL=prerender.js.map