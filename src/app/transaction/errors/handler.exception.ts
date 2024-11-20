import { HttpException, HttpStatus } from "@nestjs/common";

export class InsufficientBalance extends HttpException {
    constructor() {
        super(
            {
                error: `Insufficient balance`,
                message: `Sorry! Your balance is not enough.`,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}