// src/services/user/createUserService.ts

import { User, UserRole} from "../../models/user.js";
import { UserModel } from "../../data/documents/userDocument.js";
import { BadRequestException } from "../../exceptions/httpException.js";
import { hashPassword } from "../passwordHasher.js";
import { generateToken } from "../../auth/token.js";

type CreateUserInput = {
    username: string;
    email: string;
    password: string;
    profileImageUrl?: string;
}

type UserDataResponse = {
    id: string;
    username: string;
    email: string;
    profileImageUrl?: string;
    createdAt: Date;
    token: string;
}

export const findUserByEmail = async (email: string) => {
    return await UserModel.findOne({ email: email.toLowerCase() });
};

export const createUserService = async (userData: CreateUserInput): Promise<UserDataResponse> => {
    const { username, email, password, profileImageUrl } = userData;

    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
        throw new BadRequestException('Unable to create user. Please check the provided data.');
    }

    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
        throw new BadRequestException('Unable to create user. Please check the provided data.');
    }

    const passwordHash = await hashPassword(password);

    // Cria a entidade de domínio
    const userEntity = new User({
        username,
        email: email.toLowerCase(),
        passwordHash,
        profileImageUrl
    });

    // Prepara para salvar no banco
    const userDocument = new UserModel(userEntity.toPersistence());
    
    // SALVA NO BANCO (O MongoDB gera o _id real aqui)
    await userDocument.save();

    // === CORREÇÃO CRÍTICA AQUI ===
    // Antes estava: userId: userEntity.id
    // Mudamos para: userId: userDocument.id (Para usar o ID real do MongoDB)
    const token = generateToken({
        userId: userDocument.id, 
        email: userEntity.email,
        username: userEntity.username,
        roles: userEntity.roles as UserRole[]
    });

    return {
        id: userDocument.id, // Retornamos o ID do banco também
        username: userEntity.username,
        email: userEntity.email,
        profileImageUrl: userEntity.profileImageUrl,
        createdAt: userEntity.createdAt,
        token
    };
}