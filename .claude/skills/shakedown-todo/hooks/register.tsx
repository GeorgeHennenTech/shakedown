import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Board, Item, ListKey, Owner, Section, View } from '../types'

// The SHAKEDOWN to-do list: a pane beside the chat, drawn like the game's own HUD (cream paper,
// thick ink outlines, yellow banners, marker lettering). The list itself lives in the project, in
// todo.json at its root, so it is versioned with the game and is there in every new session.

const PLUGIN = 'shakedown-todo'
const PANE = 'shakedown-todo'
const TITLE = 'SHAKEDOWN to-do'
const FILE = 'todo.json'

// The game's palette, from game/index.html.
const INK = '#17111f'
const PAPER = '#fff3d6'
const CARD = '#fff8e6'
const HOVER = '#ffe9a8'
const SUN = '#ffc93c'
const HOT = '#ff5d8f'
const TEAL = '#2ec4b6'
const GRAPE = '#5b3fa0'
const MUTED = '#6b5d78'
const FAINT = '#a8946a'
// The pill above the prompt sits on the app's own ground, light or dark: a mid violet reads on both.
const PILL = '#8f6aff'
const COMIX = "'Marker Felt', 'Chalkboard SE', 'Comic Sans MS', Impact, sans-serif"
const FONT = "-apple-system, 'Helvetica Neue', Arial, sans-serif"

const OWNERS: { owner: Owner; title: string; color: string }[] = [
  { owner: 'me', title: 'For Seth', color: HOT },
  { owner: 'claude', title: 'For Claude', color: GRAPE },
]

// Change the tag when Board's fields change: it declines what an earlier version kept.
const board = atom({ plugin: 'shakedown-todo', key: 'board' } as const, { me: [], claude: [], ideas: [] } as Board, {
  shape: 'board-1',
})
const view = atom({ plugin: 'shakedown-todo', key: 'view' } as const, 'all' as View)
const isDoneHidden = atom({ plugin: 'shakedown-todo', key: 'isDoneHidden' } as const, false)
const isPaneOpen = atom({ plugin: 'shakedown-todo', key: 'isPaneOpen' } as const, false)

let counter = 0
const newId = (prefix: string, now: number) => `${prefix}${now.toString(36)}${(counter++).toString(36)}`

// Where the project stood when this list was first written (19 Nov 2026).
const SEED: Record<ListKey, { name: string; items: string[] }[]> = {
  me: [
    {
      name: 'Play-test',
      items: [
        'Play a set at the Open Decks tent and say how it feels',
        'Play with the sound on: nobody has heard it but you',
        'Watch a Monday exodus and a Wednesday arrival',
        'Open the camp kitchen and serve a lunch rush',
        'Hire Moonbeam for a day on the counter, then the garden',
      ],
    },
    {
      name: 'Your call',
      items: [
        'Street table or named-sandwich orders next?',
        'Try one specified task with the second model',
        'Engine choice (UE5 will not run on this Mac)',
      ],
    },
  ],
  claude: [
    {
      name: 'Food truck path',
      items: [
        'Table on Shakedown Street: pitch, queue, two-item menu',
        'Star rating for stands',
        'Orders by named sandwich (they are stored as prices only)',
        'Standing daily wage, and quitting after missed pay',
        'A second helper: someone you healed',
        'Measure Moonbeam on the counter with the test player',
        'Booth, the rival stall and the health inspector',
        'Car ladder up to the van',
        'Kitchen build, pitches and the food truck',
      ],
    },
    {
      name: 'Camp upgrade map',
      items: ['Storage and safes', 'Comfort', 'Power, light, fire and sound', 'Hygiene gear', 'Workbench levels'],
    },
  ],
  ideas: [
    {
      name: 'Later',
      items: [
        'Mouth animation for talking heads',
        'Rules for your camp while you are away on the Tour',
        'Back-to-back sets and the silent disco battle',
        'Import your own music',
        'Mushrooms: the large version',
      ],
    },
  ],
}

function seedBoard(now: number): Board {
  const make = (list: ListKey): Section[] =>
    SEED[list].map(s => ({
      id: newId('s', now),
      name: s.name,
      items: s.items.map(text => ({ id: newId('i', now), text, isDone: false })),
    }))

  return { me: make('me'), claude: make('claude'), ideas: make('ideas') }
}

// What todo.json holds is hand-editable, so anything missing or misshapen is repaired, not trusted.
function fromFile(raw: unknown, now: number): Board | null {
  if (!raw || typeof raw !== 'object') return null
  const data = raw as Record<string, unknown>
  const list = (value: unknown): Section[] =>
    (Array.isArray(value) ? value : []).flatMap(s => {
      if (!s || typeof s !== 'object') return []
      const sec = s as Record<string, unknown>
      const items: Item[] = (Array.isArray(sec.items) ? sec.items : []).flatMap(i => {
        if (typeof i === 'string') return [{ id: newId('i', now), text: i, isDone: false }]
        if (!i || typeof i !== 'object') return []
        const it = i as Record<string, unknown>
        if (typeof it.text !== 'string' || it.text.trim() === '') return []

        return [{ id: typeof it.id === 'string' ? it.id : newId('i', now), text: it.text, isDone: it.isDone === true || it.done === true }]
      })

      return [{ id: typeof sec.id === 'string' ? sec.id : newId('s', now), name: typeof sec.name === 'string' ? sec.name : 'General', items }]
    })
  if (!Array.isArray(data.me) && !Array.isArray(data.claude) && !Array.isArray(data.ideas)) return null

  return { me: list(data.me), claude: list(data.claude), ideas: list(data.ideas) }
}

async function filePath($: EngineInterface) {
  return `${await $.session.root()}/${FILE}`
}

async function load($: EngineInterface, now: number): Promise<Board> {
  try {
    const path = await filePath($)
    if (await $.fs.exists(path)) {
      const parsed = fromFile(JSON.parse(await $.fs.read(path)), now)
      if (parsed) return parsed
    }
  } catch {
    // An unreadable file falls through to what this plugin last kept.
  }
  const kept = fromFile(await $.store.get('board'), now)

  return kept ?? seedBoard(now)
}

async function save($: EngineInterface, b: Board) {
  await $.store.set('board', b)
  try {
    await $.fs.write(await filePath($), `${JSON.stringify({ about: 'The SHAKEDOWN to-do list, shown by the shakedown-todo pane. Safe to edit by hand.', ...b }, null, 2)}\n`)
  } catch {
    // The copy in the store still holds the list when the file cannot be written.
  }
}

// An open pane stays open even while no surface draws it yet, so the "show" pill hides as soon as
// the pane is open, placed or not.
async function openPane($: EngineInterface, focus?: true) {
  const opened = await $.ui.open({ id: PANE, title: TITLE, ...(focus ? { focus } : {}) })
  await update($, isPaneOpen, () => true)

  return opened
}

async function change($: EngineInterface, fn: (b: Board) => Board) {
  await update($, board, b => fn(b))
  await save($, await read($, board))
}

function addItems(b: Board, owner: ListKey, sectionName: string, texts: string[], now: number): Board {
  const name = sectionName.trim() || 'General'
  const list = b[owner]
  const found = list.find(s => s.name.toLowerCase() === name.toLowerCase())
  const items: Item[] = texts.filter(t => t.trim()).map(t => ({ id: newId('i', now), text: t.trim(), isDone: false }))
  const next = found
    ? list.map(s => (s === found ? { ...s, items: [...s.items, ...items] } : s))
    : [...list, { id: newId('s', now), name, items }]

  return { ...b, [owner]: next }
}

function mapItems(b: Board, fn: (i: Item) => Item | null): Board {
  const each = (list: Section[]) =>
    list.map(s => ({ ...s, items: s.items.map(fn).filter((i): i is Item => i !== null) }))

  return { me: each(b.me), claude: each(b.claude), ideas: each(b.ideas) }
}

const dropEmpty = (b: Board): Board => ({
  me: b.me.filter(s => s.items.length > 0),
  claude: b.claude.filter(s => s.items.length > 0),
  ideas: b.ideas.filter(s => s.items.length > 0),
})

// Moves an idea onto a task list, under a section of the same name.
function promote(b: Board, id: string, to: Owner, now: number): Board {
  const from = b.ideas.find(s => s.items.some(i => i.id === id))
  const idea = from?.items.find(i => i.id === id)
  if (!from || !idea) return b
  const without = dropEmpty({
    ...b,
    ideas: b.ideas.map(s => (s === from ? { ...s, items: s.items.filter(i => i.id !== id) } : s)),
  })

  return addItems(without, to, from.name, [idea.text], now)
}

const openCount = (list: Section[]) => list.reduce((n, s) => n + s.items.filter(i => !i.isDone).length, 0)

// "Section: task" puts the task under that section; plain text goes to General.
function parseEntry(raw: string): { section: string; text: string } {
  const m = raw.match(/^([^:]{1,40}):\s*(.+)$/)

  return m?.[1] && m[2] ? { section: m[1].trim(), text: m[2].trim() } : { section: 'General', text: raw.trim() }
}

function boardAsText(b: Board): string {
  const lines: string[] = []
  for (const { owner, title } of [...OWNERS, { owner: 'ideas' as const, title: 'Ideas' }]) {
    lines.push(`## ${title} (owner: ${owner})`)
    if (b[owner].length === 0) lines.push('(empty)')
    for (const s of b[owner]) {
      lines.push(`### ${s.name}`)
      for (const i of s.items) lines.push(`- [${i.isDone ? 'x' : ' '}] ${i.text}  (id: ${i.id})`)
    }
  }

  return lines.join('\n')
}

const TOOL_DESCRIPTION = [
  "Reads and edits the SHAKEDOWN to-do pane the user sees beside the chat. Three lists: owner 'me' (things Seth",
  "has to do: play-tests, decisions), owner 'claude' (things you, Claude, have to build or check) and owner",
  "'ideas' (ideas not yet committed to). Each list is grouped into named sections. Keep it current: complete",
  "your items as you finish them, add what comes up, and put anything you need from Seth on his list. The list",
  'is saved to todo.json in the project. Actions: list; add (owner, section, text or items[]); complete /',
  "reopen / remove (id); promote (id of an idea, owner 'me' or 'claude'); clear_done (optional owner).",
  'Returns the whole board with item ids.',
].join(' ')

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const now = await $.clock.now()
    const initial = await load($, now)
    await update($, board, () => initial)
    await save($, initial)

    await $.command.register({
      name: 'todo',
      description: 'Show or hide the SHAKEDOWN to-do pane (/todo, /todo hide, /todo add <section>: <task>)',
    })
    await $.tool.register({
      name: 'todo',
      description: TOOL_DESCRIPTION,
      isDeferred: false,
      inputSchema: {
        type: 'object',
        properties: {
          action: { type: 'string', enum: ['list', 'add', 'complete', 'reopen', 'remove', 'promote', 'clear_done'] },
          owner: {
            type: 'string',
            enum: ['me', 'claude', 'ideas'],
            description: "Which list. 'me' = Seth; for promote, the task list the idea moves to.",
          },
          section: { type: 'string', description: 'Section name for add; created if missing.' },
          text: { type: 'string', description: 'One item to add.' },
          items: { type: 'array', items: { type: 'string' }, description: 'Several items to add at once.' },
          id: { type: 'string', description: 'Item id for complete / reopen / remove / promote.' },
        },
        required: ['action'],
      },
    })
    void openPane($)

    return next(e)
  })

  on('tool.call', { tool: `mcp__${PLUGIN}__todo` }, async ($, e) => {
    const input = e as unknown as {
      action: string
      owner?: ListKey
      section?: string
      text?: string
      items?: string[]
      id?: string
    }
    const now = await $.clock.now()
    const owner: ListKey = input.owner === 'me' || input.owner === 'ideas' ? input.owner : 'claude'

    switch (input.action) {
      case 'add': {
        const texts = [...(input.items ?? []), ...(input.text ? [input.text] : [])]
        if (texts.length === 0) return { deny: 'add needs text or items.' }
        await change($, b => addItems(b, owner, input.section ?? 'General', texts, now))
        break
      }
      case 'complete':
      case 'reopen':
      case 'remove': {
        if (!input.id) return { deny: `${input.action} needs an id (call list to see ids).` }
        const b = await read($, board)
        const exists = [...b.me, ...b.claude, ...b.ideas].some(s => s.items.some(i => i.id === input.id))
        if (!exists) return { deny: `No item with id ${input.id}.` }
        const action = input.action
        await change($, x =>
          dropEmpty(
            mapItems(x, i =>
              i.id !== input.id ? i : action === 'remove' ? null : { ...i, isDone: action === 'complete' },
            ),
          ),
        )
        break
      }
      case 'promote': {
        const b = await read($, board)
        if (!input.id || !b.ideas.some(s => s.items.some(i => i.id === input.id))) {
          return { deny: 'promote needs the id of an item on the ideas list.' }
        }
        const to: Owner = input.owner === 'claude' ? 'claude' : 'me'
        await change($, x => promote(x, input.id as string, to, now))
        break
      }
      case 'clear_done': {
        await change($, x => {
          const cleared = mapItems(x, i => (i.isDone ? null : i))
          const kept = input.owner ? { ...x, [input.owner]: cleared[input.owner] } : cleared

          return dropEmpty(kept)
        })
        break
      }
      case 'list':
        break
      default:
        return { deny: `Unknown action ${input.action}.` }
    }

    return { result: boardAsText(await read($, board)) }
  })

  on('command.run', { command: 'todo' }, async ($, e) => {
    const args = e.args.trim()
    if (args === 'hide' || args === 'close') {
      await $.ui.close({ id: PANE })

      return { text: 'To-do pane hidden. Run /todo to bring it back.' }
    }
    if (args.startsWith('add ')) {
      const { section, text } = parseEntry(args.slice(4))
      const now = await $.clock.now()
      await change($, b => addItems(b, 'me', section, [text], now))
    }
    const opened = await openPane($, true)

    return { text: opened.isPlaced ? 'To-do pane open.' : 'To-do pane will show when there is room.' }
  })

  on('ui.close', async ($, e, next) => {
    if (e.id === PANE) await update($, isPaneOpen, () => false)

    return next(e)
  })

  // While the pane is hidden, a small pill above the prompt pops it back out.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || (await read($, isPaneOpen))) return next(e)
    const b = await read($, board)
    const { Box, Button, Text } = $.ui.resolve(e)

    return (
      <Box>
        <Button key="show-todo" plain onPress={() => openPane($)}>
          <Text color={PILL} weight="semibold">
            ✓ SHAKEDOWN to-do
          </Text>
          <Text color={PILL}>
            {'   '}
            {openCount(b.me)} for you
          </Text>
          <Text dimColor> · {openCount(b.claude)} for Claude</Text>
          <Text dimColor> · {b.ideas.reduce((n, s) => n + s.items.length, 0)} ideas</Text>
          <Text dimColor>{'   '}Show ›</Text>
        </Button>
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const els = $.ui.resolve(e)
    const { Box, Text, Button, Input } = els
    // The terminal has no Svg: it gets plain text in place of the art.
    const Svg = 'Svg' in els ? els.Svg : null
    const b = await read($, board)
    const v = await read($, view)
    const hideDone = await read($, isDoneHidden)
    const stats = { me: statsOf(b.me), claude: statsOf(b.claude), ideas: statsOf(b.ideas) }

    // Minimized on the desktop app: a glance, since clicks may not reach it.
    if (e.props.placement === 'widget') {
      return Svg ? <Svg source={widgetSvg(stats)} alt={altOf(stats)} /> : <Text>{altOf(stats)}</Text>
    }

    // A key cap, like the game's own key hints. The art is an Svg in the game's colours; the
    // desktop paints a button's label in its own, so a blank plain button over it takes the click.
    const chip = (key: string, label: string, color: string, isOn: boolean, onPress: () => unknown) =>
      Svg ? (
        <Box key={`chip-${key}`} flexShrink={0}>
          <Svg source={chipSvg(label, color, isOn)} alt={label} width={chipWidth(label)} height={28} />
          <Box position="absolute" top={0} left={0}>
            <Button key={key} plain label={'　'.repeat(Math.ceil(chipWidth(label) / 13))} onPress={onPress} />
          </Box>
        </Box>
      ) : (
        <Button key={key} label={label} variant={isOn ? 'primary' : 'secondary'} onPress={onPress} />
      )

    const toggleItem = (id: string) => change($, x => mapItems(x, i => (i.id === id ? { ...i, isDone: !i.isDone } : i)))
    const removeItem = (id: string) => change($, x => dropEmpty(mapItems(x, i => (i.id === id ? null : i))))

    const heading = (title: string, owner: ListKey, st: Stats, color: string) =>
      Svg ? (
        <Svg source={headingSvg(title, owner, st, color)} alt={`${title}: ${st.open} open, ${st.done} done`} height={44} />
      ) : (
        <Text color={color} weight="bold">
          {title} · {st.open} open
        </Text>
      )

    const itemRow = (i: Item, color: string) => (
      <Box
        key={`row-${i.id}`}
        flexDirection="row"
        alignItems="center"
        gap="sm"
        paddingX="xs"
        paddingY={0}
        width="100%"
        hover={{ backgroundColor: HOVER }}
      >
        {Svg ? (
          <Box flexShrink={0} width={2}>
            <Svg source={checkSvg(color, i.isDone)} alt={i.isDone ? 'Done' : 'Not done'} width={20} height={20} />
            <Box position="absolute" top={0} left={0}>
              <Button key={`t-${i.id}`} plain label={'　'} onPress={() => toggleItem(i.id)} />
            </Box>
          </Box>
        ) : (
          <Box flexShrink={0}>
            <Button key={`t-${i.id}`} label={i.isDone ? '✓' : '○'} onPress={() => toggleItem(i.id)} />
          </Box>
        )}
        <Box flexGrow={1} flexShrink={1} minWidth={0}>
          <Text color={i.isDone ? FAINT : INK} strikethrough={i.isDone} wrap="wrap">
            {i.text}
          </Text>
        </Box>
        <Box display="none" hover={{ display: 'flex' }} flexShrink={0}>
          {chip(`x-${i.id}`, 'Delete', MUTED, false, () => removeItem(i.id))}
        </Box>
      </Box>
    )

    const sectionCard = (s: Section, color: string) => {
      const left = s.items.filter(i => !i.isDone).length
      const isCleared = left === 0
      if (hideDone && isCleared) return null
      // Open first, done after, each in the order added.
      const open = s.items.filter(i => !i.isDone)
      const shown = isCleared || hideDone ? open : [...open, ...s.items.filter(i => i.isDone)]

      return (
        <Box
          key={`sec-${s.id}`}
          flexDirection="column"
          backgroundColor={CARD}
          borderStyle="round"
          borderColor={INK}
          paddingX={1}
          paddingY="sm"
          gap="xs"
          width="100%"
        >
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" width="100%" gap="sm">
            <Box flexShrink={1} minWidth={0}>
              <Text color={isCleared ? FAINT : color} weight="bold" size="caption" wrap="truncate-end">
                {s.name.toUpperCase()}
              </Text>
            </Box>
            <Text color={isCleared ? TEAL : MUTED} size="caption" weight="semibold" tabular>
              {isCleared ? `✓ all ${s.items.length} done` : `${s.items.length - left} of ${s.items.length}`}
            </Text>
          </Box>
          {shown.map(i => itemRow(i, color))}
        </Box>
      )
    }

    const ownerBlock = (owner: Owner, title: string, color: string) => {
      const list = b[owner]
      const st = stats[owner]
      const sorted = [...list].sort(
        (x, y) => Number(x.items.every(i => i.isDone)) - Number(y.items.every(i => i.isDone)),
      )
      const isEmpty = sorted.every(s => hideDone && s.items.every(i => i.isDone))

      return (
        <Box key={`owner-${owner}`} flexDirection="column" gap="sm" width="100%">
          {heading(title, owner, st, color)}
          {isEmpty && (
            <Text color={MUTED} size="footnote">
              All clear.
            </Text>
          )}
          {sorted.map(s => sectionCard(s, color))}
        </Box>
      )
    }

    const toTask = (id: string, to: Owner) => $.clock.now().then(now => change($, x => promote(x, id, to, now)))

    // An idea has no checkbox: it is kept, promoted to a task list, or deleted.
    const ideaRow = (i: Item) => (
      <Box
        key={`row-${i.id}`}
        flexDirection="row"
        alignItems="center"
        gap="sm"
        paddingX="xs"
        width="100%"
        hover={{ backgroundColor: HOVER }}
      >
        <Box flexShrink={0}>
          <Text color={TEAL} weight="bold">
            ✦
          </Text>
        </Box>
        <Box flexGrow={1} flexShrink={1} minWidth={0}>
          <Text color={INK} wrap="wrap">
            {i.text}
          </Text>
        </Box>
        <Box display="none" hover={{ display: 'flex' }} flexShrink={0} flexDirection="row" gap="xs">
          {chip(`pm-${i.id}`, '→ Seth', HOT, false, () => toTask(i.id, 'me'))}
          {chip(`pc-${i.id}`, '→ Claude', GRAPE, false, () => toTask(i.id, 'claude'))}
          {chip(`x-${i.id}`, 'Delete', MUTED, false, () => removeItem(i.id))}
        </Box>
      </Box>
    )

    const ideasBlock = () => (
      <Box key="owner-ideas" flexDirection="column" gap="sm" width="100%">
        {heading('Ideas', 'ideas', stats.ideas, TEAL)}
        {b.ideas.length === 0 && (
          <Text color={MUTED} size="footnote">
            No ideas yet. Start one below with @idea.
          </Text>
        )}
        {b.ideas.map(s => (
          <Box
            key={`sec-${s.id}`}
            flexDirection="column"
            backgroundColor={CARD}
            borderStyle="round"
            borderColor={INK}
            paddingX={1}
            paddingY="sm"
            gap="xs"
            width="100%"
          >
            <Box flexDirection="row" justifyContent="space-between" alignItems="center" width="100%" gap="sm">
              <Box flexShrink={1} minWidth={0}>
                <Text color={TEAL} weight="bold" size="caption" wrap="truncate-end">
                  {s.name.toUpperCase()}
                </Text>
              </Box>
              <Text color={MUTED} size="caption" weight="semibold" tabular>
                {s.items.length} {s.items.length === 1 ? 'idea' : 'ideas'}
              </Text>
            </Box>
            {s.items.map(ideaRow)}
          </Box>
        ))}
      </Box>
    )

    const TAB_COLOR: Record<View, string> = { all: SUN, me: HOT, claude: GRAPE, ideas: TEAL }
    const segment = (key: View, label: string) =>
      chip(`view-${key}`, label, TAB_COLOR[key], v === key, () => update($, view, () => key))
    const doneCount = stats.me.done + stats.claude.done

    return (
      <Box flexDirection="column" gap="md" width="100%">
        <Box
          flexDirection="column"
          gap="lg"
          padding="md"
          width="100%"
          backgroundColor={PAPER}
          borderStyle="round"
          borderColor={INK}
        >
          {Svg ? (
            <Svg source={heroSvg(stats)} alt={altOf(stats)} />
          ) : (
            <Text color={INK} weight="bold">
              SHAKEDOWN to-do · {altOf(stats)}
            </Text>
          )}
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" width="100%" flexWrap="wrap" gap="xs">
            <Box flexDirection="row" gap="xs">
              {segment('all', 'All')}
              {segment('me', 'Seth')}
              {segment('claude', 'Claude')}
              {segment('ideas', 'Ideas')}
            </Box>
            <Box flexDirection="row" gap="xs">
              {chip('toggle-done', hideDone ? 'Show done' : 'Hide done', MUTED, false, () =>
                update($, isDoneHidden, x => !x),
              )}
              {doneCount > 0 &&
                chip('clear-done', `Clear ${doneCount}`, TEAL, false, () =>
                  change($, x => dropEmpty(mapItems(x, i => (i.isDone ? null : i)))),
                )}
            </Box>
          </Box>
          {OWNERS.filter(o => v === 'all' || v === o.owner).map(o => ownerBlock(o.owner, o.title, o.color))}
          {(v === 'all' || v === 'ideas') && ideasBlock()}
        </Box>
        <Input
          key={`add-${stats.me.total + stats.claude.total + stats.ideas.total}`}
          placeholder="New task  ·  Section: task  ·  @claude or @idea to route it"
          submitLabel="Add"
          value=""
          onSubmit={async value => {
            const raw = value.trim()
            if (!raw) return
            const tag = raw.match(/^@(claude|ideas?)\b\s*/i)
            const tagged = tag?.[1]?.toLowerCase()
            const owner: ListKey = tagged
              ? tagged === 'claude'
                ? 'claude'
                : 'ideas'
              : v === 'claude' || v === 'ideas'
                ? v
                : 'me'
            const { section, text } = parseEntry(tag ? raw.slice(tag[0].length) : raw)
            if (!text) return
            const now = await $.clock.now()
            await change($, x => addItems(x, owner, section, [text], now))
          }}
        />
      </Box>
    )
  })
}

type Stats = { open: number; done: number; total: number; pct: number }

function statsOf(list: Section[]): Stats {
  const total = list.reduce((n, s) => n + s.items.length, 0)
  const done = list.reduce((n, s) => n + s.items.filter(i => i.isDone).length, 0)

  return { open: total - done, done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) }
}

const altOf = (s: Record<ListKey, Stats>) =>
  `${s.me.open} open for Seth (${s.me.pct}% done), ${s.claude.open} open for Claude (${s.claude.pct}% done), ${s.ideas.total} ideas`

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// A HUD meter, as the game draws Hydration and Energy: a white track with an ink outline and a flat fill.
function meter(x: number, y: number, w: number, label: string, s: Stats, color: string): string {
  const fill = Math.max(0, ((w - 6) * s.pct) / 100)

  return (
    `<text x="${x}" y="${y + 11}" font-family="${FONT}" font-size="12" font-weight="600" fill="${INK}">${esc(label)}</text>` +
    `<rect x="${x + 62}" y="${y}" width="${w}" height="14" rx="7" fill="#ffffff" stroke="${INK}" stroke-width="2.5"/>` +
    (fill > 0 ? `<rect x="${x + 65}" y="${y + 3}" width="${fill.toFixed(1)}" height="8" rx="4" fill="${color}"/>` : '') +
    `<text x="${x + 62 + w + 8}" y="${y + 11}" font-family="${FONT}" font-size="11" font-weight="600" fill="${MUTED}">${s.done} of ${s.total}</text>`
  )
}

// The header: the game's yellow zone banner with its hard ink shadow, over two HUD meters.
function heroSvg(s: Record<ListKey, Stats>): string {
  const open = s.me.open + s.claude.open

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" width="100%">` +
    `<rect x="46" y="12" width="314" height="52" rx="12" fill="${INK}"/>` +
    `<rect x="40" y="6" width="314" height="52" rx="12" fill="${SUN}" stroke="${INK}" stroke-width="4"/>` +
    `<text x="197" y="43" text-anchor="middle" font-family="${COMIX}" font-size="30" fill="${INK}" letter-spacing="1">SHAKEDOWN to-do</text>` +
    `<text x="200" y="86" text-anchor="middle" font-family="${COMIX}" font-size="17" fill="${GRAPE}">${open} ${open === 1 ? 'thing' : 'things'} left to do · ${s.ideas.total} ${s.ideas.total === 1 ? 'idea' : 'ideas'} kept</text>` +
    meter(34, 100, 210, 'Seth', s.me, HOT) +
    meter(34, 124, 210, 'Claude', s.claude, GRAPE) +
    `</svg>`
  )
}

// A key cap's width in px: about 7px a character at 12px, plus its padding.
const chipWidth = (label: string) => Math.round(label.length * 7 + 26)

// A key cap, like the game's key hints: white with an ink outline and a hard shadow; on, filled.
function chipSvg(label: string, color: string, isOn: boolean): string {
  const w = chipWidth(label)
  const dark = isOn && (color === GRAPE || color === MUTED)

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 28" width="${w}" height="28">` +
    `<rect x="3" y="5" width="${w - 6}" height="20" rx="7" fill="${INK}"/>` +
    `<rect x="3" y="2" width="${w - 6}" height="20" rx="7" fill="${isOn ? color : '#ffffff'}" stroke="${INK}" stroke-width="2"/>` +
    `<text x="${w / 2}" y="16.4" text-anchor="middle" font-family="${FONT}" font-size="12" font-weight="700" fill="${dark ? '#ffffff' : INK}">${esc(label)}</text>` +
    `</svg>`
  )
}

// A checkbox: an ink-outlined box, filled with its list's colour and an ink tick once done.
function checkSvg(color: string, isDone: boolean): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20">` +
    `<rect x="2.5" y="2.5" width="15" height="15" rx="4.5" fill="${isDone ? color : '#ffffff'}" stroke="${INK}" stroke-width="2.5"/>` +
    (isDone
      ? `<path d="M6 10.4 L8.8 13 L14 7.2" fill="none" stroke="${color === GRAPE ? '#ffffff' : INK}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`
      : '') +
    `</svg>`
  )
}

// A list's heading: marker lettering in the list's colour, its count on the right, on a thick ink rule.
function headingSvg(title: string, owner: ListKey, s: Stats, color: string): string {
  const right = owner === 'ideas' ? `${s.total} ${s.total === 1 ? 'idea' : 'ideas'}` : `${s.open} open · ${s.pct}% done`

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="44">` +
    `<text x="0" y="28" font-family="${COMIX}" font-size="26" fill="${color}">${esc(title)}</text>` +
    `<text x="100%" y="26" text-anchor="end" font-family="${FONT}" font-size="12" font-weight="600" fill="${MUTED}">${right}</text>` +
    `<rect x="0" y="37" width="100%" height="4" rx="2" fill="${INK}"/>` +
    `</svg>`
  )
}

function widgetSvg(s: Record<ListKey, Stats>): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 92" width="100%">` +
    `<rect x="2" y="2" width="236" height="88" rx="14" fill="${PAPER}" stroke="${INK}" stroke-width="4"/>` +
    `<text x="16" y="30" font-family="${COMIX}" font-size="18" fill="${GRAPE}">SHAKEDOWN to-do</text>` +
    `<text x="16" y="62" font-family="${COMIX}" font-size="30" fill="${INK}">${s.me.open + s.claude.open}</text>` +
    `<text x="62" y="60" font-family="${FONT}" font-size="12" font-weight="600" fill="${MUTED}">left · ${s.me.open} Seth · ${s.claude.open} Claude</text>` +
    `<rect x="16" y="72" width="208" height="8" rx="4" fill="#ffffff" stroke="${INK}" stroke-width="2"/>` +
    `</svg>`
  )
}
