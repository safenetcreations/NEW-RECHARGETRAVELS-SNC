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
    imageUrl: "",
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
    imageUrl: "",
    tripAdvisorUrl: "https://www.viator.com/tours/Colombo/Private-Day-Trip-of-Lion-Rock-and-Golden-Temple-from-Colombo/d4619-29711P4",
    description: "Private day trip to Sigiriya Lion Rock and Dambulla Golden Temple with lunch included"
  }
];
