export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  latitude: number;
  longitude: number;
  avatar: string;
}

// Dummy doctors around Paris area
export const doctors: Doctor[] = [
  { id: 1, name: "Dr. Sophie Martin", specialty: "Neurologist", rating: 4.9, reviews: 127, latitude: 48.8566, longitude: 2.3522, avatar: "SM" },
  { id: 2, name: "Dr. Pierre Dubois", specialty: "Speech Therapist", rating: 4.8, reviews: 93, latitude: 48.8606, longitude: 2.3376, avatar: "PD" },
  { id: 3, name: "Dr. Marie Laurent", specialty: "Child Psychologist", rating: 4.7, reviews: 156, latitude: 48.8530, longitude: 2.3499, avatar: "ML" },
  { id: 4, name: "Dr. Jean Moreau", specialty: "Pediatric Neurologist", rating: 4.9, reviews: 201, latitude: 48.8648, longitude: 2.3490, avatar: "JM" },
  { id: 5, name: "Dr. Claire Bernard", specialty: "Neurologist", rating: 4.6, reviews: 78, latitude: 48.8510, longitude: 2.3600, avatar: "CB" },
  { id: 6, name: "Dr. Luc Petit", specialty: "Speech Therapist", rating: 4.8, reviews: 112, latitude: 48.8700, longitude: 2.3320, avatar: "LP" },
  { id: 7, name: "Dr. Anne Richard", specialty: "Child Psychologist", rating: 4.5, reviews: 64, latitude: 48.8450, longitude: 2.3450, avatar: "AR" },
  { id: 8, name: "Dr. Thomas Robert", specialty: "Pediatric Neurologist", rating: 4.7, reviews: 89, latitude: 48.8590, longitude: 2.3700, avatar: "TR" },
  { id: 9, name: "Dr. Isabelle Durand", specialty: "Neurologist", rating: 4.4, reviews: 52, latitude: 48.8680, longitude: 2.3580, avatar: "ID" },
  { id: 10, name: "Dr. François Garcia", specialty: "Speech Therapist", rating: 4.9, reviews: 145, latitude: 48.8480, longitude: 2.3300, avatar: "FG" },
  { id: 11, name: "Dr. Nathalie Simon", specialty: "Child Psychologist", rating: 4.6, reviews: 98, latitude: 48.8720, longitude: 2.3450, avatar: "NS" },
  { id: 12, name: "Dr. Michel Lefèvre", specialty: "Pediatric Neurologist", rating: 4.8, reviews: 176, latitude: 48.8550, longitude: 2.3250, avatar: "ML2" },
];

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
