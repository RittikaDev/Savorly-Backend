import { Document, Types } from 'mongoose';

export interface IMealProvider extends Document {
  userId: Types.ObjectId; // Reference to `users` collection
  restaurantName: string;
  cuisineSpecialties: string[]; // Example: ["Italian", "Chinese"]
  pricing: number; // Average price per meal
  experience: number; // Years of experience
  menu: Types.ObjectId[]; // References `meals` collection
  availability: boolean; // True = accepting orders
  ratings: number[]; // Array of rating values
  reviews: {
    userId: Types.ObjectId;
    comment: string;
    rating: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
