// TripAdvisor Tours Data for Recharge Travels
// Generated from TripAdvisor listings

export interface RawTripAdvisorTour {
  title: string;
  priceUSD: number | null;
  rating: number | null;
  reviews: number;
  region: string;
  location: string;
  duration: string;
  category: string;
  imageUrl: string;
  tripAdvisorUrl: string;
  description: string;
}

export const rawTripAdvisorTours: RawTripAdvisorTour[] = [
  {
    title: "Discover Sri Lanka's Unique Marine Farming Culture",
    priceUSD: 40,
    rating: null,
    reviews: 1,
    region: "Jaffna",
    location: "Ariyalai Coastal Waters, Jaffna",
    duration: "1-2 hours",
    category: "Eco Tours",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop",
    tripAdvisorUrl: "https://www.tripadvisor.com/AttractionProductReview-g17664672-d33108820-Discover_Sri_Lanka_s_Unique_Marine_Farming_Culture-Ariyalai_Northern_Province.html",
    description: "Sri Lanka's only hands-on sea cucumber farming experience"
  },
  {
    title: "Sigiriya Rock and Dambulla Cave Temple all inclusive Private Day Trip",
    priceUSD: 85,
    rating: 5.0,
    reviews: 150,
    region: "Central",
    location: "Sigiriya, Central Province",
    duration: "Full day",
    category: "Cultural Tours",
    imageUrl: "/sigiriys.png",
    tripAdvisorUrl: "https://www.tripadvisor.com/AttractionProductReview-g293962-d12537317-Sigiriya_Rock_and_Dambulla_Cave_Temple_all_inclusive_Private_Day_Trip-Colombo_West.html",
    description: "Private day trip to Sigiriya Lion Rock and Dambulla Golden Temple with lunch included"
  },
  {
    title: "Transport only - Mirissa to Colombo Airport (CMB)",
    priceUSD: 95,
    rating: 5.0,
    reviews: 50,
    region: "South",
    location: "Mirissa to Colombo Airport",
    duration: "3-4 hours",
    category: "Airport Transfers",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
    tripAdvisorUrl: "https://www.tripadvisor.com/AttractionProductReview-g1407334-d17684488-Transport_only_Mirissa_to_Colombo_Airport_CMB-Mirissa_Southern_Province.html",
    description: "Private airport transfer from Mirissa to Colombo Bandaranaike International Airport (CMB)"
  },
  {
    title: "Colombo International Airport to Anywhere in Kalutara - Transport only",
    priceUSD: 45,
    rating: 5.0,
    reviews: 30,
    region: "West",
    location: "Colombo Airport to Kalutara",
    duration: "1-2 hours",
    category: "Airport Transfers",
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop",
    tripAdvisorUrl: "https://www.tripadvisor.com/AttractionProductReview-g1500185-d13166227-Colombo_International_Airport_to_Anywhere_in_Kalutara_Transport_only-Katunayake_N.html",
    description: "Private airport transfer from Colombo Bandaranaike International Airport to anywhere in Kalutara district"
  },
  {
    title: "Yala Safari Experience",
    priceUSD: 120,
    rating: 5.0,
    reviews: 85,
    region: "South",
    location: "Yala National Park",
    duration: "Full day",
    category: "Wildlife Safari",
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop",
    tripAdvisorUrl: "https://www.tripadvisor.com/AttractionProductReview-g293962-d12901825-Yala_Safari_Experience-Colombo_Western_Province.html",
    description: "Experience the wildlife of Yala National Park with expert guides - leopards, elephants, and more"
  },
  {
    title: "Private Airport Transfer - Colombo City to Colombo (CMB) Airport",
    priceUSD: 35,
    rating: 5.0,
    reviews: 45,
    region: "West",
    location: "Colombo City to CMB Airport",
    duration: "1 hour",
    category: "Airport Transfers",
    imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop",
    tripAdvisorUrl: "https://www.tripadvisor.com/AttractionProductReview-g293962-d17684489-Private_Airport_Transfer_Colombo_City_to_Colombo_CMB_Airport-Colombo_Western_Provi.html",
    description: "Private airport transfer from Colombo City to Colombo Bandaranaike International Airport (CMB)"
  }
];
