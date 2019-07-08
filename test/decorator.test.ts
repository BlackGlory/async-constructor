import { addAsyncConstructor } from '../src/decorator'

const delay = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout))
const getTime = () => new Date().getTime()

describe('Decorator', () => {
  test('Call once', async () => {
    @addAsyncConstructor<typeof One>(async function(this: One, start: number) {
      await delay(1000)
      this.spend = getTime() - start
    })
    class One {
      spend = 0
      constructor(protected start: number) {}
    }

    const one = await new One(getTime())
    expect(one.spend).toBeGreaterThanOrEqual(1000)
    expect(one.spend).toBeLessThan(2000)
  })

  test('Call twice', async () => {
    @addAsyncConstructor<typeof Two>(async function(this: Two) {
      await delay(1000)
      this.spend = getTime() - this.start
    })
    @addAsyncConstructor<typeof Two>(async function(this: Two, start: number) {
      await delay(1000)
      this.spend = getTime() - start
    })
    class Two {
      spend = 0
      constructor(protected start: number) {}
    }

    const two = await new Two(getTime())
    expect(two.spend).toBeGreaterThanOrEqual(2000)
    expect(two.spend).toBeLessThan(3000)
  })
})
