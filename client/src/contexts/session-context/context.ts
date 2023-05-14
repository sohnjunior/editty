import { Context } from '@/contexts/common/context'
import type { Reducer } from '@/contexts/common/context'
import type { UUID } from '@/utils/crypto'

type State = {
  sid?: UUID
}

type Action = { action: 'SET_SESSION_ID'; data: State['sid'] }

const initState: State = {
  sid: undefined,
}

const reducer: Reducer<State, Action> = ({ state, payload }) => {
  switch (payload.action) {
    case 'SET_SESSION_ID': {
      const sid = payload.data
      return { ...state, sid }
    }
  }
}

export const SessionContext = new Context(initState, reducer)
