import { AsyncConstructor, appendAsyncConstructor } from '../src'
import { mixinAsyncConstructor } from '../src/mixin'

describe('README', () => {
  describe('AsyncConstructor', () => {
    test('ES2017', async () => {
      const text = 'value'
      const load = jest.fn().mockReturnValue(text)

      class Resource extends AsyncConstructor {
        content!: string

        constructor(url: string) {
          super(async () => {
            this.content = await load(url)
          })
        }
      }
      const resource = await new Resource('data.txt')

      expect(load).toBeCalledTimes(1)
      expect(load).toBeCalledWith('data.txt')
      expect(resource.content).toBe(text)
    })

    test('ES2015', async () => {
      const text = 'value'
      const load = jest.fn().mockReturnValue(text)

      class Resource extends AsyncConstructor {
        content!: string

        constructor(url: string) {
          super(async function(this: Resource) {
            this.content = await load(url)
          })
        }
      }
      const resource = await new Resource('data.txt')

      expect(load).toBeCalledTimes(1)
      expect(load).toBeCalledWith('data.txt')
      expect(resource.content).toBe(text)
    })
  })

  test('appendAsyncConstructor', async () => {
    const text = 'value'
    const append = '\n'
    const load = jest.fn().mockReturnValue(text)

    class Resource {
      content!: string

      constructor(url: string) {
        appendAsyncConstructor(this, async () => {
          this.content = await load(url)
        })
      }
    }
    class DataResource extends Resource {
      constructor(append: string) {
        super('data.txt')

        appendAsyncConstructor(this, async () => {
          this.content += append
        })
      }
    }
    const resource = await new DataResource(append)

    expect(load).toBeCalledTimes(1)
    expect(load).toBeCalledWith('data.txt')
    expect(resource.content).toBe(text + append)
  })

  test('mixinAsyncConstructor', async () => {
    const text = 'value'
    const load = jest.fn().mockReturnValue(text)

    class Base {
      content!: string
      constructor(_: string) {}
    }

    const Resource = mixinAsyncConstructor(Base , async function(this: Base, url) {
      this.content = await load(url)
    })
    const resource = await new Resource('data.txt')

    expect(load).toBeCalledTimes(1)
    expect(load).toBeCalledWith('data.txt')
    expect(resource.content).toBe(text)
  })
})
