import { Context } from '@/contexts/shared/context'
import type { Reducer } from '@/contexts/shared/context'
import type { Archive } from '@/services/archive'
import type { UUID } from '@/utils/crypto'
import { getAllArchive, deleteArchive } from '@/services/archive'
import { setSessionId } from '@/services/session'

type State = {
  sid: UUID
  archives: Archive[]
}

type Action =
  | { action: 'FETCH_ARCHIVES_FROM_IDB' }
  | { action: 'DELETE_ARCHIVE'; data: NonNullable<State['sid']> }
  | { action: 'SET_SESSION_ID'; data: State['sid'] }

const initState: State = {
  sid: '0-0-0-0-0', // 💡 App 초기화 과정에서 할당됨을 보장합니다.
  archives: [],
}

const reducer: Reducer<State, Action> = async ({ state, payload }) => {
  switch (payload.action) {
    case 'FETCH_ARCHIVES_FROM_IDB': {
      const archives = (await getAllArchive()) ?? []
      return { ...state, archives }
    }
    case 'DELETE_ARCHIVE': {
      const targetId = payload.data
      const archives = [...state.archives]
      const idx = archives.findIndex((archive) => archive.id === targetId)
      if (idx === -1) {
        return { ...state }
      }

      try {
        await deleteArchive(targetId)
        archives.splice(idx, 1)

        return { ...state, archives }
      } catch {
        return { ...state }
      }
    }
    case 'SET_SESSION_ID': {
      const sid = payload.data
      setSessionId(sid)
      return { ...state, sid }
    }
  }
}

export const ArchiveContext = new Context(initState, reducer)
