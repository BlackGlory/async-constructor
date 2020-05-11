import { appendAsyncConstructor } from './append'

export class AsyncConstructor {
  constructor(asyncConstructor: () => PromiseLike<void>) {
    appendAsyncConstructor(this, asyncConstructor)
  }
}
