import { appendAsyncConstructor } from './append'

type Constructor<T = any> = new (...args: any[]) => T

type ReturnTypeOfConstructor<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any

export function mixinAsyncConstructor<Base extends Constructor>(
  base: Base
, asyncConstructor: (...args: ConstructorParameters<Base>) => PromiseLike<void>
): new (...args: ConstructorParameters<Base>) => PromiseLike<ReturnTypeOfConstructor<Base>> {
  return class extends base {
    constructor(...args: any[]) {
      super(...args)
      appendAsyncConstructor(
        this
      , asyncConstructor as (...args: any[]) => PromiseLike<void>
      , args
      )
    }
  }
}
