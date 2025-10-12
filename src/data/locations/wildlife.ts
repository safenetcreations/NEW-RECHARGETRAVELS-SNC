
import { type EnhancedWildlifeLocation } from '../enhancedWildlifeData';

export const wildlifeLocations: EnhancedWildlifeLocation[] = [
  // Leopard locations
  {
    id: 'yala-leopard-enhanced',
    name: 'Yala National Park - Leopard Territory',
    lat: 6.3726,
    lng: 81.5185,
    type: 'tour',
    wildlifeType: 'leopard',
    description: 'World\'s highest density of Sri Lankan leopards',
    wildlifeInfo: 'Home to the highest density of Sri Lankan leopards in the world with over 40 leopards per 100km²',
    species: ['Sri Lankan Leopard (Panthera pardus kotiya)'],
    conservationStatus: 'Vulnerable (IUCN)',
    population: '≈1,000 nationwide',
    peakSeason: 'May-July (dry season)',
    bestViewingTime: 'Early morning (6-9 AM) and late afternoon (3-6 PM)',
    accessInfo: 'Book safari jeeps in advance, park opens 6 AM',
    zoomLevel: 14,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800',
        title: 'Sri Lankan Leopard in Yala',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1549366021-9f761d040a5f?w=800',
        title: 'Leopard resting on tree',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1565173104707-85db76f72a7b?w=800',
        title: 'Yala grasslands habitat',
        type: 'gallery',
        source: 'Unsplash'
      }
    ]
  },

  // Elephant locations
  {
    id: 'minneriya-gathering',
    name: 'Minneriya - The Great Elephant Gathering',
    lat: 8.0167,
    lng: 80.8833,
    type: 'tour',
    wildlifeType: 'elephant',
    description: 'Largest elephant congregation in Asia',
    wildlifeInfo: 'Witness "The Gathering" where 200-300 elephants congregate around Minneriya tank',
    species: ['Sri Lankan Elephant (Elephas maximus maximus)'],
    conservationStatus: 'Endangered (IUCN)',
    population: '~7,000 in the wild',
    peakSeason: 'August-September (peak gathering)',
    bestViewingTime: 'Late afternoon (3-6 PM)',
    accessInfo: 'Best accessed from Habarana, book jeep safaris',
    zoomLevel: 13,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
        title: 'Elephant herd at Minneriya',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800',
        title: 'Baby elephant with mother',
        type: 'gallery',
        source: 'Unsplash'
      }
    ]
  },

  {
    id: 'udawalawe-elephants',
    name: 'Udawalawe National Park',
    lat: 6.4769,
    lng: 80.8867,
    type: 'tour',
    wildlifeType: 'elephant',
    description: 'Best park for guaranteed elephant sightings',
    wildlifeInfo: 'Over 250 elephants roam freely. Created around Udawalawe Reservoir, offering excellent wildlife photography opportunities.',
    peakSeason: 'May-September (dry season)',
    bestViewingTime: 'Early morning (6-9 AM) and late afternoon (3-6 PM)',
    accessInfo: 'Less crowded than Yala, better elephant viewing',
    zoomLevel: 13,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
        title: 'Udawalawe elephants',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800',
        title: 'Elephant family',
        type: 'gallery',
        source: 'Unsplash'
      }
    ]
  },

  {
    id: 'pinnawala-orphanage',
    name: 'Pinnawala Elephant Orphanage',
    lat: 7.2981,
    lng: 80.3853,
    type: 'tour',
    wildlifeType: 'elephant',
    description: 'World\'s largest captive elephant herd',
    wildlifeInfo: 'Home to 80+ orphaned and injured elephants. Famous for daily river bathing sessions and bottle feeding of babies.',
    peakSeason: 'Year-round',
    bestViewingTime: 'Feeding times (9 AM, 1 PM, 5 PM) and river bathing (10 AM, 2 PM)',
    accessInfo: 'Popular tourist attraction, can get crowded',
    zoomLevel: 14,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
        title: 'Pinnawala elephants bathing',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800',
        title: 'Baby elephant feeding',
        type: 'gallery',
        source: 'Unsplash'
      }
    ]
  },

  // Marine wildlife
  {
    id: 'mirissa-blue-whales',
    name: 'Mirissa - Blue Whale Capital',
    lat: 5.9485,
    lng: 80.4585,
    type: 'tour',
    wildlifeType: 'whale',
    description: 'Best place globally to see blue whales',
    wildlifeInfo: 'Continental shelf drop-off creates ideal feeding grounds for blue whales - largest animals ever',
    peakSeason: 'December–April',
    species: ['Blue Whale (Balaenoptera musculus)', 'Sperm Whale (Physeter macrocephalus)'],
    conservationStatus: 'Endangered (IUCN)',
    population: '~10,000–25,000 globally',
    bestViewingTime: 'Early morning departures (6:30 AM)',
    accessInfo: 'Book whale watching tours from Mirissa harbor',
    zoomLevel: 12,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=800',
        title: 'Blue whale surfacing',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        title: 'Whale watching boat',
        type: 'gallery',
        source: 'Unsplash'
      }
    ]
  },

  {
    id: 'kalpitiya-dolphins',
    name: 'Kalpitiya - Dolphin & Kite-surfing Hub',
    lat: 8.2333,
    lng: 79.7667,
    type: 'tour',
    wildlifeType: 'dolphin',
    description: 'Premier dolphin watching and kite-surfing destination',
    wildlifeInfo: 'Large pods of spinner dolphins year-round. Also dugong habitat and excellent wind conditions for kite-surfing.',
    peakSeason: 'November-April (kite season), year-round dolphins',
    bestViewingTime: 'Early morning dolphin tours (7-10 AM)',
    accessInfo: 'Boat tours and kite-surfing schools available',
    zoomLevel: 12,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        title: 'Spinner dolphins',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800',
        title: 'Kite-surfing paradise',
        type: 'gallery',
        source: 'Unsplash'
      }
    ]
  },

  // Rare species
  {
    id: 'wilpattu-sloth-bear',
    name: 'Wilpattu - Sloth Bear Habitat',
    lat: 8.5000,
    lng: 79.8500,
    type: 'tour',
    wildlifeType: 'bear',
    description: 'Rare Sri Lankan sloth bear territory',
    wildlifeInfo: 'One of the few places to spot the elusive Sri Lankan sloth bear in natural habitat',
    species: ['Sri Lankan Sloth Bear (Melursus ursinus inornatus)'],
    conservationStatus: 'Vulnerable (IUCN)',
    population: '< 1,000 (perhaps 500–700 remaining)',
    peakSeason: 'May-September (fruiting season)',
    bestViewingTime: 'Early morning and evening near water holes',
    accessInfo: 'Requires special permits, guided tours only',
    zoomLevel: 13,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=800',
        title: 'Sloth bear in wild',
        type: 'stock',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800',
        title: 'Wilpattu wilderness',
        type: 'gallery',
        source: 'Unsplash'
      }
    ]
  },

  {
    id: 'kalpitiya-dugong',
    name: 'Kalpitiya - Dugong Sanctuary',
    lat: 8.2333,
    lng: 79.7667,
    type: 'tour',
    wildlifeType: 'dugong',
    description: 'Critical dugong habitat in seagrass beds',
    wildlifeInfo: 'One of the last refuges for dugongs in Sri Lankan waters - gentle sea cows',
    species: ['Dugong (Dugong dugon)'],
    conservationStatus: 'Vulnerable (IUCN)',
    population: 'Only a handful left in SL (< 300 in South Asia)',
    peakSeason: 'November-April (calm seas)',
    bestViewingTime: 'Early morning snorkeling tours',
    accessInfo: 'Special eco-tours with marine biologists',
    zoomLevel: 12,
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        title: 'Seagrass beds habitat',
        type: 'gallery',
        source: 'Unsplash'
      },
      {
        url: 'https://images.unsplash.com/photo-1580019542155-247062e19ce4?w=800',
        title: 'Marine sanctuary',
        type: 'stock',
        source: 'Unsplash'
      }
    ]
  }
];
