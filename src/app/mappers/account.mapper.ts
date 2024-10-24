import { Account } from 'src/domain/entities/account.entity';

export class AccountMapper {
  static map(raw?: Account) {
    return {
      number: raw?.number,
      name: raw?.firstName + raw?.lastName,
      balance: raw?.balance,
    };
  }
}
