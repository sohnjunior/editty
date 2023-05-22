import { Context } from '@/contexts/shared/context'
import type { Reducer } from '@/contexts/shared/context'
import type { ImageObject } from '@molecules/canvas-layer/types'

type State = {
  images: ImageObject[]
}

type Action =
  | { action: 'PUSH_IMAGE'; data: State['images'][number] }
  | { action: 'CLEAR_IMAGE' }
  | { action: 'SELECT_IMAGE'; data: number }

const initState: State = {
  images: [],
}

const reducer: Reducer<State, Action> = async ({ state, payload }) => {
  switch (payload.action) {
    case 'PUSH_IMAGE': {
      const images = [...state.images]
      images.push(payload.data)

      return { ...state, images }
    }
    case 'CLEAR_IMAGE':
      return { ...state, images: [] }
    case 'SELECT_IMAGE': {
      const images = [...state.images]
      const selectedImage = images[payload.data]
      images.splice(payload.data, 1)
      images.push(selectedImage)

      return { ...state, images }
    }
  }
}

export const CanvasImageContext = new Context(initState, reducer)
