export class DepositMapper {
  static map(raw?: any) {
    return {
      cuid: raw?.cuid,
      type: raw?.type,
      when: raw?.createdAt,
      destiny: `${raw?.accountOrigin.firstName} ${raw?.accountOrigin.lastName}`,
      accountNumber: raw?.accountOrigin.number,
      depositValue: raw?.value,
      newBalance: raw?.accountOrigin.balance,
    };
  }
}

export class WithdrawMapper {
  static map(raw?: any) {
    return {
      cuid: raw?.cuid,
      type: raw?.type,
      when: raw?.createdAt,
      origin: `${raw?.accountOrigin.firstName} ${raw?.accountOrigin.lastName}`,
      accountNumber: raw?.accountOrigin.number,
      withdrawValue: raw?.value,
      newBalance: raw?.accountOrigin.balance,
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
        from: `${raw?.accountOrigin.firstName} ${raw?.accountOrigin.lastName}`,
        accountNumber: raw?.accountOrigin.number,
        newBalance: raw?.accountOrigin.balance,
      },
      destiny: {
        to: `${raw?.accountDestiny.firstName} ${raw?.accountDestiny.lastName}`,
        accountNumber: raw?.accountDestiny.number,
        newBalance: raw?.accountDestiny.balance,
      },
    };
  }
}
