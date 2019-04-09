export class AsyncConstructor {
  then?: any

  constructor(asyncConstructor: () => Promise<void>) {
    const init = (async () => {
      await asyncConstructor.call(this)
      delete this.then
      return this
    })()
    this.then = init.then.bind(init)
  }
}
