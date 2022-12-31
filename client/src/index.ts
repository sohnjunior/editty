import { defineCustomElements } from './registry'

import './global.css'

function mountApp() {
  const $app = document.getElementById('app')
  if ($app) {
    $app.appendChild(document.createElement('v-app'))
  }
}

function initialize() {
  defineCustomElements()
  mountApp()
}

initialize()
