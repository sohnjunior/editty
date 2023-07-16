import { Context } from '@/contexts/shared/context'
import type { Reducer } from '@/contexts/shared/context'

export type Phase = 'cursor' | 'draw' | 'erase' | 'emoji' | 'gallery' | 'color'

type State = {
  phase: Phase
}

type Action = { action: 'SET_PHASE'; data: State['phase'] }

const initState: State = {
  phase: 'draw',
}

const reducer: Reducer<State, Action> = async ({ state, payload }) => {
  switch (payload.action) {
    case 'SET_PHASE':
      return { ...state, phase: payload.data }
  }
}

export const CanvasMetaContext = new Context(initState, reducer)
