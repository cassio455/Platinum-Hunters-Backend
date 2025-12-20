import mongoose, { Schema, Document } from 'mongoose';

export interface IGenreDocument extends Document {
  _id: string;
  name: string;
  nameLower: string;
}

const GenreSchema = new Schema<IGenreDocument>(
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
    collection: 'genres'
  }
);

export const GenreModel = mongoose.model<IGenreDocument>('Genre', GenreSchema);
