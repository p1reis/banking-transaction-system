import { HttpException, HttpStatus } from "@nestjs/common";

export class AccountAlreadyExists extends HttpException {
    constructor(cpf: string) {
        super(
            {
                error: `Account already exists.`,
                message: `Sorry! CPF number ${cpf} is already registered.`,
            },
            HttpStatus.CONFLICT,
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