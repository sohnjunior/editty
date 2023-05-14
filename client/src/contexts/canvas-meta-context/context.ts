import { Context } from '@/contexts/shared/context'
import type { Reducer } from '@/contexts/shared/context'

export type Phase = 'cursor' | 'draw' | 'erase' | 'emoji' | 'gallery' | 'color'

type State = {
  title: string
  phase: Phase
}

type Action =
  | { action: 'SET_TITLE'; data: State['title'] }
  | { action: 'SET_PHASE'; data: State['phase'] }

const initState: State = {
  title: 'unique',
  phase: 'draw',
}

const reducer: Reducer<State, Action> = ({ state, payload }) => {
  switch (payload.action) {
    case 'SET_TITLE': {
      const title = payload.data
      return { ...state, title }
    }
    case 'SET_PHASE':
      return { ...state, phase: payload.data }
  }
}

export const CanvasMetaContext = new Context(initState, reducer)
