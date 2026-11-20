export type Who = 'seth' | 'claude'
export type Item = { id: number; who: Who; text: string; done: boolean }
export type View = { hideDone: boolean }

declare module 'claude-code' {
  interface PluginState {
    'shakedown-todo': { items: Shaped<Item[]>; view: Shaped<View> }
  }
}
