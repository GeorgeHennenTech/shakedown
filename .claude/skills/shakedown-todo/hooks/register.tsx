import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Item, View, Who } from '../types'

// The SHAKEDOWN to-do list, beside the chat, in the game's own colours.
//
// The list itself is a plain file next to this mod: todo.json. That file is the
// truth. The panel reads it when a session starts and every few seconds after,
// so Claude (or Seth, in any editor) can add, tick or reword tasks by editing
// the file and the panel follows. Every change made in the panel is written
// straight back to it. Because the file lives in the project, a new chat opens
// with the same list. The /todo skill (.claude/skills/todo) edits the same file
// from the chat.

const PANE = 'shakedown-todo'
const TITLE = 'SHAKEDOWN to-do'
const FILE = 'todo.json'

// The game's palette (game/index.html :root)
const C = {
  ink: '#17111f',
  paper: '#fff3d6',
  card: '#ffffff',
  sun: '#ffc93c',
  hot: '#ff5d8f',
  teal: '#2ec4b6',
  grape: '#5b3fa0',
  faded: '#8a7d96',
} as const

// The game's panel look: a paper card with a thick ink border and a hard
// offset shadow, and the hand-lettered heading font.
const BANNER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 150" width="640" height="150" role="img">
  <rect x="16" y="18" width="612" height="118" rx="18" fill="${C.ink}"/>
  <rect x="6" y="8" width="612" height="118" rx="18" fill="${C.sun}" stroke="${C.ink}" stroke-width="7"/>
  <circle cx="548" cy="67" r="34" fill="${C.hot}" stroke="${C.ink}" stroke-width="6"/>
  <path d="M532 68l11 12 22-26" fill="none" stroke="${C.paper}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="34" y="74" font-family="'Marker Felt','Chalkboard SE',Impact,sans-serif" font-size="58" fill="${C.ink}">SHAKEDOWN</text>
  <text x="38" y="108" font-family="'Marker Felt','Chalkboard SE',Impact,sans-serif" font-size="26" fill="${C.grape}">the to-do list</text>
</svg>`

const items = atom({ plugin: 'shakedown-todo', key: 'items' } as const, [], {
  shape: 'items-1',
})
const view = atom(
  { plugin: 'shakedown-todo', key: 'view' } as const,
  { hideDone: false },
  { shape: 'view-1' },
)

const isItem = (one: unknown): one is Item => {
  if (!one || typeof one !== 'object') return false
  const it = one as Record<string, unknown>

  return (
    typeof it.id === 'number' &&
    (it.who === 'seth' || it.who === 'claude') &&
    typeof it.text === 'string' &&
    typeof it.done === 'boolean'
  )
}

const parse = (text: string): Item[] | undefined => {
  try {
    const data: unknown = JSON.parse(text)
    const list: unknown =
      data && typeof data === 'object' && 'items' in data
        ? (data as { items: unknown }).items
        : data
    if (!Array.isArray(list)) return undefined

    return list.filter(isItem)
  } catch {
    return undefined
  }
}

const print = (list: Item[]) =>
  `${JSON.stringify(
    {
      about:
        'The SHAKEDOWN to-do list, shown in the panel beside the chat. Edit this file to add, tick or reword tasks: who is "seth" or "claude", ids must be unique.',
      items: list,
    },
    null,
    2,
  )}\n`

export const register: Register = on => {
  let lastText = ''

  on('session.start', async ($, e, next) => {
    const path = `${$.plugin.root}/${FILE}`

    const pull = async () => {
      if (!(await $.fs.exists(path))) return false
      const text = await $.fs.read(path)
      if (text === lastText) return true
      const list = parse(text)
      if (!list) return true // half-saved or broken: keep what the panel has
      lastText = text
      await update($, items, () => list)

      return true
    }

    if (!(await pull())) {
      lastText = print([])
      await $.fs.write(path, lastText)
    }
    // Follow edits made to the file from outside the panel.
    $.clock.every(4000, () => {
      void pull()
    })

    await $.command.register({
      name: 'todo-panel',
      description: 'Open the SHAKEDOWN to-do panel beside the chat',
    })
    void $.ui.open({ id: PANE, title: TITLE })

    return next(e)
  })

  on('command.run', { command: 'todo-panel' }, async $ => {
    await $.ui.open({ id: PANE, title: TITLE })

    return { text: 'SHAKEDOWN to-do panel opened.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const table = $.ui.resolve(e)
    const { Box, Text, Button, Input, Progress } = table
    const Svg = 'Svg' in table ? table.Svg : undefined
    const list = await read($, items)
    const current = await read($, view)
    const path = `${$.plugin.root}/${FILE}`

    const change = async (fn: (before: Item[]) => Item[]) => {
      const after = await update($, items, fn)
      lastText = print(after)
      await $.fs.write(path, lastText)
    }
    const toggle = (id: number) =>
      change(before =>
        before.map(it => (it.id === id ? { ...it, done: !it.done } : it)),
      )
    const remove = (id: number) =>
      change(before => before.filter(it => it.id !== id))
    const add = (who: Who, text: string) => {
      const clean = text.trim()
      if (clean === '') return

      return change(before => [
        ...before,
        {
          id: before.reduce((max, it) => Math.max(max, it.id), 0) + 1,
          who,
          text: clean,
          done: false,
        },
      ])
    }

    const doneCount = list.filter(it => it.done).length

    if (e.props.placement === 'widget') {
      const nextUp = list.find(it => !it.done && it.who === 'seth')

      return (
        <Box flexDirection="column" gap="xs" padding="sm" backgroundColor={C.paper}>
          <Text weight="bold" color={C.grape}>
            SHAKEDOWN to-do
          </Text>
          <Progress
            label="Done"
            value={doneCount}
            max={Math.max(1, list.length)}
            valueText={`${doneCount} of ${list.length}`}
            color={C.hot}
          />
          <Text size="caption" color={C.ink}>
            {nextUp ? nextUp.text : 'Nothing waiting on you.'}
          </Text>
        </Box>
      )
    }

    // A Button's own label takes the app's text colour, so every Button sits on
    // a light chip of ours and the words beside it are a Text we colour.
    const chip = (key: string, label: string, press: () => void, background: string) => (
      <Box
        backgroundColor={background}
        borderStyle="single"
        borderColor={C.ink}
        paddingX="sm"
        paddingY="xs"
        flexShrink={0}
      >
        <Button key={key} plain onPress={press}>
          {label}
        </Button>
      </Box>
    )

    const section = (who: Who, heading: string, colour: string, hint: string) => {
      const mine = list.filter(it => it.who === who)
      const shown = current.hideDone ? mine.filter(it => !it.done) : mine
      const open = mine.filter(it => !it.done).length

      return (
        <Box
          flexDirection="column"
          gap="xs"
          padding="sm"
          backgroundColor={C.card}
          borderStyle="single"
          borderColor={C.ink}
        >
          <Box flexDirection="row" gap="sm" alignItems="center">
            <Box backgroundColor={colour} paddingX="sm" paddingY="xs" flexShrink={0}>
              <Text weight="bold" color={C.ink}>
                {heading}
              </Text>
            </Box>
            <Text size="caption" color={C.faded}>
              {open === 0 ? 'all done' : `${open} to do`}
            </Text>
          </Box>
          {shown.length === 0 && (
            <Text size="caption" color={C.faded}>
              {mine.length === 0 ? 'Nothing here yet.' : 'Everything here is done.'}
            </Text>
          )}
          {shown.map(it => (
            <Box flexDirection="row" gap="sm" alignItems="center">
              {chip(
                `tick-${it.id}`,
                it.done ? '✓' : '○',
                () => void toggle(it.id),
                it.done ? C.teal : C.paper,
              )}
              <Box flexGrow={1} flexShrink={1}>
                <Text color={it.done ? C.faded : C.ink} strikethrough={it.done}>
                  {it.text}
                </Text>
              </Box>
              {chip(`drop-${it.id}`, '✕', () => void remove(it.id), C.paper)}
            </Box>
          ))}
          <Input
            key={`add-${who}`}
            placeholder={hint}
            submitLabel="Add"
            onSubmit={value => void add(who, value)}
          />
        </Box>
      )
    }

    return (
      <Box flexDirection="column" gap="sm" padding="md" backgroundColor={C.paper}>
        {Svg ? (
          <Svg source={BANNER} alt="SHAKEDOWN, the to-do list" />
        ) : (
          <Text size="title" weight="bold" color={C.grape}>
            SHAKEDOWN to-do
          </Text>
        )}
        <Progress
          label="Done"
          value={doneCount}
          max={Math.max(1, list.length)}
          valueText={`${doneCount} of ${list.length} done`}
          color={C.hot}
        />
        <Box flexDirection="row" gap="sm" alignItems="center">
          {chip(
            'hide-done',
            current.hideDone ? 'Show done' : 'Hide done',
            () => void update($, view, v => ({ hideDone: !v.hideDone })),
            C.sun,
          )}
          {doneCount > 0 &&
            chip(
              'clear-done',
              'Clear done',
              () => void change(before => before.filter(it => !it.done)),
              C.paper,
            )}
        </Box>
        {section('seth', 'SETH', C.sun, 'Add a task for you')}
        {section('claude', 'CLAUDE', C.hot, 'Add a task for Claude')}
        <Text size="caption" color={C.faded}>
          Kept in the project, so every new chat opens with this list. Type
          /todo to see or change it in the chat, or /todo-panel to bring this
          panel back.
        </Text>
      </Box>
    )
  })
}
