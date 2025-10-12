import { safariContentService } from '@/services/safariContentService';

export const seedSafariPackages = async () => {
  const packages = [
    {
      title: "Yala Leopard Safari - Premium",
      description: "Exclusive early morning leopard tracking experience in Yala National Park",
      details: "Join our expert naturalists for a premium safari experience in Sri Lanka's most famous national park. With the highest density of leopards in the world, Yala offers unparalleled wildlife viewing opportunities.",
      features: [
        "Private 4x4 safari jeep with expert guide",
        "Early morning park entry for best wildlife viewing",
        "Gourmet breakfast in the wilderness",
        "Professional photography assistance",
        "Guaranteed window seat",
        "Complimentary binoculars and wildlife guidebook"
      ],
      price: 299,
      duration: "Full Day (5:00 AM - 2:00 PM)",
      image: "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=800",
      category: "wildlife" as const,
      isActive: true
    },
    {
      title: "Udawalawe Elephant Encounter",
      description: "Witness majestic elephant herds in their natural habitat",
      details: "Experience the magic of wild elephants at Udawalawe National Park, home to over 600 elephants. This safari offers exceptional opportunities to observe elephant families, including playful calves.",
      features: [
        "Specialized elephant tracking routes",
        "Visit to Elephant Transit Home",
        "Expert wildlife photographer guide",
        "Luxury picnic lunch by the reservoir",
        "Air-conditioned safari vehicle",
        "Elephant adoption certificate"
      ],
      price: 249,
      duration: "Half Day (6:00 AM - 12:00 PM)",
      image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800",
      category: "wildlife" as const,
      isActive: true
    },
    {
      title: "Wilpattu Wilderness Expedition",
      description: "Explore Sri Lanka's largest national park in complete luxury",
      details: "Venture into the untamed wilderness of Wilpattu, known for its natural lakes and diverse wildlife including leopards, sloth bears, and over 200 bird species.",
      features: [
        "Full day safari with multiple zones",
        "Exclusive access to restricted areas",
        "Bush breakfast and sunset cocktails",
        "Wildlife tracking technology",
        "Professional guide and spotter team",
        "Luxury camping option available"
      ],
      price: 399,
      duration: "Full Day (5:30 AM - 6:30 PM)",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
      category: "wildlife" as const,
      isActive: true
    },
    {
      title: "Cinnamon Wild Lodge Package",
      description: "2-night luxury wildlife retreat at award-winning eco-lodge",
      details: "Stay at the renowned Cinnamon Wild Yala, where wildlife comes to you. This all-inclusive package combines luxury accommodation with multiple safari experiences.",
      features: [
        "2 nights in Jungle Chalet with plunge pool",
        "All meals and beverages included",
        "2 morning and 1 evening safari drives",
        "Guided nature walks and bird watching",
        "Spa treatment and yoga sessions",
        "Airport transfers in luxury vehicle"
      ],
      price: 1299,
      duration: "3 Days / 2 Nights",
      image: "https://images.unsplash.com/photo-1596834876836-e2cd8b42a3a2?w=800",
      category: "lodge" as const,
      isActive: true
    },
    {
      title: "Leopard Trails Tented Safari Camp",
      description: "Glamping experience with daily big cat tracking",
      details: "Experience the thrill of staying in luxury tented accommodation while being immersed in leopard territory. This exclusive camp offers an authentic yet comfortable safari experience.",
      features: [
        "3 nights in luxury safari tent",
        "Daily morning and evening game drives",
        "Bush dinners under the stars",
        "Expert big cat specialist guide",
        "Night safari experience",
        "Photography workshop included"
      ],
      price: 1899,
      duration: "4 Days / 3 Nights",
      image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800",
      category: "lodge" as const,
      isActive: true
    },
    {
      title: "Wildlife Photography Masterclass",
      description: "Learn from award-winning wildlife photographers",
      details: "Join professional wildlife photographers for an intensive workshop combining technical training with practical field experience in Yala and Bundala National Parks.",
      features: [
        "Professional photography equipment provided",
        "One-on-one mentoring sessions",
        "Specialized photography hides access",
        "Post-processing workshop",
        "Portfolio review and certification",
        "Take home edited photo collection"
      ],
      price: 799,
      duration: "2 Days Intensive",
      image: "https://images.unsplash.com/photo-1540206395-68808572332f?w=800",
      category: "experience" as const,
      isActive: true
    }
  ];

  console.log('Starting to seed safari packages...');
  
  for (const packageData of packages) {
    try {
      const id = await safariContentService.savePackage(packageData);
      console.log(`Created package: ${packageData.title} with ID: ${id}`);
    } catch (error) {
      console.error(`Failed to create package: ${packageData.title}`, error);
    }
  }

  // Also ensure main content exists
  try {
    await safariContentService.updateMainContent({
      heroTitle: "Luxury Safari Expeditions",
      heroSubtitle: "Experience Sri Lanka's Wildlife in Unparalleled Comfort",
      heroImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920",
      aboutText: "Embark on extraordinary wildlife adventures in Sri Lanka's premier national parks. Our luxury safari experiences combine world-class accommodations with exclusive wildlife encounters, creating memories that last a lifetime.",
      whyChooseUs: [
        "Expert naturalist guides with decades of experience",
        "Exclusive access to prime wildlife viewing areas",
        "Luxury lodges with panoramic views",
        "Customized itineraries for your preferences",
        "Small group sizes for intimate experiences",
        "Conservation-focused sustainable tourism",
        "24/7 concierge service",
        "Complimentary photography equipment",
        "Carbon-neutral safari operations"
      ],
      testimonials: [
        {
          id: "1",
          name: "Sarah Johnson",
          text: "The leopard sighting at Yala was absolutely magical! Our guide's expertise made all the difference. A truly once-in-a-lifetime experience.",
          rating: 5
        },
        {
          id: "2",
          name: "Michael Chen",
          text: "Staying at the luxury tented camp was an experience beyond words. Five-star service in the wilderness! The staff went above and beyond.",
          rating: 5
        },
        {
          id: "3",
          name: "Emma Williams",
          text: "The photography masterclass transformed my skills. I came home with stunning wildlife shots and invaluable knowledge.",
          rating: 5
        },
        {
          id: "4",
          name: "David Kumar",
          text: "Watching elephant families at Udawalawe was emotional and beautiful. The guides' respect for wildlife was evident throughout.",
          rating: 5
        }
      ]
    });
    console.log('Updated main safari content');
  } catch (error) {
    console.error('Failed to update main content:', error);
  }

  console.log('Safari packages seeding completed!');
};