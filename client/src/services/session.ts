import SessionStorage from '@/modules/storage/session'

const KEY = 'sid'

export function getSessionId() {
  return SessionStorage.getInstance().getItem<string>(KEY)
}

export function setSessionId(id: string) {
  SessionStorage.getInstance().setItem(KEY, id)
}

export function getOneTimeSessionId() {
  const timestamp = Date.now().toString()
  return timestamp
}
