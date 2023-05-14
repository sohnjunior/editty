import { Context } from '@/contexts/common/context'
import type { Reducer } from '@/contexts/common/context'

type State = {
  title: string
}

type Action = { action: 'SET_TITLE'; data: State['title'] }

const initState: State = {
  title: 'unique',
}

const reducer: Reducer<State, Action> = ({ state, payload }) => {
  switch (payload.action) {
    case 'SET_TITLE': {
      const title = payload.data
      return { ...state, title }
    }
  }
}

export const CanvasMetaContext = new Context(initState, reducer)
