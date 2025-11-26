export interface Destination {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  category: string;
  link: string;
  bestTimeToVisit: string;
  popularActivities: string[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: any; // or Timestamp
  updatedAt: any; // or Timestamp
  price?: number;
  duration?: string;
  rating?: number;
  features?: string[];
}
