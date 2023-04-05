type IndexableObject = Record<string, unknown>
type PrimitiveType = string | number | boolean | null | undefined | symbol | bigint
type BaseAction = {
  action: string
  data: PrimitiveType | IndexableObject | Array<unknown>
}

export type Reducer<State extends IndexableObject, Action extends BaseAction> = (param: {
  state: State
  payload: Action
}) => State
export type Effect<State extends IndexableObject, Action extends BaseAction> = (
  context: Context<State, Action>
) => void

export class Context<State extends IndexableObject, Action extends BaseAction> {
  #state: State
  #effects: Map<string, Effect<State, Action>[]> = new Map()
  #reducer: Reducer<State, Action>

  constructor(initState: State, reducer: Reducer<State, Action>) {
    this.#state = initState
    this.#reducer = reducer
  }

  get state() {
    return this.#state
  }

  public subscribe(param: { action: Action['action']; effect: Effect<State, Action> }) {
    if (this.#effects.has(param.action)) {
      const queue = this.#effects.get(param.action)
      queue?.push(param.effect)
    } else {
      this.#effects.set(param.action, [param.effect])
    }
  }

  private publish(param: { action: Action['action'] }) {
    const effects = this.#effects.get(param.action)

    if (effects) {
      effects.forEach((effect) => effect(this))
    }
  }

  async dispatch(payload: Action) {
    this.#state = await this.#reducer({
      state: this.#state,
      payload,
    })
    this.publish({ action: payload.action })
  }
}
