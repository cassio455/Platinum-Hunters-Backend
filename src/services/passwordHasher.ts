import bcrypt, {genSalt, hash, compare} from 'bcryptjs';

const SALT_ROUNDS = 11;

export const hashPassword = async (password: string) : Promise<string> =>{
    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
}

export const comparePassword = async (password: string, hash: string) : Promise<boolean> =>{
    return await bcrypt.compare(password, hash);
}