export interface Phase1PageContent {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  sections: Array<{
    id: string;
    type: 'text' | 'image' | 'hero' | 'stats' | 'gallery' | 'cta';
    heading?: string;
    content?: string;
    image?: string;
    imageAlt?: string;
    order: number;
    settings?: Record<string, any>;
  }>;
  status: 'published';
}

export const phase1Pages: Phase1PageContent[] = [
  // HOMEPAGE
  {
    id: 'home',
    slug: '/',
    title: 'Recharge Travels - Sri Lanka Tourism',
    metaTitle: 'Sri Lanka Tourism | Best Tours & Travel Packages | Recharge Travels',
    metaDescription: 'Discover Sri Lanka with Recharge Travels. Book cultural tours, wildlife safaris, beach holidays, and luxury experiences. Expert guides, custom packages, and unforgettable adventures.',
    metaKeywords: 'Sri Lanka tourism, Sri Lanka tours, cultural tours, wildlife safaris, beach holidays, luxury travel, Colombo, Kandy, Sigiriya, Ella, Galle',
    heroTitle: 'Discover the Magic of Sri Lanka',
    heroSubtitle: 'Experience Ancient Temples, Pristine Beaches & Wildlife Adventures',
    heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920',
    status: 'published',
    sections: [
      {
        id: 'hero-stats',
        type: 'stats',
        heading: 'Why Choose Sri Lanka',
        content: JSON.stringify([
          { value: '8', label: 'UNESCO Sites', desc: 'World heritage treasures' },
          { value: '1,340km', label: 'Coastline', desc: 'Pristine beaches' },
          { value: '3,000+', label: 'Endemic Species', desc: 'Biodiversity hotspot' },
          { value: '2,500+', label: 'Years of History', desc: 'Ancient civilization' }
        ]),
        order: 1
      },
      {
        id: 'main-content',
        type: 'text',
        heading: 'Welcome to Sri Lanka',
        content: '<p>Sri Lanka, the teardrop-shaped island in the Indian Ocean, offers an incredible diversity of experiences within its compact borders. From misty mountains and lush rainforests to golden beaches and ancient ruins, this tropical paradise has captivated travelers for centuries.</p><p>With a history spanning over 2,500 years, Sri Lanka boasts eight UNESCO World Heritage Sites, a rich cultural tapestry influenced by Buddhism, Hinduism, and colonial heritage, and some of the world\'s finest tea, spices, and gemstones.</p>',
        order: 2
      },
      {
        id: 'highlights',
        type: 'text',
        heading: 'What Makes Sri Lanka Special',
        content: '<ul><li><strong>Ancient Buddhist temples and stupas</strong> - Sacred sites of spiritual significance</li><li><strong>Pristine beaches and coral reefs</strong> - Perfect for swimming, surfing, and diving</li><li><strong>Misty tea plantations</strong> - Experience the world-famous Ceylon tea</li><li><strong>Wildlife safaris in national parks</strong> - Spot elephants, leopards, and exotic birds</li><li><strong>Spice gardens and plantations</strong> - Discover the origins of world-famous spices</li><li><strong>Colonial architecture</strong> - Portuguese, Dutch, and British influences</li><li><strong>Traditional Ayurvedic treatments</strong> - Ancient healing practices</li><li><strong>Adventure sports and activities</strong> - Hiking, rafting, and water sports</li></ul>',
        order: 3
      },
      {
        id: 'cta-section',
        type: 'cta',
        heading: 'Ready to Explore Sri Lanka?',
        content: 'Start planning your unforgettable journey to the Pearl of the Indian Ocean',
        order: 4,
        settings: {
          ctaButton: {
            text: 'Browse Our Tours',
            url: '/tours'
          }
        }
      }
    ]
  },

  // COLOMBO
  {
    id: 'colombo',
    slug: '/destinations/colombo',
    title: 'Colombo - Sri Lanka\'s Vibrant Capital',
    metaTitle: 'Colombo Travel Guide | Capital City of Sri Lanka | Recharge Travels',
    metaDescription: 'Explore Colombo, Sri Lanka\'s bustling capital city. Discover colonial architecture, modern shopping, cultural sites, and authentic cuisine. Plan your Colombo city tour.',
    metaKeywords: 'Colombo, Sri Lanka capital, Colombo travel, Colombo tourism, city tour, colonial architecture, shopping, restaurants',
    heroTitle: 'Colombo - Where Tradition Meets Modernity',
    heroSubtitle: 'Discover Sri Lanka\'s Vibrant Capital City',
    heroImage: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1920',
    status: 'published',
    sections: [
      {
        id: 'colombo-intro',
        type: 'text',
        heading: 'Welcome to Colombo',
        content: '<p>Colombo, the commercial capital of Sri Lanka, is a vibrant metropolis that seamlessly blends the old with the new. This bustling port city offers visitors a fascinating mix of colonial architecture, modern skyscrapers, ancient temples, and bustling markets.</p><p>As the gateway to Sri Lanka, Colombo serves as the perfect introduction to the island\'s rich culture and heritage. From the historic Fort district to the modern shopping malls of the city center, Colombo has something to offer every type of traveler.</p>',
        order: 1
      },
      {
        id: 'colombo-attractions',
        type: 'text',
        heading: 'Top Attractions in Colombo',
        content: '<h3>Gangaramaya Temple</h3><p>One of Colombo\'s most important Buddhist temples, featuring a unique blend of Sri Lankan, Thai, Indian, and Chinese architecture.</p><h3>Independence Memorial Hall</h3><p>A national monument built to commemorate the independence of Sri Lanka from British rule in 1948.</p><h3>Galle Face Green</h3><p>A 5-hectare ocean-side urban park, perfect for evening strolls and watching spectacular sunsets.</p><h3>National Museum</h3><p>Houses the largest collection of antiquities in Sri Lanka, including the throne and crown of the last king of Kandy.</p><h3>Pettah Market</h3><p>A bustling bazaar area where you can find everything from spices and textiles to electronics and souvenirs.</p>',
        order: 2
      },
      {
        id: 'colombo-culture',
        type: 'text',
        heading: 'Cultural Highlights',
        content: '<p>Colombo\'s cultural diversity is reflected in its religious sites, cuisine, and festivals. Visit the Jami Ul-Alfar Mosque with its distinctive red and white striped architecture, the St. Anthony\'s Shrine for Catholic pilgrims, or the Hindu Kovil for traditional ceremonies.</p><p>The city\'s food scene is equally diverse, offering everything from traditional Sri Lankan rice and curry to international cuisine. Don\'t miss trying the famous Colombo crab curry or fresh seafood at the beach restaurants.</p>',
        order: 3
      }
    ]
  },

  // KANDY
  {
    id: 'kandy',
    slug: '/destinations/kandy',
    title: 'Kandy - The Cultural Capital of Sri Lanka',
    metaTitle: 'Kandy Travel Guide | Cultural Capital of Sri Lanka | Recharge Travels',
    metaDescription: 'Visit Kandy, the cultural heart of Sri Lanka. Explore the Temple of the Sacred Tooth Relic, Royal Botanical Gardens, and traditional dance performances. Book your Kandy tour.',
    metaKeywords: 'Kandy, Sri Lanka, Temple of the Tooth, cultural capital, Royal Botanical Gardens, traditional dance, hill country',
    heroTitle: 'Kandy - The Sacred City',
    heroSubtitle: 'Discover the Cultural Heart of Sri Lanka',
    heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920',
    status: 'published',
    sections: [
      {
        id: 'kandy-intro',
        type: 'text',
        heading: 'The Sacred City of Kandy',
        content: '<p>Kandy, the last capital of the ancient kings of Sri Lanka, is a UNESCO World Heritage site and the cultural capital of the island. Nestled in the central highlands, this beautiful city is surrounded by lush hills and tea plantations.</p><p>The city is most famous for the Temple of the Sacred Tooth Relic, which houses the tooth of Lord Buddha and is the most sacred Buddhist site in Sri Lanka. The annual Esala Perahera festival, featuring traditional dancers and decorated elephants, is one of the most spectacular cultural events in Asia.</p>',
        order: 1
      },
      {
        id: 'kandy-attractions',
        type: 'text',
        heading: 'Must-See Attractions',
        content: '<h3>Temple of the Sacred Tooth Relic</h3><p>The most important Buddhist temple in Sri Lanka, housing the sacred tooth relic of Lord Buddha. The temple complex features stunning architecture and beautiful gardens.</p><h3>Royal Botanical Gardens</h3><p>Spread over 147 acres, these gardens feature over 4,000 species of plants, including the famous orchid house and giant bamboo groves.</p><h3>Kandy Lake</h3><p>Built by the last king of Kandy, this artificial lake is surrounded by a scenic walking path and offers beautiful views of the city.</p><h3>Traditional Dance Performances</h3><p>Experience the vibrant Kandyan dance performances, featuring colorful costumes, rhythmic drumming, and acrobatic displays.</p>',
        order: 2
      },
      {
        id: 'kandy-culture',
        type: 'text',
        heading: 'Cultural Experiences',
        content: '<p>Kandy offers numerous cultural experiences, from visiting ancient temples and watching traditional dance performances to exploring the city\'s rich history through its museums and heritage sites.</p><p>The city is also famous for its traditional crafts, including wood carving, brass work, and batik fabric. Visit local workshops to see artisans at work and purchase authentic souvenirs.</p>',
        order: 3
      }
    ]
  },

  // GALLE
  {
    id: 'galle',
    slug: '/destinations/galle',
    title: 'Galle - Historic Fort City by the Sea',
    metaTitle: 'Galle Fort Travel Guide | Historic Coastal City | Recharge Travels',
    metaDescription: 'Explore Galle Fort, a UNESCO World Heritage site. Discover colonial architecture, boutique hotels, art galleries, and stunning ocean views. Plan your Galle tour.',
    metaKeywords: 'Galle Fort, Galle, Sri Lanka, UNESCO World Heritage, colonial architecture, coastal city, boutique hotels',
    heroTitle: 'Galle Fort - Where History Meets the Sea',
    heroSubtitle: 'Explore the UNESCO World Heritage Fort City',
    heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920',
    status: 'published',
    sections: [
      {
        id: 'galle-intro',
        type: 'text',
        heading: 'The Historic Fort City',
        content: '<p>Galle Fort, a UNESCO World Heritage site, is one of the best-preserved examples of a fortified city built by Europeans in South and Southeast Asia. The fort was originally built by the Portuguese in the 16th century and later extensively fortified by the Dutch in the 17th century.</p><p>Today, Galle Fort is a charming blend of colonial architecture, boutique hotels, art galleries, and trendy cafes. The narrow streets, historic buildings, and stunning ocean views make it one of Sri Lanka\'s most picturesque destinations.</p>',
        order: 1
      },
      {
        id: 'galle-attractions',
        type: 'text',
        heading: 'Exploring Galle Fort',
        content: '<h3>Fort Walls and Lighthouse</h3><p>Walk along the massive fort walls that have protected the city for centuries. The iconic lighthouse, built in 1939, offers spectacular views of the Indian Ocean.</p><h3>Historic Buildings</h3><p>Explore the Dutch Reformed Church, All Saints\' Church, and the old Dutch Hospital, now converted into a shopping and dining complex.</p><h3>Art Galleries and Boutiques</h3><p>Discover local art galleries showcasing contemporary Sri Lankan art, and boutique shops selling handmade jewelry, textiles, and souvenirs.</p><h3>Sunset Views</h3><p>The western ramparts of the fort offer some of the most beautiful sunset views in Sri Lanka, perfect for photography and romantic evenings.</p>',
        order: 2
      },
      {
        id: 'galle-culture',
        type: 'text',
        heading: 'Cultural Heritage',
        content: '<p>Galle Fort is not just a historical site but a living community where locals and expatriates coexist. The fort area is home to boutique hotels, restaurants serving both local and international cuisine, and cultural events throughout the year.</p><p>The Galle Literary Festival, held annually in January, attracts writers and literature enthusiasts from around the world, making it a cultural highlight of the city.</p>',
        order: 3
      }
    ]
  },

  // SIGIRIYA
  {
    id: 'sigiriya',
    slug: '/destinations/sigiriya',
    title: 'Sigiriya - The Ancient Rock Fortress',
    metaTitle: 'Sigiriya Rock Fortress | Ancient Palace in the Sky | Recharge Travels',
    metaDescription: 'Climb Sigiriya, the ancient rock fortress and palace. Explore the Lion Rock, frescoes, and royal gardens. UNESCO World Heritage site. Book your Sigiriya tour.',
    metaKeywords: 'Sigiriya, Lion Rock, rock fortress, ancient palace, UNESCO World Heritage, frescoes, Sri Lanka archaeology',
    heroTitle: 'Sigiriya - The Eighth Wonder of the World',
    heroSubtitle: 'Climb the Ancient Rock Fortress Palace',
    heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920',
    status: 'published',
    sections: [
      {
        id: 'sigiriya-intro',
        type: 'text',
        heading: 'The Lion Rock Fortress',
        content: '<p>Sigiriya, also known as the Lion Rock, is one of Sri Lanka\'s most iconic landmarks and a UNESCO World Heritage site. This ancient palace and fortress complex was built by King Kasyapa in the 5th century AD and is considered one of the most important archaeological sites in Asia.</p><p>The massive rock rises 200 meters above the surrounding plains and was once the site of a magnificent palace complex, complete with gardens, pools, and elaborate frescoes. Today, visitors can climb to the top to explore the ruins and enjoy breathtaking views of the surrounding countryside.</p>',
        order: 1
      },
      {
        id: 'sigiriya-attractions',
        type: 'text',
        heading: 'What to See at Sigiriya',
        content: '<h3>The Frescoes</h3><p>The famous Sigiriya frescoes, depicting beautiful maidens, are located in a sheltered pocket of the rock face. These 5th-century paintings are considered masterpieces of ancient art.</p><h3>The Mirror Wall</h3><p>Once polished to a mirror-like finish, this wall is covered in ancient graffiti written by visitors over the centuries, providing fascinating insights into the site\'s history.</p><h3>The Lion\'s Paw</h3><p>At the entrance to the palace, visitors pass through the remains of a massive lion statue, with only the paws remaining today.</p><h3>The Royal Gardens</h3><p>The extensive water gardens, terraced gardens, and boulder gardens showcase sophisticated ancient engineering and landscaping techniques.</p>',
        order: 2
      },
      {
        id: 'sigiriya-tips',
        type: 'text',
        heading: 'Visiting Tips',
        content: '<p><strong>Best Time to Visit:</strong> Early morning (6-8 AM) to avoid crowds and heat, or late afternoon for sunset views.</p><p><strong>Climbing:</strong> The climb involves 1,200 steps and takes about 2-3 hours round trip. Wear comfortable shoes and bring water.</p><p><strong>Photography:</strong> Photography is allowed throughout the site, but flash photography is prohibited in the fresco area.</p><p><strong>Guides:</strong> Consider hiring a local guide to learn about the fascinating history and architecture of this ancient wonder.</p>',
        order: 3
      }
    ]
  },

  // ELLA
  {
    id: 'ella',
    slug: '/destinations/ella',
    title: 'Ella - Hill Country Paradise',
    metaTitle: 'Ella Travel Guide | Hill Country Paradise | Recharge Travels',
    metaDescription: 'Visit Ella, the charming hill country town. Hike to Ella Rock, visit Nine Arch Bridge, and enjoy stunning mountain views. Book your Ella adventure tour.',
    metaKeywords: 'Ella, Sri Lanka hill country, Ella Rock, Nine Arch Bridge, hiking, tea plantations, mountain views',
    heroTitle: 'Ella - Gateway to the Hill Country',
    heroSubtitle: 'Experience Mountain Adventures and Tea Plantations',
    heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920',
    status: 'published',
    sections: [
      {
        id: 'ella-intro',
        type: 'text',
        heading: 'Welcome to Ella',
        content: '<p>Ella, a small town nestled in the heart of Sri Lanka\'s hill country, has become one of the island\'s most popular destinations for nature lovers and adventure seekers. Surrounded by tea plantations, misty mountains, and scenic valleys, Ella offers a perfect escape from the heat and hustle of the lowlands.</p><p>The town\'s laid-back atmosphere, stunning natural beauty, and numerous hiking trails make it an ideal destination for those looking to experience the authentic charm of Sri Lanka\'s hill country.</p>',
        order: 1
      },
      {
        id: 'ella-attractions',
        type: 'text',
        heading: 'Top Attractions in Ella',
        content: '<h3>Ella Rock</h3><p>A challenging 4-5 hour hike that rewards visitors with panoramic views of the surrounding mountains and valleys. The trail passes through tea plantations and local villages.</p><h3>Nine Arch Bridge</h3><p>This iconic railway bridge, built during the British colonial period, is one of the most photographed landmarks in Sri Lanka. Visit early morning for the best photos.</p><h3>Little Adam\'s Peak</h3><p>A relatively easy 1-2 hour hike offering spectacular views of Ella Gap and the surrounding countryside. Perfect for sunrise or sunset.</p><h3>Tea Plantations</h3><p>Visit local tea factories to learn about the tea-making process and enjoy a cup of freshly brewed Ceylon tea while taking in the mountain views.</p>',
        order: 2
      },
      {
        id: 'ella-activities',
        type: 'text',
        heading: 'Adventure Activities',
        content: '<p>Ella is a paradise for outdoor enthusiasts. Besides hiking, visitors can enjoy:</p><ul><li><strong>Rock Climbing:</strong> Several climbing routes for both beginners and experienced climbers</li><li><strong>Zip Lining:</strong> Experience the thrill of flying over tea plantations</li><li><strong>Mountain Biking:</strong> Explore the countryside on two wheels</li><li><strong>Yoga and Meditation:</strong> Many guesthouses offer yoga classes with mountain views</li><li><strong>Railway Journeys:</strong> Take the scenic train ride from Ella to Kandy or Nuwara Eliya</li></ul>',
        order: 3
      }
    ]
  },

  // WILDLIFE TOURS
  {
    id: 'wildtours',
    slug: '/tours/wildtours',
    title: 'Wildlife Tours - Safari Adventures in Sri Lanka',
    metaTitle: 'Wildlife Tours Sri Lanka | Safari Adventures | Recharge Travels',
    metaDescription: 'Experience incredible wildlife tours in Sri Lanka. Spot elephants, leopards, and exotic birds on safari adventures. Visit Yala, Udawalawe, and Wilpattu national parks.',
    metaKeywords: 'wildlife tours, safari Sri Lanka, Yala National Park, Udawalawe, elephants, leopards, bird watching, nature tours',
    heroTitle: 'Wildlife Safari Adventures',
    heroSubtitle: 'Discover Sri Lanka\'s Incredible Wildlife and National Parks',
    heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920',
    status: 'published',
    sections: [
      {
        id: 'wildlife-intro',
        type: 'text',
        heading: 'Sri Lanka\'s Wildlife Paradise',
        content: '<p>Sri Lanka is a biodiversity hotspot, home to an incredible variety of wildlife including elephants, leopards, sloth bears, and over 400 species of birds. Our wildlife tours take you to the heart of the island\'s most spectacular national parks and wildlife sanctuaries.</p><p>From the famous Yala National Park, known for its high density of leopards, to the elephant paradise of Udawalawe, each park offers unique wildlife viewing opportunities and unforgettable safari experiences.</p>',
        order: 1
      },
      {
        id: 'wildlife-parks',
        type: 'text',
        heading: 'Top National Parks',
        content: '<h3>Yala National Park</h3><p>Famous for its high density of leopards, Yala also offers excellent opportunities to spot elephants, crocodiles, and a variety of bird species. The park\'s diverse habitats include grasslands, forests, and coastal areas.</p><h3>Udawalawe National Park</h3><p>Known as the elephant paradise, Udawalawe is home to large herds of Asian elephants. The park also supports water buffalo, sambar deer, and numerous bird species.</p><h3>Wilpattu National Park</h3><p>The largest national park in Sri Lanka, Wilpattu features numerous natural lakes and is home to leopards, elephants, and sloth bears.</p><h3>Minneriya National Park</h3><p>Famous for the "Gathering," where hundreds of elephants congregate around the reservoir during the dry season.</p>',
        order: 2
      },
      {
        id: 'wildlife-safaris',
        type: 'text',
        heading: 'Safari Experiences',
        content: '<p>Our wildlife tours include:</p><ul><li><strong>Morning and Evening Safaris:</strong> The best times to spot wildlife</li><li><strong>Expert Guides:</strong> Experienced naturalists who know the parks intimately</li><li><strong>Comfortable Vehicles:</strong> Open-top jeeps for optimal wildlife viewing</li><li><strong>Photography Tours:</strong> Specialized tours for wildlife photography</li><li><strong>Bird Watching:</strong> Guided tours focusing on Sri Lanka\'s rich birdlife</li><li><strong>Conservation Visits:</strong> Learn about wildlife conservation efforts</li></ul>',
        order: 3
      }
    ]
  },

  // CULTURAL TOURS
  {
    id: 'cultural-tours',
    slug: '/tours/cultural',
    title: 'Cultural Tours - Discover Sri Lanka\'s Rich Heritage',
    metaTitle: 'Cultural Tours Sri Lanka | Heritage & Traditions | Recharge Travels',
    metaDescription: 'Explore Sri Lanka\'s rich cultural heritage on our cultural tours. Visit ancient temples, historical sites, and experience traditional arts and crafts.',
    metaKeywords: 'cultural tours, Sri Lanka heritage, ancient temples, historical sites, traditional arts, Buddhist temples, cultural experiences',
    heroTitle: 'Cultural Heritage Tours',
    heroSubtitle: 'Discover Sri Lanka\'s Ancient Temples and Rich Traditions',
    heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920',
    status: 'published',
    sections: [
      {
        id: 'cultural-intro',
        type: 'text',
        heading: 'Sri Lanka\'s Cultural Heritage',
        content: '<p>Sri Lanka\'s cultural heritage spans over 2,500 years, shaped by Buddhism, Hinduism, and various colonial influences. Our cultural tours take you on a journey through time, exploring ancient temples, historical sites, and traditional arts and crafts.</p><p>From the sacred Temple of the Tooth in Kandy to the ancient ruins of Anuradhapura and Polonnaruwa, each site tells a story of Sri Lanka\'s rich and diverse cultural history.</p>',
        order: 1
      },
      {
        id: 'cultural-sites',
        type: 'text',
        heading: 'Sacred Sites and Temples',
        content: '<h3>Temple of the Sacred Tooth Relic (Kandy)</h3><p>The most sacred Buddhist temple in Sri Lanka, housing the tooth relic of Lord Buddha. The temple complex features stunning architecture and beautiful gardens.</p><h3>Anuradhapura</h3><p>One of the ancient capitals of Sri Lanka, featuring the sacred Bodhi tree and numerous stupas and temples dating back to the 3rd century BC.</p><h3>Polonnaruwa</h3><p>Another ancient capital with well-preserved ruins including the Royal Palace, Gal Vihara with its massive Buddha statues, and numerous temples.</p><h3>Dambulla Cave Temple</h3><p>A complex of five cave temples with over 150 Buddha statues and beautiful frescoes dating back to the 1st century BC.</p>',
        order: 2
      },
      {
        id: 'cultural-experiences',
        type: 'text',
        heading: 'Cultural Experiences',
        content: '<p>Our cultural tours include:</p><ul><li><strong>Temple Visits:</strong> Guided tours of ancient Buddhist and Hindu temples</li><li><strong>Traditional Dance:</strong> Watch Kandyan and other traditional dance performances</li><li><strong>Arts and Crafts:</strong> Visit workshops for wood carving, brass work, and batik</li><li><strong>Ayurvedic Medicine:</strong> Learn about traditional healing practices</li><li><strong>Local Markets:</strong> Experience the vibrant atmosphere of local bazaars</li><li><strong>Traditional Cooking:</strong> Learn to cook authentic Sri Lankan dishes</li></ul>',
        order: 3
      }
    ]
  }
]; 