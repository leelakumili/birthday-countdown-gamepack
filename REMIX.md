# Master Game Prompit

Use this master prompt to generate or extend a Birthday Countdown Game Pack for any child, theme, and date.

> Note: filename intentionally uses `prompit` to match project naming.

---

## Table of contents

- [How to use](#how-to-use)
- [Architecture overview](#architecture-overview)
  - [Theme object structure](#theme-object-structure)
  - [How games read theme data](#how-games-read-theme-data)
  - [Rules — NEVER hardcode these in game files](#rules--never-hardcode-these-in-game-files)
- [Prompt template](#prompt-template)

---

## How to use

1. Copy the prompt template below.
2. Replace every `{{double_braces}}` field.
3. Paste into your AI coding assistant.

---

## Architecture overview

All theme data lives in **one place only**: `engine/theme-manager.js` → `FALLBACK_THEMES`.  
Games and the launcher **never hardcode** colors, emoji, strings, or titles.  
Switching themes is a single line in `config/app-config.js`:

```js
activeTheme: "transformer"  // ← change this only
```

### Theme object structure

Each theme must define **all** of these keys:

```js
{
  name:   "Display Name",
  mascot: "🤖",

  colors: {
    "bg", "surface", "surface-2", "text", "muted",
    "accent", "accent-dark", "accent-2", "danger",
    // semantic aliases (keep even if unused):
    "green-dark", "green-mid", "green-bright", "green-light", "green-pale",
    "yellow", "yellow-dark",
    "card-past", "card-today", "stripe-color"
  },

  canvas: {
    bgFill, bgStripe, bgGround, bgGroundDark, bgCloud,
    collectFill, collectDark, collectAccent,
    enemyFill,  enemyStripe,  enemyWing,
    playerBody, playerLight,  playerDark, playerAccent
  },

  icons: {
    player:  "🤖",   // player character / basket
    collect: "🔋",   // good item to catch/tap
    enemy:   "🛡️",   // bad item to avoid
    life:    "⚡",    // life indicator (repeats in HUD)
    hole:    "⚙️"    // empty cell in tap game
  },

  strings: {
    appTitle, playBtn, mascotSays, howToFallback,
    completionPrefix, completionSuffix,
    winBtn, retryBtn, resultsBtn, winMsg,
    clueTemplate,   // ← REQUIRED: prefix before the hidden clue
    bgTexture       // "circuit" | "bamboo" | "ice" | "wave"
  },

  games: {           // title shown in launcher + game badge, keyed by day id
    day1: "Energon Harvest",
    day2: "Matrix Memory",
    // ... through day10
  },

  memoryLevels:  [ /* 10 objects: { id, name, emoji, type, cols, rows, timeLimit, starMoves, badge } */ ],
  cardEmojis:    [],   // 20+ emoji for Memory Match card faces
  patternEmojis: [],   // 9  emoji for pattern-challenge grid
  catchLevels:   [ /* 10 objects: { num, target, time, speed, enemyChance, spawnRate } */ ],
  stackLevels:   [ /* 10 objects: { num, target, time, speed } */ ],
  wordleLevels:  [ /* 10 objects: { word: "THEME", hint: "..." } */ ]
}
```

---

## How games read theme data

Every game HTML file has this pattern in `<head>`:

```html
<script src="../config/app-config.js"></script>
<script src="../engine/panda-adventure.js"></script>
<script src="../engine/theme-manager.js"></script>
<script src="../engine/sounds.js"></script>
<script src="../engine/game-bridge.js"></script>

<script>
  (function () {
    var cfg = window.APP_CONFIG || null;
    if (window.PandaAdventure && window.PandaAdventure.Theme) {
      window.__activeTheme = window.PandaAdventure.Theme.applyFromConfig(cfg);
    }
  })();
</script>
<script>
  (function(){
    var t = window.__activeTheme || {};
    window.__T  = t;
    window.__TI = t.icons   || {};
    window.__TC = t.canvas  || {};
    window.__TS = t.strings || {};
  })();
</script>
```

At the bottom of `<body>`, every game has a **THEME SYNC** block:

```html
<script>
(function() {
  var t  = window.__T  || window.__activeTheme || {};
  var TI = window.__TI || t.icons   || {};
  var TS = window.__TS || t.strings || {};
  var Th = window.PandaAdventure && window.PandaAdventure.Theme;
  var mascot = t.mascot || '🎮';

  var dayId = null;
  if (window.APP_CONFIG && window.APP_CONFIG.days) {
    var path = window.location.pathname;
    for (var i=0; i<window.APP_CONFIG.days.length; i++) {
      if (path.indexOf(window.APP_CONFIG.days[i].file.replace('../games/','')) !== -1) {
        dayId = window.APP_CONFIG.days[i].id; break;
      }
    }
  }
  var gameTitle = (dayId && Th) ? Th.getGameTitle(t, dayId, document.title) : (t.name || document.title);
  document.title = gameTitle;
  var tag = document.getElementById('level-game-tag') || document.querySelector('.game-name-tag');
  if (tag) tag.textContent = gameTitle;

  ['ov-panda','win-panda','ov-emoji','level-mascot'].forEach(function(id){
    var el = document.getElementById(id); if (el) el.textContent = mascot;
  });

  var livesEl = document.getElementById('hud-lives') || document.getElementById('lives');
  if (livesEl) livesEl.textContent = (TI.life||'❤️').repeat(3);

  document.querySelectorAll('[data-btn="retry"]').forEach(function(el){ el.textContent = TS.retryBtn || 'Retry! 🔄'; });
  document.querySelectorAll('[data-btn="next"]').forEach(function(el){ el.textContent = TS.winBtn   || 'Next →'; });
  document.querySelectorAll('[data-btn="results"]').forEach(function(el){ el.textContent = TS.resultsBtn || 'See results'; });

  document.querySelectorAll('.hole:not(.active)').forEach(function(el){ el.textContent = TI.hole || '⚙️'; });

  var clueBox = document.getElementById('bday-clue-box');
  if (clueBox) { clueBox.style.background = 'var(--surface-2)'; clueBox.style.borderColor = 'var(--accent-2)'; }
  var bdayMsg = document.getElementById('bday-msg');
  if (bdayMsg) bdayMsg.style.color = 'var(--muted)';
})();
</script>
```

---

## Rules — NEVER hardcode these in game files

| What | Use instead |
|---|---|
| Life icon `❤️` | `(window.__TI.life\|\|'❤️').repeat(n)` |
| Collect emoji | `window.__TI.collect` |
| Enemy emoji | `window.__TI.enemy` |
| Player/mascot emoji | `window.__TI.player` or `t.mascot` |
| Hole cell emoji | `window.__TI.hole` |
| Canvas collect color | `window.__TC.collectFill` |
| Canvas enemy color | `window.__TC.enemyFill` |
| Canvas player color | `window.__TC.playerBody` / `playerLight` |
| Canvas background | `window.__TC.bgFill` |
| Game title in badge | `App.Theme.getGameTitle(t, dayId, fallback)` |
| Button labels | `window.__TS.retryBtn` / `winBtn` / `resultsBtn` |
| Clue prefix | `App.Theme.getString(activeTheme, "clueTemplate", "")` |
| Any hex color in inline style | `var(--accent)`, `var(--surface-2)`, etc. |
| "Panda" in display text | `t.name`, `t.mascot`, or `Th.getString(t, key)` |

---

## Prompt template

```md
You are helping me build an offline-friendly "Birthday Countdown Game Pack" for a child.

## Goal
Create a reusable framework where one game unlocks each day up to the birthday.
Keep the same overall structure/style/layout, but theme and content must be fully customized.
No colors, emoji, game titles, button labels, or clue messages may be hardcoded in game files.
All theme data lives exclusively in engine/theme-manager.js → FALLBACK_THEMES.

## Inputs
- Child name: {{child_name}}
- Child age turning: {{age_turning}}
- Birthday date (YYYY-MM-DD): {{birthday_date}}
- Countdown length in days: {{countdown_days}}
- Theme name: {{theme_name}}
- Theme characters / style notes: {{theme_notes}}
- Kid's favorite game types: {{favorite_games}}
- Difficulty: {{difficulty_level}}  (easy / medium / mixed — tune for age {{age_turning}})
- Session length target: {{session_minutes}} minutes
- Reward clue on final day: {{final_clue}}

## Theme object to implement
Add a new theme named "{{theme_name}}" to FALLBACK_THEMES with ALL required keys:
  name, mascot, colors{...}, canvas{...}, icons{...}, strings{...},
  games{day1..day10}, memoryLevels[10], cardEmojis[20], patternEmojis[9],
  catchLevels[10], stackLevels[10], wordleLevels[10]

Refer to the Architecture Overview section of REMIX.md for exact key names.

## Hard requirements
1. Works offline in any browser — no backend, no CDN calls.
2. Single-line theme switch: change activeTheme in config/app-config.js only.
3. Every game file reads icons/colors/strings from window.__TI / window.__TC / window.__TS.
4. Every game file has a THEME SYNC block at the bottom of <body>.
5. Lives HUD uses (window.__TI.life||'❤️').repeat(n) — never '❤️'.repeat(n).
6. Game name badge reads from App.Theme.getGameTitle(t, dayId, fallback).
7. Clue reveal in launcher prepends App.Theme.getString(activeTheme, "clueTemplate", "").
8. Clue-box inline styles use var(--surface-2) and var(--accent-2) not hex.
9. Mascot overlays (ov-panda, win-panda, ov-emoji) always set from t.mascot, no === '🐼' guard.
10. Kid-friendly copy tuned for age {{age_turning}}.
11. Sound effects use `App.Sounds.play(eventName)` — never inline `new Audio(...)`.
12. Keyboard input supported for every game (see README.md Keyboard input section).
13. Best scores saved via `App.State.saveBestScore(state, gameId, score)` before signalling completion.

## Emotional rhythm of the 10 days
Day 1   — warm-up action game (catch/tap)
Day 2   — memory/matching game
Day 3   — building/stacking game
Day 4   — word puzzle
Day 5   — fast-tap reflex game
Day 6   — logic puzzle (sudoku-style)
Day 7   — creative/paint game
Day 8   — Tetris/tile game
Day 9   — code-breaker / pattern challenge
Day 10  — birthday finale quest (multi-stage)

## Output sections

### A) Theme Definition
Full theme object for engine/theme-manager.js — all keys, no placeholders.

### B) Countdown Plan
Table: Day | Date | Game Name | Type | Difficulty | Placement reason.
Final day date must exactly equal {{birthday_date}}.

### C) Difficulty Tuning
catchLevels and stackLevels tuned for age {{age_turning}}.
Level 1 should be winnable in 30 seconds; level 10 should require 3+ attempts.

### D) New Theme Checklist
[ ] name and mascot
[ ] all colors{} keys including semantic aliases
[ ] all canvas{} keys
[ ] all icons{} keys (player, collect, enemy, life, hole)
[ ] all strings{} keys including clueTemplate, winMsg, retryBtn, winBtn, resultsBtn
[ ] games{} for day1..day10
[ ] memoryLevels[10] with id, name, emoji, type, cols/rows or patternLen/gridSize, timeLimit, starMoves, badge
[ ] cardEmojis[20+] and patternEmojis[9]
[ ] catchLevels[10] and stackLevels[10]
[ ] wordleLevels[10] with word and hint per level

### E) README update
Quick-start, customization steps, date-mapping explanation.
```
