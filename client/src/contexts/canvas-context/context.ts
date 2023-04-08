import { Context } from '@/contexts/common/context'
import type { Reducer } from '@/contexts/common/context'
import { Phase } from './types'

type State = {
  phase: Phase
  snapshots: ImageData[]
  stash: ImageData[]
}

type Action =
  | { action: 'SET_PHASE'; data: State['phase'] }
  | { action: 'PUSH_SNAPSHOT'; data: State['snapshots'] }
  | { action: 'POP_SNAPSHOT' }
  | { action: 'POP_STASH' }

const initState: State = {
  phase: 'draw',
  snapshots: [],
  stash: [],
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
      const stash = [...state.stash]

      const snapshot = snapshots.pop()
      if (snapshot) {
        stash.push(snapshot)
      }

      return { ...state, snapshots, stash }
    }
    case 'POP_STASH': {
      const snapshots = [...state.snapshots]
      const stash = [...state.stash]

      const snapshot = stash.pop()
      if (snapshot) {
        snapshots.push(snapshot)
      }

      return { ...state, snapshots, stash }
    }
    default:
      return { ...state }
  }
}

export const CanvasContext = new Context(initState, reducer)
