import { Application } from './application'
import { createLogger, transports, format, Logger } from 'winston'
import { ApplicationConfig } from './types'

const logger: Logger = createLogger({
  level: 'debug',
  transports: [new transports.Console({ format: format.colorize() })],
})

const appConfig: ApplicationConfig = {
  port: Number(process.env.PORT) || 3000,
}

const app = new Application(appConfig)

async function stop(emergency: boolean = false) {
  try {
    await app.stop()
  } catch (ex) {
    logger.error('Cant stop app', { reason: ex.message })
  }

  try {
    logger.close()

    setTimeout(() => process.exit(emergency ? 1 : 0), 1000)
  } catch (ex) {
    // tslint:disable-next-line:no-console
    console.error('Cant close logger')

    setTimeout(() => process.exit(emergency ? 1 : 0), 1000)
  }
}

process.on('SIGTERM', (signal) => {
  logger.info('Exit signal', { signal })
  stop()
})

process.on('SIGINT', (signal) => {
  logger.info('Exit signal', { signal })
  stop()
})

process.on('unhandledRejection', (reason: any) => {
  logger.error(reason.message || reason, reason)
})

process.on('uncaughtException', (reason: any) => {
  logger.error(reason.message || reason, reason)
})

async function start() {
  try {
    await app.start()
    logger.info('Application started')
  } catch (ex) {
    process.exit(1)
  }
}

start()
