import { makeAutoObservable } from "mobx"

export class Selection<Item> {
  items: Item[] = []
  private _current?: Item = undefined

  constructor(private getKey: (item: Item) => string, initialItem?: Item) {
    makeAutoObservable(this, undefined, { autoBind: true })
    this._current = initialItem
  }

  get current(): Item | undefined {
    return this._current !== undefined &&
      this.items.map(this.getKey).includes(this.getKey(this._current))
      ? this._current
      : undefined
  }

  get currentIndex(): number | undefined {
    if (this._current === undefined) return undefined
    const index = this.items.indexOf(this._current)
    return index >= 0 ? index : undefined
  }

  setItems(items: Item[]) {
    this.items = items
  }

  setCurrent(item: Item) {
    this._current = item
  }
}
