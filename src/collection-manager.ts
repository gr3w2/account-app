import { Collection } from './collection'

export class CollectionManager {
  private _collections: Array<Collection>

  constructor() {
    this._collections = []
  }

  public createCollection<Entity = any>(): Collection<Entity> {
    const collection = new Collection<Entity>()
    collection.start()

    this._collections.push(collection)

    return collection
  }

  public stop() {
    for (const collection of this._collections) {
      collection.stop()
    }

    this._collections.length = 0
  }
}
