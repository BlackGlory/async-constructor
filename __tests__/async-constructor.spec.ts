import { AsyncConstructor } from '@src/async-constructor'
import { isPromise } from 'extra-promise'

describe('AsyncConstructor', () => {
  describe('class extends AsyncConstructor', () => {
    it('is async constructor', async () => {
      const logger = jest.fn()
      const ClassAsync = class extends AsyncConstructor {
        constructor() {
          super(() => logger('Async'))
          logger('Sync')
        }
      }

      const result = new ClassAsync()
      const isProBefore = isPromise(result)
      const calledTimesBefore = calledTimes(logger)
      const proResult = await result
      const calledTimesAfter = calledTimes(logger)
      const isProAfter = isPromise(result)

      expect(isProBefore).toBe(true)
      expect(calledTimesBefore).toBe(1)
      expect(proResult).toBeInstanceOf(AsyncConstructor)
      expect(proResult).toBeInstanceOf(ClassAsync)
      expect(isProAfter).toBe(false)
      expect(calledTimesAfter).toBe(2)
      expect(logger).nthCalledWith(1, 'Sync')
      expect(logger).nthCalledWith(2, 'Async')
    })
  })

  describe('class extends class extends AsyncConstructor', () => {
    it('is async constructor', async () => {
      const logger = jest.fn()
      const ClassAsync = class extends AsyncConstructor {
        constructor() {
          super(() => logger('Async'))
          logger('Sync')
        }
      }
      const ChildClassAsync = class extends ClassAsync {
        constructor() {
          super()
          logger('ChildSync')
        }
      }

      const result = new ChildClassAsync()
      const isProBefore = isPromise(result)
      const calledTimesBefore = calledTimes(logger)
      const proResult = await result
      const calledTimesAfter = calledTimes(logger)
      const isProAfter = isPromise(result)

      expect(isProBefore).toBe(true)
      expect(calledTimesBefore).toBe(2)
      expect(proResult).toBeInstanceOf(AsyncConstructor)
      expect(proResult).toBeInstanceOf(ClassAsync)
      expect(proResult).toBeInstanceOf(ChildClassAsync)
      expect(isProAfter).toBe(false)
      expect(calledTimesAfter).toBe(3)
      expect(logger).nthCalledWith(1, 'Sync')
      expect(logger).nthCalledWith(2, 'ChildSync')
      expect(logger).nthCalledWith(3, 'Async')
    })
  })
})

function calledTimes(fn: jest.Mock): number {
  return fn.mock.calls.length
}
