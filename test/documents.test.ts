import { AsyncConstructor, appendAsyncConstructor } from '../src'
import { mixinAsyncConstructor } from '../src/mixin'
import { addAsyncConstructor } from '../src/decorator'

describe('README.md', () => {
  describe('AsyncConstructor', () => {
    test('ES2017+', async () => {
      const load = jest.fn((url: string) => 'Goodnight, my kitten.')

      // start
      class Resource extends AsyncConstructor {
        content?: any

        constructor(url: string) {
          super(async () => {
            this.content = await load(url)
          })
        }
      }

      const resource = await new Resource('data.json')
      // end

      expect(load.mock.calls.length).toBe(1)
      expect(load.mock.calls[0][0]).toBe('data.json')
      expect(resource.content).toBe('Goodnight, my kitten.')
    })

    test('ES6', async () => {
      const load = jest.fn((url: string) => 'Goodnight, my kitten.')

      // start
      class Resource extends AsyncConstructor {
        content?: any

        constructor(url: string) {
          super(async function(this: Resource) {
            this.content = await load(url)
          })
        }
      }

      const resource = await new Resource('data.json')
      // end

      expect(load.mock.calls.length).toBe(1)
      expect(load.mock.calls[0][0]).toBe('data.json')
      expect(resource.content).toBe('Goodnight, my kitten.')
    })
  })

  test('appendAsyncConstructor', async () => {
    const load = jest.fn((url: string) => 'Goodnight, my kitten.')
    // start

    class Resource {
      content?: any

      constructor(url: string) {
        appendAsyncConstructor(this, async () => {
          this.content = await load(url)
        })
      }
    }

    const resource = await new Resource('data.json')
    // end

    expect(load.mock.calls.length).toBe(1)
    expect(load.mock.calls[0][0]).toBe('data.json')
    expect(resource.content).toBe('Goodnight, my kitten.')
  })

  test('Extend#1', async () => {
    const load = jest.fn((url: string) => 'Goodnight, my kitten.')

    // start
    class Resource extends AsyncConstructor {
      content?: any

      constructor(url: string) {
        super(async () => {
          this.content = await load(url)
        })
      }
    }

    class DataResource extends Resource {
      constructor() {
        super('data.json')
      }
    }

    const resource = await new DataResource()
    // end

    expect(load.mock.calls.length).toBe(1)
    expect(load.mock.calls[0][0]).toBe('data.json')
    expect(resource.content).toBe('Goodnight, my kitten.')
  })

  test('Extend#2', async () => {
    const load = jest.fn((url: string) => 'Goodnight, my kitten.')

    // start
    class Resource extends AsyncConstructor {
      content?: any

      constructor(url: string) {
        super(async () => {
          this.content = await load(url)
        })
      }
    }

    class DataResource extends Resource {
      constructor(eof: string) {
        super('data.json')

        appendAsyncConstructor(this, async () => {
          this.content += eof
        })
      }
    }

    const resource = await new DataResource('\n')
    // end

    expect(load.mock.calls.length).toBe(1)
    expect(load.mock.calls[0][0]).toBe('data.json')
    expect(resource.content).toBe('Goodnight, my kitten.\n')
  })

  describe('Mixin & Decorator', () => {
    test('Mixin#1', async () => {
      const load = jest.fn((url: string) => 'Goodnight, my kitten.')

      // start
      class Base {
        content?: any
        constructor(url: string) {}
      }

      const Resource = mixinAsyncConstructor(
        Base
      , async function(this: Base, url: string) {
          this.content = await load(url)
        }
      )

      const resource = await new Resource('data.json')
      // end

      expect(load.mock.calls.length).toBe(1)
      expect(load.mock.calls[0][0]).toBe('data.json')
      expect(resource.content).toBe('Goodnight, my kitten.')
    })

    test('Decorator', async () => {
      const load = jest.fn((url: string) => 'Goodnight, my kitten.')

      // start
      @addAsyncConstructor<typeof Resource>(
        async function(this: Resource, url: string) {
          this.content = await load(url)
        }
      )
      class Resource {
        content?: any
        constructor(url: string) {}
      }

      const resource = await new Resource('data.json')
      // end

      expect(load.mock.calls.length).toBe(1)
      expect(load.mock.calls[0][0]).toBe('data.json')
      expect(resource.content).toBe('Goodnight, my kitten.')
    })

    test('Mixin#2', async () => {
      const load = jest.fn((url: string) => 'Goodnight, my kitten.')
      const remove = jest.fn((url: string) => Promise.resolve())

      // start
      class Base {
        content?: any
        constructor(url: string) {}
      }

      const Resource = mixinAsyncConstructor(
        Base
      , async function(this: Base, url: string) {
          this.content = await load(url)
        }
      )

      type ReturnTypeOfConstructor<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any

      const DisposableResource = mixinAsyncConstructor(
        Resource
      , async function(this: ReturnTypeOfConstructor<typeof Resource>, url: string) {
          await remove(url)
        }
      )

      const resource = await new DisposableResource('data.json')
      // end

      expect(load.mock.calls.length).toBe(1)
      expect(load.mock.calls[0][0]).toBe('data.json')
      expect(remove.mock.calls.length).toBe(1)
      expect(remove.mock.calls[0][0]).toBe('data.json')
      expect(resource.content).toBe('Goodnight, my kitten.')
    })
  })
})
