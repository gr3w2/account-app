import { TransactionDao } from '../dao'
import { TransactionType } from '../enum'
import { TransactionEntity } from '../types'

export class TransactionService {
  private _transactionDao: TransactionDao

  constructor(transactionDao: TransactionDao) {
    this._transactionDao = transactionDao
  }

  public getTransactionsListBy(filters?: Partial<TransactionEntity>) {
    return this._transactionDao.getTransactionsListBy(filters)
  }

  public async getTransactionById(id: string) {
    return this._transactionDao.getTransactionById(id)
  }

  public getLastTransaction() {
    return this._transactionDao.getLastTransaction()
  }

  public insertTransaction(amount: number, type: TransactionType) {
    return this._transactionDao.insertTransaction(amount, type)
  }
}
