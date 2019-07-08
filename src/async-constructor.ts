import { appendAsyncConstructor } from './append-async-constructor'

export class AsyncConstructor {
  constructor(asyncConstructor: () => Promise<void>) {
    appendAsyncConstructor(this, asyncConstructor)
  }
}
