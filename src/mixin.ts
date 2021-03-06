import { ReturnTypeOfConstructor } from 'hotypes'
import { Constructor } from 'justypes'
import { appendAsyncConstructor } from './append'

export function mixinAsyncConstructor<Base extends Constructor<any>>(
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
