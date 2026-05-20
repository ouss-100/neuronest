export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  latitude: number;
  longitude: number;
  avatar: string;
  phone?: string;
  email?: string;
}
