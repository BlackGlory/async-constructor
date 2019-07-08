import { mixinAsyncConstructor, Constructor } from './mixin'

export function addAsyncConstructor<Base extends Constructor>(asyncConstructor: (...args: ConstructorParameters<Base>) => Promise<void>) {
  return (base: Base) => mixinAsyncConstructor(base, asyncConstructor)
}
