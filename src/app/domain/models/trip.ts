export interface Trip {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  nrOfRatings: number;
  verticalType: string;
  tags: string[];
  co2: number;
  thumbnailUrl: string;
  imageUrl: string;
  creationDate: string;
}

// We create a model that will be only used in frontend, as score is frontend-calculated (should score be calculated in backend?)
export interface FrontendTrip extends Trip {
  score: 'average' | 'good' | 'awesome';
}

export type TripSortByOptions = 'title' | 'price' | 'rating' | 'creationDate';

export interface TripFilters {
  sortBy: TripSortByOptions;
  sortOrder: 'ASC' | 'DESC';
  titleFilter: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  tags: string;
  page: number;
  limit: number;
}
