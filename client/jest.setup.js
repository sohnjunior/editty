require('@testing-library/jest-dom')
const { defineCustomElements } = require('./src/registry')

beforeAll(() => {
  defineCustomElements()
})
