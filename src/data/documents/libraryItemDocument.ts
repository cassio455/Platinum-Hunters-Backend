import mongoose, { Schema, Document } from 'mongoose';
import { LibraryItemStatus } from '../../models/libraryItemStatus.js';

export interface ILibraryItem extends Document {
  userId: string;
  gameId: string;
  progress: number;
  platinum: boolean;
  hoursPlayed: number;
  status: LibraryItemStatus;
  createdAt: Date;
  updatedAt: Date;
}

const LibraryItemSchema = new Schema<ILibraryItem>({
  userId: { 
    type: String, 
    required: true
  },
  gameId: { 
    type: String, 
    required: true
  },
  progress: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 100
  },
  platinum: { 
    type: Boolean, 
    default: false 
  },
  hoursPlayed: { 
    type: Number, 
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: Object.values(LibraryItemStatus),
    default: LibraryItemStatus.PLAYING
  }
}, {
  timestamps: true,
  collection: 'library_items'
});

LibraryItemSchema.index({ userId: 1, gameId: 1 }, { unique: true });
LibraryItemSchema.index({ gameId: 1 });
LibraryItemSchema.index({ userId: 1, status: 1 });

export const LibraryItemModel = mongoose.model<ILibraryItem>('LibraryItem', LibraryItemSchema);
