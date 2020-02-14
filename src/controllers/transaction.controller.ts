import { TransactionService } from '../services/transaction.service';
import { TransactionType } from '../enum';
import { TransactionEntity } from '../types';

export class TransactionController {
  private _transactionService: TransactionService;

  constructor(transactionService: TransactionService) {
    this._transactionService = transactionService;
  }

  public getTransactionsListBy(filters?: Partial<TransactionEntity>) {
    return this._transactionService.getTransactionsListBy(filters);
  }

  public async getTransactionById(id: string) {
    return this._transactionService.getTransactionById(id);
  }

  public insertTransaction(amount: number, type: TransactionType) {
    return this._transactionService.insertTransaction(amount, type);
  }
}
