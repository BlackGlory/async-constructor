import { appendAsyncConstructor } from '@src/append'
import { isPromiseLike } from '@blackglory/types'

describe('appendAsyncConstructor(target: T, asyncConstructor: (...args: any) => PromiseLike<void>, args: unknown[])', () => {
  describe('append once', () => {
    it('become async', async () => {
      const logger = jest.fn()
      const ClassAsync = class {
        constructor() {
          appendAsyncConstructor(this, () => logger('Async'))
          logger('Sync')
        }
      }

      const result = new ClassAsync()
      const isProBefore = isPromiseLike(result)
      const calledTimesBefore = calledTimes(logger)
      const proResult = await result
      const calledTimesAfter = calledTimes(logger)
      const isProAfter = isPromiseLike(result)

      expect(isProBefore).toBe(true)
      expect(calledTimesBefore).toBe(1)
      expect(proResult).toBeInstanceOf(ClassAsync)
      expect(calledTimesAfter).toBe(2)
      expect(isProAfter).toBe(false)
      expect(logger).nthCalledWith(1, 'Sync')
      expect(logger).nthCalledWith(2, 'Async')
    })
  })

  describe('append twice', () => {
    it('become async', async () => {
      const logger = jest.fn()
      const ClassAsync = class {
        constructor() {
          appendAsyncConstructor(this, () => logger('Async1'))
          appendAsyncConstructor(this, () => logger('Async2'))
          logger('Sync')
        }
      }

      const result = new ClassAsync()
      const isProBefore = isPromiseLike(result)
      const calledTimesBefore = calledTimes(logger)
      const proResult = await result
      const calledTimesAfter = calledTimes(logger)
      const isProAfter = isPromiseLike(result)

      expect(isProBefore).toBe(true)
      expect(calledTimesBefore).toBe(1)
      expect(proResult).toBeInstanceOf(ClassAsync)
      expect(calledTimesAfter).toBe(3)
      expect(isProAfter).toBe(false)
      expect(logger).nthCalledWith(1, 'Sync')
      expect(logger).nthCalledWith(2, 'Async1')
      expect(logger).nthCalledWith(3, 'Async2')
    })
  })
})

function calledTimes(fn: jest.Mock): number {
  return fn.mock.calls.length
}
