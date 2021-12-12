import { makeAutoObservable } from "mobx"

export class IndexSelection<T> {
  items: T[] = []
  index = 0

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true })
  }

  get currentItem(): T | undefined {
    return this.items[this.index]
  }

  setItems(items: T[]) {
    this.items = items
  }

  setCurrentItem(item: T) {
    this.index = Math.max(this.items.indexOf(item), 0)
  }

  setIndex(index: number) {
    this.index = index
  }
}
