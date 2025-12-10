import { ArgumentException } from "../exceptions/argumentException.js";
import { Rate } from "./rate.js";
import { Genre } from "./genre.js";

export interface GameProps {
    id: string;
    nome: string;
    anoLancamento?: number;
    playtime?: number;
    plataformas?: string[];
    backgroundImage?: string;
    rating?: number;
    ratings?: Rate[];
    ratingsCount?: number;
    genres?: Genre[];
}

export class Game {
    private _props: GameProps;
    
    constructor(props: GameProps) {
        if (!props.id || !props.nome) {
            throw new ArgumentException("Invalid game properties: id and nome are required");
        }
        this._props = { ...props };
    }

    get id() {
        return this._props.id;
    }

    get nome() {
        return this._props.nome;
    }

    get anoLancamento() {
        return this._props.anoLancamento;
    }

    get playtime() {
        return this._props.playtime;
    }

    get plataformas() {
        return this._props.plataformas;
    }

    get backgroundImage() {
        return this._props.backgroundImage;
    }

    get rating() {
        return this._props.rating;
    }

    get ratings() {
        return this._props.ratings;
    }

    get ratingsCount() {
        return this._props.ratingsCount;
    }

    get genres() {
        return this._props.genres;
    }

    toPersistence() {
        return {
            _id: this._props.id,
            nome: this._props.nome,
            ano_de_lancamento: this._props.anoLancamento,
            playtime: this._props.playtime,
            plataformas: this._props.plataformas,
            backgroundimage: this._props.backgroundImage,
            rating: this._props.rating,
            ratings: this._props.ratings,
            ratings_count: this._props.ratingsCount,
            genres: this._props.genres?.map(g => g.name)
        };
    }

    static fromPersistence(data: any): Game {
        return new Game({
            id: data._id,
            nome: data.nome,
            anoLancamento: data.ano_de_lancamento,
            playtime: data.playtime,
            plataformas: data.plataformas,
            backgroundImage: data.backgroundimage,
            rating: data.rating,
            ratings: data.ratings,
            ratingsCount: data.ratings_count,
            genres: data.genres?.map((name: string) => ({ name }))
        });
    }
}