import { Schema, model } from 'mongoose';
import { ICar } from './car.interface';

const carSchema = new Schema<ICar>(
  {
    name: { type: String, required: [true, 'Car name is required'] },
    description: { type: String, required: [true, 'Description is required'] },
    image: { type: String, required: [true, 'Image URL is required'] },
    brand: { type: String, required: [true, 'Brand is required'] },
    model: { type: String, required: [true, 'Model is required'] },
    type: { type: String, required: [true, 'Type is required'] },
    category: { type: String, required: [true, 'Category is required'] },
    year: { type: Number, required: [true, 'Year is required'] },
    price: { type: Number, required: [true, 'Year is required'] },
    color: { type: String, required: [true, 'Color is required'] },
    seatCapacity: {
      type: Number,
      required: [true, 'Seat capacity is required'],
    },
    isElectric: { type: Boolean, default: false },
    moreImages: [
      {
        url: {
          type: String,
          required: [true, 'Gallery image URL is required'],
        },
      },
    ],
    features: { type: [String], default: [] },
    transmission: {
      type: String,
      enum: ['automatic', 'manual'],
      required: [true, 'Transmission type is required'],
    },
    status: {
      type: String,
      enum: ['available', 'unavailable'],
      default: 'available',
    },
    stock: {
      type: Number,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

export const CarModel = model<ICar>('Car', carSchema);
