
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdvancedHotelSearch from '@/components/hotels/AdvancedHotelSearch'
import HotelListing from '@/components/hotels/HotelListing'
import HotelDetailPage from '@/components/hotels/HotelDetailPage'
import HotelComparison from '@/components/hotels/HotelComparison'
import RoomSelection from '@/components/hotels/RoomSelection'
import BookingConfirmation from '@/components/hotels/BookingConfirmation'
import BookingSuccess from '@/components/hotels/BookingSuccess'
import HotelAdminPanel from '@/components/hotels/HotelAdminPanel'
import { Button } from '@/components/ui/button'
import { Search, Sparkles, MapPin, Calendar, Users, Star, Crown, Settings, Building } from 'lucide-react'
import { Hotel } from '@/types/hotel'
import { googlePlacesService } from '@/services/googlePlacesService'
import { firebaseHotelService } from '@/services/firebaseHotelService'

const Hotels = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentView, setCurrentView] = useState<'search' | 'detail' | 'room_selection' | 'comparison' | 'booking' | 'success' | 'admin'>('search')
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [bookingDetails, setBookingDetails] = useState<any>(null)
  const [bookingData, setBookingData] = useState<any>(null)
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
    guests: { adults: 2, children: 0, rooms: 1 },
    priceRange: [0, 1000] as [number, number],
    starRating: [] as number[],
    amenities: [] as string[],
    hotelType: [] as string[],
    sortBy: 'recommended'
  })
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [comparedHotels, setComparedHotels] = useState<Hotel[]>([])
  const [heroSearch, setHeroSearch] = useState({
    location: '',
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
    guests: { adults: 2, children: 0, rooms: 1 }
  })
  const [selectedStarRating, setSelectedStarRating] = useState<number | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  // Google Places autocomplete state
  const [showHeroSuggestions, setShowHeroSuggestions] = useState(false)
  const [heroGoogleSuggestions, setHeroGoogleSuggestions] = useState<string[]>([])
  const [heroLocalSuggestions, setHeroLocalSuggestions] = useState<string[]>([])
  const [heroSearchLoading, setHeroSearchLoading] = useState(false)

  // Popular Sri Lankan hotel locations
  const POPULAR_HOTEL_LOCATIONS = [
    'Colombo',
    'Negombo',
    'Galle',
    'Kandy',
    'Bentota',
    'Hikkaduwa',
    'Mirissa',
    'Unawatuna',
    'Ella',
    'Nuwara Eliya',
    'Sigiriya',
    'Anuradhapura',
    'Polonnaruwa',
    'Yala',
    'Udawalawe',
    'Dambulla',
    'Arugam Bay',
    'Trincomalee',
    'Jaffna',
    'Batticaloa'
  ]

  // Google Places search function
  const searchHeroGooglePlaces = async (query: string) => {
    if (query.length < 2) {
      setHeroGoogleSuggestions([])
      return
    }

    setHeroSearchLoading(true)
    try {
      const response = await googlePlacesService.autocomplete({
        input: query,
        types: 'establishment',
        componentRestrictions: { country: 'lk' }
      }) as any

      if (response?.status === 'OK' && response?.predictions) {
        const suggestions = response.predictions.slice(0, 5).map((prediction: any) =>
          prediction.description
        )
        setHeroGoogleSuggestions(suggestions)
      } else {
        setHeroGoogleSuggestions([])
      }
    } catch (error) {
      console.error('Google Places autocomplete error:', error)
      setHeroGoogleSuggestions([])
    } finally {
      setHeroSearchLoading(false)
    }
  }

  // Handle hero location input change
  const handleHeroLocationChange = (value: string) => {
    setHeroSearch(prev => ({ ...prev, location: value }))

    if (value.length > 0) {
      // Filter local locations
      const filtered = POPULAR_HOTEL_LOCATIONS.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      )
      setHeroLocalSuggestions(filtered.slice(0, 5))

      // Search Google Places
      searchHeroGooglePlaces(value)

      setShowHeroSuggestions(true)
    } else {
      setHeroLocalSuggestions(POPULAR_HOTEL_LOCATIONS.slice(0, 8))
      setHeroGoogleSuggestions([])
      setShowHeroSuggestions(false)
    }
  }

  // Handle location selection
  const handleHeroLocationSelect = (location: string) => {
    setHeroSearch(prev => ({ ...prev, location }))
    setShowHeroSuggestions(false)
    setHeroGoogleSuggestions([])
  }

  const handleSearch = (filters: any) => {
    setSearchFilters(filters)
  }

  // Mock hotel data - comprehensive collection with different types and ratings
  useEffect(() => {
    const mockHotels: Hotel[] = [
      // 5-Star Luxury Hotels
      {
        id: '1',
        name: 'Shangri-La Colombo',
        description: 'Luxury beachfront hotel with world-class amenities and exceptional service.',
        star_rating: 5,
        hotel_type: 'luxury_resort',
        base_price_per_night: 250,
        address: '192 A2, Colombo 00300, Sri Lanka',
        city: { id: '1', name: 'Colombo', country: 'Sri Lanka' },
        amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Beach Access', 'Concierge'],
        is_active: true,
        average_rating: 4.8,
        review_count: 1250,
        images: [{
          id: '1',
          hotel_id: '1',
          image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
          is_primary: true,
          sort_order: 1
        }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Cinnamon Grand Colombo',
        description: 'Historic luxury hotel in the heart of Colombo with colonial architecture.',
        star_rating: 5,
        hotel_type: 'luxury_resort',
        base_price_per_night: 180,
        address: '77 Galle Rd, Colombo 00300, Sri Lanka',
        city: { id: '1', name: 'Colombo', country: 'Sri Lanka' },
        amenities: ['Free WiFi', 'Swimming Pool', 'Business Center', 'Restaurant', 'Bar', 'Valet Parking'],
        is_active: true,
        average_rating: 4.6,
        review_count: 890,
        images: [{
          id: '2',
          hotel_id: '2',
          image_url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
          is_primary: true,
          sort_order: 1
        }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Anantara Peace Haven Tangalle Resort',
        description: 'Exclusive luxury resort with private villas and stunning ocean views.',
        star_rating: 5,
        hotel_type: 'luxury_resort',
        base_price_per_night: 320,
        address: 'Peace Haven, Tangalle, Sri Lanka',
        city: { id: '2', name: 'Tangalle', country: 'Sri Lanka' },
        amenities: ['Private Pool', 'Spa', 'Restaurant', 'Beach Access', 'Butler Service', 'Yoga'],
        is_active: true,
        average_rating: 4.9,
        review_count: 650,
        images: [{
          id: '3',
          hotel_id: '3',
          image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
          is_primary: true,
          sort_order: 1
        }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },

      // 4-Star Hotels
      {
        id: '4',
        name: 'Hilton Colombo',
        description: 'Modern business hotel with excellent facilities and city views.',
        star_rating: 4,
        hotel_type: 'business',
        base_price_per_night: 140,
        address: '2 Sir Chittampalam A Gardiner Mawatha, Colombo 00200, Sri Lanka',
        city: { id: '1', name: 'Colombo', country: 'Sri Lanka' },
        amenities: ['Free WiFi', 'Fitness Center', 'Business Center', 'Restaurant', 'Room Service'],
        is_active: true,
        average_rating: 4.3,
        review_count: 1200,
        images: [{
          id: '4',
          hotel_id: '4',
          image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
          is_primary: true,
          sort_order: 1
        }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Jetwing Beach Negombo',
        description: 'Beachfront hotel with tropical gardens and water sports facilities.',
        star_rating: 4,
        hotel_type: 'boutique',
        base_price_per_night: 95,
        address: 'Negombo Beach, Negombo, Sri Lanka',
        city: { id: '3', name: 'Negombo', country: 'Sri Lanka' },
        amenities: ['Beach Access', 'Swimming Pool', 'Restaurant', 'Water Sports', 'Spa'],
        is_active: true,
        average_rating: 4.4,
        review_count: 980,
        images: [{
          id: '5',
          hotel_id: '5',
          image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
          is_primary: true,
          sort_order: 1
        }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },

      // 3-Star Hotels
      {
        id: '6',
        name: 'Grand Oriental Hotel',
        description: 'Comfortable city hotel with modern amenities and central location.',
        star_rating: 3,
        hotel_type: 'business',
        base_price_per_night: 65,
        address: '2 York Street, Colombo 01, Sri Lanka',
        city: { id: '1', name: 'Colombo', country: 'Sri Lanka' },
        amenities: ['Free WiFi', 'Restaurant', 'Room Service', 'Laundry'],
        is_active: true,
        average_rating: 3.8,
        review_count: 450,
        images: [{
          id: '6',
          hotel_id: '6',
          image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
          is_primary: true,
          sort_order: 1
        }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '7',
        name: 'Sunshine Beach Hotel',
        description: 'Budget-friendly beach hotel with basic amenities and ocean views.',
        star_rating: 3,
        hotel_type: 'budget',
        base_price_per_night: 45,
        address: 'Mount Lavinia Beach, Colombo, Sri Lanka',
        city: { id: '1', name: 'Colombo', country: 'Sri Lanka' },
        amenities: ['Free WiFi', 'Beach Access', 'Restaurant'],
        is_active: true,
        average_rating: 3.9,
        review_count: 320,
        images: [{
          id: '7',
          hotel_id: '7',
          image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
          is_primary: true,
          sort_order: 1
        }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },

      // Villas
      {
        id: '8',
        name: 'Ocean View Villa',
        description: 'Private luxury villa with panoramic ocean views and personal chef service.',
        star_rating: 5,
        hotel_type: 'villa',
        base_price_per_night: 400,
        address: 'Bentota Beach, Bentota, Sri Lanka',
        city: { id: '4', name: 'Bentota', country: 'Sri Lanka' },
        amenities: ['Private Pool', 'Chef Service', 'Ocean View', 'Spa', 'Butler Service'],
        is_active: true,
        average_rating: 4.9,
        review_count: 180,
        images: [{
          id: '8',
          hotel_id: '8',
          image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
          is_primary: true,
          sort_order: 1
        }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '9',
        name: 'Jungle Villa Retreat',
        description: 'Eco-friendly villa surrounded by tropical rainforest with wildlife viewing.',
        star_rating: 4,
        hotel_type: 'villa',
        base_price_per_night: 150,
        address: 'Sinharaja Forest Reserve, Sri Lanka',
        city: { id: '5', name: 'Sinharaja', country: 'Sri Lanka' },
        amenities: ['Wildlife Viewing', 'Eco Tours', 'Private Chef', 'Rainforest Views'],
        is_active: true,
        average_rating: 4.6,
        review_count: 95,
        images: [{
          id: '9',
          hotel_id: '9',
          image_url: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop',
          is_primary: true,
          sort_order: 1
        }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },

      // Bungalows and Huts
      {
        id: '10',
        name: 'Beach Bungalow Paradise',
        description: 'Traditional beach bungalows with thatched roofs and direct beach access.',
        star_rating: 4,
        hotel_type: 'cabana',
        base_price_per_night: 85,
        address: 'Unawatuna Beach, Unawatuna, Sri Lanka',
        city: { id: '6', name: 'Unawatuna', country: 'Sri Lanka' },
        amenities: ['Beach Access', 'Restaurant', 'Bar', 'Snorkeling'],
        is_active: true,
        average_rating: 4.2,
        review_count: 240,
        images: [{
          id: '10',
          hotel_id: '10',
          image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
          is_primary: true,
          sort_order: 1
        }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '11',
        name: 'Tree House Eco Lodge',
        description: 'Sustainable tree house accommodation with canopy views and nature trails.',
        star_rating: 3,
        hotel_type: 'cabana',
        base_price_per_night: 55,
        address: 'Kitulgala Rainforest, Sri Lanka',
        city: { id: '7', name: 'Kitulgala', country: 'Sri Lanka' },
        amenities: ['Nature Trails', 'Eco Tours', 'Restaurant', 'Adventure Activities'],
        is_active: true,
        average_rating: 4.1,
        review_count: 160,
        images: [{
          id: '11',
          hotel_id: '11',
          image_url: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop',
          is_primary: true,
          sort_order: 1
        }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },

      // Apartments and Guesthouses
      {
        id: '12',
        name: 'Colombo City Apartments',
        description: 'Modern serviced apartments in the heart of Colombo with city views.',
        star_rating: 4,
        hotel_type: 'apartment',
        base_price_per_night: 110,
        address: 'Fort District, Colombo 01, Sri Lanka',
        city: { id: '1', name: 'Colombo', country: 'Sri Lanka' },
        amenities: ['Kitchen', 'City Views', 'Gym Access', 'Concierge', 'Laundry'],
        is_active: true,
        average_rating: 4.3,
        review_count: 380,
        images: [{
          id: '12',
          hotel_id: '12',
          image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
          is_primary: true,
          sort_order: 1
        }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '13',
        name: 'Heritage Guesthouse',
        description: 'Charming colonial-era guesthouse with traditional Sri Lankan hospitality.',
        star_rating: 3,
        hotel_type: 'boutique',
        base_price_per_night: 50,
        address: 'Galle Fort, Galle, Sri Lanka',
        city: { id: '8', name: 'Galle', country: 'Sri Lanka' },
        amenities: ['Traditional Architecture', 'Garden', 'Restaurant', 'Cultural Tours'],
        is_active: true,
        average_rating: 4.0,
        review_count: 290,
        images: [{
          id: '13',
          hotel_id: '13',
          image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          is_primary: true,
          sort_order: 1
        }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },

      // Eco Lodges
      {
        id: '14',
        name: 'Rainforest Eco Lodge',
        description: 'Sustainable eco-lodge deep in the rainforest with wildlife conservation focus.',
        star_rating: 4,
        hotel_type: 'boutique',
        base_price_per_night: 120,
        address: 'Udawalawe National Park, Sri Lanka',
        city: { id: '9', name: 'Udawalawe', country: 'Sri Lanka' },
        amenities: ['Wildlife Safaris', 'Eco Tours', 'Sustainable Practices', 'Organic Food'],
        is_active: true,
        average_rating: 4.5,
        review_count: 210,
        images: [{
          id: '14',
          hotel_id: '14',
          image_url: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=600&fit=crop',
          is_primary: true,
          sort_order: 1
        }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },

      // Budget Options
      {
        id: '15',
        name: 'Backpacker Paradise',
        description: 'Affordable dormitory and private room accommodation for budget travelers.',
        star_rating: 2,
        hotel_type: 'budget',
        base_price_per_night: 25,
        address: 'Hikkaduwa Beach, Hikkaduwa, Sri Lanka',
        city: { id: '10', name: 'Hikkaduwa', country: 'Sri Lanka' },
        amenities: ['Beach Access', 'Shared Kitchen', 'Surf Lessons', 'Bar'],
        is_active: true,
        average_rating: 3.7,
        review_count: 520,
        images: [{
          id: '15',
          hotel_id: '15',
          image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
          is_primary: true,
          sort_order: 1
        }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      // Vacation Homes
      {
        id: '16',
        name: 'Serene Lake House',
        description: 'A beautiful vacation home overlooking Koggala Lake, perfect for families.',
        star_rating: 4,
        hotel_type: 'vacation_home',
        base_price_per_night: 200,
        address: 'Koggala Lake, Galle, Sri Lanka',
        city: { id: '8', name: 'Galle', country: 'Sri Lanka' },
        amenities: ['Lake View', 'Private Garden', 'Kitchen', 'BBQ Facilities', 'WiFi'],
        is_active: true,
        average_rating: 4.8,
        review_count: 45,
        images: [{
          id: '16',
          hotel_id: '16',
          image_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?w=800&h=600&fit=crop',
          is_primary: true,
          sort_order: 1
        }],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    const fetchHotels = async () => {
      try {
        const firebaseData = await firebaseHotelService.getAllHotels()
        if (firebaseData && firebaseData.length > 0) {
          setHotels(firebaseData)
        } else {
          setHotels(mockHotels)
        }
      } catch (error) {
        console.error('Error fetching hotels from Firebase:', error)
        setHotels(mockHotels)
      }
    }

    fetchHotels()
  }, [])

  const handleHotelSelect = (hotel: Hotel) => {
    setSelectedHotel(hotel)
    setCurrentView('detail')
  }

  const handleBookNow = (hotel: Hotel) => {
    setSelectedHotel(hotel)
    setCurrentView('room_selection')
  }

  const handleRoomSelected = (roomType: any) => {
    setSelectedRoom(roomType)
    setCurrentView('booking')
  }

  const handleBookingConfirm = (data: any) => {
    setBookingData(data)
    setCurrentView('success')
  }

  const handleAddToComparison = (hotel: Hotel) => {
    if (!comparedHotels.find(h => h.id === hotel.id)) {
      setComparedHotels(prev => [...prev, hotel])
    }
  }

  const handleRemoveFromComparison = (hotelId: string) => {
    setComparedHotels(prev => prev.filter(h => h.id !== hotelId))
  }

  const handleViewComparison = () => {
    setCurrentView('comparison')
  }

  const handleSaveHotel = (hotel: Hotel) => {
    setHotels(prev => {
      const existing = prev.find(h => h.id === hotel.id)
      if (existing) {
        return prev.map(h => h.id === hotel.id ? hotel : h)
      } else {
        return [...prev, hotel]
      }
    })
  }

  const handleDeleteHotel = (hotelId: string) => {
    setHotels(prev => prev.filter(h => h.id !== hotelId))
  }

  const handleUpdateHotel = (hotel: Hotel) => {
    setHotels(prev => prev.map(h => h.id === hotel.id ? hotel : h))
  }

  // Check for admin access, comparison view, and booking
  useEffect(() => {
    const adminParam = searchParams.get('admin')
    const compareParam = searchParams.get('compare')
    const bookParam = searchParams.get('book')
    const hotelId = searchParams.get('hotel')

    if (adminParam === 'true') {
      setIsAdmin(true)
      setCurrentView('admin')
    } else if (compareParam === 'true' && comparedHotels.length > 0) {
      setCurrentView('comparison')
    } else if (bookParam === 'true' && hotelId) {
      const hotel = hotels.find(h => h.id === hotelId)
      if (hotel) {
        setSelectedHotel(hotel)
        // For now, create a default room type
        setSelectedRoom({
          id: '1',
          name: 'Standard Room',
          description: 'Comfortable room with basic amenities',
          maxOccupancy: 2,
          bedType: 'Queen',
          roomSize: 25,
          pricePerNight: hotel.base_price_per_night || 100,
          amenities: ['WiFi', 'TV', 'Air Conditioning'],
          images: [],
          availableCount: 5,
          isActive: true,
          discountedPrice: hotel.base_price_per_night || 100
        })
        setCurrentView('booking')
      }
    }
  }, [searchParams, comparedHotels.length, hotels])

  if (isAdmin) {
    return (
      <HotelAdminPanel
        hotels={hotels}
        onSaveHotel={handleSaveHotel}
        onDeleteHotel={handleDeleteHotel}
        onUpdateHotel={handleUpdateHotel}
      />
    )
  }

  if (currentView === 'room_selection' && selectedHotel) {
    return (
      <RoomSelection
        hotel={selectedHotel}
        checkIn={searchFilters.checkIn || new Date()}
        checkOut={searchFilters.checkOut || new Date(Date.now() + 86400000)}
        guests={searchFilters.guests}
        onSelectRoom={handleRoomSelected}
        onBack={() => setCurrentView('detail')}
      />
    )
  }

  if (currentView === 'comparison') {
    return (
      <HotelComparison
        hotels={comparedHotels}
        onRemoveHotel={handleRemoveFromComparison}
        onBookNow={handleBookNow}
        onClose={() => setCurrentView('search')}
      />
    )
  }

  if (currentView === 'booking' && selectedHotel && selectedRoom) {
    return (
      <BookingConfirmation
        hotel={selectedHotel}
        roomType={selectedRoom}
        bookingDetails={{
          checkIn: new Date().toISOString().split('T')[0],
          checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0], // +1 day
          guests: { adults: 2, children: 0, rooms: 1 },
          totalPrice: selectedRoom.discountedPrice || selectedRoom.basePrice,
          nights: 1
        }}
        onConfirmBooking={handleBookingConfirm}
        onBack={() => setCurrentView('detail')}
      />
    )
  }

  if (currentView === 'success' && bookingData) {
    return (
      <BookingSuccess
        bookingData={bookingData}
        onViewBookings={() => setCurrentView('search')}
        onBookAnother={() => setCurrentView('search')}
        onDownloadConfirmation={() => alert('Download functionality would be implemented here')}
      />
    )
  }

  return (
    <>
      <Helmet>
        <title>Luxury Hotels & Resorts in Sri Lanka - Recharge Travels</title>
        <meta name="description" content="Discover premium hotels, luxury resorts, boutique accommodations and budget-friendly stays in Sri Lanka. From beachfront cabanas to mountain retreats." />
        <meta name="keywords" content="Sri Lanka hotels, luxury resorts, boutique hotels, budget accommodation, beach hotels, mountain hotels" />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-soft-beige">
        {/* Enhanced Hero Section with Search */}
        <div className="relative bg-gradient-to-br from-teal-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 py-16">
            <div className="text-center mb-12">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-semibold rounded-full shadow-lg">
                  <Crown className="w-4 h-4 mr-2" />
                  ✨ Luxury Hotel Sale - Up to 40% Off Premium Stays!
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-6 bg-gradient-to-r from-white via-blue-100 to-teal-100 bg-clip-text text-transparent">
                Find Your Perfect Hotel
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold font-playfair mb-6 text-teal-100">
                in Beautiful Sri Lanka
              </h2>
              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto font-inter text-blue-100">
                Search by hotel name, location, or star rating. From luxury beach resorts to charming boutique hotels.
              </p>
            </div>

            {/* Quick Star Rating Selection */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 relative z-20">
                <h3 className="text-white text-lg font-semibold mb-4 text-center">Quick Select by Star Rating</h3>
                <div className="flex gap-4 justify-center">
                  {[3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => {
                        if (selectedStarRating === rating) {
                          setSelectedStarRating(null)
                          setSearchFilters(prev => ({ ...prev, starRating: [] }))
                        } else {
                          setSelectedStarRating(rating)
                          setSearchFilters(prev => ({
                            ...prev,
                            starRating: [rating]
                          }))
                        }
                      }}
                      className={`flex flex-col items-center px-6 py-4 rounded-xl transition-all duration-300 ${selectedStarRating === rating
                        ? 'bg-white text-teal-800 shadow-lg transform scale-105'
                        : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                        }`}
                    >
                      <div className="flex items-center mb-2">
                        {[...Array(rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-current" />
                        ))}
                      </div>
                      <span className="font-semibold">{rating}-Star</span>
                      <span className="text-sm opacity-80">Hotels</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Select by Property Type */}
            <div className="flex justify-center mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 relative z-20">
                <h3 className="text-white text-lg font-semibold mb-4 text-center">Browse by Property Type</h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  {[
                    { type: 'vacation_home', label: 'Vacation Homes', icon: Building },
                    { type: 'apartment', label: 'Apartments', icon: Building },
                    { type: 'villa', label: 'Villas', icon: Crown },
                    { type: 'luxury_resort', label: 'Resorts', icon: Sparkles }
                  ].map((item) => (
                    <button
                      key={item.type}
                      onClick={() => {
                        const isSelected = searchFilters.hotelType.includes(item.type);
                        setSearchFilters(prev => ({
                          ...prev,
                          hotelType: isSelected
                            ? prev.hotelType.filter(t => t !== item.type)
                            : [...prev.hotelType, item.type]
                        }))
                      }}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${searchFilters.hotelType.includes(item.type)
                        ? 'bg-white text-teal-800 shadow-lg transform scale-105'
                        : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                        }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="font-semibold">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Search Bar */}
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Location/Hotel Search */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Hotel Name or Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search hotels by name or location (e.g., Shangri-La, Colombo, Beach)..."
                        value={heroSearch.location}
                        onChange={(e) => handleHeroLocationChange(e.target.value)}
                        onFocus={() => {
                          if (!heroSearch.location) {
                            setHeroLocalSuggestions(POPULAR_HOTEL_LOCATIONS.slice(0, 8))
                            setShowHeroSuggestions(true)
                          }
                        }}
                        onBlur={() => {
                          setTimeout(() => setShowHeroSuggestions(false), 200)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setSearchFilters(prev => ({
                              ...prev,
                              location: heroSearch.location,
                              checkIn: heroSearch.checkIn,
                              checkOut: heroSearch.checkOut,
                              guests: heroSearch.guests
                            }))
                            setShowHeroSuggestions(false)
                          }
                        }}
                        className="w-full px-4 py-4 pl-12 text-lg text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300"
                      />
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      {heroSearch.location && (
                        <button
                          onClick={() => setHeroSearch(prev => ({ ...prev, location: '' }))}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      )}

                      {/* Autocomplete Dropdown */}
                      {showHeroSuggestions && (heroGoogleSuggestions.length > 0 || heroLocalSuggestions.length > 0) && (
                        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-xl max-h-80 overflow-y-auto">
                          {heroSearchLoading && (
                            <div className="p-4 text-center text-gray-500">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500 mx-auto mb-2"></div>
                              Searching Google Places...
                            </div>
                          )}

                          {heroGoogleSuggestions.length > 0 && (
                            <>
                              <div className="p-3 text-xs font-medium text-green-600 bg-green-50 border-b">
                                🌍 Google Places Results ({heroGoogleSuggestions.length})
                              </div>
                              {heroGoogleSuggestions.map((location, index) => (
                                <button
                                  key={`google-${index}`}
                                  type="button"
                                  onClick={() => handleHeroLocationSelect(location)}
                                  className="w-full text-left px-4 py-3 hover:bg-green-50 focus:bg-green-50 focus:outline-none border-b border-gray-100 last:border-b-0 flex items-center gap-3 transition-colors"
                                >
                                  <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                      {location}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </>
                          )}

                          {heroLocalSuggestions.length > 0 && (
                            <>
                              <div className="p-3 text-xs font-medium text-blue-600 bg-blue-50 border-b">
                                🏝️ Popular Sri Lankan Locations ({heroLocalSuggestions.length})
                              </div>
                              {heroLocalSuggestions.map((location, index) => (
                                <button
                                  key={`local-${index}`}
                                  type="button"
                                  onClick={() => handleHeroLocationSelect(location)}
                                  className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0 flex items-center gap-3 transition-colors"
                                >
                                  <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                      {location}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Popular Suggestions */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['Colombo', 'Negombo', 'Galle', 'Kandy', 'Bentota'].map((location) => (
                        <button
                          key={location}
                          onClick={() => setHeroSearch(prev => ({ ...prev, location }))}
                          className="px-3 py-1 bg-teal-50 text-teal-700 rounded-lg text-sm hover:bg-teal-100 transition-colors"
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Check-in Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={heroSearch.checkIn ? heroSearch.checkIn.toISOString().split('T')[0] : ''}
                      onChange={(e) => setHeroSearch(prev => ({
                        ...prev,
                        checkIn: e.target.value ? new Date(e.target.value) : undefined
                      }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300"
                    />
                  </div>

                  {/* Check-out Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={heroSearch.checkOut ? heroSearch.checkOut.toISOString().split('T')[0] : ''}
                      onChange={(e) => setHeroSearch(prev => ({
                        ...prev,
                        checkOut: e.target.value ? new Date(e.target.value) : undefined
                      }))}
                      min={heroSearch.checkIn ? heroSearch.checkIn.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Guests Selection */}
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    Guests & Rooms
                  </label>
                  <div className="flex items-center gap-4">
                    <select
                      value={`${heroSearch.guests.adults}-${heroSearch.guests.children}-${heroSearch.guests.rooms}`}
                      onChange={(e) => {
                        const [adults, children, rooms] = e.target.value.split('-').map(Number)
                        setHeroSearch(prev => ({ ...prev, guests: { adults, children, rooms } }))
                      }}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300"
                    >
                      <option value="1-0-1">1 Adult, 1 Room</option>
                      <option value="2-0-1">2 Adults, 1 Room</option>
                      <option value="2-1-1">2 Adults, 1 Child, 1 Room</option>
                      <option value="2-2-1">2 Adults, 2 Children, 1 Room</option>
                      <option value="4-0-2">4 Adults, 2 Rooms</option>
                      <option value="6-0-3">6 Adults, 3 Rooms</option>
                    </select>

                    <Button
                      onClick={() => {
                        // Apply hero search to main filters
                        setSearchFilters(prev => ({
                          ...prev,
                          location: heroSearch.location,
                          checkIn: heroSearch.checkIn,
                          checkOut: heroSearch.checkOut,
                          guests: heroSearch.guests
                        }))
                      }}
                      size="lg"
                      className="px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      Search Hotels
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold mb-2">{hotels.length}+</div>
                <div className="text-teal-100 text-sm">Premium Hotels</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold mb-2">100K+</div>
                <div className="text-teal-100 text-sm">Happy Guests</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold mb-2">4.8★</div>
                <div className="text-teal-100 text-sm">Average Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-2xl font-bold mb-2">24/7</div>
                <div className="text-teal-100 text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section (toggleable) */}
        {showSearch && (
          <div className="bg-white border-b py-8">
            <div className="container mx-auto px-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Hotel</h2>
                <p className="text-gray-600">Search by name, location, or use our advanced filters</p>
              </div>
              <AdvancedHotelSearch onSearch={handleSearch} />
            </div>
          </div>
        )}

        <HotelListing
          hotels={hotels}
          filters={searchFilters}
          onHotelSelect={handleHotelSelect}
          selectedHotels={comparedHotels}
          showComparison={true}
          onFilterChange={setSearchFilters}
        />

        {/* Comparison Bar */}
        {comparedHotels.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="font-semibold">Compare ({comparedHotels.length})</span>
                <div className="flex space-x-2">
                  {comparedHotels.map(hotel => (
                    <div key={hotel.id} className="flex items-center bg-gray-100 rounded-lg px-3 py-1">
                      <span className="text-sm">{hotel.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-4 w-4 p-0"
                        onClick={() => handleRemoveFromComparison(hotel.id)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handleViewComparison}>
                Compare Hotels
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}

export default Hotels
