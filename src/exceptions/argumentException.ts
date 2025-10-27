export class ArgumentException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ArgumentException";
    }
}