import { CollectionManager } from './collection-manager'
import { Server, createServer } from 'http'
import * as express from 'express'
import { TransactionEntity, ApplicationConfig } from './types'
import { TransactionDao } from './dao'
import { TransactionService } from './services'
import { TransactionController, BalanceController } from './controllers'
import { TransactionRouter, BalanceRouter } from './routers'
import { CorsMiddleware, BodyParserMiddleware, ErrorMiddleware } from './middlewares'
import { promisify } from 'util'

export class Application {
  private _collectionManager: CollectionManager
  private _server: Server
  private _port: number

  constructor(config: ApplicationConfig) {
    this._port = config.port

    this._collectionManager = new CollectionManager()
  }

  public bootstrap(): void {
    const transactionCollection = this._collectionManager.createCollection<TransactionEntity>()
    const transactionDao = new TransactionDao(transactionCollection)
    const transactionService = new TransactionService(transactionDao)

    const transactionController = new TransactionController(transactionService)
    const transactionRouter = new TransactionRouter(transactionController)

    const balanceController = new BalanceController(transactionService)
    const balanceRouter = new BalanceRouter(balanceController)

    const corsMiddleware = new CorsMiddleware()
    const bodyParserMiddleware = new BodyParserMiddleware()
    const errorMiddleware = new ErrorMiddleware()

    const app = express()

    app.use(corsMiddleware.handle.bind(corsMiddleware))
    app.use(bodyParserMiddleware.handle.bind(bodyParserMiddleware))

    app.use('/transactions', transactionRouter.buildRouter())
    app.use('/balance', balanceRouter.buildRouter())

    app.use(errorMiddleware.handle.bind(errorMiddleware))

    this._server = createServer(app)
  }

  public async start() {
    if (this._server) {
      return
    }

    this.bootstrap()

    await promisify(this._server.listen).call(this._server, this._port)
  }

  public async stop() {
    await promisify(this._server.close).call(this._server)
    this._collectionManager.stop()
  }
}
