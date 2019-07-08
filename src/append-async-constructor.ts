export function appendAsyncConstructor<T extends any>(
  target: T
, asyncConstructor: (...args: any) => Promise<void>
, args: any[] = []): void {
  async function run(): Promise<T> {
    await Promise.resolve()
    await asyncConstructor.apply(target, args)
    delete target.then
    return target
  }
  const promise: Promise<T> = target['then'] ? target.then(run) : run()
  const then = promise.then.bind(promise)
  target.then = then
}
