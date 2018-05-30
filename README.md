# async-constructor [![npm](https://img.shields.io/npm/v/async-constructor.svg?maxAge=2592000)](https://www.npmjs.com/package/async-constructor) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/BlackGlory/async-constructor/master/LICENSE) [![Build Status](https://travis-ci.org/BlackGlory/async-constructor.svg?branch=master)](https://travis-ci.org/BlackGlory/async-constructor) [![Coverage Status](https://coveralls.io/repos/github/BlackGlory/async-constructor/badge.svg)](https://coveralls.io/github/BlackGlory/async-constructor)

A base class that helps you to create the class that contains asynchronous constructor.

## Install

```sh
yarn add async-constructor
```

## Usage

```js
import { AsyncConstructor } from 'async-constructor'

function delay(timeout) {
  return new Promise(resolve => setTimeout(() => resolve(), timeout))
}

class MyClass extends AsyncConstructor {
  constructor(timeout) {
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