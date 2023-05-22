import { Context } from '@/contexts/shared/context'
import type { Reducer } from '@/contexts/shared/context'
import type { Archive } from '@/services/archive'
import type { UUID } from '@/utils/crypto'
import { getAllArchive } from '@/services/archive'

type State = {
  sid?: UUID
  archives: Archive[]
}

type Action =
  | { action: 'FETCH_ARCHIVES_FROM_IDB' }
  | { action: 'SET_SESSION_ID'; data: State['sid'] }

const initState: State = {
  sid: undefined,
  archives: [],
}

const reducer: Reducer<State, Action> = async ({ state, payload }) => {
  switch (payload.action) {
    case 'FETCH_ARCHIVES_FROM_IDB': {
      const archives = (await getAllArchive()) ?? []
      return { ...state, archives }
    }
    case 'SET_SESSION_ID': {
      const sid = payload.data
      return { ...state, sid }
    }
  }
}

export const ArchiveContext = new Context(initState, reducer)
