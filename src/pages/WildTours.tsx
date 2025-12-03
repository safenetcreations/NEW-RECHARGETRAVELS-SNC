import { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WildToursHero from '@/components/wildTours/WildToursHero'
import TourPackageCard, { TourPackage } from '@/components/wildTours/TourPackageCard'
import BookingWidget, { BookingFormData } from '@/components/wildTours/BookingWidget'
import { wildToursData, getCategoryTitle, getCategoryDescription } from '@/data/wildToursData'
import { wildToursService } from '@/services/firebaseWildToursService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import AIOptimizedFAQ from '@/components/seo/AIOptimizedFAQ'
import {
  Binoculars,
  Camera,
  Waves,
  TreePine,
  Star,
  Users,
  MapPin,
  ArrowRight,
  CheckCircle,
  Award,
  Compass
} from 'lucide-react'
import { toast } from 'sonner'
import { BookingDialog } from '@/components/wildTours/BookingDialog'
import { useAuth } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'
import {
  COMPANY,
  createBreadcrumbSchema,
  createOrganizationSchema,
  createSpeakableSchema
} from '@/utils/schemaMarkup'

// AI-Optimized FAQs for Wildlife Tours
const wildlifeFAQs = [
  {
    question: "Which national park is best for seeing leopards in Sri Lanka?",
    answer: "Yala National Park has the highest leopard density in the world at approximately 1 leopard per square kilometer. Block 1 of Yala is the best zone for leopard sightings, with early morning (6am) and late afternoon (3-6pm) safaris offering the highest success rates. February to July is the optimal season when leopards are most active near water sources. Wilpattu National Park is an excellent alternative with fewer crowds.",
    category: "Leopards"
  },
  {
    question: "When is the best time for whale watching in Sri Lanka?",
    answer: "Blue whale watching in Sri Lanka has two main seasons: Mirissa (south coast) from November to April with peak sightings in February-March, and Trincomalee (east coast) from May to October. Success rates during peak season exceed 95%. Tours depart at 6am when seas are calmest. Mirissa is the most accessible location, just 3 hours from Colombo, offering sightings of blue whales, sperm whales, and dolphins.",
    category: "Whale Watching"
  },
  {
    question: "Where can I see wild elephants in Sri Lanka?",
    answer: "The best places to see wild elephants are: Udawalawe National Park (500+ resident elephants, year-round sightings guaranteed), Minneriya National Park (famous for 'The Gathering' of 300+ elephants from July-October), and Kaudulla National Park (elephant gathering November-December). Pinnawala Elephant Orphanage offers close-up experiences with rescued elephants. Udawalawe is recommended for first-time visitors due to consistent sightings.",
    category: "Elephants"
  },
  {
    question: "How much do wildlife safaris cost in Sri Lanka?",
    answer: "Wildlife safari costs in Sri Lanka vary by experience level: Budget-friendly safaris start at $50-80 per person (shared jeep, local guide). Semi-luxury safaris range from $120-200 per person (private jeep, expert naturalist, premium equipment). Full-day safaris including park fees, jeep, and guide typically cost $100-150 per person. Whale watching tours range from $40-150 depending on boat type and operator.",
    category: "Pricing"
  },
  {
    question: "What wildlife can I see on a Sri Lanka safari besides the Big 4?",
    answer: "Beyond leopards, elephants, blue whales, and sloth bears, Sri Lanka offers incredible biodiversity: 439 bird species (34 endemic), crocodiles in every national park, wild boar, spotted deer, sambar deer, water buffalo, mongoose, jackals, dolphins (spinner, bottlenose), sea turtles (5 species), and over 100 reptile species. Sinharaja Rainforest is best for endemic birds and reptiles.",
    category: "Wildlife"
  },
  {
    question: "Is it safe to go on wildlife safaris in Sri Lanka?",
    answer: "Yes, wildlife safaris in Sri Lanka are safe when conducted with licensed operators. All Recharge Travels safaris include: certified naturalist guides trained in animal behavior, DWC-approved safari vehicles with safety features, strict distance protocols from animals, and comprehensive insurance. Parks have ranger patrols and emergency procedures. We recommend wearing neutral colors and following guide instructions at all times.",
    category: "Safety"
  }
]

const WildTours = () => {
  // Verified: NationalParksSection removed
  console.log('WildTours component loaded');
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null)
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [tours, setTours] = useState<Record<string, TourPackage[]>>(wildToursData)
  const [loading, setLoading] = useState(true)
  const bookingRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const { user } = useAuth()

  const categories = Object.keys(tours)

  // Load tours from Firebase (with fallback to static data)
  useEffect(() => {
    const loadTours = async () => {
      setLoading(true)
      try {
        const firebaseTours = await wildToursService.getAllTours()

        if (firebaseTours.length > 0) {
          // Group tours by category
          const groupedTours: Record<string, TourPackage[]> = {}
          firebaseTours.forEach(tour => {
            if (!groupedTours[tour.category]) {
              groupedTours[tour.category] = []
            }
            groupedTours[tour.category].push(tour)
          })
          setTours(groupedTours)
        } else {
          // Fallback to static data if no Firebase data
          setTours(wildToursData)
        }
      } catch (error) {
        console.error('Error loading tours:', error)
        // Fallback to static data on error
        setTours(wildToursData)
      } finally {
        setLoading(false)
      }
    }

    loadTours()
  }, [])

  // Handle hash navigation (e.g., #national-parks)
  useEffect(() => {
    if (location.hash) {
      // Remove the # from the hash
      const elementId = location.hash.substring(1)

      // Wait for the page to fully render
      setTimeout(() => {
        const element = document.getElementById(elementId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [location.hash])

  const handleBookingStart = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handlePackageSelect = (pkg: TourPackage) => {
    setSelectedPackage(pkg)
    setBookingDialogOpen(true)
  }

  const handleBookingSubmit = async (bookingData: any) => {
    try {
      const userId = user ? user.uid : 'guest';

      await wildToursService.createBooking({
        ...bookingData,
        userId,
        userEmail: user?.email || bookingData.contactEmail,
        createdAt: new Date().toISOString()
      });

      setBookingDialogOpen(false);
      toast.success('Booking confirmed! Check your email for details.', {
        duration: 5000,
      });

      // Reset selection
      setSelectedPackage(null);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to process booking. Please try again.');
    }
  }

  const relatedTours = [
    { title: 'Tours Home', href: '/tours' },
    { title: 'National Parks', href: '/tours/wildtours/parks' },
    { title: 'Cultural Tours', href: '/tours/cultural' }
  ]

  const handleWidgetSubmit = (bookingData: BookingFormData) => {
    console.log('Widget search submitted:', bookingData)
    toast.info('Searching for available tours...')
    // Logic to filter tours or scroll to category could go here
    const categoryId = `${bookingData.tourType}-tours`
    const element = document.getElementById(categoryId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": "Wild Tours Sri Lanka - Wildlife Safari Adventures",
    "description": "Experience Sri Lanka's wildlife with semi-luxury and budget-friendly safari tours including elephant safaris, leopard watching, whale watching, dolphin tours, birdwatching, and underwater adventures.",
    "provider": {
      "@type": "Organization",
      "name": "Recharge Travels",
      "url": "https://rechargetravels.com"
    },
    "offers": categories.map(category => ({
      "@type": "Offer",
      "name": getCategoryTitle(category),
      "description": getCategoryDescription(category),
      "priceCurrency": "USD",
      "price": Math.min(...wildToursData[category].map(pkg => pkg.price)),
      "priceRange": `$${Math.min(...wildToursData[category].map(pkg => pkg.price))}-$${Math.max(...wildToursData[category].map(pkg => pkg.price))}`,
      "availability": "InStock",
      "validFrom": new Date().toISOString(),
      "category": "TouristActivity"
    })),
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What's the difference between Semi-Luxury and Budget-Friendly tours?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Semi-Luxury tours include private vehicles, expert guides, boutique accommodation, and premium amenities. Budget-Friendly tours offer shared experiences with local guides and authentic guesthouse stays at affordable prices."
          }
        },
        {
          "@type": "Question",
          "name": "When is the best time for whale watching in Sri Lanka?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Blue whale watching is best from December to April in Mirissa (south coast) and May to October in Trincomalee (east coast), following the seasonal migration patterns."
          }
        },
        {
          "@type": "Question",
          "name": "Which national parks are best for wildlife viewing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yala National Park offers the highest leopard density, Udawalawe is famous for elephant herds, Minneriya hosts 'The Gathering' of elephants, and Sinharaja is perfect for endemic birds and rainforest species."
          }
        }
      ]
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-2">Loading Wild Tours</h2>
            <p className="text-gray-600 font-montserrat">Preparing your wildlife adventures...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Wild Tours Sri Lanka – Elephant, Leopard, Whale, Dolphin & More | Recharge Travels</title>
        <meta
          name="description"
          content="Experience Sri Lanka's incredible wildlife with semi-luxury and budget safari packages. Book elephant safaris, leopard watching, whale tours, dolphin encounters, birdwatching expeditions, national park visits, and underwater adventures. Expert guides, flexible pricing, instant booking."
        />
        <meta name="keywords" content="Sri Lanka wildlife tours, elephant safari, leopard watching, whale watching Mirissa, dolphin tours Kalpitiya, budget safari packages, semi-luxury wildlife tours, book Sri Lanka elephant safari, Yala leopard tours, Sinharaja birdwatching, national parks Sri Lanka, Udawalawe elephants, Minneriya gathering" />
        <link rel="canonical" href="https://www.rechargetravels.com/wildtours" />
        <meta property="og:title" content="Wild Tours Sri Lanka – Wildlife Safari Adventures" />
        <meta property="og:description" content="Experience Sri Lanka's incredible wildlife with flexible semi-luxury and budget-friendly safari packages. Book now!" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1549366021-9f761d040a94?w=1200" />
        <meta property="og:url" content="https://www.rechargetravels.com/wildtours" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Recharge Travels" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wild Tours Sri Lanka – Wildlife Safari Adventures" />
        <meta name="twitter:description" content="Experience Sri Lanka's incredible wildlife. Book elephant safaris, leopard watching, whale tours & more." />

        {/* Main Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>

        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify(createBreadcrumbSchema([
            { name: 'Home', url: COMPANY.url },
            { name: 'Tours', url: `${COMPANY.url}/tours` },
            { name: 'Wildlife Tours', url: `${COMPANY.url}/wildtours` }
          ]))}
        </script>

        {/* Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify(createOrganizationSchema())}
        </script>

        {/* Speakable Schema for Voice Search */}
        <script type="application/ld+json">
          {JSON.stringify(createSpeakableSchema(
            'https://www.rechargetravels.com/wildtours',
            ['h1', '.hero-description', '.tour-category-title']
          ))}
        </script>

        {/* Collection Page Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": "https://www.rechargetravels.com/wildtours#collection",
            "name": "Wild Tours Sri Lanka - Wildlife Safari Adventures",
            "description": "Browse and book wildlife safari tours in Sri Lanka. Elephant safaris, leopard watching, whale watching, dolphin tours, and more.",
            "url": "https://www.rechargetravels.com/wildtours",
            "image": "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=1200",
            "hasPart": categories.map(category => ({
              "@type": "WebPage",
              "name": getCategoryTitle(category),
              "description": getCategoryDescription(category),
              "url": `https://www.rechargetravels.com/wildtours#${category}`
            })),
            "provider": {
              "@type": "TravelAgency",
              "name": COMPANY.name,
              "url": COMPANY.url,
              "telephone": COMPANY.phone,
              "email": COMPANY.email
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": 4.9,
              "reviewCount": 1847,
              "bestRating": 5,
              "worstRating": 1
            }
          })}
        </script>
      </Helmet>

      <Header />

      {/* Breadcrumb and related links */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-600 flex items-center gap-2">
            <Link to="/tours" className="text-emerald-700 font-semibold hover:text-emerald-800">Tours</Link>
            <span aria-hidden>›</span>
            <span className="text-slate-900 font-semibold">Wildlife & Safaris</span>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            {relatedTours.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700 hover:border-amber-400 hover:text-amber-700 transition"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <WildToursHero onBookingStart={handleBookingStart} />

      {/* Introduction Section */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-6 leading-tight">
              Leopard, Whale & Elephant Safaris — Your Way
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-montserrat mb-8">
              Curate your Sri Lankan wildlife journey: <strong className="text-amber-700">Semi-Luxury safaris</strong> with private jeeps, marine biologists,
              and boutique eco-lodges, or <strong className="text-green-700">Budget-friendly adventures</strong> with trusted local guides, shared boats,
              and authentic stays. Track leopards in Yala, witness “The Gathering” of elephants, and chase blue whales off Mirissa — tailored to how you travel.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <Card className="border-2 border-amber-200 hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  <CardTitle className="flex items-center gap-2 font-playfair">
                    <Star className="w-5 h-5" />
                    Semi-Luxury Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 text-left">
                    {[
                      'Private jeeps & boats for leopard, whale, and elephant encounters',
                      'Lead naturalists, marine biologists, and park rangers',
                      'Boutique eco-lodges near Yala, Udawalawe, Wilpattu, and Mirissa',
                      'Pro-grade optics and safety gear included',
                      'Chef-curated meals and sundowner setups',
                      'Micro groups (max 6–8) for prime sightings'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 font-montserrat">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <CardTitle className="flex items-center gap-2 font-playfair">
                    <Users className="w-5 h-5" />
                    Budget-Friendly Adventure
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 text-left">
                    {[
                      'Trusted shared jeeps and boats for leopard, elephant, and whale days',
                      'Local trackers who know every hide, nesting beach, and lagoon',
                      'Guesthouses/homestays near parks and whale harbors',
                      'Binoculars and life vests provided where needed',
                      'Home-style Sri Lankan meals between game drives',
                      'Social groups (8–15) to keep trips budget-friendly'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 font-montserrat">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>



      {/* Tour Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Booking Widget - Sticky Sidebar */}
            <div className="lg:w-1/3">
              <div ref={bookingRef}>
                <BookingWidget onBookingSubmit={handleWidgetSubmit} />
              </div>
            </div>

            {/* Tour Categories - Main Content */}
            <div className="lg:w-2/3 space-y-16">
              {categories.map((category) => (
                <div key={category} id={`${category}-tours`} className="scroll-mt-20">
                  <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      {category === 'elephant' && <Binoculars className="w-8 h-8 text-amber-600" />}
                      {category === 'leopard' && <Camera className="w-8 h-8 text-amber-600" />}
                      {category === 'whale' && <Waves className="w-8 h-8 text-blue-600" />}
                      {category === 'dolphin' && <Waves className="w-8 h-8 text-teal-600" />}
                      {category === 'birds' && <TreePine className="w-8 h-8 text-green-600" />}
                      {category === 'underwater' && <Compass className="w-8 h-8 text-cyan-600" />}
                      <h3 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 leading-tight">
                        {getCategoryTitle(category)}
                      </h3>
                    </div>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-montserrat leading-relaxed">
                      {getCategoryDescription(category)}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {tours[category]?.map((pkg) => (
                      <TourPackageCard
                        key={pkg.id}
                        package={pkg}
                        onSelect={handlePackageSelect}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Wild Tours Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-6">
              Why Choose Our Wild Tours?
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-montserrat">
              Experience Sri Lanka's incredible biodiversity with expert guidance,
              flexible pricing, and authentic encounters tailored to your adventure style.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="w-12 h-12 text-amber-600" />,
                title: 'Expert Local Guides',
                description: 'Our naturalists and wildlife experts share deep knowledge of animal behavior, conservation, and local ecosystems.'
              },
              {
                icon: <Star className="w-12 h-12 text-green-600" />,
                title: 'Flexible Pricing Tiers',
                description: 'Choose between premium semi-luxury experiences or authentic budget-friendly adventures without compromising on wildlife encounters.'
              },
              {
                icon: <CheckCircle className="w-12 h-12 text-blue-600" />,
                title: 'Sustainable Tourism',
                description: 'Support local communities and conservation efforts while experiencing Sri Lanka\'s wildlife in responsible, ethical ways.'
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-playfair font-bold mb-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 font-montserrat leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Ready for Your Wild Adventure?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto font-montserrat opacity-90">
            Book your Sri Lankan wildlife experience today and create memories that will last a lifetime.
          </p>
          <Button
            size="lg"
            onClick={handleBookingStart}
            className="bg-white text-amber-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
          >
            Start Planning Your Tour
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* AI-Optimized FAQ Section */}
      <AIOptimizedFAQ
        faqs={wildlifeFAQs}
        title="Wildlife Safari FAQ"
        description="Get answers to common questions about Sri Lanka wildlife safaris, best times to visit, and what to expect."
        pageUrl="/tours/wildtours"
        showCategories={true}
      />

      <Footer />

      {selectedPackage && (
        <BookingDialog
          tour={selectedPackage}
          open={bookingDialogOpen}
          onOpenChange={setBookingDialogOpen}
          onBook={handleBookingSubmit}
        />
      )}
    </>
  )
}

export default WildTours
