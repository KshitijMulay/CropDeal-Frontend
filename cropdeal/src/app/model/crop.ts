export interface Crop {
  cropId?: number;
  cropName: string;
  cropType: string;
  quantityAvailable: number;
  pricePerKg: number;
  quantityBooked?: number;
  status?: string;
  postedAt?: string;
  farmerId?: number;
}
