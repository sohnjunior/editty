require('@testing-library/jest-dom')
const { defineCustomElements } = require('./src/registry')

beforeAll(() => {
  // ✅ setup web-component before invoke test suites
  defineCustomElements()
})
