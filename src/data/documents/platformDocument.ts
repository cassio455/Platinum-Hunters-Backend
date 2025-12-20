import mongoose, { Schema, Document } from 'mongoose';

export interface IPlatformDocument extends Document {
  _id: string;
  name: string;
  nameLower: string;
}

const PlatformSchema = new Schema<IPlatformDocument>(
  {
    _id: { 
      type: String, 
      required: true 
    },
    name: { 
      type: String, 
      required: true,
      unique: true
    },
    nameLower: { 
      type: String, 
      required: true,
      unique: true,
      index: true
    }
  },
  {
    timestamps: true,
    collection: 'platforms'
  }
);

export const PlatformModel = mongoose.model<IPlatformDocument>('Platform', PlatformSchema);
