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

export interface TripFilters {
  sortBy: 'title' | 'price' | 'rating' | 'creationDate';
  sortOrder: 'ASC' | 'DESC';
  titleFilter: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  tags: string;
  page: number;
  limit: number;
}
