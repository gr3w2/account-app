import { Collection } from '../collection';
import { TransactionEntity } from '../types';
import { NoEnoughCreditsError } from '../errors';
import { TransactionType } from '../enum';
import * as generateId from 'uuid/v4';

export class TransactionDao {
  private _collection: Collection<TransactionEntity>;

  constructor(collection: Collection<TransactionEntity>) {
    this._collection = collection;
  }

  public getTransactionsListBy(filters?: Partial<TransactionEntity>) {
    return this._collection.executeOperation(() => this._collection.find(filters));
  }

  public async getTransactionById(id: string) {
    const transactions = await this._collection.executeOperation(() => this._collection.find({ id }));

    return transactions[0];
  }

  public async getLastTransaction() {
    const transactions = await this.getTransactionsListBy();

    return transactions[transactions.length - 1];
  }

  public async insertTransaction(amount: number, type: TransactionType) {
    return this._collection.executeOperation(async () => {
      const transactions = await this._collection.find();
      const lastTransaction = transactions[transactions.length - 1];

      const delta = type === TransactionType.Credit ? amount : amount * -1;
      const balance = lastTransaction ? lastTransaction.balance + delta : delta;
      if (balance < 0) {
        throw new NoEnoughCreditsError();
      }

      return this._collection.insert({
        id: generateId(),
        amount,
        balance,
        type,
        effectiveDate: new Date(),
      });
    });
  }
}
