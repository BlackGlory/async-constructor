import { mixinAsyncConstructor } from '../src/mixin'

const delay = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout))
const getTime = () => new Date().getTime()

type ReturnTypeOfConstructor<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any

describe('Mixin', () => {
  test('Call once', async () => {
    class Base {
      spend = 0
      constructor(start: number) {}
    }

    const One = mixinAsyncConstructor(Base, async function(this: Base, start: number) {
      await delay(1000)
      this.spend = getTime() - start
    })

    const one = await new One(getTime())
    expect(one.spend).toBeGreaterThanOrEqual(1000)
    expect(one.spend).toBeLessThan(2000)
  })

  test('Call twice', async () => {
    class Base {
      spend = 0
      constructor(public start: number) {}
    }

    const One = mixinAsyncConstructor(Base, async function(this: Base, start: number) {
      await delay(1000)
      this.spend = getTime() - start
    })

    const Two = mixinAsyncConstructor(One, async function(this: ReturnTypeOfConstructor<typeof One>) {
      await delay(1000)
      this.spend = getTime() - this.start
    })

    const two = await new Two(getTime())
    expect(two.spend).toBeGreaterThanOrEqual(2000)
    expect(two.spend).toBeLessThan(3000)
  })
})
