import { IsDecimal, IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  balance: number;
}
