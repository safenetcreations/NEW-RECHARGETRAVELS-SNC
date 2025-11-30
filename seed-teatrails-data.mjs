import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCxFnQfMo3rOWhgm1_yiRIh0Oez246U2N0",
  authDomain: "recharge-travels-73e76.firebaseapp.com",
  projectId: "recharge-travels-73e76",
  storageBucket: "recharge-travels-73e76.firebasestorage.app",
  messagingSenderId: "515581447537",
  appId: "1:515581447537:web:b4f65bf9c2544c65d6fad0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedTeaTrailsData() {
  console.log('🍃 Seeding Tea Trails data...\n');

  // Hero Content
  await setDoc(doc(db, 'teatrails_content', 'hero'), {
    title: 'Sri Lanka Tea Trails',
    subtitle: 'From misty plantations to your perfect cup',
    backgroundImage: 'https://images.unsplash.com/photo-1606820854416-439b3305ff39?q=80&w=3840&h=2160&auto=format&fit=crop',
    ctaText: 'Book Tea Trail Tour',
    ctaLink: '#tours'
  });
  console.log('✓ Hero content saved');

  // Intro Content
  await setDoc(doc(db, 'teatrails_content', 'intro'), {
    introParagraph: "Wake to the aroma of fresh Ceylon tea, hike through velvety carpets of emerald leaves and learn 150 years of plantation lore from local pickers. Sri Lanka's Tea Trails weave between lofty peaks, tumbling waterfalls and colonial bungalows that once housed British planters. This experience pairs gentle adventure with liquid gold in your cup, revealing how a tiny leaf shaped the island's history—and still fuels its high-country culture today."
  });
  console.log('✓ Intro content saved');

  // Highlights
  await setDoc(doc(db, 'teatrails_content', 'highlights'), {
    items: [
      { icon: "🌿", title: "Estate Walks", blurb60: "Stroll with an expert guide among century-old bushes and learn how altitude shapes aroma." },
      { icon: "🫖", title: "Factory & Tasting", blurb60: "Tour a working 19th-century factory, see withering & rolling, then taste white, green and classic BOP." },
      { icon: "👒", title: "Pluck-Like-a-Pro", blurb60: "Try your hand at two-leaf-and-a-bud picking alongside smiling estate workers." },
      { icon: "🌄", title: "Lipton's Seat Hike", blurb60: "Sunrise trek to Sir Thomas Lipton's lookout for panoramas across five provinces." }
    ]
  });
  console.log('✓ Highlights saved');

  // CTA Content
  await setDoc(doc(db, 'teatrails_content', 'cta'), {
    headline: "Sip the World's Finest Tea Where It's Grown",
    subtitle: "Let Recharge Travels craft your perfect hill-country escape—private transport, colonial bungalows and insider tastings included.",
    buttonText: "Start Your Tea Journey",
    buttonLink: "/booking/tea-trails"
  });
  console.log('✓ CTA content saved');

  // Booking Config
  await setDoc(doc(db, 'teatrails_content', 'booking'), {
    depositPercent: 20,
    depositNote: '20% deposit required to confirm your booking',
    cancellationPolicy: 'Free cancellation up to 48 hours before the tour start date.',
    whatsapp: '+94777721999',
    email: 'info@rechargetravels.com',
    phone: '+94777721999',
    responseTime: 'We respond within 2 hours',
    pickupLocations: [
      'Colombo - Bandaranaike International Airport',
      'Colombo City Hotels',
      'Kandy City Hotels',
      'Nuwara Eliya Hotels',
      'Ella Hotels',
      'Custom Location'
    ],
    paymentMethods: ['Credit Card', 'PayPal', 'Bank Transfer', 'Pay on Arrival']
  });
  console.log('✓ Booking config saved');

  // =====================
  // TOURS - 6 Different tea trail tours
  // =====================
  const tours = [
    {
      title: 'Ultimate Tea Trail Experience',
      thumbnail: 'https://images.unsplash.com/photo-1606820854416-439b3305ff39?w=800&auto=format&fit=crop',
      badges: ['Bestseller', 'Small Group'],
      duration: '3 Days / 2 Nights',
      salePriceUSD: 299,
      regularPriceUSD: 399,
      highlights: ['3 Tea Estates', 'Factory Tours', 'Tea Plucking Experience', 'Colonial Bungalow Stay'],
      description: 'The complete Ceylon tea experience covering three premium estates with overnight stays in colonial-era bungalows.',
      isPublished: true,
      order: 0
    },
    {
      title: 'Nuwara Eliya Tea Discovery',
      thumbnail: 'https://images.unsplash.com/photo-1589456506629-b2ea1a8576fb?w=800&auto=format&fit=crop',
      badges: ['Popular'],
      duration: '2 Days / 1 Night',
      salePriceUSD: 189,
      highlights: ['Pedro Estate Visit', 'High Tea at Grand Hotel', 'City Tour', 'Lake Gregory Views'],
      description: 'Explore the Little England of Sri Lanka with premium tea tastings and scenic hill country views.',
      isPublished: true,
      order: 1
    },
    {
      title: "Lipton's Seat Sunrise Adventure",
      thumbnail: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&auto=format&fit=crop',
      badges: ['Adventure', 'Early Start'],
      duration: '1 Day',
      salePriceUSD: 89,
      highlights: ['Sunrise Trek', 'Dambatenne Factory Tour', 'Tea Tasting Session', 'Scenic Train Ride Option'],
      description: 'Wake early for the iconic sunrise trek to where Sir Thomas Lipton surveyed his tea empire.',
      isPublished: true,
      order: 2
    },
    {
      title: 'Kandy to Ella Tea Express',
      thumbnail: 'https://images.unsplash.com/photo-1596018589855-e9c3e317c4dc?w=800&auto=format&fit=crop',
      badges: ['Train Journey', 'Scenic'],
      duration: '2 Days / 1 Night',
      salePriceUSD: 229,
      highlights: ['Scenic Train Ride', 'Multiple Factory Stops', 'Nine Arch Bridge', 'Little Adams Peak'],
      description: 'Combine the famous hill country train journey with visits to working tea estates along the way.',
      isPublished: true,
      order: 3
    },
    {
      title: 'Luxury Tea Planter Experience',
      thumbnail: 'https://images.unsplash.com/photo-1563911892727-df9c92c2d5d2?w=800&auto=format&fit=crop',
      badges: ['Luxury', 'Private'],
      duration: '4 Days / 3 Nights',
      salePriceUSD: 599,
      regularPriceUSD: 749,
      highlights: ['Private Tea Bungalow', 'Chef-Prepared Meals', 'Helicopter Tour Option', 'Spa Treatments'],
      description: 'Live like a colonial tea planter with all modern luxuries in restored heritage bungalows.',
      isPublished: true,
      order: 4
    },
    {
      title: 'Tea & Waterfalls Day Trip',
      thumbnail: 'https://images.unsplash.com/photo-1605451730973-b0e21c0b5b0a?w=800&auto=format&fit=crop',
      badges: ['Day Trip', 'Family Friendly'],
      duration: '1 Day',
      salePriceUSD: 69,
      highlights: ['One Factory Visit', 'Waterfall Stop', 'Tea Tasting', 'Scenic Drive'],
      description: 'Perfect introduction to tea country combining estate visits with stunning waterfall viewpoints.',
      isPublished: true,
      order: 5
    }
  ];

  for (const tour of tours) {
    await addDoc(collection(db, 'teatrails_tours'), tour);
  }
  console.log(`✓ ${tours.length} tours saved`);

  // =====================
  // ROUTES - 3 Tea trail routes
  // =====================
  const routes = [
    {
      routeName: 'Kandy → Hatton Heritage Line',
      duration: '1 day / 105 km',
      distanceKm: 105,
      bestClass: 'Observation coach',
      difficulty: 'Easy',
      elevation: '500-1500m',
      description: 'The classic tea country rail journey through lush green valleys and historic estates.',
      isActive: true,
      order: 0
    },
    {
      routeName: 'Nuwara Eliya Tea Loop',
      duration: '½ day / 30 km scenic drive',
      distanceKm: 30,
      bestClass: 'Private van',
      difficulty: 'Easy',
      elevation: '1800-2000m',
      description: 'A circular route connecting the major estates around Sri Lanka\'s highest tea-growing region.',
      isActive: true,
      order: 1
    },
    {
      routeName: "Haputale → Lipton's Seat Trail",
      duration: '4 hr hike / 7 km',
      distanceKm: 7,
      bestClass: 'On foot',
      difficulty: 'Moderate',
      elevation: '1400-1800m',
      description: 'Trek through working plantations to the legendary viewpoint of tea baron Thomas Lipton.',
      isActive: true,
      order: 2
    }
  ];

  for (const route of routes) {
    await addDoc(collection(db, 'teatrails_routes'), route);
  }
  console.log(`✓ ${routes.length} routes saved`);

  // =====================
  // GALLERY - 6 images
  // =====================
  const gallery = [
    { url: 'https://images.unsplash.com/photo-1596018589855-e9c3e317c4dc?w=1200&h=800&auto=format&fit=crop', alt: 'Woman in vibrant sari plucking Ceylon tea leaves at sunrise', caption: 'Traditional tea plucking at dawn', order: 0 },
    { url: 'https://images.unsplash.com/photo-1605451730973-b0e21c0b5b0a?w=1200&h=800&auto=format&fit=crop', alt: 'Old British tea factory with cast-iron machinery in Sri Lanka', caption: 'Historic tea processing machinery', order: 1 },
    { url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=1200&h=800&auto=format&fit=crop', alt: 'Aerial view of terraced plantations and misty mountains near Haputale', caption: 'Breathtaking aerial view of tea terraces', order: 2 },
    { url: 'https://images.unsplash.com/photo-1563911892727-df9c92c2d5d2?w=1200&h=800&auto=format&fit=crop', alt: 'Ceylon tea tasting session with traditional cups', caption: 'Authentic tea tasting experience', order: 3 },
    { url: 'https://images.unsplash.com/photo-1606821306103-85ca0e88bdd8?w=1200&h=800&auto=format&fit=crop', alt: 'Misty morning over tea estate hills', caption: 'Misty mornings in the tea country', order: 4 },
    { url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200&h=800&auto=format&fit=crop', alt: 'Tea pickers working in the plantations', caption: 'Dedicated tea plantation workers', order: 5 }
  ];

  for (const image of gallery) {
    await addDoc(collection(db, 'teatrails_gallery'), image);
  }
  console.log(`✓ ${gallery.length} gallery images saved`);

  // =====================
  // FAQS - 5 questions
  // =====================
  const faqs = [
    {
      question: 'What is the best time to visit tea plantations?',
      answer: 'The best time is from December to May when the weather is dry and clear. However, tea plantations can be visited year-round. The misty atmosphere during the monsoon season (June-September) also offers a unique charm.',
      order: 0,
      isActive: true
    },
    {
      question: 'Can I participate in tea plucking?',
      answer: "Yes! Many estates offer tea plucking experiences where you can dress like a tea plucker and learn the traditional 'two leaves and a bud' technique. It's usually available in the morning when actual plucking happens.",
      order: 1,
      isActive: true
    },
    {
      question: 'What should I wear when visiting tea estates?',
      answer: 'Wear comfortable walking shoes with good grip as paths can be steep and slippery. Bring layers as temperatures can be cool in the morning and evening. Long pants are recommended to protect against insects and plants.',
      order: 2,
      isActive: true
    },
    {
      question: 'How long does a typical tea factory tour take?',
      answer: 'A comprehensive factory tour usually takes 1.5 to 2 hours, including the processing demonstration and tea tasting session. Some estates offer shorter 45-minute tours.',
      order: 3,
      isActive: true
    },
    {
      question: 'Can I buy tea directly from the estates?',
      answer: 'Absolutely! Estate shops offer fresh tea at factory prices. You can buy various grades of tea, from premium whole leaf to everyday blends. Staff can help you choose based on your preferences.',
      order: 4,
      isActive: true
    }
  ];

  for (const faq of faqs) {
    await addDoc(collection(db, 'teatrails_faqs'), faq);
  }
  console.log(`✓ ${faqs.length} FAQs saved`);

  // =====================
  // TESTIMONIALS - 5 reviews
  // =====================
  const testimonials = [
    {
      name: 'James Patterson',
      country: 'United Kingdom',
      comment: 'The tea trail tour was absolutely magical. Watching the sunrise from Lipton\'s Seat while sipping freshly brewed Ceylon tea is a memory I\'ll treasure forever.',
      rating: 5,
      tourName: "Lipton's Seat Sunrise Adventure",
      isActive: true
    },
    {
      name: 'Emma Schmidt',
      country: 'Germany',
      comment: 'As a tea enthusiast, this was a dream come true. The factory tours were incredibly informative, and I came home with the best tea I\'ve ever tasted.',
      rating: 5,
      tourName: 'Ultimate Tea Trail Experience',
      isActive: true
    },
    {
      name: 'Yuki Tanaka',
      country: 'Japan',
      comment: 'The colonial bungalow stay was like stepping back in time. The staff were wonderful and the tea plucking experience with local workers was authentic and fun.',
      rating: 5,
      tourName: 'Luxury Tea Planter Experience',
      isActive: true
    },
    {
      name: 'Michael & Sarah Brown',
      country: 'Australia',
      comment: 'Perfect family day out! Our kids loved the train ride and even they enjoyed learning about tea. The waterfalls were a bonus highlight.',
      rating: 5,
      tourName: 'Tea & Waterfalls Day Trip',
      isActive: true
    },
    {
      name: 'François Dubois',
      country: 'France',
      comment: 'The train journey from Kandy to Ella combined with tea estate visits was incredible. Some of the most beautiful scenery I\'ve experienced anywhere in the world.',
      rating: 5,
      tourName: 'Kandy to Ella Tea Express',
      isActive: true
    }
  ];

  for (const testimonial of testimonials) {
    await addDoc(collection(db, 'teatrails_testimonials'), testimonial);
  }
  console.log(`✓ ${testimonials.length} testimonials saved`);

  console.log('\n✅ All Tea Trails data seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - 6 Tea Trail Tours`);
  console.log(`   - 3 Routes`);
  console.log(`   - 6 Gallery Images`);
  console.log(`   - 5 FAQs`);
  console.log(`   - 5 Testimonials`);
  console.log('\nVisit https://www.rechargetravels.com/experiences/tea-trails to see the updated page');
  process.exit(0);
}

seedTeaTrailsData().catch(console.error);
