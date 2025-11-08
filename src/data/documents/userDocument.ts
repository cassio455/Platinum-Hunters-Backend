import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
    _id: string;
    username: string;
    email: string;
    passwordHash: string;
    profileImageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
    {
        _id: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: [true, 'Username é obrigatório'],
            unique: true,
            minlength: [5, 'Username deve ter no mínimo 5 caracteres'],
            maxlength: [20, 'Username deve ter no máximo 20 caracteres'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email é obrigatório'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Email inválido']
        },
        passwordHash: {
            type: String,
            required: [true, 'Password hash é obrigatório']
        },
        profileImageUrl: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true,
        _id: false
    }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
