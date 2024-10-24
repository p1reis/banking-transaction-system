import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty({ message: `"firstName" field must be an valid account number` })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: `"lastName" field must be an valid account number` })
  lastName: string;

  @IsPositive()
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: `"Value" field must be a decimal number'` })
  balance: number;
}
