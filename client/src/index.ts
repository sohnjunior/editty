import { defineCustomElements } from './registry'

import './reset.css'
import './global.css'

initialize()

function initialize() {
  defineCustomElements()
  mountApp()
}

function mountApp() {
  const $app = document.getElementById('app')
  if ($app) {
    $app.appendChild(document.createElement('v-app'))
  }
}
