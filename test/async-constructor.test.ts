import { AsyncConstructor } from '../src/async-constructor'

test('async constructor', async () => {
  function delay(timeout) {
    return new Promise(resolve => setTimeout(() => resolve(), timeout))
  }

  class MyClass extends AsyncConstructor {
    completed: boolean

    constructor(timeout) {
      super(async () => {
        await delay(timeout)
        this.completed = true
      })

      this.completed = false
    }
  }

  const start = Date.now()
  const result = await new MyClass(1000)
  const end = Date.now()
  expect(result.completed).toBeTruthy()
  expect(end - start).toBeGreaterThanOrEqual(1000)
})

test('sync constructor', async () => {
  class MyClass extends AsyncConstructor {
    completed: boolean

    constructor() {
      super(() => {
        return Promise.resolve()
      })

      this.completed = true
    }
  }

  const result = await new MyClass()
  expect(result.completed).toBeTruthy()
})
