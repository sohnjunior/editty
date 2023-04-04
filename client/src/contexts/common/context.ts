type Object = { [key: string]: any }
type BaseAction = { action: string; data: Object | string | number | null | undefined }

export type Reducer<State extends Object, Action extends BaseAction> = (param: {
  state: State
  payload: Action
}) => State
export type Handler<State extends Object, Action extends BaseAction> = (
  context: Context<State, Action>
) => void

export class Context<State extends Object, Action extends BaseAction> {
  #state: State
  #handlers: Map<string, Handler<State, Action>[]> = new Map()
  #reducer: Reducer<State, Action>

  constructor(initState: State, reducer: Reducer<State, Action>) {
    this.#state = initState
    this.#reducer = reducer
  }

  get state() {
    return this.#state
  }

  public subscribe(param: { action: Action['action']; handler: Handler<State, Action> }) {
    if (this.#handlers.has(param.action)) {
      const queue = this.#handlers.get(param.action)
      queue?.push(param.handler)
    } else {
      this.#handlers.set(param.action, [param.handler])
    }
  }

  private publish(param: { action: Action['action'] }) {
    const handlers = this.#handlers.get(param.action)

    if (!handlers) {
      throw new Error('🚨 undefined action handler type')
    }

    handlers.forEach((handler) => handler(this))
  }

  async dispatch(payload: Action) {
    this.#state = await this.#reducer({
      state: this.#state,
      payload,
    })
    this.publish({ action: payload.action })
  }
}
