import { Pinecone } from '@pinecone-database/pinecone'
import OpenAI from 'openai'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import * as fs from 'fs/promises'
import * as path from 'path'

// Initialize services
const pinecone = new Pinecone({
  apiKey: process.env.VITE_PINECONE_API_KEY!
})

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY!
})

// Knowledge categories for Sri Lanka
const KNOWLEDGE_CATEGORIES = {
  DESTINATIONS: 'destinations',
  BEACHES: 'beaches',
  WILDLIFE: 'wildlife',
  CULTURE: 'culture',
  FOOD: 'food',
  TRANSPORT: 'transport',
  ACCOMMODATION: 'accommodation',
  ACTIVITIES: 'activities',
  WEATHER: 'weather',
  PRACTICAL: 'practical',
  HISTORY: 'history',
  FESTIVALS: 'festivals',
  SHOPPING: 'shopping',
  HEALTH: 'health'
}

// Comprehensive Sri Lankan knowledge sources
const KNOWLEDGE_SOURCES = [
  // Official Tourism Sites
  {
    url: 'https://www.srilanka.travel/',
    category: KNOWLEDGE_CATEGORIES.DESTINATIONS,
    depth: 2 // Crawl 2 levels deep
  },
  {
    url: 'https://www.srilanka.travel/beaches',
    category: KNOWLEDGE_CATEGORIES.BEACHES
  },
  {
    url: 'https://www.srilanka.travel/wildlife',
    category: KNOWLEDGE_CATEGORIES.WILDLIFE
  },
  
  // Travel Guides
  {
    url: 'https://www.lonelyplanet.com/sri-lanka',
    category: KNOWLEDGE_CATEGORIES.PRACTICAL,
    selector: '.article-body' // Specific content selector
  },
  {
    url: 'https://www.roughguides.com/sri-lanka/',
    category: KNOWLEDGE_CATEGORIES.DESTINATIONS
  },
  
  // Local Insights
  {
    url: 'https://www.yamu.lk/place-type/restaurants',
    category: KNOWLEDGE_CATEGORIES.FOOD
  },
  {
    url: 'https://roar.media/english/life/culture-identities/',
    category: KNOWLEDGE_CATEGORIES.CULTURE
  },
  
  // Wildlife & Nature
  {
    url: 'https://www.dwc.gov.lk/national-parks/',
    category: KNOWLEDGE_CATEGORIES.WILDLIFE
  },
  
  // Weather & Climate
  {
    url: 'https://www.meteo.gov.lk/',
    category: KNOWLEDGE_CATEGORIES.WEATHER
  }
]

// Structured knowledge templates
const STRUCTURED_KNOWLEDGE = [
  // Comprehensive Beach Guide
  {
    id: 'beaches-complete-guide',
    title: 'Complete Sri Lankan Beach Guide 2025',
    content: `
# Sri Lankan Beaches - Complete Guide

## SOUTH COAST BEACHES (Best: November - April)

### Mirissa Beach
- **Known for**: Whale watching capital of Sri Lanka
- **Best time**: December to April for blue whales
- **Activities**: Surfing, snorkeling, beach bars, coconut tree hill
- **Vibe**: Backpacker-friendly, lively nightlife
- **Accommodation**: Budget hostels to luxury villas
- **Must-do**: Sunrise whale watching tour, sunset at Coconut Tree Hill
- **Local tip**: Try the fresh seafood BBQ at beach restaurants

### Unawatuna Beach
- **Known for**: Calm waters, family-friendly
- **Best time**: December to March
- **Activities**: Swimming, snorkeling, diving, yoga
- **Vibe**: Tourist-friendly, well-developed
- **Special**: Japanese Peace Pagoda nearby
- **Water sports**: Jet skiing, banana boat rides
- **Local secret**: Jungle Beach for a quieter experience

### Weligama Bay
- **Known for**: Stilt fishermen, surf breaks
- **Best time**: Year-round for beginners
- **Activities**: Learn to surf, SUP boarding
- **Famous for**: Snake Island (walkable at low tide)
- **Surf spots**: Coconut Point, Lazy Left, Rams Right
- **Photography**: Best stilt fishermen shots at sunrise

### Tangalle
- **Known for**: Long pristine beaches, less crowded
- **Best time**: December to April
- **Activities**: Turtle watching, lagoon tours
- **Beaches**: Goyambokka, Silent Beach, Marakolliya
- **Nature**: Rekawa turtle conservation project
- **Accommodation**: Eco-lodges and boutique hotels

### Hiriketiya Bay
- **Known for**: Horseshoe-shaped bay, hipster paradise
- **Best time**: November to April
- **Activities**: Surfing, yoga retreats, healthy cafes
- **Vibe**: Bohemian, eco-conscious
- **Surf level**: Beginner to intermediate
- **Stay**: Beachfront cabanas and guesthouses

## EAST COAST BEACHES (Best: April - September)

### Arugam Bay
- **Known for**: World-class surf breaks
- **Best time**: May to September
- **Activities**: Surfing, parties, wildlife safaris
- **Main Point**: International surf competitions
- **Other breaks**: Whiskey Point, Peanut Farm
- **Wildlife**: Kumana National Park nearby
- **Vibe**: Surf town, international crowd

### Pasikudah
- **Known for**: Shallow bay, luxury resorts
- **Best time**: May to September
- **Activities**: Swimming, water sports, relaxation
- **Special**: Can walk 100m into sea
- **Resorts**: Maalu Maalu, Anantaya, Uga Bay
- **Family**: Perfect for kids

### Nilaveli Beach
- **Known for**: White sand, Pigeon Island
- **Best time**: April to September
- **Activities**: Snorkeling, diving, island hopping
- **Marine life**: Reef sharks, sea turtles
- **Day trip**: Pigeon Island National Park
- **Historical**: Koneswaram Temple in Trincomalee

### Kalkudah Beach
- **Known for**: Longest beach stretch
- **Best time**: May to October
- **Activities**: Kite surfing, beach walks
- **Development**: Emerging destination
- **Peaceful**: Less crowded than Pasikudah

## HIDDEN BEACHES & SECRET SPOTS

### Kudawella
- **Location**: Near Tangalle
- **Famous for**: Natural blowhole
- **Best time**: Rough seas create bigger spouts
- **Swimming**: Natural rock pools

### Polhena Beach
- **Location**: Matara
- **Special**: Natural reef pool
- **Activities**: Snorkeling with sea turtles
- **Protected**: Calm waters year-round

### Talalla Beach
- **Location**: Between Matara and Tangalle
- **Vibe**: Secluded, romantic
- **Activities**: Yoga retreats, surfing
- **Accommodation**: Boutique retreats

## BEACH SAFETY & TIPS

### Swimming Safety
- Always check for red flags
- Beware of currents and riptides
- Swim near lifeguard areas
- Don't swim after drinking

### Sun Protection
- Use high SPF sunscreen
- Avoid midday sun (11am-3pm)
- Wear hats and UV clothing
- Stay hydrated

### Local Etiquette
- Respect local customs
- Dress modestly away from beach
- No nude sunbathing
- Ask before photographing locals

### Best Times Summary
- **West & South Coast**: November to April
- **East Coast**: April to September
- **Year-round options**: Bentota, Hikkaduwa (calmer areas)
    `,
    category: KNOWLEDGE_CATEGORIES.BEACHES,
    metadata: {
      type: 'comprehensive-guide',
      lastUpdated: new Date().toISOString(),
      tags: ['beaches', 'swimming', 'surfing', 'tourism'],
      importance: 'high'
    }
  },

  // Wildlife Parks Deep Dive
  {
    id: 'wildlife-parks-masterguide',
    title: 'Sri Lankan Wildlife Parks - Expert Guide',
    content: `
# Sri Lankan Wildlife Parks - Complete Expert Guide

## YALA NATIONAL PARK

### Overview
- **Size**: 979 sq km (Block 1 most popular)
- **Famous for**: Highest leopard density globally
- **Best time**: February to June (dry season)
- **Gates open**: 6:00 AM and 2:00 PM
- **Booking**: Advance booking essential for Block 1

### Wildlife Spotting Guide
- **Leopards**: Early morning in Block 1, near water holes
- **Elephants**: Throughout park, larger herds in Block 5
- **Sloth Bears**: May-July during palu fruit season
- **Birds**: 215 species including peacocks, eagles, storks
- **Crocodiles**: Spotted at water bodies
- **Deer**: Spotted deer and sambars abundant

### Safari Tips
- Book first morning slot (6 AM) for leopards
- Hire experienced tracker/driver
- Bring binoculars and telephoto lens
- Wear earth colors
- Stay quiet and patient
- Avoid weekends and holidays

### Accommodation
- **Inside**: Cinnamon Wild (luxury tented)
- **Nearby**: Jetwing Yala, Chena Huts
- **Budget**: Tissmaharama guesthouses

## UDAWALAWE NATIONAL PARK

### Overview
- **Size**: 308 sq km
- **Famous for**: Elephant guarantee (400+ elephants)
- **Best time**: Year-round, May-September optimal
- **Special**: Elephant Transit Home visits

### Unique Features
- **Elephant Transit Home**: 
  - Feeding times: 9AM, 12PM, 3PM, 6PM
  - Baby elephants rehabilitation
  - Advance booking required
- **Udawalawe Reservoir**: Scenic backdrop
- **Better roads**: Suitable for families

### Wildlife
- **Elephants**: See 50-100 per safari
- **Water buffalo**: Large herds
- **Crocodiles**: Mugger crocodiles common
- **Birds**: White-bellied sea eagle, serpent eagle
- **Rare**: Rusty-spotted cat (nocturnal)

## MINNERIYA NATIONAL PARK

### The Gathering Phenomenon
- **When**: August to September
- **What**: 200-300 elephants gather
- **Where**: Around Minneriya Tank
- **Why**: Water and fresh grass
- **Best time**: 3-6 PM

### Planning Your Visit
- **Alternative**: Kaudulla NP (July-August)
- **Combine**: With Sigiriya visit
- **Duration**: Half-day sufficient
- **Crowds**: Book private jeep early

## WILPATTU NATIONAL PARK

### Overview
- **Size**: 1,317 sq km (largest park)
- **Famous for**: Natural lakes (villus), leopards
- **Best time**: February to October
- **Special**: Less crowded, more wilderness

### Unique Ecosystem
- **Villus**: 60+ natural lakes
- **Leopards**: Good sightings but requires patience
- **Sloth bears**: Better chances than Yala
- **Birds**: 217 species, painted storks
- **Landscape**: Dense jungle, open plains

### Safari Experience
- **Duration**: Full day recommended
- **Roads**: Rougher, more adventure
- **Guides**: Local knowledge essential
- **Photography**: Dramatic landscapes

## BUNDALA NATIONAL PARK

### Birdwatcher's Paradise
- **Recognition**: UNESCO Biosphere Reserve
- **Birds**: 197 species recorded
- **Flamingos**: November to March
- **Migrants**: September to March
- **Wetlands**: Five shallow lagoons

### Highlights
- **Greater flamingos**: Up to 2000 birds
- **Crocodiles**: Highest density in parks
- **Elephants**: Smaller herds (30-40)
- **Unique**: Dry thorny scrublands
- **Photography**: Best for bird shots

## KUMANA NATIONAL PARK

### Overview
- **Location**: East coast, near Arugam Bay
- **Famous for**: Bird nesting site
- **Best time**: April to July (nesting)
- **Special**: 200+ bird species

### Birding Highlights
- **Kumana Villu**: Major nesting ground
- **Species**: Pelicans, storks, spoonbills
- **Rare**: Black-necked stork
- **Night herons**: Large colonies
- **Best viewing**: Early morning

## SAFARI PLANNING GUIDE

### What to Bring
- Binoculars (8x42 recommended)
- Camera with zoom lens
- Neutral colored clothing
- Sun protection
- Water and snacks
- Dust mask/scarf

### Booking Tips
- Book park entry online
- Choose experienced operators
- Private jeep vs shared
- Morning vs afternoon slots
- Avoid full moon days

### Photography Tips
- Golden hours best
- Higher ISO for dawn
- Bean bag for stability
- Respect animal distance
- No flash photography

### Costs (2025 Estimates)
- **Park entry**: $15-25 per person
- **Jeep hire**: $40-60 per safari
- **Guide fee**: Often included
- **Camera fee**: May apply
- **Transit Home**: $5 per person

### Conservation Notes
- Don't litter in parks
- No feeding animals
- Maintain silence
- Follow park rules
- Support eco-lodges
    `,
    category: KNOWLEDGE_CATEGORIES.WILDLIFE,
    metadata: {
      type: 'expert-guide',
      lastUpdated: new Date().toISOString(),
      tags: ['wildlife', 'safari', 'national-parks', 'conservation'],
      importance: 'high'
    }
  },

  // Cultural Heritage Sites
  {
    id: 'cultural-heritage-complete',
    title: 'Sri Lankan Cultural Heritage - Ultimate Guide',
    content: `
# Sri Lankan Cultural & UNESCO Heritage Sites

## SIGIRIYA - THE LION ROCK

### Historical Significance
- **Built**: 5th century by King Kasyapa
- **Height**: 200m (660 feet)
- **UNESCO**: World Heritage Site since 1982
- **Features**: Frescoes, mirror wall, gardens

### Visiting Guide
- **Best time**: Early morning (7 AM) or late afternoon
- **Climb duration**: 1.5-2 hours
- **Steps**: 1,200 steps to summit
- **Difficulty**: Moderate (steep sections)
- **Tickets**: $30 USD foreigners, book online

### Must-See Features
- **Frescoes**: 5th-century paintings of celestial nymphs
- **Mirror Wall**: Ancient graffiti and poems
- **Lion's Paws**: Massive carved entrance
- **Summit**: Palace ruins and 360° views
- **Water Gardens**: Sophisticated hydraulics
- **Boulder Gardens**: Natural and designed paths

### Tips
- Start early to avoid heat and crowds
- Bring water and sun protection
- Wear comfortable shoes
- Photography allowed (no flash on frescoes)
- Combine with Pidurangala Rock

## TEMPLE OF THE TOOTH - KANDY

### Sacred Significance
- **Houses**: Buddha's tooth relic
- **Built**: 1595-1687
- **Ceremonies**: Daily pujas at dawn, noon, dusk
- **Festival**: Esala Perahera (July/August)

### Visiting Protocol
- **Dress code**: Cover shoulders and knees
- **Shoes**: Remove before entering
- **Photography**: Allowed in most areas
- **Best time**: Evening puja (6:30 PM)
- **Duration**: 1-2 hours

### Esala Perahera Festival
- **Duration**: 10 days
- **Features**: Elephants, dancers, fire-breathers
- **Highlight**: Tooth relic procession
- **Booking**: Reserve accommodation months ahead
- **Tips**: Book grandstand seats for comfort

## ANCIENT CITIES

### Anuradhapura
- **Period**: 4th century BC - 11th century AD
- **Highlights**:
  - Sri Maha Bodhi (sacred Bo tree)
  - Ruwanwelisaya Dagoba
  - Jetavanarama Stupa
  - Abhayagiri Monastery
- **Best transport**: Bicycle or tuk-tuk
- **Time needed**: Full day

### Polonnaruwa
- **Period**: 11th-13th century
- **Must-see**:
  - Gal Vihara (rock Buddha statues)
  - Royal Palace complex
  - Parakrama Samudra (ancient reservoir)
  - Vatadage (circular relic house)
- **Best transport**: Bicycle perfect
- **Time needed**: Half day

### Dambulla Cave Temple
- **Age**: Over 2,000 years
- **Caves**: 5 main caves
- **Features**: 157 Buddha statues
- **Paintings**: 2,100 sq meters
- **Climb**: 300+ steps
- **Tip**: Visit after Sigiriya

## GALLE FORT

### Dutch Colonial Heritage
- **Built**: 1663 by Dutch
- **UNESCO**: World Heritage Site
- **Size**: 52 hectares
- **Features**: Ramparts, lighthouse, churches

### Walking Tour Highlights
- **Ramparts**: Best at sunset
- **Lighthouse**: Iconic photo spot
- **Dutch Reformed Church**: 1755
- **National Museum**: Former Dutch warehouse
- **Flag Rock**: Cliff jumping spot
- **Shopping**: Boutiques and galleries

### Modern Galle
- **Cafes**: Fortaleza, Poonie's Kitchen
- **Hotels**: Amangalla, Fort Bazaar
- **Events**: Galle Literary Festival (January)
- **Cricket**: International stadium

## TEMPLE ETIQUETTE GUIDE

### Dress Code
- Cover shoulders and knees
- Remove hats
- White clothing preferred for locals
- No tight or revealing clothes

### Behavior
- Remove shoes before entering
- Don't point feet at Buddha
- No photos with back to Buddha
- Silence in shrine rooms
- Walk clockwise around stupas

### Offerings
- Flowers (lotus preferred)
- Incense sticks
- Oil lamps
- Food for monks (morning)
- Small donations appreciated

## LESSER-KNOWN CULTURAL SITES

### Yapahuwa
- **Period**: 13th century
- **Feature**: Rock fortress capital
- **Highlight**: Ornate stone stairway
- **Crowds**: Much quieter than Sigiriya

### Ritigala
- **Type**: Ancient monastery
- **Special**: Medicinal herbs
- **Trek**: Forest paths
- **Mystery**: Unique architecture

### Buduruwagala
- **Feature**: 7 carved Buddha figures
- **Height**: 15m tallest statue
- **Age**: 10th century
- **Location**: Near Wellawaya

## CULTURAL EXPERIENCES

### Traditional Dance Shows
- **Kandy**: Lake Club, Red Cross Hall
- **Types**: Kandyan, low country, Sabaragamuwa
- **Duration**: 1 hour
- **Include**: Fire walking, drum performances

### Craft Villages
- **Ambalangoda**: Mask making
- **Koggala**: Stilt fishing culture
- **Dumbara Valley**: Traditional weaving
- **Kundasale**: Brass work

### Tea Culture
- **Factories**: Mackwoods, Pedro, Blue Field
- **Process**: Plucking to packaging tour
- **Tasting**: Different grades
- **Buy**: Fresh tea at factory prices

### Village Tours
- **Activities**: Bullock cart rides
- **Cooking**: Traditional rice and curry
- **Crafts**: Pottery, weaving demos
- **Duration**: Half day
- **Best**: Hiriwadunna, Habarana

## FESTIVAL CALENDAR

### Major Festivals
- **January**: Thai Pusam (Hindu)
- **February**: Independence Day
- **April**: Sinhala/Tamil New Year
- **May**: Vesak (Buddha's birth/enlightenment)
- **July/August**: Esala Perahera
- **December**: Unduvap Poya

### Planning Tips
- Book accommodation early
- Expect transport delays
- Many shops close
- Alcohol restrictions on Poya days
- Wonderful cultural immersion
    `,
    category: KNOWLEDGE_CATEGORIES.CULTURE,
    metadata: {
      type: 'cultural-guide',
      lastUpdated: new Date().toISOString(),
      tags: ['culture', 'temples', 'heritage', 'UNESCO', 'festivals'],
      importance: 'high'
    }
  },

  // Sri Lankan Cuisine Guide
  {
    id: 'cuisine-masterclass',
    title: 'Sri Lankan Cuisine - Food Lover\'s Bible',
    content: `
# Sri Lankan Cuisine - The Complete Food Guide

## RICE & CURRY - The National Dish

### Understanding Rice & Curry
- **Not a single dish**: Collection of curries with rice
- **Typical spread**: 4-7 different curries
- **Balance**: Meat/fish + vegetables + lentils + sambols
- **Eating style**: Mix small amounts with rice

### Essential Curries
- **Dhal curry**: Lentil base, everyday staple
- **Pol sambol**: Coconut relish, spicy
- **Parippu**: Another lentil variation
- **Chicken/Fish curry**: Protein component
- **Vegetable curries**: Beans, okra, eggplant
- **Mallum**: Shredded greens with coconut

### Regional Variations
- **Kandyan**: Milder, more vegetables
- **Southern**: Spicier, more seafood
- **Jaffna**: Tamil influence, unique spices
- **Eastern**: Muslim influence, biryani styles

## STREET FOOD ESSENTIALS

### Kottu Roti
- **What**: Chopped roti with vegetables/meat
- **Sound**: Rhythmic chopping on griddle
- **Types**: Vegetable, chicken, cheese, dolphin
- **Where**: Street stalls after 6 PM
- **Price**: Rs. 200-500
- **Tip**: "Spicy" means VERY spicy

### Hoppers (Appa)
- **Plain hopper**: Bowl-shaped crispy pancake
- **Egg hopper**: With egg in center
- **Milk hopper**: Sweet version
- **String hoppers**: Steamed rice noodle nests
- **Best time**: Breakfast or dinner
- **Accompaniment**: Curry or sambol

### Short Eats
- **Fish rolls**: Spiced fish in pastry
- **Vegetable roti**: Spiced vegetables wrapped
- **Isso vadai**: Prawn fritters
- **Samosas**: Vegetable or fish filled
- **Cutlets**: Breaded fish/vegetable balls
- **Where**: Bakeries, tea shops

## SEAFOOD SPECIALTIES

### Coastal Delicacies
- **Ambul thiyal**: Sour fish curry (tuna)
- **Crab curry**: Jaffna style is famous
- **Prawns curry**: Coconut based
- **Squid curry**: Black curry version
- **Fish ambulthiyal**: Dry curry preservation

### Negombo Lagoon
- **Lagoon crabs**: Sweet meat
- **Prawns**: Tiger and king varieties
- **Seer fish**: Premium catch
- **Best restaurants**: Beach Wadiya, Lords

## SWEETS & DESSERTS

### Traditional Sweets
- **Wattalapan**: Coconut custard pudding
- **Kiri bath**: Milk rice for celebrations
- **Kokis**: Crispy traditional cookies
- **Kavum**: Oil cakes for New Year
- **Aluwa**: Diamond-shaped sweet

### Modern Fusion
- **Curd & treacle**: Buffalo curd with kitul
- **Ice cream**: Elephant House local brand
- **Wood apple juice**: Unique local fruit
- **Passion fruit**: Fresh juice everywhere

## BEVERAGES

### Tea Culture
- **Ceylon tea**: World famous export
- **Plain tea**: Default very sweet
- **Milk tea**: Condensed milk common
- **Tea shops**: Social gathering spots

### Local Drinks
- **King coconut**: Orange coconuts, hydrating
- **Toddy**: Fermented palm sap
- **Arrack**: Coconut flower distilled spirit
- **Ginger beer**: Elephant House brand
- **Faluda**: Rose syrup milk drink

## WHERE TO EAT

### Colombo Fine Dining
- **Ministry of Crab**: Celebrity chef, premium
- **Upali's**: Authentic local, multiple locations
- **Nuga Gama**: Traditional village setting
- **Paradise Road**: Fusion cuisine
- **Kaema Sutra**: Modern Sri Lankan

### Local Favorites
- **Hotel de Pilawoos**: Famous kottu
- **Mathara Bath Kade**: Authentic rice & curry
- **Green Cabin**: Colombo institution
- **Fab**: Local fast food chain

### Beach Restaurants
- **Wijaya Beach**: Unawatuna
- **Roti Shop**: Mirissa
- **Lucky Fort**: Galle Fort
- **Coconut Tree Hill**: Mirissa views

## FOOD EXPERIENCES

### Cooking Classes
- **Ella Spice Garden**: Garden to table
- **Galle Fort**: Multiple options
- **Kandy**: Traditional homes
- **Duration**: 3-5 hours
- **Include**: Market visit, cooking, eating

### Tea Factory Visits
- **Process**: Plucking to packaging
- **Tasting**: Different grades
- **Locations**: Nuwara Eliya, Ella
- **Buy**: Factory prices

### Spice Gardens
- **Matale**: Major spice area
- **Products**: Cinnamon, pepper, cardamom
- **Warning**: Tourist prices high
- **Better**: Local markets

## DIETARY CONSIDERATIONS

### Vegetarian/Vegan
- **Easy**: Many vegetable curries
- **Watch**: Fish-based seasonings
- **Safe bets**: Dhal, vegetable curries
- **Fruit**: Abundant tropical varieties

### Allergies
- **Nuts**: Used in some curries
- **Seafood**: Dried fish in sambols
- **Dairy**: Coconut milk everywhere
- **Gluten**: Rice-based alternatives

### Spice Levels
- **Tourist spicy**: Still quite hot
- **Local spicy**: Extremely hot
- **Mild options**: Ask "less spicy"
- **Cool down**: Curd, coconut, banana

## FOOD SAFETY TIPS

### Street Food
- **Busy stalls**: Higher turnover
- **Cooked fresh**: Watch preparation
- **Avoid**: Pre-cut fruit, ice
- **Safe**: Boiled/fried items

### Water
- **Bottled**: Always for tourists
- **Brands**: Kist, Highland
- **Hotels**: Usually filtered
- **Ice**: Avoid at street stalls

## FOOD COSTS (2025)

### Budget Eating
- **Local rice & curry**: Rs. 200-400
- **Kottu**: Rs. 300-500
- **Short eats**: Rs. 50-150 each
- **Tea**: Rs. 30-50

### Mid-Range
- **Tourist restaurants**: Rs. 800-2000
- **Seafood**: Rs. 1500-3000
- **Western food**: Rs. 1000-2500

### High-End
- **Fine dining**: Rs. 3000-8000
- **Ministry of Crab**: Rs. 5000-15000
- **Hotels**: Rs. 2000-5000

## MUST-TRY DISHES CHECKLIST

□ Rice & curry spread
□ Kottu roti (late night)
□ Egg hopper
□ Pol sambol (coconut sambol)
□ Fish ambul thiyal
□ Lamprais (Dutch-Burgher)
□ String hoppers breakfast
□ Curd & treacle
□ Wood apple juice
□ Fresh king coconut
    `,
    category: KNOWLEDGE_CATEGORIES.FOOD,
    metadata: {
      type: 'culinary-guide',
      lastUpdated: new Date().toISOString(),
      tags: ['food', 'cuisine', 'restaurants', 'street-food', 'cooking'],
      importance: 'high'
    }
  },

  // Practical Travel Information
  {
    id: 'practical-travel-info',
    title: 'Sri Lanka Travel - Practical Information',
    content: `
# Sri Lanka Practical Travel Guide 2025

## VISA & ENTRY REQUIREMENTS

### Electronic Travel Authorization (ETA)
- **Required for**: Most nationalities
- **Apply**: www.eta.gov.lk
- **Cost**: $50 USD (30 days)
- **Processing**: 24-72 hours
- **Validity**: 30 days, double entry
- **Extension**: Available in Colombo

### Visa on Arrival
- **Available**: Selected countries
- **Cost**: $60 USD
- **Queue**: Can be long
- **Recommendation**: Get ETA online

### Free Visa Countries
- Singapore, Maldives, Seychelles

## MONEY MATTERS

### Currency
- **Currency**: Sri Lankan Rupee (LKR)
- **Symbol**: Rs. or රු
- **Notes**: 20, 50, 100, 500, 1000, 5000
- **Coins**: 1, 2, 5, 10, 25

### ATMs & Cards
- **Availability**: Widespread in cities
- **Networks**: Visa, Mastercard, Cirrus
- **Limit**: Often Rs. 50,000 per transaction
- **Fees**: Check your bank
- **Tip**: Notify bank of travel

### Money Exchange
- **Airport**: Available but lower rates
- **Banks**: Better rates, need passport
- **Hotels**: Convenient but poor rates
- **Street**: Illegal, avoid

### Costs & Budget
**Backpacker Daily: $20-30**
- Accommodation: $5-10
- Food: $5-8
- Transport: $5-10
- Activities: $5-10

**Mid-Range Daily: $50-80**
- Accommodation: $20-40
- Food: $15-20
- Transport: $10-15
- Activities: $10-20

**Luxury Daily: $150+**
- Accommodation: $80+
- Food: $30+
- Transport: $30+
- Activities: $20+

## GETTING AROUND

### Trains
**Scenic Routes:**
- Kandy to Ella (best scenery)
- Colombo to Galle (coastal)
- Colombo to Jaffna (long journey)

**Classes:**
- 1st Class: Reserved seats, AC
- 2nd Class: Reserved seats
- 3rd Class: Unreserved

**Booking:**
- 12Go Asia online
- Station counters
- Book early for 1st class

### Buses
**Types:**
- CTB: Government, cheap
- Private: Faster, similar price
- AC: Intercity, comfortable

**Tips:**
- Front seats less bumpy
- Keep bags close
- Have small change

### Tuk-Tuks
**Apps:**
- PickMe (like Uber)
- Uber available in Colombo

**Negotiation:**
- Always agree price first
- Rs. 50-100 per km typical
- More at night

### Private Drivers
**Cost:** $40-60 per day including fuel
**Benefits:** Flexible, comfortable
**Booking:** Hotels, agencies
**Tip:** 10% customary

### Domestic Flights
**Airlines:** SriLankan, Cinnamon Air
**Routes:** Colombo-Jaffna, Colombo-Batticaloa
**Seaplanes:** To some resorts

## ACCOMMODATION GUIDE

### Types & Costs
**Hostels:** $5-15 dorm bed
**Guesthouses:** $15-40 room
**Hotels:** $40-150 mid-range
**Boutique:** $100-300
**Luxury:** $300+

### Booking Platforms
- Booking.com (wide selection)
- Airbnb (homestays)
- Agoda (Asian focus)
- Direct (better prices)

### Areas to Stay

**Colombo:**
- Pettah: Budget, chaotic
- Fort: Business district
- Cinnamon Gardens: Upscale

**Kandy:**
- Lake area: Convenient
- Hills: Peaceful

**Ella:**
- Town: Backpacker vibe
- Hills: Scenic stays

**Beach Towns:**
- Beachfront vs inland
- Price difference significant

## HEALTH & SAFETY

### Vaccinations
**Routine:** Up to date
**Recommended:**
- Hepatitis A & B
- Typhoid
- Japanese Encephalitis (rural)
- Rabies (animal contact)

### Health Precautions
- Dengue: Use mosquito repellent
- Water: Bottled only
- Food: Careful with street food
- Sun: High SPF essential

### Medical Facilities
**Colombo:** Good private hospitals
**Tourist Areas:** Basic clinics
**Rural:** Limited facilities
**Insurance:** Essential

### Safety Tips
- Generally safe country
- Petty theft in tourist areas
- Solo female travel: Conservative dress
- Swimming: Check conditions
- Wildlife: Maintain distance

## COMMUNICATION

### SIM Cards
**Providers:** Dialog, Mobitel, Airtel
**Cost:** Rs. 1500-2500 tourist package
**Where:** Airport, shops
**Need:** Passport
**Data:** 10-30GB typical

### Internet
- WiFi widespread
- Hotels usually included
- Cafes common
- 4G coverage good

### Apps to Download
- PickMe (transport)
- Google Translate
- Maps.me (offline maps)
- XE Currency
- WhatsApp (locals use)

## WEATHER & WHEN TO VISIT

### Monsoon Patterns
**Southwest:** May-September
- Affects: West/South coasts, Hill country
**Northeast:** October-January
- Affects: East/North coasts

### Best Times by Region
**West/South Coast:** December-March
**East Coast:** April-September
**Hill Country:** December-March ideal
**Cultural Triangle:** Year-round, hot

### What to Pack
**Essentials:**
- Sunscreen (expensive locally)
- Insect repellent
- Light rain jacket
- Modest clothing
- Good walking shoes
- Power adapter (Type D/G)

**Nice to Have:**
- Dry bag
- Sarong (multi-use)
- Reusable water bottle
- First aid basics
- Toilet paper

## CULTURAL ETIQUETTE

### Do's
- Remove shoes entering homes/temples
- Dress modestly
- Use right hand
- Accept tea if offered
- Bargain politely

### Don'ts
- Touch Buddha statues
- Public displays affection
- Point with finger
- Turn back to Buddha
- Wear camo (military only)

### Photography
- Ask permission for people
- No flash in temples
- Drone permits required
- Military areas forbidden

## USEFUL PHRASES

**Sinhala Basics:**
- Hello: Ayubowan
- Thank you: Istuti
- Yes: Ow
- No: Naa
- How much?: Kiyada?

**Tamil Basics:**
- Hello: Vanakkam
- Thank you: Nandri
- Yes: Aam
- No: Illai
- How much?: Evvalavu?

## EMERGENCY CONTACTS

- **Police:** 119
- **Fire/Ambulance:** 110
- **Tourist Police:** 011-2421052
- **Medical Emergency:** 1990

## COMMON SCAMS TO AVOID

- Gem shops (overpriced)
- Spice garden markups
- Temple "guides"
- Train seat scams
- Fake travel agents
- Inflated tuk-tuk prices
    `,
    category: KNOWLEDGE_CATEGORIES.PRACTICAL,
    metadata: {
      type: 'practical-guide',
      lastUpdated: new Date().toISOString(),
      tags: ['visa', 'money', 'transport', 'safety', 'communication'],
      importance: 'high'
    }
  }
]

// Function to chunk text for better embedding
function chunkText(text: string, maxChunkSize: number = 1000): string[] {
  const sentences = text.split(/[.!?]+/)
  const chunks: string[] = []
  let currentChunk = ''

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk) {
      chunks.push(currentChunk.trim())
      currentChunk = sentence
    } else {
      currentChunk += sentence + '. '
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim())
  }

  return chunks
}

// Create embeddings using OpenAI
async function createEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: text,
      dimensions: 1536
    })
    
    return response.data[0].embedding
  } catch (error) {
    console.error('Embedding error:', error)
    throw error
  }
}

// Scrape website content
async function scrapeWebsite(url: string, selector?: string): Promise<string> {
  try {
    console.log(`🕷️ Scraping: ${url}`)
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)
    
    // Remove scripts, styles, and nav elements
    $('script, style, nav, header, footer').remove()
    
    // Use specific selector if provided
    const content = selector 
      ? $(selector).text()
      : $('main, article, .content, .main-content, body').text()
    
    return content
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 10000) // Limit content
  } catch (error) {
    console.error(`Error scraping ${url}:`, error)
    return ''
  }
}

// Process and store in Pinecone
async function processAndStore(
  content: string,
  metadata: any,
  index: any
) {
  const chunks = chunkText(content, 800)
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    if (chunk.length < 50) continue // Skip very small chunks
    
    const embedding = await createEmbedding(chunk)
    
    await index.upsert([{
      id: `${metadata.id || Date.now()}-chunk-${i}`,
      values: embedding,
      metadata: {
        ...metadata,
        content: chunk,
        chunkIndex: i,
        totalChunks: chunks.length,
        contentLength: chunk.length
      }
    }])
    
    console.log(`  ✅ Stored chunk ${i + 1}/${chunks.length}`)
  }
}

// Main function to build knowledge base
export async function buildPineconeKnowledgeBase() {
  console.log('🚀 Starting Pinecone Knowledge Base Builder for Yalu...\n')
  
  try {
    // Initialize Pinecone index
    const index = pinecone.index('yalu-memory')
    console.log('📊 Connected to Pinecone index: yalu-memory\n')
    
    // Process structured knowledge
    console.log('📚 Processing structured Sri Lankan knowledge...')
    for (const knowledge of STRUCTURED_KNOWLEDGE) {
      console.log(`\n📝 Processing: ${knowledge.title}`)
      await processAndStore(
        knowledge.content,
        {
          ...knowledge.metadata,
          id: knowledge.id,
          title: knowledge.title,
          source: 'structured-knowledge',
          category: knowledge.category
        },
        index
      )
    }
    
    // Scrape and process websites
    console.log('\n\n🌐 Scraping Sri Lankan travel websites...')
    for (const source of KNOWLEDGE_SOURCES) {
      const content = await scrapeWebsite(source.url, source.selector)
      if (content && content.length > 100) {
        await processAndStore(
          content,
          {
            source: source.url,
            category: source.category,
            type: 'scraped-content',
            scrapedAt: new Date().toISOString()
          },
          index
        )
      }
    }
    
    // Store index statistics
    const stats = await index.describeIndexStats()
    console.log('\n\n📈 Knowledge Base Statistics:')
    console.log(`Total vectors: ${stats.totalRecordCount}`)
    console.log(`Dimensions: ${stats.dimension}`)
    console.log(`Index fullness: ${(stats.indexFullness * 100).toFixed(2)}%`)
    
    // Create a summary document
    const summary = {
      buildDate: new Date().toISOString(),
      totalDocuments: STRUCTURED_KNOWLEDGE.length + KNOWLEDGE_SOURCES.length,
      categories: Object.values(KNOWLEDGE_CATEGORIES),
      vectorCount: stats.totalRecordCount,
      status: 'complete'
    }
    
    await fs.writeFile(
      path.join(process.cwd(), 'pinecone-build-summary.json'),
      JSON.stringify(summary, null, 2)
    )
    
    console.log('\n\n✅ Pinecone Knowledge Base Build Complete!')
    console.log('📄 Summary saved to: pinecone-build-summary.json')
    console.log('\n🐆 Yalu now has comprehensive knowledge about:')
    console.log('  • Sri Lankan beaches and coastal areas')
    console.log('  • Wildlife parks and safari experiences')
    console.log('  • Cultural heritage sites and temples')
    console.log('  • Authentic cuisine and food culture')
    console.log('  • Practical travel information')
    console.log('  • And much more!\n')
    
  } catch (error) {
    console.error('❌ Build failed:', error)
    throw error
  }
}

// Query function for testing
export async function queryKnowledge(query: string, topK: number = 5) {
  const index = pinecone.index('yalu-memory')
  const queryEmbedding = await createEmbedding(query)
  
  const results = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true
  })
  
  return results.matches.map(match => ({
    score: match.score,
    content: match.metadata?.content,
    category: match.metadata?.category,
    source: match.metadata?.source,
    title: match.metadata?.title
  }))
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildPineconeKnowledgeBase()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}