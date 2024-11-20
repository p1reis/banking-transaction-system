import { HttpException, HttpStatus } from "@nestjs/common";

export class AccountAlreadyExists extends HttpException {
    constructor(firstName: string, lastName: string) {
        super(
            {
                error: `Account already exists.`,
                message: `Sorry! ${firstName} ${lastName} already had an account`,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}

export class AccountCreationFailed extends HttpException {
    constructor(error: string) {
        super(
            {
                error: `Account creation failed`,
                message: `Account creation failed: ${error}`,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}