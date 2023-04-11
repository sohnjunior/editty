import EventBus from './bus'

describe('EventBus (class)', () => {
  it('should subscribe event', () => {
    const eventBus = EventBus.getInstance()

    let result = null
    const unsubscribe = eventBus.on('subscribe-test', () => (result = 'success'))
    eventBus.emit('subscribe-test')

    expect(result).toBe('success')

    unsubscribe()
  })

  it('should unsubscribe event', () => {
    const eventBus = EventBus.getInstance()

    let result = null
    const unsubscribe = eventBus.on('subscribe-test', () => (result = 'success'))
    unsubscribe()
    eventBus.emit('subscribe-test')

    expect(result).toBe(null)

    unsubscribe()
  })

  it('should subscribe once', () => {
    const eventBus = EventBus.getInstance()

    let result = null
    eventBus.once('subscribe-test', (flag: string) => (result = flag))
    eventBus.emit('subscribe-test', 'success')
    eventBus.emit('subscribe-test', 'fail')

    expect(result).toBe('success')
  })
})
