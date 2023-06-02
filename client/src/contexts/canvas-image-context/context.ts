import { Context } from '@/contexts/shared/context'
import type { Reducer } from '@/contexts/shared/context'
import type { ImageObject } from '@molecules/canvas-layer/types'

type State = {
  images: ImageObject[]
}

type Action =
  | { action: 'INIT_IMAGE'; data: State['images'] }
  | { action: 'PUSH_IMAGE'; data: State['images'][number] }
  | { action: 'DELETE_IMAGE'; data: State['images'][number]['id'] }
  | { action: 'CLEAR_IMAGE' }
  | { action: 'SELECT_IMAGE'; data: number }

const initState: State = {
  images: [],
}

const reducer: Reducer<State, Action> = async ({ state, payload }) => {
  switch (payload.action) {
    case 'INIT_IMAGE': {
      const images = payload.data
      return { ...state, images }
    }
    case 'PUSH_IMAGE': {
      const images = [...state.images]
      images.push(payload.data)

      return { ...state, images }
    }
    case 'DELETE_IMAGE': {
      const imageId = payload.data
      const images = state.images.filter((image) => image.id !== imageId)

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
