import { Pinecone } from '@pinecone-database/pinecone'
import { Configuration, OpenAIApi } from 'openai'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'

// Initialize services
const pinecone = new Pinecone({
  apiKey: process.env.VITE_PINECONE_API_KEY!,
  environment: process.env.VITE_PINECONE_ENVIRONMENT!
})

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.VITE_OPENAI_API_KEY
  })
)

// Sri Lankan travel websites to scrape
const KNOWLEDGE_SOURCES = [
  {
    url: 'https://www.srilanka.travel/',
    category: 'official-tourism'
  },
  {
    url: 'https://www.lonelyplanet.com/sri-lanka',
    category: 'travel-guide'
  },
  {
    url: 'https://www.tripadvisor.com/Tourism-g293961-Sri_Lanka-Vacations.html',
    category: 'reviews'
  },
  {
    url: 'https://www.mysrilanka.com/',
    category: 'local-insights'
  },
  {
    url: 'https://www.yamu.lk/',
    category: 'local-recommendations'
  }
]

// Additional static knowledge
const STATIC_KNOWLEDGE = [
  {
    id: 'beaches-overview',
    content: `Sri Lankan Beaches Guide:
    
    SOUTH COAST (Nov-Apr best):
    - Mirissa: Whale watching capital, blue whales Dec-Apr, chill vibe
    - Unawatuna: Family-friendly, calm waters, great restaurants
    - Weligama: Learn to surf, stilt fishermen, coconut tree hill
    - Hiriketiya: Hipster paradise, surf breaks, yoga retreats
    - Tangalle: Pristine beaches, less crowded, turtle watching
    
    EAST COAST (Apr-Sep best):
    - Arugam Bay: World-class surfing, backpacker heaven
    - Pasikudah: Shallow waters, luxury resorts
    - Kalkudah: Long pristine beach, water sports
    - Nilaveli: Near Trinco, diving spots, Pigeon Island
    
    HIDDEN GEMS:
    - Kudawella Blowhole: Natural fountain, less touristy
    - Dikwella Beach: Rock pools, natural jacuzzi
    - Kahandamodara: Secret beach near Tangalle`,
    category: 'beaches',
    metadata: {
      type: 'guide',
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: 'wildlife-parks',
    content: `Sri Lankan Wildlife Parks:
    
    YALA NATIONAL PARK:
    - Highest leopard density in the world
    - Best time: Feb-June (dry season)
    - Also see: Elephants, sloth bears, crocodiles
    - Book Block 1 for best leopard sightings
    - Stay: Cinnamon Wild or camping
    
    UDAWALAWE:
    - Best for elephants (400+ individuals)
    - Baby elephant transit home visits
    - Less crowded than Yala
    - Better roads, suitable for families
    
    MINNERIYA:
    - The Gathering: 200+ elephants (Aug-Sep)
    - Ancient tank (reservoir) setting
    - Best afternoon safaris
    
    WILPATTU:
    - Largest park, least crowded
    - Natural lakes (villus)
    - Leopards, sloth bears
    - More adventurous, rougher roads
    
    BUNDALA:
    - Birdwatcher's paradise
    - Greater flamingos (Nov-Mar)
    - Coastal wetland ecosystem`,
    category: 'wildlife',
    metadata: {
      type: 'guide',
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: 'cultural-sites',
    content: `Sri Lankan Cultural Heritage:
    
    CULTURAL TRIANGLE:
    - Sigiriya: Lion Rock fortress, 5th century, frescoes
    - Dambulla: Cave temples, 2000-year-old paintings
    - Anuradhapura: Ancient capital, sacred Bo tree
    - Polonnaruwa: Medieval capital, Gal Vihara statues
    
    KANDY:
    - Temple of Tooth: Buddha's tooth relic
    - Perahera Festival: July/August spectacle
    - Royal Botanical Gardens
    - Traditional dance shows
    
    GALLE:
    - Dutch Fort: UNESCO site, boutique shops
    - Lighthouse, ramparts walk at sunset
    - Cricket stadium inside fort
    - Art galleries and cafes
    
    TEMPLES ETIQUETTE:
    - Remove shoes and hats
    - Cover shoulders and knees
    - No photos with back to Buddha
    - Small donation appreciated`,
    category: 'culture',
    metadata: {
      type: 'guide',
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: 'food-guide',
    content: `Sri Lankan Cuisine Guide:
    
    MUST-TRY DISHES:
    - Rice & Curry: Daily staple, multiple curries
    - Kottu Roti: Chopped roti street food, rhythmic cooking
    - Hoppers: Bowl-shaped pancakes, egg hoppers for breakfast
    - String Hoppers: Steamed rice noodle nests
    - Lamprais: Dutch-Burgher dish, banana leaf packet
    
    STREET FOOD:
    - Isso Wade: Prawn fritters
    - Rolls: Godamba roti with filling
    - Samosas: Vegetable or fish
    - Wood apple juice: Unique local fruit
    
    SWEETS:
    - Watalappan: Coconut custard
    - Kiri Pani: Curd with treacle
    - Kokis: Crispy traditional cookies
    
    WHERE TO EAT:
    - Colombo: Ministry of Crab, Upali's
    - Galle: Wijaya Beach, Lucky Fort
    - Ella: Chill Cafe, 98 Acres
    - Local spots: Ask for "bath kade" (rice shops)`,
    category: 'food',
    metadata: {
      type: 'guide',
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: 'practical-info',
    content: `Practical Sri Lanka Travel Info:
    
    VISA:
    - ETA required for most nationalities
    - Apply online: eta.gov.lk
    - 30-day tourist visa
    - Extension possible in Colombo
    
    TRANSPORT:
    - Tuk-tuks: Negotiate fare first, use PickMe app
    - Trains: Scenic routes (Kandy-Ella), book 1st class
    - Buses: Cheap but crowded, AC buses available
    - Private driver: $40-60/day including fuel
    
    MONEY:
    - Currency: Sri Lankan Rupee (LKR)
    - ATMs widely available
    - Credit cards in tourist areas
    - Always carry cash for local spots
    
    WEATHER:
    - West/South: Dec-Mar (dry)
    - East: Apr-Sep (dry)
    - Hill country: Cool year-round
    - Two monsoons affect different coasts
    
    COSTS (Daily Budget):
    - Backpacker: $20-30
    - Mid-range: $50-80
    - Luxury: $150+`,
    category: 'practical',
    metadata: {
      type: 'guide',
      lastUpdated: new Date().toISOString()
    }
  }
]

async function scrapeWebsite(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)
    
    // Remove scripts and styles
    $('script, style').remove()
    
    // Extract text content
    const content = $('body').text()
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 5000) // Limit content length
    
    return content
  } catch (error) {
    console.error(`Error scraping ${url}:`, error)
    return ''
  }
}

async function createEmbedding(text: string): Promise<number[]> {
  const response = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: text
  })
  
  return response.data.data[0].embedding
}

async function buildKnowledgeBase() {
  console.log('🏗️ Building Yalu Knowledge Base...')
  
  // Initialize Pinecone index
  const index = pinecone.Index('yalu-memory')
  
  // Process static knowledge
  console.log('📚 Processing static knowledge...')
  for (const knowledge of STATIC_KNOWLEDGE) {
    const embedding = await createEmbedding(knowledge.content)
    
    await index.upsert([{
      id: knowledge.id,
      values: embedding,
      metadata: {
        ...knowledge.metadata,
        category: knowledge.category,
        content: knowledge.content.slice(0, 1000) // Store truncated content
      }
    }])
    
    console.log(`✅ Added: ${knowledge.id}`)
  }
  
  // Scrape and process websites
  console.log('🌐 Scraping websites...')
  for (const source of KNOWLEDGE_SOURCES) {
    const content = await scrapeWebsite(source.url)
    if (content) {
      const embedding = await createEmbedding(content)
      
      await index.upsert([{
        id: `web-${source.category}-${Date.now()}`,
        values: embedding,
        metadata: {
          source: source.url,
          category: source.category,
          content: content.slice(0, 1000),
          scrapedAt: new Date().toISOString()
        }
      }])
      
      console.log(`✅ Scraped: ${source.url}`)
    }
  }
  
  console.log('🎉 Knowledge base built successfully!')
}

// Run the builder
buildKnowledgeBase().catch(console.error)