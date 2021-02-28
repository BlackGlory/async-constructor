import { Constructor, ReturnTypeOfConstructor } from '@blackglory/types'
import { appendAsyncConstructor } from './append'

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
