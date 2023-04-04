import { Context } from './common/context'
import type { Reducer } from './common/context'

type State = {
  phase: 'drawing' | 'erasing'
  snapshots: ImageData[]
}

type Action =
  | { action: 'SET_PHASE'; data: State['phase'] }
  | { action: 'PUSH_SNAPSHOT'; data: State['snapshots'] }

const initState: State = {
  phase: 'drawing',
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
    default:
      return { ...state }
  }
}

export const CanvasContext = new Context(initState, reducer)
