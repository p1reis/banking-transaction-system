import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
} from 'class-validator';
import { TransactionTypeEnum } from '@prisma/client';

export class CreateWithdrawDto {
    @IsEnum(TransactionTypeEnum)
    @IsNotEmpty({ message: `Transaction type must be WITHDRAW` })
    type: TransactionTypeEnum;

    @IsString()
    @IsNotEmpty({ message: `"From" field must be an valid account number` })
    from: string;

    @IsPositive()
    @IsNotEmpty()
    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'Value field must be a decimal number' },
    )
    value: number;
}
