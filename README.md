# async-constructor [![npm](https://img.shields.io/npm/v/async-constructor.svg?maxAge=2592000)](https://www.npmjs.com/package/async-constructor) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/BlackGlory/async-constructor/master/LICENSE) [![Build Status](https://travis-ci.org/BlackGlory/async-constructor.svg?branch=master)](https://travis-ci.org/BlackGlory/async-constructor) [![Coverage Status](https://coveralls.io/repos/github/BlackGlory/async-constructor/badge.svg)](https://coveralls.io/github/BlackGlory/async-constructor)

A base class that helps you to create the class that contains asynchronous constructor.

## Install

```sh
npm install --save async-constructor
yarn add async-constructor
```

## Usage

### target ES2017+

```ts
import { AsyncConstructor } from 'async-constructor'

function delay(timeout: number) {
  return new Promise(resolve => setTimeout(() => resolve(), timeout))
}

class MyClass extends AsyncConstructor {
  completed: boolean

  constructor(timeout: number) {
    super(async () => {
      await delay(timeout)
      this.completed = true
    })

    this.completed = false
  }
}

;(async () => {
  const a = await new MyClass(5000)
  console.log(a.completed) // Print true after 5000ms
})()
```

### target ES6

Note: Sync constructor will not throw an error.

```ts
import { AsyncConstructor } from 'async-constructor/lib/es6'

function delay(timeout: number) {
  return new Promise(resolve => setTimeout(() => resolve(), timeout))
}

class MyClass extends AsyncConstructor {
  completed: boolean

  constructor(timeout: number) {
    super(async function(this: MyClass) {
      await delay(timeout)
      this.completed = true
    })

    this.completed = false
  }
}

;(async () => {
  const a = await new MyClass(5000)
  console.log(a.completed) // Print true after 5000ms
})()
```

See also: [#1](https://github.com/BlackGlory/async-constructor/issues/1)

## API

### AsyncConstructor

**constructor(asyncConstructor: () => Promise\<void>)**
