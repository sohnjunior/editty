import { Context } from '@/contexts/common/context'
import type { Reducer } from '@/contexts/common/context'
import type { ImageObject } from '@molecules/canvas-layer/types'

type State = {
  images: ImageObject[]
}

type Action = { action: 'PUSH_IMAGE'; data: ImageObject } | { action: 'CLEAR_IMAGE' }

const initState: State = {
  images: [],
}

const reducer: Reducer<State, Action> = ({ state, payload }) => {
  switch (payload.action) {
    case 'PUSH_IMAGE': {
      const images = [...state.images]
      images.push(payload.data)
      return { ...state, images }
    }
    case 'CLEAR_IMAGE':
      return { ...state, images: [] }
  }
}

export const CanvasImageContext = new Context(initState, reducer)
