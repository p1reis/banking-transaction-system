import { Account } from '@prisma/client';

export class AccountMapper {
  static map(raw?: Account) {
    return {
      message: 'Account created successfully!',
      account: {
        number: raw?.number,
        name: `${raw?.firstName} ${raw?.lastName}`,
        balance: raw?.balance,
      },
    };
  }
}
