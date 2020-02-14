import * as generateId from 'uuid/v1';
import { EventEmitter } from 'events';

interface ExecutionQueueItem {
  operation: () => Promise<any>;
  operationId: string;
  withLock: boolean;
}

export class Collection<Entity = any> {
  private _collection: Array<Entity>;
  private _executionQueue: Array<ExecutionQueueItem>;
  private _operationEndEmitter: EventEmitter;

  private _locked: boolean;
  private _inProgress: boolean;

  private _loopIntervalId: NodeJS.Timeout;

  constructor() {
    this._collection = [];
    this._executionQueue = [];
    this._operationEndEmitter = new EventEmitter();

    this._locked = false;
    this._inProgress = false;
  }

  public start() {
    this._loopIntervalId = setInterval(async () => {
      if (this._locked || this._inProgress) {
        return;
      }

      if (this._executionQueue.length !== 0) {
        this._inProgress = true;
      }

      const operations = [];
      while (this._executionQueue.length !== 0) {
        const queueItem = this._executionQueue[0];
        if (queueItem.withLock && operations.length !== 0) {
          break;
        } else if (queueItem.withLock && operations.length === 0) {
          this._executionQueue.shift();
          this._locked = true;
          operations.push(this._executeAndWrapOperation(queueItem));
          break;
        } else {
          this._executionQueue.shift();
          operations.push(this._executeAndWrapOperation(queueItem));
        }
      }

      await Promise.all(operations);

      this._inProgress = false;
      this._locked = false;
    }, 0);
  }

  public stop() {
    clearInterval(this._loopIntervalId);
  }

  public find(filter: Partial<Entity> = {}): Promise<Array<Entity>> {
    const keyValueFilter = Object.entries(filter);

    const results = this._collection.filter((account) => {
      for (const [key, value] of keyValueFilter) {
        if (account[key] !== value) {
          return false;
        }
      }

      return true;
    });

    return Promise.resolve(results);
  }

  public insert(item: Entity): Promise<Entity> {
    this._collection.push(item);

    return Promise.resolve(item);
  }

  public async executeOperation<T = any>(operation: () => Promise<T>, withLock: boolean = false): Promise<T> {
    const operationId = generateId();
    this._executionQueue.push({ withLock, operation, operationId });
    return new Promise((resolve, reject) => {
      this._operationEndEmitter.on(operationId, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  private _executeAndWrapOperation(queueItem: ExecutionQueueItem) {
    return queueItem
      .operation()
      .then((result: any) => this._operationEndEmitter.emit(queueItem.operationId, null, result))
      .catch((err: any) => this._operationEndEmitter.emit(queueItem.operationId, err, null));
  }
}
