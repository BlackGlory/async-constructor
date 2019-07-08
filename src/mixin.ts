import { appendAsyncConstructor } from './append-async-constructor'

export type Constructor<T = {}> = new (...args: any[]) => T

export function mixinAsyncConstructor<Base extends Constructor>(base: Base, asyncConstructor: (...args: ConstructorParameters<Base>) => Promise<void>) {
  return class extends base {
    constructor(...args: any[]) {
      super(...args)
      appendAsyncConstructor(this, asyncConstructor, args as ConstructorParameters<Base>)
    }
  }
}
