import { TransactionController } from '../controllers';
import { Router, Request, Response, NextFunction } from 'express';
import { InternalServerError, NoEnoughCreditsError, WebError, BadRequestError, NotFoundError } from '../errors';
import { TransactionEntity } from '../types';
import { TransactionType } from '../enum';

export class TransactionRouter {
  private _transactionController: TransactionController;

  constructor(transactionController: TransactionController) {
    this._transactionController = transactionController;
  }

  public buildRouter() {
    const router = Router();

    router.get('/', this._getTransactionsList.bind(this));
    router.get('/:id', this._getTransactionById.bind(this));
    router.post('/', this._insertTransaction.bind(this));

    return router;
  }

  private async _getTransactionsList(req: Request, res: Response, next: NextFunction) {
    const filters: Partial<TransactionEntity> = {};
    if (req.query.type) {
      if (req.query.type === TransactionType.Credit || req.query.type === TransactionType.Debit) {
        filters.type = req.query.type;
      } else {
        return next(new BadRequestError('Invalid type value'));
      }
    }

    try {
      const transactions = await this._transactionController.getTransactionsListBy(filters);

      const dtos = transactions.map((transaction) => this._convertTransactionToDto(transaction));

      res.status(200).send(dtos);
    } catch (ex) {
      next(new InternalServerError());
    }
  }

  private async _getTransactionById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    if (!id || !/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id)) {
      return next(new BadRequestError('Invalid id value'));
    }

    try {
      const transaction = await this._transactionController.getTransactionById(id);

      if (!transaction) {
        throw new NotFoundError('Transaction with specified id not found');
      }

      const dto = this._convertTransactionToDto(transaction);

      res.status(200).send(dto);
    } catch (ex) {
      if (ex instanceof WebError) {
        next(ex);
      } else {
        next(new InternalServerError());
      }
    }
  }

  private async _insertTransaction(req: Request, res: Response, next: NextFunction) {
    const amount = req.body.amount;
    const type = req.body.type;

    if (type !== TransactionType.Credit && type !== TransactionType.Debit) {
      return next(new BadRequestError('Invalid type value'));
    } else if (typeof amount !== 'number' || amount < 0) {
      return next(new BadRequestError('Invalid amount value'));
    }

    try {
      const transaction = await this._transactionController.insertTransaction(amount, type);

      const dto = this._convertTransactionToDto(transaction);

      res.status(201).send(dto);
    } catch (ex) {
      if (ex instanceof NoEnoughCreditsError) {
        next(new WebError(ex.message, 400, ex.details, ex.stack));
      } else {
        next(new InternalServerError());
      }
    }
  }

  private _convertTransactionToDto(transaction: TransactionEntity) {
    return {
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      effectiveDate: transaction.effectiveDate.toISOString(),
    };
  }
}
