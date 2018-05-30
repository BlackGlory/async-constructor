export class AsyncConstructor {
  then?: any

  constructor(asyncConstructor: () => Promise<void>) {
    const init = (async () => {
      await asyncConstructor()
      delete this.then
      return this
    })()
    this.then = init.then.bind(init)
  }
}

export default AsyncConstructor
