import { ArgumentException } from "../exceptions/argumentException.js";

export interface GameProps{
    id: string;
    title: string;
    backgroundImage: string;
    releaseDate: string;
}

export class Game {
    private _props: GameProps;
    constructor(props: GameProps){
        if(!props.title || !props.backgroundImage || !props.releaseDate || !props.id){
            throw new ArgumentException("Invalid game properties");
        }
        this._props = { ...props };
    }
    get title(){
        return this._props.title;
    }
    get backgroundImage(){
        return this._props.backgroundImage;
    }
    get releaseDate(){
        return this._props.releaseDate;
    }
}