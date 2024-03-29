import { defineCustomElements } from './registry'
import IndexedDB from '@/modules/storage/idb'
import SessionStorage from '@/modules/storage/session'
import { getSessionId, getOneTimeSessionId } from '@/services/session'
import { ArchiveContext } from '@/contexts'

import './reset.css'
import './global.css'

initialize()

async function initialize() {
  mountSessionStorage()
  initializeSessionId()
  await mountDatabase()
  mountApp()
}

function mountSessionStorage() {
  SessionStorage.getInstance().initialize()
}

function initializeSessionId() {
  const initialSessionId = getSessionId() ?? getOneTimeSessionId()
  ArchiveContext.dispatch({ action: 'SET_SESSION_ID', data: initialSessionId })
}

async function mountDatabase() {
  await IndexedDB.getInstance().initialize()
}

function mountApp() {
  defineCustomElements()

  const $app = document.getElementById('app')
  if ($app) {
    $app.appendChild(document.createElement('v-app'))
  }
}
