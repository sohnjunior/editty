import SessionStorage from './session'

describe('session-storage', () => {
  beforeAll(() => {
    SessionStorage.getInstance().initialize()
  })
  afterEach(() => {
    SessionStorage.getInstance().removeItem('test')
  })

  it('should set and get item', () => {
    SessionStorage.getInstance().setItem('test', { type: 'session' })
    const item = SessionStorage.getInstance().getItem<{ type: string }>('test')

    expect(item).toStrictEqual({ type: 'session' })
  })

  it('should return undefined when item not found', () => {
    const item = SessionStorage.getInstance().getItem('unknown')

    expect(item).toBeUndefined()
  })

  it('should remove item', () => {
    SessionStorage.getInstance().setItem('test', { type: 'session' })
    SessionStorage.getInstance().removeItem('test')
    const item = SessionStorage.getInstance().getItem('test')

    expect(item).toBeUndefined()
  })
})
