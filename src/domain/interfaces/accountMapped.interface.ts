export interface CreateAccountMapped {
  message: string;
  account: {
    number: string;
    name: string;
    balance: number;
  };
}
