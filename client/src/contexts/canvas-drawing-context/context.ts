import { Context } from '@/contexts/common/context'
import type { Reducer } from '@/contexts/common/context'
import { Phase } from './types'
import { PALETTE_COLORS } from '@/utils/constant'

type State = {
  phase: Phase
  snapshots: ImageData[]
  stash: ImageData[]
  pencilColor: string
}

type Action =
  | { action: 'SET_PHASE'; data: State['phase'] }
  | { action: 'PUSH_SNAPSHOT'; data: State['snapshots'] }
  | { action: 'HISTORY_BACK' }
  | { action: 'HISTORY_FORWARD' }
  | { action: 'CLEAR_ALL' }
  | { action: 'SET_PENCIL_COLOR'; data: State['pencilColor'] }

const initState: State = {
  phase: 'draw',
  snapshots: [],
  stash: [],
  pencilColor: PALETTE_COLORS['teal-blue'],
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
    case 'HISTORY_BACK': {
      const snapshots = [...state.snapshots]
      const stash = [...state.stash]

      const snapshot = snapshots.pop()
      if (snapshot) {
        stash.push(snapshot)
      }

      return { ...state, snapshots, stash }
    }
    case 'HISTORY_FORWARD': {
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
      return { ...state, pencilColor: PALETTE_COLORS[payload.data] }
    }
    default:
      return { ...state }
  }
}

export const CanvasDrawingContext = new Context(initState, reducer)
