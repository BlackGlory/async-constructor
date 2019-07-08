import { AsyncConstructor, appendAsyncConstructor } from '../src'

const delay = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout))
const getTime = () => new Date().getTime()

describe('AsyncConstructor', () => {
  test('Call once', async () => {
    class One extends AsyncConstructor {
      spend = 0
      constructor(start: number) {
        super(async () => {
          await delay(1000)
          this.spend = getTime() - start
        })
      }
    }

    const one = await new One(getTime())
    expect(one.spend).toBeGreaterThanOrEqual(1000)
    expect(one.spend).toBeLessThan(2000)
  })

  test('Call twice', async () => {
    class One extends AsyncConstructor {
      spend = 0
      constructor(protected start: number) {
        super(async () => {
          await delay(1000)
          this.spend = getTime() - start
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
