import { TransactionController, BalanceController } from '../controllers'
import { Router, Request, Response, NextFunction } from 'express'
import { InternalServerError, NoEnoughCreditsError, WebError, BadRequestError } from '../errors'
import { TransactionEntity } from '../types'
import { TransactionType } from '../enum'

export class BalanceRouter {
  private _balanceController: BalanceController

  constructor(balanceController: BalanceController) {
    this._balanceController = balanceController
  }

  public buildRouter() {
    const router = Router()

    router.get('/', this._getBalance.bind(this))

    return router
  }

  private async _getBalance(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._balanceController.getBalance()

      res.status(200).send(result)
    } catch (ex) {
      next(new InternalServerError())
    }
  }
}
