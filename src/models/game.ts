import { ArgumentException } from "../exceptions/argumentException.js";

export interface GameProps{
    title: string;
    backgroundImage: string;
    releaseDate: string;
}
export class Game {
    private props: GameProps;
    constructor(props: GameProps){
        if(!props.title || !props.backgroundImage || !props.releaseDate){
            throw new ArgumentException("Invalid game properties");
        }
        this.props = props;
    }
    get title(){
        return this.props.title;
    }
    get backgroundImage(){
        return this.props.backgroundImage;
    }
    get releaseDate(){
        return this.props.releaseDate;
    }
}