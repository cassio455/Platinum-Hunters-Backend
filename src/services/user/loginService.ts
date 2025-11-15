import { UserProps, User, UserRole } from "../../models/user.js";
import { UserModel } from "../../data/documents/userDocument.js";
import { BadRequestException } from "../../exceptions/httpException.js";
import { comparePassword } from "../../services/passwordHasher.js";
import { generateToken } from "../../auth/token.js";
import { findUserByEmail } from "./createUserService.js";

interface LoginCredentialsInput {
    email: string;
    password: string;
}

type UserDataResponse = {
    id: string;
    username: string;
    email: string;
    profileImageUrl?: string;
    token: string;
}

export const loginUserService = async (credentials: LoginCredentialsInput): Promise<UserDataResponse> => {
    const { email, password } = credentials;

    const user = await findUserByEmail(email);
    if (!user) {
        throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
        throw new BadRequestException('Invalid email or password');
    }

    const token = generateToken({
        userId: user._id,
        email: user.email,
        username: user.username,
        roles: user.roles as UserRole[]
    });

    return {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        token
    };
};
