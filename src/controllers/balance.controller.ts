import { TransactionService } from '../services/transaction.service'

export class BalanceController {
  private _transactionService: TransactionService

  constructor(transactionService: TransactionService) {
    this._transactionService = transactionService
  }

  public async getBalance() {
    const transaction = await this._transactionService.getLastTransaction()

    return { balance: transaction.balance }
  }
}
