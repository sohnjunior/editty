import { Context } from '@/contexts/common/context'
import type { Reducer } from '@/contexts/common/context'
import { Phase } from './types'

type State = {
  phase: Phase
  snapshots: ImageData[]
  stash: ImageData[]
  pencilColor: string
  strokeSize: number
}

type Action =
  | { action: 'SET_PHASE'; data: State['phase'] }
  | { action: 'PUSH_SNAPSHOT'; data: State['snapshots'] }
  | { action: 'HISTORY_CHANGE' }
  | { action: 'CLEAR_ALL' }
  | { action: 'SET_PENCIL_COLOR'; data: State['pencilColor'] }
  | { action: 'SET_STROKE_SIZE'; data: State['strokeSize'] }

const initState: State = {
  phase: 'draw',
  snapshots: [],
  stash: [],
  pencilColor: 'teal-blue',
  strokeSize: 10,
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
    case 'HISTORY_CHANGE': {
      const snapshots = [...state.snapshots]
      const stash = [...state.stash]

      const snapshot = stash.pop()
      if (snapshot) {
        snapshots.push(snapshot)
      }

      return { ...state, snapshots, stash }
    }
    case 'CLEAR_ALL': {
      return { ...state, snapshots: [], stash: [] }
    }
    case 'SET_PENCIL_COLOR': {
      return { ...state, pencilColor: payload.data }
    }
    case 'SET_STROKE_SIZE': {
      return { ...state, strokeSize: payload.data }
    }
    default:
      return { ...state }
  }
}

export const CanvasDrawingContext = new Context(initState, reducer)
