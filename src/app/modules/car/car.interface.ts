export interface ICarGalleryImage {
  url: string;
}

export interface ICar {
  name: string;
  description: string;
  image: string;
  brand: string;
  model: string;
  type: string;
  category: string;
  year: number;
  price: number;
  color: string;
  seatCapacity: number;
  isElectric: boolean;
  moreImages: ICarGalleryImage[];
  features: string[];
  transmission: 'automatic' | 'manual';
  status: 'available' | 'unavailable';
  stock: number;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
