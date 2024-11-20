import { HttpException, HttpStatus } from "@nestjs/common";

export class AccountNotFound extends HttpException {
    constructor(account: string, number: string) {
        super(
            {
                error: `${account} account was not found`,
                message: number
                    ? `Sorry! The account number ${number} wasn't found.`
                    : `Sorry! The ${account} account wasn't found.`,
            },
            HttpStatus.NOT_FOUND,
        );
    }
}

export class ValueMustBePositive extends HttpException {
    constructor(value: string) {
        super(
            {
                error: `${value} isn't positive`,
                message: `Sorry! ${value} must be positive.`,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}

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