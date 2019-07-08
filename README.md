# async-constructor [![npm](https://img.shields.io/npm/v/async-constructor.svg?maxAge=86400)](https://www.npmjs.com/package/async-constructor) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/BlackGlory/async-constructor/master/LICENSE) [![Build Status](https://travis-ci.org/BlackGlory/async-constructor.svg?branch=master)](https://travis-ci.org/BlackGlory/async-constructor) [![Coverage Status](https://coveralls.io/repos/github/BlackGlory/async-constructor/badge.svg)](https://coveralls.io/github/BlackGlory/async-constructor)

The helper functions for creating classes that require asynchronous constructors.

Since v0.3.0, async constructor will always run asynchronously, and `then` method hidden in TypeScript.

## Install

```sh
npm install --save async-constructor
yarn add async-constructor
```

## Usage

This module is created for [TypeScript](#TypeScript), but can also be used in [JavaScript](#JavaScript).

### JavaScript

```js
import { AsyncConstructor } from 'async-constructor'

class Resource extends AsyncConstructor {
  constructor(url) {
    super(async () => {
      this.content = await load(url)
    })
  }
}

;(async () => {
  const resource = await new Resource('data.json')
})()
```

You may not need the module because JavaScript constructor could create an async constructor like

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

##### ES2017+

```ts
import { AsyncConstructor } from 'async-constructor'

class Resource extends AsyncConstructor {
  content?: any

  constructor(url: string) {
    super(async () => {
      this.content = await load(url)
    })
  }
}

;(async () => {
  const resource = await new Resource('data.json')
})()
```

##### ES6

```ts
import { AsyncConstructor } from 'async-constructor/lib/es6'

class Resource extends AsyncConstructor {
  content?: any

  constructor(url: string) {
    super(async function(this: Resource) {
      this.content = await load(url)
    })
  }
}

;(async () => {
  const resource = await new Resource('data.json')
})()
```

#### appendAsyncConstructor

you can create an asynchronous constructor directly with `appendAsyncConstructor` without using AsyncConstructor.

```ts
import { appendAsyncConstructor } from 'async-constructor'

class Resource {
  content?: any

  constructor(url: string) {
    appendAsyncConstructor(this, async () => {
      this.content = await load(url)
    })
  }
}

;(async () => {
  const resource = await new Resource('data.json')
})()
```

#### Extend

Once a class uses an asynchronous constructor, its subclasses will also become asynchronous constructors.

```js
import { AsyncConstructor } from 'async-constructor'

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

;(async () => {
  const resource = await new DataResource()
})
```

It is not recommended that you add other synchronization code to the constructor, but it is safe to add a new async constructor via the helper funciton.

```js
import { AsyncConstructor, appendAsyncConstructor } from 'async-constructor'

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

;(async () => {
  const resource = await new DataResource('\n')
})
```

`appendAsyncConstructor` can be called multiple times, the asynchronous constructors will be called in order.

#### mixinAsyncConstructor & addAsyncConstructor

The mixin function `mixinAsyncConstructor` and decorator function `addAsyncConstructor` are also used to add asynchronous constructors to classes, but you cannot access protected/private member in the async constructor.

These are pure TypeScript features that cannot be build as JavaScript files, so you need to import TypeScript file directly.

```ts
import { mixinAsyncConstructor } from 'async-constructor/src/mixin'

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

;(async () => {
  const resource = await new Resource('data.json')
})()
```

```ts
import { addAsyncConstructor } from 'async-constructor/src/decorator'

@addAsyncConstructor<typeof Resource>(
  async function(this: Resource, url: string) {
    this.content = await load(url)
  }
)
class Resource {
  content?: any
  constructor(url: string) {}
}

;(async () => {
  const resource = await new Resource('data.json')
})()
```

You can continue to use the asynchronous constructor to mixin new asynchronous constructors on the class, and the asynchronous constructors will be called in order.

```ts
import { mixinAsyncConstructor } from 'async-constructor/src/mixin'

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

;(async () => {
  const resource = await new DisposableResource('data.json')
})()
```

The decorator base on the mixin function, so this can also work on the decorator, but this is not recommended because the code semantics are terrible.
