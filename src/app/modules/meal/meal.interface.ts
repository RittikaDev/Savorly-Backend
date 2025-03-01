import { Document, Types } from 'mongoose';

export interface IMeal extends Document {
  name: string;
  description: string;
  ingredients: string[];
  portionSize: string;
  price: number;
  dietaryPreferences: string[]; // EXAMPLE: ['VEGAN', 'GLUTEN-FREE']
  cuisineType: string; // EXAMPLE: 'ITALIAN', 'MEXICAN', ETC.
  providerId: Types.ObjectId; // REFERENCE TO MEAL PROVIDER
  availability: boolean;
  rating: number; // RATING BASED ON CUSTOMER REVIEWS
  image: string[];
}
