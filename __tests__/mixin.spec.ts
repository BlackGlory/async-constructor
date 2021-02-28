import { mixinAsyncConstructor } from '@src/mixin'
import { isPromiseLike } from '@blackglory/types'

describe('mixinAsyncConstructor(base: Base, asyncConstructor: (...args: ConstructorParameters<Base>): new (...args: ConstructorParameters<Base>) => PromiseLike<Base>', () => {
  describe('mixin a sync class', () => {
    it('return a async class', async () => {
      const logger = jest.fn()
      const Class = class {
        constructor() {
          logger('Sync')
        }
      }
      const ClassAsync = mixinAsyncConstructor(Class, async () => logger('Async'))

      const result = new ClassAsync()
      const isProBefore = isPromiseLike(result)
      const calledTimesBefore = calledTimes(logger)
      const proResult = await result
      const calledTimesAfter = calledTimes(logger)
      const isProAfter = isPromiseLike(result)

      expect(isProBefore).toBe(true)
      expect(calledTimesBefore).toBe(1)
      expect(proResult).toBeInstanceOf(Class)
      expect(proResult).toBeInstanceOf(ClassAsync)
      expect(calledTimesAfter).toBe(2)
      expect(isProAfter).toBe(false)
      expect(logger).nthCalledWith(1, 'Sync')
      expect(logger).nthCalledWith(2, 'Async')
    })
  })

  describe('mixin a async class', () => {
    it('return a async class', async () => {
      const logger = jest.fn()
      const Class = class {
        constructor() {
          logger('Sync')
        }
      }
      const ClassAsync = mixinAsyncConstructor(Class, async () => logger('Async'))
      const ChildClassAsync = mixinAsyncConstructor(ClassAsync, async () => logger('ChildAsync'))

      const result = new ChildClassAsync()
      const isProBefore = isPromiseLike(result)
      const calledTimesBefore = calledTimes(logger)
      const proResult = await result
      const calledTimesAfter = calledTimes(logger)
      const isProAfter = isPromiseLike(result)

      expect(isProBefore).toBe(true)
      expect(calledTimesBefore).toBe(1)
      expect(proResult).toBeInstanceOf(Class)
      expect(proResult).toBeInstanceOf(ClassAsync)
      expect(proResult).toBeInstanceOf(ChildClassAsync)
      expect(calledTimesAfter).toBe(3)
      expect(isProAfter).toBe(false)
      expect(logger).nthCalledWith(1, 'Sync')
      expect(logger).nthCalledWith(2, 'Async')
      expect(logger).nthCalledWith(3, 'ChildAsync')
    })
  })
})

function calledTimes(fn: jest.Mock): number {
  return fn.mock.calls.length
}
