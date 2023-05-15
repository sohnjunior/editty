import { Context } from './context'
import type { Reducer } from '@/contexts/shared/context'

type State = {
  name: string
}

type Action = { action: 'SET_NAME'; data: State['name'] }

describe('base context', () => {
  it('should subscribe and dispatch event', async () => {
    const initState = { name: '' }
    const reducer: Reducer<State, Action> = ({ state, payload }) => {
      switch (payload.action) {
        case 'SET_NAME':
          return { ...state, name: payload.data }
      }
    }
    const context = new Context(initState, reducer)

    let receivedState = { name: '' }
    const mockEffect = jest.fn((context) => (receivedState = context.state))
    context.subscribe({ action: 'SET_NAME', effect: mockEffect })

    await context.dispatch({ action: 'SET_NAME', data: 'owen' })

    expect(receivedState.name).toBe('owen')
  })
})
