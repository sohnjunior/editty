import { Context } from '@/contexts/common/context'
import type { Reducer } from '@/contexts/common/context'
import { Phase } from './types'

type State = {
  phase: Phase
  snapshots: ImageData[]
}

type Action =
  | { action: 'SET_PHASE'; data: State['phase'] }
  | { action: 'PUSH_SNAPSHOT'; data: State['snapshots'] }
  | { action: 'POP_SNAPSHOT' }

const initState: State = {
  phase: 'draw',
  snapshots: [],
}

const reducer: Reducer<State, Action> = ({ state, payload }) => {
  switch (payload.action) {
    case 'SET_PHASE':
      return { ...state, phase: payload.data }
    case 'PUSH_SNAPSHOT': {
      const snapshots = [...state.snapshots]
      snapshots.push(...payload.data)
      return { ...state, snapshots }
    }
    case 'POP_SNAPSHOT': {
      const snapshots = [...state.snapshots]
      snapshots.pop()
      return { ...state, snapshots }
    }
    default:
      return { ...state }
  }
}

export const CanvasContext = new Context(initState, reducer)
