import SessionStorage from '@/modules/storage/session'
import { getRandomUUID } from '@/utils/crypto'
import type { UUID } from '@/utils/crypto'

const KEY = 'sid'

export function getSessionId() {
  return SessionStorage.getInstance().getItem<UUID>(KEY)
}

export function setSessionId() {
  // TODO: url query 에서 파싱하는 로직 추가하기
  // 세션 ID 설정 우선순위
  // 1. 스토리지에 설정된 sid
  // 2. url-query 에 설정된 sid
  // 3. 이외에는 기본 sid 생성해서 스토리지에 할당
  const uuid = getSessionId() ?? getOneTimeSessionId()

  SessionStorage.getInstance().setItem(KEY, uuid)
}

function getOneTimeSessionId(): UUID {
  return getRandomUUID()
}
