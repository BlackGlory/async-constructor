import { isPromiseLike } from 'extra-promise'

type Thenable<T> = T & { then?: PromiseLike<any>['then'] }

export function appendAsyncConstructor<T extends any, U extends any[]>(
  target: T
, asyncConstructor: (...args: U) => PromiseLike<void>
, args?: U
): void {
  async function applyAsyncConstructor(): Promise<T> {
    await Promise.resolve() // ensure this is a microtask
    await Reflect.apply(asyncConstructor, target, args ?? [])
    delete (target as Thenable<T>).then
    return target
  }

  if (isPromiseLike(target)) {
    setThenMethod(target, Promise.resolve(target).then(applyAsyncConstructor))
  } else {
    setThenMethod(target, applyAsyncConstructor())
  }
}

function setThenMethod<T extends any>(target: T, promise: Promise<T>) {
  (target as Thenable<T>).then = promise.then.bind(promise)
}
