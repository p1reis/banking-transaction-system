export class DepositMapper {
  static map(raw?: any) {
    return {
      cuid: raw?.cuid,
      type: raw?.type,
      when: raw?.createdAt,
      from: `${raw?.accountFrom.firstName} ${raw?.accountFrom.lastName}`,
      accountNumber: raw?.accountFrom.number,
      depositValue: raw?.value,
      newBalance: raw?.accountFrom.balance,
    };
  }
}

export class WithdrawMapper {
  static map(raw?: any) {
    return {
      cuid: raw?.cuid,
      type: raw?.type,
      when: raw?.createdAt,
      from: `${raw?.accountFrom.firstName} ${raw?.accountFrom.lastName}`,
      accountNumber: raw?.accountFrom.number,
      withdrawValue: raw?.value,
      newBalance: raw?.accountFrom.balance,
    };
  }
}

export class TransferMapper {
  static map(raw?: any) {
    return {
      cuid: raw?.cuid,
      type: raw?.type,
      when: raw?.createdAt,
      transferValue: raw?.value,
      origin: {
        from: `${raw?.accountFrom.firstName} ${raw?.accountFrom.lastName}`,
        accountNumber: raw?.accountFrom.number,
        newBalance: raw?.accountFrom.balance,
      },
      destiny: {
        to: `${raw?.accountTo.firstName} ${raw?.accountTo.lastName}`,
        accountNumber: raw?.accountTo.number,
        newBalance: raw?.accountTo.balance,
      },
    };
  }
}
