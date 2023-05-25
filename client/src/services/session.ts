import SessionStorage from '@/modules/storage/session'
import { getRandomUUID } from '@/utils/crypto'
import type { UUID } from '@/utils/crypto'

const KEY = 'sid'

export function getSessionId() {
  return SessionStorage.getInstance().getItem<UUID>(KEY)
}

export function setSessionId(id: UUID) {
  SessionStorage.getInstance().setItem(KEY, id)
}

export function getOneTimeSessionId(): UUID {
  return getRandomUUID()
}
