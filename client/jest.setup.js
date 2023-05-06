require('@testing-library/jest-dom')
const { defineCustomElements } = require('./src/registry')

beforeAll(() => {
  // ✅ setup web-component before invoke test suites
  defineCustomElements()
})

afterEach(() => {
  // 🧹 cleanup document body after each test case run for test-isolation
  document.body.innerHTML = ''
})
