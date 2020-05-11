# async-constructor [![npm](https://img.shields.io/npm/v/async-constructor.svg?maxAge=86400)](https://www.npmjs.com/package/async-constructor) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/BlackGlory/async-constructor/master/LICENSE)

The helper functions for creating classes that require async constructors.

## Install

```sh
npm install --save async-constructor
# or
yarn add async-constructor
```

## Usage

This module is created for [TypeScript](#TypeScript), but can also be used in [JavaScript](#JavaScript).

### JavaScript

You may not need the module because JavaScript constructor could return a `Promise<this>`:

```js
class Resource {
  constructor(url) {
    return (async () => {
      this.content = await load(url)
      return this
    })()
  }
}
```

or

```js
function Resource(url) {
  return (async () => {
    this.content = await load(url)
    return this
  })()
}
```

### TypeScript

#### AsyncConstructor

##### ES2017

```ts
import { AsyncConstructor } from 'async-constructor'

class Resource extends AsyncConstructor {
  content!: string

  constructor(url: string) {
    super(async () => {
      this.content = await load(url)
    })
  }
}

const resource = await new Resource('data.txt')
```

##### ES2015

```ts
import { AsyncConstructor } from 'async-constructor/lib/es2015'

class Resource extends AsyncConstructor {
  content!: any

  constructor(url: string) {
    super(async function(this: Resource) {
      this.content = await load(url)
    })
  }
}

;(async () => {
  const resource = await new Resource('data.txt')
})()
```

you can create an async constructor directly with `appendAsyncConstructor` without using AsyncConstructor.

```ts
import { appendAsyncConstructor } from 'async-constructor'

class Resource {
  content!: string

  constructor(url: string) {
    appendAsyncConstructor(this, async () => {
      this.content = await load(url)
    })
  }
}

;(async () => {
  const resource = await new Resource('data.txt')
})()
```

#### appendAsyncConstructor

```ts
function appendAsyncConstructor<T extends any, U extends any[]>(
  target: T
, asyncConstructor: (...args: U) => PromiseLike<void>
, args?: U
): void
```

Once a class has an async constructor, its subclasses will also have async constructors.

The function `AsyncConstructor` is a wrapper for `appendAsyncConstructor`, you can call `appendAsyncConstructor` in the sync constructor to append an async constructor.

```js
import { appendAsyncConstructor } from 'async-constructor'

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

const resource = await new DataResource('\n')
```

The multiple async constructors will be called in order, and always called after all sync constructor.

#### mixinAsyncConstructor

```ts
function mixinAsyncConstructor<Base extends Constructor>(
  base: Base
, asyncConstructor: (...args: ConstructorParameters<Base>) => PromiseLike<void>
): new (...args: ConstructorParameters<Base>) => PromiseLike<ReturnTypeOfConstructor<Base>>
```

The mixin function `mixinAsyncConstructor` is also used to add async constructors to classes, but you cannot access protected/private member in the async constructor.

```ts
import { mixinAsyncConstructor } from 'async-constructor'

class Base {
  content!: string
  constructor(url: string) {}
}

const Resource = mixinAsyncConstructor(Base , async function(this: Base, url) {
  this.content = await load(url)
})

const resource = await new Resource('data.txt')
```
