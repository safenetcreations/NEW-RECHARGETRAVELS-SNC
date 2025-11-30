import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

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

async function deleteCollection(collectionName) {
  console.log(`🗑️ Deleting all documents from ${collectionName}...`);
  const snapshot = await getDocs(collection(db, collectionName));
  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  console.log(`   ✓ Deleted ${snapshot.docs.length} documents from ${collectionName}`);
}

async function seedAyurvedaData() {
  console.log('🧹 Clearing existing Ayurveda data...\n');

  // Delete all existing data first
  await deleteCollection('ayurveda_retreats');
  await deleteCollection('ayurveda_treatments');
  await deleteCollection('ayurveda_testimonials');

  console.log('\n📝 Seeding fresh Ayurveda data with unique images...\n');

  // Hero Content
  await setDoc(doc(db, 'ayurveda_content', 'hero'), {
    title: 'Ayurveda & Wellness Retreats',
    subtitle: 'Experience 5,000 years of ancient healing wisdom in the serene heart of Sri Lanka',
    backgroundImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=2000&q=80',
    ctaText: 'Discover Your Path to Wellness',
    ctaLink: '#retreats'
  });
  console.log('✓ Hero content saved');

  // Philosophy Content
  await setDoc(doc(db, 'ayurveda_content', 'philosophy'), {
    label: 'The Ancient Science of Life',
    title: 'Harmonize Body, Mind & Spirit',
    description: 'Ayurveda, meaning "knowledge of life," is an ancient Indian healing system that has flourished in Sri Lanka for over 3,000 years. Our expert practitioners combine traditional therapies with modern wellness practices, using locally sourced herbs and oils to restore your natural balance.',
    pillars: ['Vata Balance', 'Pitta Harmony', 'Kapha Vitality']
  });
  console.log('✓ Philosophy content saved');

  // CTA Content
  await setDoc(doc(db, 'ayurveda_content', 'cta'), {
    title: 'Begin Your Healing Journey Today',
    subtitle: 'Our wellness consultants will craft a personalized retreat experience tailored to your health goals',
    buttonText: 'Book Your Consultation',
    buttonLink: '/contact',
    backgroundImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=2000&q=80'
  });
  console.log('✓ CTA content saved');

  // =====================
  // UNIQUE RETREATS - 6 Different packages with unique images
  // =====================
  const retreats = [
    {
      title: 'Panchakarma Deep Detox',
      description: 'A comprehensive 14-day deep cleansing program featuring all five Panchakarma therapies. This ancient purification system eliminates toxins, rejuvenates tissues, and restores optimal health with daily yoga and organic Ayurvedic cuisine.',
      duration: '14 Days / 13 Nights',
      price: 2850,
      image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80',
      highlights: ['Complete Panchakarma Therapy', 'Daily Yoga & Meditation', 'Personalized Diet Plan', 'Herbal Steam Baths', 'Nature Walks'],
      isActive: true,
      order: 0,
      location: 'Kandy'
    },
    {
      title: 'Stress Relief & Mental Clarity',
      description: 'A 7-day escape designed for modern professionals seeking relief from burnout. Combines Shirodhara (oil pouring therapy), Abhyanga massage, and mindfulness practices to restore mental clarity and emotional balance.',
      duration: '7 Days / 6 Nights',
      price: 1450,
      image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=1200&q=80',
      highlights: ['Shirodhara Therapy', 'Stress Management', 'Sound Healing', 'Meditation Retreat', 'Digital Detox'],
      isActive: true,
      order: 1,
      location: 'Ella'
    },
    {
      title: 'Weight Loss & Metabolism Boost',
      description: 'A transformative 10-day program combining Ayurvedic dietary principles, Udvartana (herbal powder massage), and lifestyle modifications. Achieve sustainable weight loss while improving metabolism and energy levels.',
      duration: '10 Days / 9 Nights',
      price: 1950,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
      highlights: ['Udvartana Massage', 'Ayurvedic Diet', 'Fitness Sessions', 'Cooking Classes', 'Body Analysis'],
      isActive: true,
      order: 2,
      location: 'Sigiriya'
    },
    {
      title: 'Romantic Couples Retreat',
      description: 'A romantic 5-day retreat for couples seeking to reconnect and rejuvenate together. Features synchronized treatments, couples yoga, candlelit dinners, and private sessions designed to strengthen bonds.',
      duration: '5 Days / 4 Nights',
      price: 2200,
      image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
      highlights: ['Couples Massage', 'Private Yoga', 'Romantic Dinners', 'Sunset Meditation', 'Spa Rituals'],
      isActive: true,
      order: 3,
      location: 'Bentota'
    },
    {
      title: 'Senior Wellness & Joint Care',
      description: 'A gentle 12-day program designed for seniors focusing on joint health, mobility, and overall vitality. Features mild therapies, physiotherapy, and exercises adapted for older adults.',
      duration: '12 Days / 11 Nights',
      price: 2400,
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
      highlights: ['Joint Care Therapy', 'Gentle Yoga', 'Physiotherapy', 'Memory Enhancement', 'Social Activities'],
      isActive: true,
      order: 4,
      location: 'Negombo'
    },
    {
      title: 'Immunity & Vitality Boost',
      description: 'A powerful 8-day program focused on strengthening your immune system using Rasayana (rejuvenation) therapies, immune-boosting herbs, and lifestyle practices to enhance your natural defenses.',
      duration: '8 Days / 7 Nights',
      price: 1650,
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
      highlights: ['Rasayana Therapy', 'Herbal Immunity Boost', 'Pranayama', 'Forest Bathing', 'Healthy Cooking'],
      isActive: true,
      order: 5,
      location: 'Dambulla'
    }
  ];

  for (const retreat of retreats) {
    await addDoc(collection(db, 'ayurveda_retreats'), retreat);
  }
  console.log(`✓ ${retreats.length} retreats saved`);

  // =====================
  // UNIQUE TREATMENTS - 8 Different treatments with unique images
  // =====================
  const treatments = [
    {
      title: 'Abhyanga Full Body Massage',
      description: 'A synchronized full-body massage using warm herbal oils selected for your dosha type. This deeply relaxing treatment improves circulation, nourishes tissues, and promotes restful sleep.',
      duration: '75 minutes',
      price: 85,
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
      benefits: ['Deep Relaxation', 'Improved Circulation', 'Skin Nourishment', 'Stress Relief', 'Better Sleep'],
      isActive: true,
      order: 0,
      category: 'Massage'
    },
    {
      title: 'Shirodhara Third Eye Therapy',
      description: 'A profound therapy where warm oil is continuously poured over the forehead. This deeply calming treatment relieves anxiety, insomnia, and mental fatigue while enhancing intuition.',
      duration: '60 minutes',
      price: 95,
      image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=800&q=80',
      benefits: ['Mental Clarity', 'Anxiety Relief', 'Insomnia Cure', 'Enhanced Focus', 'Spiritual Awakening'],
      isActive: true,
      order: 1,
      category: 'Head Therapy'
    },
    {
      title: 'Udvartana Herbal Body Scrub',
      description: 'A vigorous massage using warm herbal powders that exfoliate the skin, reduce cellulite, and stimulate metabolism. Excellent for weight management and skin conditions.',
      duration: '60 minutes',
      price: 75,
      image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
      benefits: ['Cellulite Reduction', 'Skin Exfoliation', 'Weight Loss', 'Toxin Removal', 'Improved Texture'],
      isActive: true,
      order: 2,
      category: 'Body Treatment'
    },
    {
      title: 'Pizhichil Royal Oil Bath',
      description: 'Known as the "King of Ayurvedic treatments," warm medicated oil is continuously poured and massaged over the body by two therapists. Ultimate rejuvenation for muscles and joints.',
      duration: '90 minutes',
      price: 150,
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
      benefits: ['Complete Rejuvenation', 'Muscle Recovery', 'Joint Health', 'Anti-Aging', 'Deep Healing'],
      isActive: true,
      order: 3,
      category: 'Premium'
    },
    {
      title: 'Nasya Nasal Cleansing',
      description: 'Medicated oils or herbal preparations are administered through the nose to clear the sinuses, improve breathing, and enhance mental clarity. Highly effective for respiratory issues.',
      duration: '30 minutes',
      price: 45,
      image: 'https://images.unsplash.com/photo-1591343395902-1adcb454c4e2?auto=format&fit=crop&w=800&q=80',
      benefits: ['Sinus Relief', 'Clear Breathing', 'Mental Alertness', 'Headache Relief', 'Improved Voice'],
      isActive: true,
      order: 4,
      category: 'Cleansing'
    },
    {
      title: 'Kati Basti Back Treatment',
      description: 'A specialized treatment where warm medicated oil is retained on the lower back using a dough dam. Provides remarkable relief for back pain, sciatica, and spinal conditions.',
      duration: '45 minutes',
      price: 65,
      image: 'https://images.unsplash.com/photo-1573883431205-98b5f10aaedb?auto=format&fit=crop&w=800&q=80',
      benefits: ['Back Pain Relief', 'Sciatica Treatment', 'Spine Health', 'Muscle Relaxation', 'Disc Problems'],
      isActive: true,
      order: 5,
      category: 'Therapeutic'
    },
    {
      title: 'Mukha Lepam Facial',
      description: 'A nourishing facial using Ayurvedic herbs and oils customized for your skin type. Includes cleansing, herbal mask, and facial marma massage for radiant, youthful skin.',
      duration: '60 minutes',
      price: 70,
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      benefits: ['Glowing Skin', 'Anti-Aging', 'Deep Cleansing', 'Pore Refinement', 'Natural Radiance'],
      isActive: true,
      order: 6,
      category: 'Facial'
    },
    {
      title: 'Swedana Herbal Steam',
      description: 'A therapeutic steam treatment using aromatic herbs that opens pores, promotes sweating, and helps eliminate toxins. Usually done after oil massage for enhanced benefits.',
      duration: '20 minutes',
      price: 35,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      benefits: ['Toxin Release', 'Open Pores', 'Muscle Relief', 'Better Absorption', 'Respiratory Health'],
      isActive: true,
      order: 7,
      category: 'Cleansing'
    }
  ];

  for (const treatment of treatments) {
    await addDoc(collection(db, 'ayurveda_treatments'), treatment);
  }
  console.log(`✓ ${treatments.length} treatments saved`);

  // =====================
  // TESTIMONIALS - 6 Different testimonials
  // =====================
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      country: 'United Kingdom',
      comment: 'The Panchakarma retreat completely transformed my health. After years of chronic fatigue, I finally have my energy back. The doctors and therapists were incredibly knowledgeable and caring.',
      rating: 5,
      image: '',
      retreatName: 'Panchakarma Deep Detox',
      isActive: true
    },
    {
      name: 'Marcus Weber',
      country: 'Germany',
      comment: 'As a stressed executive, I was skeptical about Ayurveda. But the stress relief program gave me tools I use daily. The Shirodhara therapy was life-changing - I sleep better than I have in years.',
      rating: 5,
      image: '',
      retreatName: 'Stress Relief & Mental Clarity',
      isActive: true
    },
    {
      name: 'Jennifer & David Chen',
      country: 'Canada',
      comment: "We did the couples retreat for our 10th anniversary and it was magical. The private villa, synchronized treatments, and thoughtful touches made it unforgettable. We've already booked our return!",
      rating: 5,
      image: '',
      retreatName: 'Romantic Couples Retreat',
      isActive: true
    },
    {
      name: 'Akiko Tanaka',
      country: 'Japan',
      comment: 'The weight management program helped me lose 8kg and completely changed my relationship with food. The Ayurvedic cooking classes were a highlight - I now cook these recipes at home.',
      rating: 5,
      image: '',
      retreatName: 'Weight Loss & Metabolism Boost',
      isActive: true
    },
    {
      name: 'Robert Anderson',
      country: 'Australia',
      comment: "At 72, I was experiencing significant joint pain. The senior wellness program's gentle therapies and exercises have improved my mobility dramatically. The staff treated me like family.",
      rating: 5,
      image: '',
      retreatName: 'Senior Wellness & Joint Care',
      isActive: true
    },
    {
      name: 'Maria Santos',
      country: 'Brazil',
      comment: 'After COVID, my immunity was weak and I kept getting sick. The immunity retreat with Rasayana therapy has made me feel stronger than ever. The herbal supplements they gave me are incredible.',
      rating: 5,
      image: '',
      retreatName: 'Immunity & Vitality Boost',
      isActive: true
    }
  ];

  for (const testimonial of testimonials) {
    await addDoc(collection(db, 'ayurveda_testimonials'), testimonial);
  }
  console.log(`✓ ${testimonials.length} testimonials saved`);

  console.log('\n✅ All Ayurveda data seeded successfully with unique images!');
  console.log('\n📊 Summary:');
  console.log(`   - 6 Unique Retreats (each with different image)`);
  console.log(`   - 8 Unique Treatments (each with different image)`);
  console.log(`   - 6 Testimonials`);
  console.log('\nVisit http://localhost:5173/experiences/ayurveda to see the updated page');
  process.exit(0);
}

seedAyurvedaData().catch(console.error);
