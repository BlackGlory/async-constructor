import { appendAsyncConstructor } from '../src/append-async-constructor'

const delay = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout))
const getTime = () => new Date().getTime()

describe('appendAsyncConstructor', () => {
  test('Call sync', async () => {
    class One {
      spend = 0

      constructor(protected start: number) {
        appendAsyncConstructor(this, async () => {
          this.spend = getTime() - this.start
        })
      }
    }

    const one = await new One(getTime())
    expect(one.spend).toBeGreaterThan(0)
    expect(one.spend).toBeLessThan(1000)
  })

  test('Call once', async () => {
    class One {
      spend = 0

      constructor(protected start: number) {
        appendAsyncConstructor(this, async () => {
          await delay(1000)
          this.spend = getTime() - this.start
        })
      }
    }

    const one = await new One(getTime())
    expect(one.spend).toBeGreaterThanOrEqual(1000)
    expect(one.spend).toBeLessThan(2000)
  })

  test('Call twice', async () => {
    class Two {
      spend = 0

      constructor(protected start: number) {
        appendAsyncConstructor(this, async () => {
          await delay(1000)
          this.spend = getTime() - this.start
        })

        appendAsyncConstructor(this, async () => {
          await delay(1000)
          this.spend = getTime() - this.start
        })
      }
    }

    const two = await new Two(getTime())
    expect(two.spend).toBeGreaterThanOrEqual(2000)
    expect(two.spend).toBeLessThan(3000)
  })

  test('Call twice via extend', async () => {
    class One {
      spend = 0

      constructor(protected start: number) {
        appendAsyncConstructor(this, async () => {
          await delay(1000)
          this.spend = getTime() - this.start
        })
      }
    }

    class Two extends One {
      constructor(start: number) {
        super(start)
        appendAsyncConstructor(this, async () => {
          await delay(1000)
          this.spend = getTime() - this.start
        })
      }
    }

    const two = await new Two(getTime())
    expect(two.spend).toBeGreaterThanOrEqual(2000)
    expect(two.spend).toBeLessThan(3000)
  })
})
