import { ArgumentException } from "../exceptions/argumentException.js";
import { generateUUID } from "../utils/uuid.js";

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
    MOD = "MOD"
}

export interface UserProps {
    username : string;
    email : string;
    passwordHash : string;
    profileImageUrl? : string;
}
export class User {
    private _createdAt : Date;
    private _updatedAt? : Date;
    private _id: string;
    private _props: UserProps;

    constructor(props: UserProps){
        if(!props.username || !props.email || !props.passwordHash){
            throw new ArgumentException("Invalid user properties");
        }
        this._createdAt = new Date();
        this._updatedAt = new Date();
        this._id = generateUUID();
        this._props = { ...props };
    }

    get username(){
        return this._props.username;
    }

    get email(){
        return this._props.email;
    }

    get profileImageUrl(){
        return this._props.profileImageUrl;
    }

    get id(){
        return this._id;
    }

    get createdAt(){
        return this._createdAt;
    }

    get updatedAt(){
        return this._updatedAt;
    }
    toPersistence(){
        return {
            _id: this._id,
            username: this._props.username,
            email: this._props.email,
            passwordHash: this._props.passwordHash,
            profileImageUrl: this._props.profileImageUrl,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }

    setProfileImageUrl(url?: string){
        this._props.profileImageUrl = url;
        this._updatedAt = new Date();
    }
}