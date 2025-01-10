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
