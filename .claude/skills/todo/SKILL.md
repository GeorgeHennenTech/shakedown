---
name: todo
description: Show or change the SHAKEDOWN to-do list (Seth's tasks and Claude's). Use when the user runs /todo, asks what is on the to-do list, or asks to add, tick, undo, reword or remove a task.
---

# The SHAKEDOWN to-do list

The list is one file: `.claude/skills/shakedown-todo/todo.json` in the project root (`~/code/shakedown`). It is the single source of truth. A panel mod beside the chat (`shakedown-todo`) draws the same file and follows edits within a few seconds, so never keep a second copy anywhere.

File shape:

```json
{
  "about": "…",
  "items": [
    { "id": 1, "who": "seth", "text": "Play the newest build", "done": false }
  ]
}
```

`who` is `"seth"` or `"claude"`. Ids are whole numbers and must be unique; a new task gets the highest id plus one. Keep the `about` line and two-space indentation. If the file is missing, create it with an empty `items` list.

## What to do

Read the file first, every time. Then, from what the user typed after `/todo` (or asked in words):

- **Nothing, or "show":** print the list (see "How to show it").
- **"add …":** add a task. It is Seth's unless the text starts with "claude:" or is plainly work for Claude (building, fixing, measuring, writing). Say which list you put it on.
- **"done …", "tick …", "finished …":** mark the matching task done. Match by id, or by the closest wording. If two tasks could match, ask which.
- **"undo …", "untick …":** mark it not done.
- **"remove …", "delete …":** take it off the list.
- **"reword … to …":** change the text, keep the id.
- **"clear done":** remove every finished task.

After any change, write the file and then show the updated list. Do not narrate the file edit.

## How to show it

Two short sections, open tasks first, finished ones after, each with its id so the user can refer to it:

```
SETH (3 to do)
☐ 1  Play the newest build and tell Claude what feels off
☐ 3  Decide: grow serum stays buyable, or earned only
☑ 2  Listen to the test track

CLAUDE (2 to do)
☐ 6  Build the table on Shakedown Street
```

Plain words, no commentary on each task. End with one line: how to change it ("Say /todo add …, /todo done 3, or just tell me").

## Keeping it honest

- When you finish something that is on Claude's list during normal work, tick it without being asked.
- When Seth asks for something "later" or you defer work, add it.
- Never tick one of Seth's tasks unless he says it is done.
