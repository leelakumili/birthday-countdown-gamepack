(function (window, document) {
  var App = window.PandaAdventure = window.PandaAdventure || {};

  // ═══════════════════════════════════════════════════════════════════════════
  // THEME DEFINITIONS
  //
  // Every visual, string, icon, level name, and canvas color is defined HERE.
  // Games read window.__activeTheme at runtime — nothing is hardcoded in HTML.
  //
  // Theme structure:
  //   name          — display name
  //   mascot        — launcher header emoji
  //   colors        — CSS custom properties (all --tokens the UI uses)
  //   canvas        — colors for in-game canvas drawing (background, objects)
  //   icons         — emoji used inside games (player, collect, enemy, life, hole)
  //   strings       — all user-visible text strings
  //   cardEmojis    — emoji deck used in Memory Match card faces
  //   patternEmojis — emoji set used in Memory Match pattern challenge
  //   games         — per-day title shown in launcher (keyed by day id)
  //   memoryLevels  — 10 level definitions for Memory Match
  //   catchLevels   — 10 level definitions for Catch (difficulty tuned per theme)
  //   stackLevels   — 10 level definitions for Stack
  // ═══════════════════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────────────────
  // SHARED LEVEL TABLES
  // Panda / Penguin / Brainrot share identical difficulty curves.
  // Transformer uses its own (faster ramp). Reference these by name instead
  // of duplicating 20 identical rows across three themes.
  // ─────────────────────────────────────────────────────────────────────────
  var SHARED_CATCH_LEVELS = [
    { num:1,  target:10, time:60, speed:1.0,  enemyChance:0.20, spawnRate:52 },
    { num:2,  target:16, time:60, speed:1.15, enemyChance:0.24, spawnRate:48 },
    { num:3,  target:22, time:65, speed:1.30, enemyChance:0.28, spawnRate:44 },
    { num:4,  target:28, time:65, speed:1.45, enemyChance:0.31, spawnRate:40 },
    { num:5,  target:35, time:70, speed:1.60, enemyChance:0.34, spawnRate:36 },
    { num:6,  target:42, time:70, speed:1.75, enemyChance:0.36, spawnRate:33 },
    { num:7,  target:50, time:70, speed:1.90, enemyChance:0.38, spawnRate:30 },
    { num:8,  target:58, time:75, speed:2.05, enemyChance:0.40, spawnRate:28 },
    { num:9,  target:66, time:75, speed:2.20, enemyChance:0.42, spawnRate:26 },
    { num:10, target:75, time:80, speed:2.40, enemyChance:0.44, spawnRate:24 }
  ];

  var SHARED_STACK_LEVELS = [
    { num:1,  target:8,  time:70, speed:1.5 },
    { num:2,  target:10, time:70, speed:1.7 },
    { num:3,  target:12, time:70, speed:1.9 },
    { num:4,  target:14, time:68, speed:2.1 },
    { num:5,  target:16, time:68, speed:2.3 },
    { num:6,  target:18, time:66, speed:2.5 },
    { num:7,  target:20, time:64, speed:2.8 },
    { num:8,  target:22, time:62, speed:3.1 },
    { num:9,  target:24, time:60, speed:3.4 },
    { num:10, target:26, time:58, speed:3.8 }
  ];

  var FALLBACK_THEMES = {

    // ─────────────────────────────────────────────────────────────────────────
    transformer: {
      name:   "Cybertron Quest",
      mascot: "🤖",

      colors: {
        "bg":           "#0a0e1a",
        "surface":      "#111827",
        "surface-2":    "#1e2d45",
        "text":         "#e8f4ff",
        "muted":        "#9bb8d4",
        "accent":       "#f5c842",
        "accent-dark":  "#c9960a",
        "accent-2":     "#3b82f6",
        "danger":       "#ef4444",
        // semantic aliases (used by old --green-* references)
        "green-dark":   "#0a0e1a",
        "green-mid":    "#1e2d45",
        "green-bright": "#3b82f6",
        "green-light":  "#9bb8d4",
        "green-pale":   "#1e2d45",
        "yellow":       "#f5c842",
        "yellow-dark":  "#c9960a",
        "card-past":    "rgba(59,130,246,0.18)",
        "card-today":   "rgba(245,200,66,0.18)",
        "stripe-color": "rgba(59,130,246,0.07)"
      },

      // Canvas drawing colors (used by games' drawBg / drawObjects)
      canvas: {
        bgFill:       "#0d1b35",   // main canvas background
        bgStripe:     "rgba(59,130,246,0.06)",
        bgGround:     "#1a2d4a",
        bgGroundDark: "#0f1e30",
        bgCloud:      "rgba(180,210,255,0.18)",
        collectFill:  "#f5c842",   // good item (energon cube)
        collectDark:  "#c9960a",
        collectAccent:"#ffe066",
        enemyFill:    "#9b1c1c",   // bad item (decepticon)
        enemyStripe:  "#7f1d1d",
        enemyWing:    "rgba(255,100,100,0.55)",
        playerBody:   "#1e40af",   // player / basket
        playerLight:  "#3b82f6",
        playerDark:   "#1e3a8a",
        playerAccent: "#f5c842"
      },

      icons: {
        player:  "🤖",   // player character on basket
        collect: "🔋",   // good item to catch/tap
        enemy:   "🛡️",   // bad item to avoid
        life:    "⚡",   // life indicator
        hole:    "⚙️"    // empty hole in tap game
      },

      strings: {
        appTitle:         "Cybertron Quest",
        playBtn:          "Roll Out! 🤖",
        mascotSays:       "Optimus says",
        howToFallback:    "More than meets the eye — dive in! 🤖",
        completionPrefix: "Quest Complete!",
        completionSuffix: "at level",
        winBtn:           "Next Mission ⚡",
        retryBtn:         "Retry 🔄",
        resultsBtn:       "Mission Report 🤖",
        bgTexture:        "circuit",
        wordleInstructions: "Guess the 5-letter word in 6 tries. A green tile means correct spot, yellow means wrong spot.",
        wordleHint1:       "A powerful leader",
        wordleHint2:       "The energy source for Transformers",
        wordleHint3:       "The home planet of the Transformers",
        wordleWinTitle:    "Mission Accomplished!",
        wordleWinSub:      "You've earned your stripes!",
        wordleFailSub:     "Even the best bots have off days. Try again!"
      },

      games: {
        day1:  { title: "Energon Harvest",     clue: "Clue 1: Your first hiding spot." },
        day2:  { title: "Matrix Memory",      clue: "Clue 2: Your second hiding spot." },
        day3:  { title: "Scrapheap Stack",    clue: "Clue 3: Your third hiding spot." },
        day4:  { title: "Cyber-Words",        clue: "Clue 4: Your fourth hiding spot." },
        day5:  { title: "Energon Tap",        clue: "Clue 5: Your fifth hiding spot." },
        day6:  { title: "Vector Sudoku",      clue: "Clue 6: Your sixth hiding spot." },
        day7:  { title: "Blueprint Paint",    clue: "Clue 7: Your seventh hiding spot." },
        day8:  { title: "Alloy Tetris",        clue: "Clue 8: Your eighth hiding spot." },
        day9:  { title: "Encryption Breaker", clue: "Clue 9: Your ninth hiding spot." },
        day10: { title: "The Prime Final Quest", clue: "Final clue: Happy Birthday! Your gift is waiting 🎁" }
      },

      // Memory Match — 10 levels themed + slightly harder for smart 10yo
      memoryLevels: [
        { id:1,  name:"Boot Sequence",   emoji:"🤖", type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[12,16,20], badge:"🔌 Booting"        },
        { id:2,  name:"Energon Scan",    emoji:"🔋", type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[14,18,22], badge:"⚡ Charged"         },
        { id:3,  name:"Signal Lock",     emoji:"📡", type:"pattern", patternLen:4, gridSize:6,     starMoves:[1,2,3],    badge:"📡 Locked"          },
        { id:4,  name:"Autobot Roll",    emoji:"🚗", type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[18,22,28], badge:"🚗 Rolling"         },
        { id:5,  name:"Matrix Decode",   emoji:"💎", type:"pattern", patternLen:5, gridSize:9,     starMoves:[1,2,3],    badge:"💎 Decoded"         },
        { id:6,  name:"Cyber Sprint",    emoji:"⚡", type:"speed",   cols:4, rows:3, timeLimit:40, starMoves:[12,15,20], badge:"⚡ Speed Bot"       },
        { id:7,  name:"Twin Primes",     emoji:"🔩", type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[16,20,26], badge:"🔩 Engineer"        },
        { id:8,  name:"All Spark",       emoji:"✨", type:"pattern", patternLen:6, gridSize:9,     starMoves:[1,2,3],    badge:"✨ Sparker"         },
        { id:9,  name:"Prime Protocol",  emoji:"🔥", type:"speed",   cols:4, rows:4, timeLimit:55, starMoves:[16,20,26], badge:"🔥 Elite Bot"       },
        { id:10, name:"CYBERTRON BOSS!", emoji:"🏆", type:"memory",  cols:5, rows:4, timeLimit:0,  starMoves:[20,26,32], badge:"🏆 Prime"           }
      ],

      cardEmojis:    ["🤖","🔋","⚡","🚗","💎","📡","🔩","🛸","🌌","✨","🎯","🔐","💻","🛡️","🚀","🌟","⚙️","🔭","🏆","🎖️"],
      patternEmojis: ["🤖","🔋","⚡","🚗","💎","📡","🔩","🛸","🌌"],

      // Catch levels — tuned for smart 10yo (faster ramp, more targets needed)
      catchLevels: [
        { num:1,  target:12, time:60, speed:1.1,  enemyChance:0.18, spawnRate:50 },
        { num:2,  target:18, time:60, speed:1.25, enemyChance:0.22, spawnRate:46 },
        { num:3,  target:25, time:65, speed:1.40, enemyChance:0.26, spawnRate:42 },
        { num:4,  target:32, time:65, speed:1.55, enemyChance:0.29, spawnRate:38 },
        { num:5,  target:40, time:70, speed:1.70, enemyChance:0.32, spawnRate:34 },
        { num:6,  target:48, time:70, speed:1.88, enemyChance:0.35, spawnRate:31 },
        { num:7,  target:57, time:70, speed:2.05, enemyChance:0.37, spawnRate:28 },
        { num:8,  target:66, time:75, speed:2.22, enemyChance:0.39, spawnRate:25 },
        { num:9,  target:76, time:75, speed:2.40, enemyChance:0.41, spawnRate:23 },
        { num:10, target:88, time:80, speed:2.65, enemyChance:0.43, spawnRate:20 }
      ],

      // Stack levels — slightly harder block speed
      stackLevels: [
        { num:1,  target:8,  time:70, speed:1.6  },
        { num:2,  target:10, time:70, speed:1.85 },
        { num:3,  target:12, time:70, speed:2.1  },
        { num:4,  target:14, time:68, speed:2.35 },
        { num:5,  target:17, time:68, speed:2.6  },
        { num:6,  target:20, time:66, speed:2.9  },
        { num:7,  target:23, time:64, speed:3.2  },
        { num:8,  target:26, time:62, speed:3.55 },
        { num:9,  target:29, time:60, speed:3.9  },
        { num:10, target:33, time:58, speed:4.3  }
      ],
      wordleLevels: [
        { word: 'ROBOT', hint: 'The core form of a Transformer' },
        { word: 'PRIME', hint: 'Optimus ___' },
        { word: 'LASER', hint: 'A beam of energy used in battle' },
        { word: 'LIGHT', hint: 'The Matrix of Leadership emits this' },
        { word: 'METAL', hint: 'What most bots are made of' },
        { word: 'SMART', hint: 'Optimus is very ___' },
        { word: 'PLANE', hint: 'Starscream transforms into this' },
        { word: 'TRUCK', hint: 'Optimus transforms into this' },
        { word: 'SPARK', hint: 'The soul of a Transformer' },
        { word: 'RADIO', hint: 'Bumblebee talks through his ___' }
      ],

      mosaicLevels: [
        { num:1,  label:'Boot Sequence 🤖' }, { num:2,  label:'Energon Core 🔋' },
        { num:3,  label:'Signal Lock 📡' },   { num:4,  label:'Autobot Roll 🚗' },
        { num:5,  label:'Matrix Spark ✨' },   { num:6,  label:'Cyber King 👑' },
        { num:7,  label:'Energon Load ⚡' },   { num:8,  label:'Titan Mode 🌟' },
        { num:9,  label:'Cybertron Map 🌌' },  { num:10, label:'Prime Blueprint 🏆' }
      ],

      // Tetris / mosaic piece colors (indices 1-7 match SHAPES I O T L J S Z)
      mosaicColors: [null,'#f5c842','#3b82f6','#ef4444','#f97316','#06d6a0','#8b5cf6','#60a5fa'],

      // Confetti burst colors
      confettiColors: ['#f5c842','#3b82f6','#ef4444','#60a5fa','#f97316','#a78bfa','#06d6a0','#fbbf24'],

      // Paint-by-numbers completion messages [unused, 1-star, 2-star, 3-star]
      paintMessages: ['','Good start, Autobot artist! ⚙️','Your circuits are creative! 🤖','Optimus would hang this in the Ark! ⚡'],

      // Birthday Quest stage strings
      quest: {
        stage1Title:  'Mission Briefing',
        stage1PathA:  'Route Alpha ⚡',
        stage1PathB:  'Route Beta 🔧',
        stage1Trap:   'Decepticon trap! Lose an Energon cube. Try Route Alpha!',
        stage2Title:  'Autobot Code Gate',
        stage3Title:  'Energon Turbo Tap',
        stage3BtnText:'⚡ CHARGE! 🤖',
        finishText:   '⚡ Happy Birthday, Superstar! ⚡'
      },

      // Draw player/collect/enemy as canvas vectors instead of emoji
      useVectorGraphics: true
    },

    // ─────────────────────────────────────────────────────────────────────────
    panda: {
      name:   "Panda Adventure",
      mascot: "🐼",

      colors: {
        "bg":           "#0f2c1f",
        "surface":      "#1a3c2a",
        "surface-2":    "#24543c",
        "text":         "#ffffff",
        "muted":        "#c6e9d6",
        "accent":       "#ffd166",
        "accent-dark":  "#c9960a",
        "accent-2":     "#52b788",
        "danger":       "#ef476f",
        "green-dark":   "#1a3c2a",
        "green-mid":    "#2d6a4f",
        "green-bright": "#52b788",
        "green-light":  "#b7e4c7",
        "green-pale":   "#d8f3dc",
        "yellow":       "#ffd166",
        "yellow-dark":  "#c9960a",
        "card-past":    "rgba(82,183,136,0.18)",
        "card-today":   "rgba(255,209,102,0.18)",
        "stripe-color": "rgba(82,183,136,0.06)"
      },

      canvas: {
        bgFill:       "#c8e6c9",
        bgStripe:     "rgba(46,125,50,0.06)",
        bgGround:     "#a5d6a7",
        bgGroundDark: "#81c784",
        bgCloud:      "rgba(255,255,255,0.5)",
        collectFill:  "#4CAF50",
        collectDark:  "#388E3C",
        collectAccent:"#81C784",
        enemyFill:    "#F4C430",
        enemyStripe:  "#2a2a2a",
        enemyWing:    "rgba(210,235,255,0.75)",
        playerBody:   "#8B5E3C",
        playerLight:  "#A0714F",
        playerDark:   "#6D4C2A",
        playerAccent: "#ffd166"
      },

      icons: {
        player:  "🐼",
        collect: "🎋",
        enemy:   "🐝",
        life:    "❤️",
        hole:    "🌿"
      },

      strings: {
        appTitle:         "Panda Adventure Game Pack",
        playBtn:          "Play Now! 🐼",
        mascotSays:       "Panda says",
        howToFallback:    "Hop in and learn as you go! 🐼",
        completionPrefix: "Amazing! Score",
        completionSuffix: "at level",
        winBtn:           "Next Level 🎋",
        retryBtn:         "Try Again 🐼",
        resultsBtn:       "See my results 🐼",
        bgTexture:        "bamboo",
        wordleInstructions: "Guess the 5-letter word in 6 tries. A green tile means correct spot, yellow means wrong spot.",
        wordleHint1:       "A fluffy forest friend",
        wordleHint2:       "What a playful cub loves",
        wordleHint3:       "Leader of the pack",
        wordleWinTitle:    "Panda-tastic!",
        wordleWinSub:      "You've got a sharp mind!",
        wordleFailSub:     "Even the best climbers fall sometimes. Try again!"
      },

      games: {
        day1:  { title: "Panda Catch",          clue: "Clue 1: Your first hiding spot." },
        day2:  { title: "Panda Memory",         clue: "Clue 2: Your second hiding spot." },
        day3:  { title: "Panda Stack",          clue: "Clue 3: Your third hiding spot." },
        day4:  { title: "Panda Wordle",         clue: "Clue 4: Your fourth hiding spot." },
        day5:  { title: "Bamboo Tap",           clue: "Clue 5: Your fifth hiding spot." },
        day6:  { title: "Panda Sudoku",         clue: "Clue 6: Your sixth hiding spot." },
        day7:  { title: "Panda Paint By Number",clue: "Clue 7: Your seventh hiding spot." },
        day8:  { title: "Panda Tetris",         clue: "Clue 8: Your eighth hiding spot." },
        day9:  { title: "Panda Code Breaker",   clue: "Clue 9: Your ninth hiding spot." },
        day10: { title: "Panda Birthday Quest", clue: "Final clue: Happy Birthday! Your gift is waiting 🎁" }
      },

      memoryLevels: [
        { id:1,  name:"Baby Panda",    emoji:"🐼", type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[10,14,18], badge:"🐣 Hatchling"   },
        { id:2,  name:"Bamboo Forest", emoji:"🎋", type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[12,16,20], badge:"🌱 Sprout"       },
        { id:3,  name:"Panda Nap",     emoji:"😴", type:"pattern", patternLen:3, gridSize:6,     starMoves:[1,2,3],    badge:"💤 Snoozer"      },
        { id:4,  name:"Bamboo Munch",  emoji:"🍀", type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[16,20,26], badge:"🌿 Muncher"      },
        { id:5,  name:"Panda Play",    emoji:"🎪", type:"pattern", patternLen:4, gridSize:9,     starMoves:[1,2,3],    badge:"🎭 Performer"    },
        { id:6,  name:"Panda Sprint",  emoji:"⚡", type:"speed",   cols:4, rows:3, timeLimit:45, starMoves:[10,13,18], badge:"⚡ Speed Panda"  },
        { id:7,  name:"Twin Pandas",   emoji:"👫", type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[14,18,24], badge:"👫 Twin"         },
        { id:8,  name:"Panda Dancer",  emoji:"💃", type:"pattern", patternLen:5, gridSize:9,     starMoves:[1,2,3],    badge:"💃 Dancer"       },
        { id:9,  name:"Speed Demon",   emoji:"🔥", type:"speed",   cols:4, rows:4, timeLimit:60, starMoves:[14,18,24], badge:"🔥 Fire Panda"   },
        { id:10, name:"BOSS LEVEL!",   emoji:"🏆", type:"memory",  cols:5, rows:4, timeLimit:0,  starMoves:[18,22,28], badge:"🏆 Panda Master" }
      ],

      cardEmojis:    ["🐼","🎋","🐾","🌸","🍃","🌿","🎍","🐨","🌙","🦋","🍎","🍓","🍊","🍋","🍇","🎪","⭐","🌺","🌻","🌼"],
      patternEmojis: ["🐼","🎋","🌸","🐾","⭐","🍃","🌿","🎍","🌙"],

      catchLevels: SHARED_CATCH_LEVELS,
      stackLevels: SHARED_STACK_LEVELS,
      wordleLevels: [
        { word: 'PANDA', hint: 'A fluffy forest friend 🐼' },
        { word: 'FRUIT', hint: 'What a playful cub loves 🍎' },
        { word: 'CLIMB', hint: 'Something young pandas practice' },
        { word: 'SLEEP', hint: 'What pandas do most of the day' },
        { word: 'GREEN', hint: 'The color of a healthy forest' },
        { word: 'SMART', hint: 'Exactly what you are!' },
        { word: 'PARTY', hint: 'A big birthday celebration' },
        { word: 'HAPPY', hint: 'How birthdays should feel' },
        { word: 'BLACK', hint: 'One of the colors on a panda' },
        { word: 'WHITE', hint: 'The other color on a panda' }
      ],

      mosaicLevels: [
        { num:1,  label:'Baby Panda 🐼' },    { num:2,  label:'Bamboo Snack 🎋' },
        { num:3,  label:'Panda Nap 😴' },      { num:4,  label:'Forest Roam 🌿' },
        { num:5,  label:'Panda Dance 🎪' },    { num:6,  label:'Bamboo King 🏆' },
        { num:7,  label:'Twin Pandas 👫' },    { num:8,  label:'Moonlit Grove 🌙' },
        { num:9,  label:'Speed Panda ⚡' },    { num:10, label:'Panda Master 🏆' }
      ],

      mosaicColors: [null,'#4CAF50','#ffd166','#ef476f','#52b788','#a2d2ff','#b7e4c7','#95d5b2'],
      confettiColors: ['#ffd166','#52b788','#ef476f','#4CAF50','#b7e4c7','#a2d2ff','#ffd166','#81C784'],
      paintMessages: ['','Nice colors, little panda! 🎋','A very zen painting! 🐼','The most beautiful bamboo in the forest! 🎋🏆'],
      quest: {
        stage1Title:  'The Journey Begins',
        stage1PathA:  'Safe Path ❤️',
        stage1PathB:  'Shortcut 🌿',
        stage1Trap:   '🐼 found a prickly bush! Try the other path!',
        stage2Title:  'Logic Gate',
        stage3Title:  'Panda Celebration',
        stage3BtnText:'🐼 DANCE! ✨',
        finishText:   '🎂 Happy Birthday! 🎈'
      }
    },

    // ─────────────────────────────────────────────────────────────────────────
    penguin: {
      name:   "Penguin Adventure",
      mascot: "🐧",

      colors: {
        "bg":           "#0e1b2e",
        "surface":      "#162a46",
        "surface-2":    "#22406b",
        "text":         "#eef7ff",
        "muted":        "#bdd3eb",
        "accent":       "#8ecae6",
        "accent-dark":  "#2a7c9e",
        "accent-2":     "#219ebc",
        "danger":       "#ff6b6b",
        "green-dark":   "#0e1b2e",
        "green-mid":    "#1a3550",
        "green-bright": "#219ebc",
        "green-light":  "#bdd3eb",
        "green-pale":   "#162a46",
        "yellow":       "#8ecae6",
        "yellow-dark":  "#2a7c9e",
        "card-past":    "rgba(33,158,188,0.18)",
        "card-today":   "rgba(142,202,230,0.18)",
        "stripe-color": "rgba(142,202,230,0.06)"
      },

      canvas: {
        bgFill:       "#b3d9ee",
        bgStripe:     "rgba(33,158,188,0.06)",
        bgGround:     "#8ecae6",
        bgGroundDark: "#219ebc",
        bgCloud:      "rgba(255,255,255,0.6)",
        collectFill:  "#ffb703",
        collectDark:  "#c9960a",
        collectAccent:"#ffd166",
        enemyFill:    "#e63946",
        enemyStripe:  "#9d0208",
        enemyWing:    "rgba(255,200,200,0.6)",
        playerBody:   "#023047",
        playerLight:  "#219ebc",
        playerDark:   "#01151f",
        playerAccent: "#8ecae6"
      },

      icons: {
        player:  "🐧",
        collect: "🐟",
        enemy:   "🦈",
        life:    "❄️",
        hole:    "🧊"
      },

      strings: {
        appTitle:         "Penguin Adventure Game Pack",
        playBtn:          "Waddle In! 🐧",
        mascotSays:       "Penguin says",
        howToFallback:    "Waddle in and figure it out! 🐧",
        completionPrefix: "Iceberg cleared! Score",
        completionSuffix: "at level",
        winBtn:           "Next Level 🐟",
        retryBtn:         "Try Again 🐧",
        resultsBtn:       "See my results 🐧",
        bgTexture:        "ice",
        wordleInstructions: "Guess the 5-letter word in 6 tries. A green tile means correct spot, yellow means wrong spot.",
        wordleHint1:       "A bird that cannot fly",
        wordleHint2:       "What penguins love to eat",
        wordleHint3:       "The frozen edge of the world",
        wordleWinTitle:    "Ice Cold Victory!",
        wordleWinSub:      "You're a cool thinker!",
        wordleFailSub:     "Slide back and try once more!"
      },

      games: {
        day1:  { title: "Fish Catch",           clue: "Clue 1: Your first hiding spot." },
        day2:  { title: "Ice Memory",           clue: "Clue 2: Your second hiding spot." },
        day3:  { title: "Iceberg Stack",        clue: "Clue 3: Your third hiding spot." },
        day4:  { title: "Penguin Wordle",       clue: "Clue 4: Your fourth hiding spot." },
        day5:  { title: "Fish Tap",             clue: "Clue 5: Your fifth hiding spot." },
        day6:  { title: "Arctic Sudoku",        clue: "Clue 6: Your sixth hiding spot." },
        day7:  { title: "Penguin Paint",        clue: "Clue 7: Your seventh hiding spot." },
        day8:  { title: "Ice Tetris",           clue: "Clue 8: Your eighth hiding spot." },
        day9:  { title: "Igloo Breaker",        clue: "Clue 9: Your ninth hiding spot." },
        day10: { title: "Penguin Birthday Quest", clue: "Final clue: Happy Birthday! Your gift is waiting 🎁" }
      },
      memoryLevels: [
        { id:1,  name:"Baby Penguin",  emoji:"🐧", type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[10,14,18], badge:"🐣 Hatchling"   },
        { id:2,  name:"Ice Shelf",     emoji:"🧊", type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[12,16,20], badge:"🧊 Slider"      },
        { id:3,  name:"Deep Dive",     emoji:"🌊", type:"pattern", patternLen:3, gridSize:6,     starMoves:[1,2,3],    badge:"🌊 Diver"       },
        { id:4,  name:"Fish Snack",    emoji:"🐟", type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[16,20,26], badge:"🐟 Hunter"      },
        { id:5,  name:"Arctic Wind",   emoji:"🌬️", type:"pattern", patternLen:4, gridSize:9,     starMoves:[1,2,3],    badge:"🌬️ Blizzard"    },
        { id:6,  name:"Sled Race",     emoji:"🛷", type:"speed",   cols:4, rows:3, timeLimit:45, starMoves:[10,13,18], badge:"🛷 Racer"       },
        { id:7,  name:"Polar Pair",    emoji:"🐻", type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[14,18,24], badge:"🐻 Friend"      },
        { id:8,  name:"Aurora Dance",  emoji:"🌌", type:"pattern", patternLen:5, gridSize:9,     starMoves:[1,2,3],    badge:"✨ Sky Gazer"   },
        { id:9,  name:"Snow Sprint",   emoji:"❄️", type:"speed",   cols:4, rows:4, timeLimit:60, starMoves:[14,18,24], badge:"❄️ Snowmaster"  },
        { id:10, name:"ICEBERG BOSS!",  emoji:"🏔️", type:"memory",  cols:5, rows:4, timeLimit:0,  starMoves:[18,22,28], badge:"👑 Ice King"    }
      ],
      cardEmojis:    ["🐧","🐟","🦈","❄️","🧊","🌨️","⛄","🛷","🏔️","🐋","🚢","⚓","🧥","🧤","🧣","🌫️","🌌","🌬️","🐻","🌊"],
      patternEmojis: ["🐧","🐟","❄️","🧊","🏔️","🌌","🌬️","🐻","🛷"],
      catchLevels: SHARED_CATCH_LEVELS,
      stackLevels: SHARED_STACK_LEVELS,
      wordleLevels: [
        { word: 'FROST', hint: 'What covers the ice each morning' },
        { word: 'FLOES', hint: 'Floating sheets of sea ice' },
        { word: 'CHILL', hint: 'The feeling of arctic air' },
        { word: 'SLEET', hint: 'Freezing rain mixed with snow' },
        { word: 'DRIFT', hint: 'A pile of wind-blown snow' },
        { word: 'OCEAN', hint: 'The vast sea where penguins swim' },
        { word: 'SLIDE', hint: 'How penguins travel on ice' },
        { word: 'DEPTH', hint: 'How far down a penguin can dive' },
        { word: 'BRISK', hint: 'Cold and refreshing arctic air' },
        { word: 'POLAR', hint: 'Relating to the North or South Pole' }
      ],
      mosaicLevels: [
        { num:1,  label:'Tiny Egg 🥚' },       { num:2,  label:'Baby Chick 🐣' },
        { num:3,  label:'Snow Slide ⛸️' },      { num:4,  label:'Deep Dive 🐟' },
        { num:5,  label:'Frosty Guard ❄️' },    { num:6,  label:'Southern Star 🌟' },
        { num:7,  label:'Iceberg Peak 🏔️' },    { num:8,  label:'Aurora Sky 🌌' },
        { num:9,  label:'Blizzard Dance 🌨️' },  { num:10, label:'Penguin King 👑' }
      ],
      sudokuLevels: { easy: 'Slurry', medium: 'Frosty', hard: 'Blizzard' },
      mosaicColors: [null,'#8ecae6','#219ebc','#ffffff','#023047','#a8dadc','#457b9d','#1d3557'],
      confettiColors: ['#8ecae6','#ffb703','#219ebc','#ffffff','#023047','#a8dadc','#457b9d','#ffd166'],
      paintMessages: ['','Nice start, little penguin! ❄️','A cool piece of art! 🐧','A true Arctic masterpiece! 🏔️🏆'],
      quest: {
        stage1Title:  'The Ice Journey',
        stage1PathA:  'Safe Floe ❄️',
        stage1PathB:  'Shortcut 🧊',
        stage1Trap:   '🐧 slipped on thin ice! Try the other path!',
        stage2Title:  'Ice Code Gate',
        stage3Title:  'Penguin Celebration',
        stage3BtnText:'🐧 WADDLE! ✨',
        finishText:   '🎂 Happy Birthday! 🎈'
      }
    },

    // ─────────────────────────────────────────────────────────────────────────
    brainrot: {
      name:   "Roblox Brainrot",
      mascot: "🦍",

      colors: {
        "bg":           "#0a4b75",
        "surface":      "#11659c",
        "surface-2":    "#1a82c2",
        "text":         "#ffffff",
        "muted":        "#a4d8f0",
        "accent":       "#fbc02d",
        "accent-dark":  "#f9a825",
        "accent-2":     "#ff4d85",
        "danger":       "#ff5252",
        "green-dark":   "#0a4b75",
        "green-mid":    "#ff4d85",
        "green-bright": "#ff75a0",
        "green-light":  "#ffd1e3",
        "green-pale":   "#06304d",
        "yellow":       "#fbc02d",
        "yellow-dark":  "#f9a825",
        "card-past":    "rgba(255,77,133,0.15)",
        "card-today":   "rgba(251,192,45,0.15)",
        "stripe-color": "rgba(255,255,255,0.05)"
      },

      canvas: {
        bgFill:       "#0a4b75",
        bgStripe:     "rgba(255,255,255,0.05)",
        bgGround:     "#11659c",
        bgGroundDark: "#06304d",
        bgCloud:      "rgba(255,255,255,0.1)",
        collectFill:  "#fbc02d",
        collectDark:  "#f9a825",
        collectAccent:"#ffee58",
        enemyFill:    "#8c9eff",
        enemyStripe:  "#536dfe",
        enemyWing:    "rgba(140,158,255,0.5)",
        playerBody:   "#ffb74d",
        playerLight:  "#ffcc80",
        playerDark:   "#f57c00",
        playerAccent: "#ff9800"
      },

      icons: {
        player:  "🦍",
        collect: "🍌",
        enemy:   "🦈",
        life:    "👟",
        hole:    "💀"
      },

      strings: {
        appTitle:         "Roblox Brainrot Countdown",
        playBtn:          "LET'S GOOO! 💎",
        mascotSays:       "Sigma says",
        howToFallback:    "No cap, just vibe and win fr fr 🧠",
        completionPrefix: "MAX AURA! Score",
        completionSuffix: "at level",
        winBtn:           "Next Win ⚡",
        retryBtn:         "Try Again 💀",
        resultsBtn:       "Check the Aura 🧠",
        bgTexture:        "wave"
      },

      games: {
        day1:  { title: "Coin Collector",       clue: "Clue 1: Your first hiding spot." },
        day2:  { title: "Meme Match",           clue: "Clue 2: Your second hiding spot." },
        day3:  { title: "Sigma Stack",          clue: "Clue 3: Your third hiding spot." },
        day4:  { title: "Slang Words",          clue: "Clue 4: Your fourth hiding spot." },
        day5:  { title: "Rizz Tap",             clue: "Clue 5: Your fifth hiding spot." },
        day6:  { title: "Ohio Sudoku",          clue: "Clue 6: Your sixth hiding spot." },
        day7:  { title: "Brainrot Paint",       clue: "Clue 7: Your seventh hiding spot." },
        day8:  { title: "Bloxy Tiles",          clue: "Clue 8: Your eighth hiding spot." },
        day9:  { title: "Aura Code",            clue: "Clue 9: Your ninth hiding spot." },
        day10: { title: "The Final Showdown",   clue: "Final clue: Happy Birthday! Your gift is waiting 🎁" }
      },
      memoryLevels: [
        { id:1,  name:"Baby Noob 🧱",   emoji:"🧱", type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[10,14,18], badge:"🧱 Noob"        },
        { id:2,  name:"Bacon Path 🥓",  emoji:"🥓", type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[12,16,20], badge:"🥓 Bacon"       },
        { id:3,  name:"Guest Rizz 👤",   emoji:"👤", type:"pattern", patternLen:3, gridSize:6,     starMoves:[1,2,3],    badge:"👤 Guest"       },
        { id:4,  name:"Robux Pro 💎",   emoji:"💎", type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[16,20,26], badge:"💎 Rich"        },
        { id:5,  name:"Brook Haven 🏡",  emoji:"🏡", type:"pattern", patternLen:4, gridSize:9,     starMoves:[1,2,3],    badge:"🏡 Resident"    },
        { id:6,  name:"Speed Blox ⚡",   emoji:"⚡", type:"speed",   cols:4, rows:3, timeLimit:45, starMoves:[10,13,18], badge:"⚡ Fast"        },
        { id:7,  name:"Pizza Tax 🍕",    emoji:"🍕", type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[14,18,24], badge:"🍕 Work"        },
        { id:8,  name:"Obby Master 🏁",  emoji:"🏁", type:"pattern", patternLen:5, gridSize:9,     starMoves:[1,2,3],    badge:"🏁 Winner"      },
        { id:9,  name:"Sigma Blox 🔥",   emoji:"🔥", type:"speed",   cols:4, rows:4, timeLimit:60, starMoves:[14,18,24], badge:"🔥 Ultra"       },
        { id:10, name:"ROBLOX BOSS! 👑", emoji:"👑", type:"memory",  cols:5, rows:4, timeLimit:0,  starMoves:[18,22,28], badge:"👑 God"         }
      ],
      mosaicLevels: [
        { num:1, label:'Bacon Hair 🥓' }, { num:2, label:'Noob Skin 🧱' },
        { num:3, label:'Guest Mode 👤' }, { num:4, label:'Robux Flex 💎' },
        { num:5, label:'Sigma Roblox 🗿' }, { num:6, label:'Max Aura 👑' },
        { num:7, label:'Blox Fruit 🍎' }, { num:8, label:'Pet Sim 🥚' },
        { num:9, label:'Adopt Me 🐶' }, { num:10, label:'Dominus 👑' }
      ],
      sudokuLevels: { easy: 'Noob', medium: 'Bacon', hard: 'Sigma' },
      cardEmojis:    ["🧱","🥓","👤","💎","🏡","⚡","🍕","🏁","🔥","👑","🍎","🥚","🐶","🎒","👕","🛠️","🎮","👾","🧱","🔥"],
      patternEmojis: ["🧱","🥓","💎","👑","🔥","💯","🗿"],
      catchLevels: SHARED_CATCH_LEVELS,
      stackLevels: SHARED_STACK_LEVELS,
      wordleLevels: [
        { word: 'SIGMA', hint: 'Top-tier personality type' },
        { word: 'GRIND', hint: 'Never stop the ___' },
        { word: 'SKILL', hint: 'Earned, never given' },
        { word: 'RATIO', hint: 'When replies > likes' },
        { word: 'BASED', hint: 'Agreeing with confidence' },
        { word: 'FACTS', hint: 'No cap, just ___' },
        { word: 'VIBES', hint: 'The energy you carry' },
        { word: 'SAUCE', hint: 'Dripping with it' },
        { word: 'SLANG', hint: 'Internet speak, no cap' },
        { word: 'GOATS', hint: 'Greatest of all time (plural)' }
      ],
      mosaicColors: [null,'#fbc02d','#ff4d85','#8c9eff','#ff6b6b','#00e5ff','#b388ff','#69f0ae'],
      confettiColors: ['#fbc02d','#ff4d85','#8c9eff','#ff6b6b','#00e5ff','#b388ff','#69f0ae','#ffee58'],
      paintMessages: ['','No cap, that\'s fire! 🔥','Sheesh, you ate that! 💅','GOATED with the sauce! 🏆'],
      quest: {
        stage1Title:  'The Sigma Mission',
        stage1PathA:  'Sigma Path 💪',
        stage1PathB:  'Rizz Shortcut 💀',
        stage1Trap:   'Nah bro, big L! Try the sigma path!',
        stage2Title:  'Brainrot Code Gate',
        stage3Title:  'Sigma Celebration',
        stage3BtnText:'🦍 RIZZ UP! ✨',
        finishText:   '🎂 Happy Birthday, no cap! 🎈'
      }
    },

    // ─────────────────────────────────────────────────────────────────────────
    pirate: {
      name:   "Pirate Treasure Quest",
      mascot: "🏴‍☠️",

      colors: {
        "bg":           "#0a1628",
        "surface":      "#12253f",
        "surface-2":    "#1c3558",
        "text":         "#f0e6c8",
        "muted":        "#a8bdd4",
        "accent":       "#f5c518",
        "accent-dark":  "#c99b0a",
        "accent-2":     "#e8834a",
        "danger":       "#e63946",
        "green-dark":   "#0a1628",
        "green-mid":    "#1c3558",
        "green-bright": "#f5c518",
        "green-light":  "#f0e6c8",
        "green-pale":   "#12253f",
        "yellow":       "#f5c518",
        "yellow-dark":  "#c99b0a",
        "card-past":    "rgba(245,197,24,0.15)",
        "card-today":   "rgba(232,131,74,0.18)",
        "stripe-color": "rgba(245,197,24,0.06)"
      },

      canvas: {
        bgFill:       "#0d2040",
        bgStripe:     "rgba(30,80,140,0.15)",
        bgGround:     "#163560",
        bgGroundDark: "#0a1e3a",
        bgCloud:      "rgba(200,220,255,0.18)",
        collectFill:  "#f5c518",
        collectDark:  "#c99b0a",
        collectAccent:"#ffe566",
        enemyFill:    "#2a7ab5",
        enemyStripe:  "#1a5a8a",
        enemyWing:    "rgba(80,160,220,0.55)",
        playerBody:   "#8b4513",
        playerLight:  "#a0522d",
        playerDark:   "#6b340f",
        playerAccent: "#f5c518"
      },

      icons: {
        player:  "🏴‍☠️",
        collect: "🪙",
        enemy:   "🦈",
        life:    "⚓",
        hole:    "💀"
      },

      strings: {
        appTitle:         "Pirate Treasure Quest",
        playBtn:          "Set Sail! 🏴‍☠️",
        mascotSays:       "Captain says",
        howToFallback:    "Ahoy! Dive in and find the treasure! 🏴‍☠️",
        completionPrefix: "Treasure Found! Score",
        completionSuffix: "at level",
        winBtn:           "Next Voyage ⚓",
        retryBtn:         "Try Again 🏴‍☠️",
        resultsBtn:       "Check the Map 🗺️",
        bgTexture:        "wave",
        wordleInstructions: "Guess the 5-letter word in 6 tries. A green tile means correct spot, yellow means wrong spot.",
        wordleHint1:       "Pirates hide their gold here",
        wordleHint2:       "Cross this with a blade",
        wordleHint3:       "Walk the ___",
        wordleWinTitle:    "X Marks the Spot!",
        wordleWinSub:      "Ye be a sharp pirate mind!",
        wordleFailSub:     "Even Davy Jones had bad days. Try again!"
      },

      games: {
        day1:  { title: "Treasure Catch",          clue: "Clue 1: Your first hiding spot." },
        day2:  { title: "Pirate Memory",           clue: "Clue 2: Your second hiding spot." },
        day3:  { title: "Cannon Stack",            clue: "Clue 3: Your third hiding spot." },
        day4:  { title: "Sea-Words",               clue: "Clue 4: Your fourth hiding spot." },
        day5:  { title: "Doubloon Tap",            clue: "Clue 5: Your fifth hiding spot." },
        day6:  { title: "Captain's Sudoku",        clue: "Clue 6: Your sixth hiding spot." },
        day7:  { title: "Treasure Map Paint",      clue: "Clue 7: Your seventh hiding spot." },
        day8:  { title: "Kraken Tetris",           clue: "Clue 8: Your eighth hiding spot." },
        day9:  { title: "Code Breaker's Chest",    clue: "Clue 9: Your ninth hiding spot." },
        day10: { title: "The Final Treasure Quest", clue: "Final clue: Happy Birthday! Your gift is waiting 🎁" }
      },

      memoryLevels: [
        { id:1,  name:"Landlubber",      emoji:"🏴‍☠️", type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[10,14,18], badge:"⚓ Landlubber"   },
        { id:2,  name:"Deck Hand",       emoji:"🪙",    type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[12,16,20], badge:"🪙 Deck Hand"     },
        { id:3,  name:"Map Reader",      emoji:"🗺️",   type:"pattern", patternLen:3, gridSize:6,     starMoves:[1,2,3],    badge:"🗺️ Navigator"     },
        { id:4,  name:"Salty Sea Dog",   emoji:"🦈",    type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[16,20,26], badge:"🦈 Sea Dog"        },
        { id:5,  name:"Treasure Seeker", emoji:"💎",    type:"pattern", patternLen:4, gridSize:9,     starMoves:[1,2,3],    badge:"💎 Seeker"         },
        { id:6,  name:"Crow's Nest",     emoji:"⚡",    type:"speed",   cols:4, rows:3, timeLimit:45, starMoves:[10,13,18], badge:"🔭 Lookout"        },
        { id:7,  name:"First Mate",      emoji:"⚔️",   type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[14,18,24], badge:"⚔️ First Mate"    },
        { id:8,  name:"Kraken Tamer",    emoji:"🐙",    type:"pattern", patternLen:5, gridSize:9,     starMoves:[1,2,3],    badge:"🐙 Kraken Tamer"  },
        { id:9,  name:"Captain's Dare",  emoji:"🔥",    type:"speed",   cols:4, rows:4, timeLimit:60, starMoves:[14,18,24], badge:"🔥 Daring Cap'n"  },
        { id:10, name:"PIRATE BOSS!",    emoji:"🏆",    type:"memory",  cols:5, rows:4, timeLimit:0,  starMoves:[18,22,28], badge:"🏆 Pirate King"   }
      ],

      cardEmojis:    ["🏴‍☠️","🪙","⚓","🗺️","🦈","⚔️","🐙","💎","🔭","🏝️","🦜","🛶","🌊","🔱","💀","🎯","🧭","⛵","🌟","🍾"],
      patternEmojis: ["🏴‍☠️","🪙","⚓","🗺️","🦈","⚔️","💎","🔭","🏝️"],

      catchLevels: SHARED_CATCH_LEVELS,
      stackLevels: SHARED_STACK_LEVELS,

      wordleLevels: [
        { word: 'CHEST', hint: 'Pirates store their treasure here' },
        { word: 'SWORD', hint: 'A pirate\'s trusty blade' },
        { word: 'PLANK', hint: 'Walk the ___' },
        { word: 'OCEAN', hint: 'The vast sea around you' },
        { word: 'WAVES', hint: 'The sea rises and falls in ___' },
        { word: 'COINS', hint: 'Gold doubloons, pieces of eight' },
        { word: 'SAILS', hint: 'The ship catches wind in its ___' },
        { word: 'MASTS', hint: 'Tall poles holding the sails' },
        { word: 'SHARK', hint: 'The ocean\'s most feared hunter' },
        { word: 'CREWS', hint: 'A captain\'s loyal sailors' }
      ],

      mosaicLevels: [
        { num:1,  label:'Jolly Roger 🏴‍☠️' }, { num:2,  label:'Gold Coin 🪙' },
        { num:3,  label:'Anchor Drop ⚓' },    { num:4,  label:'Treasure Map 🗺️' },
        { num:5,  label:'Shark Attack 🦈' },   { num:6,  label:'Sword Fight ⚔️' },
        { num:7,  label:'Kraken Rise 🐙' },    { num:8,  label:'Buried Gems 💎' },
        { num:9,  label:'Island Found 🏝️' },   { num:10, label:'Pirate King 🏆' }
      ],

      sudokuLevels: { easy: 'Landlubber', medium: 'Buccaneer', hard: 'Pirate King' },
      mosaicColors: [null,'#f5c518','#e63946','#1d3557','#a8dadc','#457b9d','#e07a5f','#81b29a'],
      confettiColors: ['#f5c518','#e63946','#a8dadc','#f0e6c8','#457b9d','#e07a5f','#ffe566','#2a9d8f'],
      paintMessages: ['','Not bad, landlubber! ⚓','A fine treasure map! 🗺️','X marks the masterpiece! 🏴‍☠️🏆'],
      quest: {
        stage1Title:  'The Voyage Begins',
        stage1PathA:  'Safe Waters ⚓',
        stage1PathB:  'Shortcut 💀',
        stage1Trap:   '🏴‍☠️ hit a reef! Try the safe waters!',
        stage2Title:  'Pirate Code Chest',
        stage3Title:  'Treasure Celebration',
        stage3BtnText:'🏴‍☠️ YO HO! ✨',
        finishText:   '🎂 Happy Birthday, matey! 🎈'
      }
    },

    // ─────────────────────────────────────────────────────────────────────────
    dino: {
      name:   "Dino Adventure",
      mascot: "🦕",

      colors: {
        "bg":           "#1a3320",
        "surface":      "#243d28",
        "surface-2":    "#305535",
        "text":         "#f0f7ee",
        "muted":        "#b2d4b8",
        "accent":       "#f59e0b",
        "accent-dark":  "#b45309",
        "accent-2":     "#84cc16",
        "danger":       "#ef4444",
        "green-dark":   "#1a3320",
        "green-mid":    "#305535",
        "green-bright": "#84cc16",
        "green-light":  "#d1fae5",
        "green-pale":   "#243d28",
        "yellow":       "#f59e0b",
        "yellow-dark":  "#b45309",
        "card-past":    "rgba(132,204,22,0.15)",
        "card-today":   "rgba(245,158,11,0.18)",
        "stripe-color": "rgba(74,155,74,0.08)"
      },

      canvas: {
        bgFill:       "#2d5a27",
        bgStripe:     "rgba(60,120,60,0.12)",
        bgGround:     "#3d7a35",
        bgGroundDark: "#1e4018",
        bgCloud:      "rgba(220,255,220,0.25)",
        collectFill:  "#f3d06a",
        collectDark:  "#c9960a",
        collectAccent:"#ffe59a",
        enemyFill:    "#b45309",
        enemyStripe:  "#92400e",
        enemyWing:    "rgba(200,100,30,0.55)",
        playerBody:   "#6b9c3a",
        playerLight:  "#82ba48",
        playerDark:   "#4a6e28",
        playerAccent: "#f59e0b"
      },

      icons: {
        player:  "🦕",
        collect: "🥚",
        enemy:   "☄️",
        life:    "🦴",
        hole:    "🌿"
      },

      strings: {
        appTitle:         "Dino Adventure Game Pack",
        playBtn:          "ROAR! 🦕",
        mascotSays:       "Dino says",
        howToFallback:    "Stomp in and explore! 🦕",
        completionPrefix: "Fossil Found! Score",
        completionSuffix: "at level",
        winBtn:           "Next Era 🦴",
        retryBtn:         "Try Again 🦕",
        resultsBtn:       "See my fossils 🦕",
        bgTexture:        "bamboo",
        wordleInstructions: "Guess the 5-letter word in 6 tries. A green tile means correct spot, yellow means wrong spot.",
        wordleHint1:       "What T-Rex does loudly",
        wordleHint2:       "Sharp things on a dino's feet",
        wordleHint3:       "Hard things dinos leave behind",
        wordleWinTitle:    "Jurassic Victory!",
        wordleWinSub:      "You've got prehistoric brainpower!",
        wordleFailSub:     "Even T-Rex stumbled sometimes. Try again!"
      },

      games: {
        day1:  { title: "Egg Catch",           clue: "Clue 1: Your first hiding spot." },
        day2:  { title: "Dino Memory",         clue: "Clue 2: Your second hiding spot." },
        day3:  { title: "Boulder Stack",       clue: "Clue 3: Your third hiding spot." },
        day4:  { title: "Dino-Words",          clue: "Clue 4: Your fourth hiding spot." },
        day5:  { title: "Fossil Tap",          clue: "Clue 5: Your fifth hiding spot." },
        day6:  { title: "Jurassic Sudoku",     clue: "Clue 6: Your sixth hiding spot." },
        day7:  { title: "Dino Paint By Number",clue: "Clue 7: Your seventh hiding spot." },
        day8:  { title: "Meteor Tetris",       clue: "Clue 8: Your eighth hiding spot." },
        day9:  { title: "Fossil Code",         clue: "Clue 9: Your ninth hiding spot." },
        day10: { title: "The Final Dino Quest", clue: "Final clue: Happy Birthday! Your gift is waiting 🎁" }
      },

      memoryLevels: [
        { id:1,  name:"Baby Dino",       emoji:"🥚", type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[10,14,18], badge:"🥚 Hatchling"      },
        { id:2,  name:"Fern Forest",     emoji:"🌿", type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[12,16,20], badge:"🌿 Sprout"          },
        { id:3,  name:"Swamp Stomp",     emoji:"🦕", type:"pattern", patternLen:3, gridSize:6,     starMoves:[1,2,3],    badge:"🦕 Stomper"         },
        { id:4,  name:"Fossil Hunter",   emoji:"🦴", type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[16,20,26], badge:"🦴 Hunter"          },
        { id:5,  name:"Meteor Watch",    emoji:"☄️", type:"pattern", patternLen:4, gridSize:9,     starMoves:[1,2,3],    badge:"☄️ Watcher"         },
        { id:6,  name:"Dino Sprint",     emoji:"⚡",  type:"speed",   cols:4, rows:3, timeLimit:45, starMoves:[10,13,18], badge:"⚡ Speed Dino"      },
        { id:7,  name:"T-Rex Terror",    emoji:"🦖", type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[14,18,24], badge:"🦖 T-Rex"           },
        { id:8,  name:"Raptor Pack",     emoji:"🐾", type:"pattern", patternLen:5, gridSize:9,     starMoves:[1,2,3],    badge:"🐾 Raptor"          },
        { id:9,  name:"Dino Stampede",   emoji:"🔥", type:"speed",   cols:4, rows:4, timeLimit:60, starMoves:[14,18,24], badge:"🔥 Stampeder"       },
        { id:10, name:"DINO BOSS!",      emoji:"🏆", type:"memory",  cols:5, rows:4, timeLimit:0,  starMoves:[18,22,28], badge:"🏆 Dino Master"     }
      ],

      cardEmojis:    ["🦕","🦖","🥚","🌿","🦴","☄️","🐾","🌋","🌴","🍃","🦟","🦎","🐊","🌑","🔥","🏔️","🌊","🌾","⛰️","🌿"],
      patternEmojis: ["🦕","🦖","🥚","🌿","🦴","☄️","🐾","🌋","🌴"],

      catchLevels: SHARED_CATCH_LEVELS,
      stackLevels: SHARED_STACK_LEVELS,

      wordleLevels: [
        { word: 'ROARS', hint: 'What a T-Rex does loudly' },
        { word: 'CLAWS', hint: 'Sharp feet of a raptor' },
        { word: 'TEETH', hint: 'T-Rex has lots of sharp ___' },
        { word: 'BONES', hint: 'What fossils are made of' },
        { word: 'STONE', hint: 'Fossils are found in ___' },
        { word: 'SWAMP', hint: 'A wet prehistoric habitat' },
        { word: 'FERNS', hint: 'Ancient plants dinos munched on' },
        { word: 'CHASE', hint: 'What raptors love to do' },
        { word: 'STOMP', hint: 'How a big dino walks' },
        { word: 'GROWL', hint: 'A low rumbling dino warning' }
      ],

      mosaicLevels: [
        { num:1,  label:'Dino Egg 🥚' },       { num:2,  label:'Baby Dino 🦕' },
        { num:3,  label:'Fern Grove 🌿' },      { num:4,  label:'Fossil Dig 🦴' },
        { num:5,  label:'Meteor Watch ☄️' },    { num:6,  label:'Swamp Walk 🌊' },
        { num:7,  label:'T-Rex Roar 🦖' },      { num:8,  label:'Raptor Run 🐾' },
        { num:9,  label:'Volcano Blast 🌋' },   { num:10, label:'Dino Master 🏆' }
      ],

      sudokuLevels: { easy: 'Hatchling', medium: 'Raptor', hard: 'T-Rex' },
      mosaicColors: [null,'#84cc16','#f59e0b','#ef4444','#65a30d','#fbbf24','#4ade80','#a3e635'],
      confettiColors: ['#84cc16','#f59e0b','#ef4444','#65a30d','#fbbf24','#4ade80','#f3d06a','#a3e635'],
      paintMessages: ['','Roar-some start! 🦕','Prehistoric painting skills! 🦖','A Jurassic masterpiece! 🦕🏆'],
      quest: {
        stage1Title:  'The Dino Quest Begins',
        stage1PathA:  'Safe Trail 🦴',
        stage1PathB:  'Shortcut 🌿',
        stage1Trap:   '🦕 stumbled into a trap! Try the safe trail!',
        stage2Title:  'Fossil Code Gate',
        stage3Title:  'Dino Celebration',
        stage3BtnText:'🦕 STOMP! ✨',
        finishText:   '🎂 Happy Birthday, dino explorer! 🎈'
      }
    },

    // ─────────────────────────────────────────────────────────────────────────
    minecraft: {
      name:   "Minecraft Adventure",
      mascot: "⛏️",

      colors: {
        "bg":           "#1c1c1c",
        "surface":      "#2a2a2a",
        "surface-2":    "#3a3a3a",
        "text":         "#f0f0f0",
        "muted":        "#b0b0b0",
        "accent":       "#4caf50",
        "accent-dark":  "#2e7d32",
        "accent-2":     "#00bcd4",
        "danger":       "#f44336",
        "green-dark":   "#1c1c1c",
        "green-mid":    "#2e7d32",
        "green-bright": "#4caf50",
        "green-light":  "#a5d6a7",
        "green-pale":   "#2a2a2a",
        "yellow":       "#ffeb3b",
        "yellow-dark":  "#f9a825",
        "card-past":    "rgba(76,175,80,0.18)",
        "card-today":   "rgba(0,188,212,0.18)",
        "stripe-color": "rgba(76,175,80,0.07)"
      },

      canvas: {
        bgFill:       "#3c3c3c",
        bgStripe:     "rgba(60,60,60,0.3)",
        bgGround:     "#5a4a2a",
        bgGroundDark: "#3e3018",
        bgCloud:      "rgba(255,255,255,0.15)",
        collectFill:  "#00bcd4",
        collectDark:  "#006064",
        collectAccent:"#4dd0e1",
        enemyFill:    "#4caf50",
        enemyStripe:  "#1b5e20",
        enemyWing:    "rgba(80,200,80,0.55)",
        playerBody:   "#795548",
        playerLight:  "#a1887f",
        playerDark:   "#4e342e",
        playerAccent: "#ffeb3b"
      },

      icons: {
        player:  "🧱",
        collect: "💎",
        enemy:   "🐺",
        life:    "❤️",
        hole:    "⛏️"
      },

      strings: {
        appTitle:         "Minecraft Adventure Game Pack",
        playBtn:          "Start Mining! ⛏️",
        mascotSays:       "Steve says",
        howToFallback:    "Mine, craft, survive — dive in! ⛏️",
        completionPrefix: "Block cleared! Score",
        completionSuffix: "at level",
        winBtn:           "Next Block ⛏️",
        retryBtn:         "Respawn 💎",
        resultsBtn:       "Check Inventory 🎒",
        bgTexture:        "circuit",
        wordleInstructions: "Guess the 5-letter word in 6 tries. A green tile means correct spot, yellow means wrong spot.",
        wordleHint1:       "The basic unit of the world",
        wordleHint2:       "Use a table to make tools",
        wordleHint3:       "Stick your favourite ore here",
        wordleWinTitle:    "Achievement Unlocked!",
        wordleWinSub:      "You're a master crafter!",
        wordleFailSub:     "Even Steve dies sometimes. Respawn and try again!"
      },

      games: {
        day1:  { title: "Diamond Catch",         clue: "Clue 1: Your first hiding spot." },
        day2:  { title: "Crafting Memory",        clue: "Clue 2: Your second hiding spot." },
        day3:  { title: "Block Stack",            clue: "Clue 3: Your third hiding spot." },
        day4:  { title: "Mine-Words",             clue: "Clue 4: Your fourth hiding spot." },
        day5:  { title: "Creeper Tap",            clue: "Clue 5: Your fifth hiding spot." },
        day6:  { title: "Redstone Sudoku",        clue: "Clue 6: Your sixth hiding spot." },
        day7:  { title: "Pixel Art Paint",        clue: "Clue 7: Your seventh hiding spot." },
        day8:  { title: "TNT Tetris",             clue: "Clue 8: Your eighth hiding spot." },
        day9:  { title: "Chest Code Breaker",     clue: "Clue 9: Your ninth hiding spot." },
        day10: { title: "The Final Boss Quest",   clue: "Final clue: Happy Birthday! Your gift is waiting 🎁" }
      },

      memoryLevels: [
        { id:1,  name:"Dirt Digger",     emoji:"🧱", type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[10,14,18], badge:"🧱 Digger"          },
        { id:2,  name:"Stone Miner",     emoji:"⛏️", type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[12,16,20], badge:"⛏️ Miner"           },
        { id:3,  name:"Crafting Table",  emoji:"🪵", type:"pattern", patternLen:3, gridSize:6,     starMoves:[1,2,3],    badge:"🪵 Crafter"         },
        { id:4,  name:"Cave Explorer",   emoji:"🕯️", type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[16,20,26], badge:"🕯️ Explorer"        },
        { id:5,  name:"Creeper Dodger",  emoji:"💚", type:"pattern", patternLen:4, gridSize:9,     starMoves:[1,2,3],    badge:"💚 Survivor"        },
        { id:6,  name:"Speed Builder",   emoji:"⚡",  type:"speed",   cols:4, rows:3, timeLimit:45, starMoves:[10,13,18], badge:"⚡ Speed Builder"   },
        { id:7,  name:"Diamond Hunter",  emoji:"💎", type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[14,18,24], badge:"💎 Diamond"         },
        { id:8,  name:"Redstone Wizard", emoji:"🔴", type:"pattern", patternLen:5, gridSize:9,     starMoves:[1,2,3],    badge:"🔴 Redstone Wiz"   },
        { id:9,  name:"Nether Rush",     emoji:"🔥", type:"speed",   cols:4, rows:4, timeLimit:60, starMoves:[14,18,24], badge:"🔥 Nether Hero"     },
        { id:10, name:"ENDER BOSS!",     emoji:"🏆", type:"memory",  cols:5, rows:4, timeLimit:0,  starMoves:[18,22,28], badge:"🏆 Ender Dragon"    }
      ],

      cardEmojis:    ["🧱","⛏️","💎","🪵","🔴","💚","🌳","🗡️","🏹","🔥","❄️","🌕","🪨","🥕","🍖","🐺","🕷️","🐉","🏰","🎮"],
      patternEmojis: ["🧱","⛏️","💎","🪵","🔴","💚","🌳","🗡️","🏹"],

      catchLevels: SHARED_CATCH_LEVELS,
      stackLevels: SHARED_STACK_LEVELS,

      wordleLevels: [
        { word: 'BLOCK', hint: 'The basic unit of the Minecraft world' },
        { word: 'CRAFT', hint: 'What you do at a crafting table' },
        { word: 'STONE', hint: 'The second layer underground' },
        { word: 'GRASS', hint: 'The green surface block' },
        { word: 'TORCH', hint: 'Light up the cave with a ___' },
        { word: 'CHEST', hint: 'Store your items here' },
        { word: 'ARROW', hint: 'Shoot it from a bow' },
        { word: 'CAVES', hint: 'Underground hollow spaces' },
        { word: 'SPAWN', hint: 'Where you appear in the world' },
        { word: 'SWORD', hint: 'Your trusty melee weapon' }
      ],

      mosaicLevels: [
        { num:1,  label:'Dirt Block 🧱' },      { num:2,  label:'Stone Mine ⛏️' },
        { num:3,  label:'Wood Cabin 🪵' },       { num:4,  label:'Diamond Find 💎' },
        { num:5,  label:'Creeper Face 💚' },     { num:6,  label:'Redstone Power 🔴' },
        { num:7,  label:'Nether Portal 🔥' },    { num:8,  label:'End Gateway 🌌' },
        { num:9,  label:'Dragon Egg 🐉' },       { num:10, label:'Ender Dragon 🏆' }
      ],

      sudokuLevels: { easy: 'Dirt', medium: 'Iron', hard: 'Diamond' },
      mosaicColors: [null,'#4caf50','#00bcd4','#f44336','#ffeb3b','#9c27b0','#ff9800','#2196f3'],
      confettiColors: ['#4caf50','#00bcd4','#f44336','#ffeb3b','#9c27b0','#ff9800','#2196f3','#a5d6a7'],
      paintMessages: ['','A fine start, crafter! ⛏️','That\'s some pixel art! 💎','Achievement Unlocked: Master Painter! 🏆'],
      quest: {
        stage1Title:  'The Mine Begins',
        stage1PathA:  'Safe Tunnel 💎',
        stage1PathB:  'Shortcut ⛏️',
        stage1Trap:   '🧱 Creeper ambush! Try the safe tunnel!',
        stage2Title:  'Redstone Code Gate',
        stage3Title:  'Crafting Celebration',
        stage3BtnText:'⛏️ MINE! ✨',
        finishText:   '🎂 Happy Birthday, Master Crafter! 🎈'
      }
    },
    // ─────────────────────────────────────────────────────────────────────────
    pokemon: {
      name:   "Pokémon Adventure",
      mascot: "⚡",

      colors: {
        "bg":           "#0a0e2e",
        "surface":      "#131843",
        "surface-2":    "#1c2460",
        "text":         "#ffffff",
        "muted":        "#a0b4f0",
        "accent":       "#FFCB05",
        "accent-dark":  "#c9960a",
        "accent-2":     "#cc0000",
        "danger":       "#ef4444",
        "green-dark":   "#0a0e2e",
        "green-mid":    "#1c2460",
        "green-bright": "#FFCB05",
        "green-light":  "#a0b4f0",
        "green-pale":   "#131843",
        "yellow":       "#FFCB05",
        "yellow-dark":  "#c9960a",
        "card-past":    "rgba(255,203,5,0.15)",
        "card-today":   "rgba(204,0,0,0.18)",
        "stripe-color": "rgba(255,203,5,0.07)"
      },

      canvas: {
        bgFill:       "#1a2a1a",
        bgStripe:     "rgba(80,160,80,0.08)",
        bgGround:     "#2d4a2d",
        bgGroundDark: "#1a2e1a",
        bgCloud:      "rgba(220,255,220,0.2)",
        collectFill:  "#FFCB05",
        collectDark:  "#c9960a",
        collectAccent:"#ffe566",
        enemyFill:    "#cc0000",
        enemyStripe:  "#8b0000",
        enemyWing:    "rgba(255,100,100,0.55)",
        playerBody:   "#cc0000",
        playerLight:  "#ff3333",
        playerDark:   "#8b0000",
        playerAccent: "#FFCB05"
      },

      icons: {
        player:  "🧢",
        collect: "⚡",
        enemy:   "💜",
        life:    "❤️",
        hole:    "🔮"
      },

      strings: {
        appTitle:           "Pokémon Adventure Game Pack",
        playBtn:            "Go! ⚡",
        mascotSays:         "Professor says",
        howToFallback:      "Gotta catch 'em all! ⚡",
        completionPrefix:   "Pokémon Caught! Score",
        completionSuffix:   "at level",
        winBtn:             "Next Battle ⚡",
        retryBtn:           "Try Again 🎮",
        resultsBtn:         "Check Pokédex 📖",
        bgTexture:          "circuit",
        wordleInstructions: "Guess the 5-letter word in 6 tries. Green = right spot, yellow = wrong spot.",
        wordleHint1:        "What you do with a Pokéball",
        wordleHint2:        "The big outdoor biome in Pokémon",
        wordleHint3:        "You collect these from Gym Leaders",
        wordleWinTitle:     "Pokémon Caught!",
        wordleWinSub:       "You've got a Trainer's sharp mind!",
        wordleFailSub:      "Even Ash lost sometimes. Try again!"
      },

      games: {
        day1:  { title: "Pokémon Catch",          clue: "Clue 1: Your first hiding spot." },
        day2:  { title: "Pokédex Memory",         clue: "Clue 2: Your second hiding spot." },
        day3:  { title: "Pokéball Stack",         clue: "Clue 3: Your third hiding spot." },
        day4:  { title: "Poké-Words",             clue: "Clue 4: Your fourth hiding spot." },
        day5:  { title: "Trainer Tap",            clue: "Clue 5: Your fifth hiding spot." },
        day6:  { title: "Gym Sudoku",             clue: "Clue 6: Your sixth hiding spot." },
        day7:  { title: "Pixel Pokémon Paint",    clue: "Clue 7: Your seventh hiding spot." },
        day8:  { title: "Pokémon Tetris",         clue: "Clue 8: Your eighth hiding spot." },
        day9:  { title: "Team Rocket Code",       clue: "Clue 9: Your ninth hiding spot." },
        day10: { title: "The Final Pokémon Quest",clue: "Final clue: Happy Birthday! Your gift is waiting 🎁" }
      },

      memoryLevels: [
        { id:1,  name:"Starter Choice",    emoji:"🌱", type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[10,14,18], badge:"🌱 Rookie Trainer"  },
        { id:2,  name:"Pallet Town",       emoji:"🏘️", type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[12,16,20], badge:"🏘️ Local Hero"      },
        { id:3,  name:"Viridian Forest",   emoji:"🌿", type:"pattern", patternLen:3, gridSize:6,     starMoves:[1,2,3],    badge:"🌿 Bug Catcher"     },
        { id:4,  name:"Gym Battle",        emoji:"🏆", type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[16,20,26], badge:"🏆 Badge Holder"    },
        { id:5,  name:"Safari Zone",       emoji:"🦁", type:"pattern", patternLen:4, gridSize:9,     starMoves:[1,2,3],    badge:"🦁 Safari Scout"    },
        { id:6,  name:"Speed Trainer",     emoji:"⚡", type:"speed",   cols:4, rows:3, timeLimit:45, starMoves:[10,13,18], badge:"⚡ Quick Trainer"   },
        { id:7,  name:"Elite Four",        emoji:"💫", type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[14,18,24], badge:"💫 Elite Challenger" },
        { id:8,  name:"Legendary Hunt",    emoji:"🌌", type:"pattern", patternLen:5, gridSize:9,     starMoves:[1,2,3],    badge:"🌌 Legend Seeker"   },
        { id:9,  name:"Champion Race",     emoji:"🔥", type:"speed",   cols:4, rows:4, timeLimit:60, starMoves:[14,18,24], badge:"🔥 Champion Rival"  },
        { id:10, name:"POKÉMON MASTER!",   emoji:"🏆", type:"memory",  cols:5, rows:4, timeLimit:0,  starMoves:[18,22,28], badge:"🏆 Pokémon Master"  }
      ],

      cardEmojis:    ["⚡","🔥","💧","🌿","🌙","☀️","🌊","🌸","❄️","🌟","🏔️","🦋","🐉","🎯","🔮","✨","🥊","🎪","🏆","🎖️"],
      patternEmojis: ["⚡","🔥","💧","🌿","🌙","🌟","🎯","🔮","🐉"],

      catchLevels: SHARED_CATCH_LEVELS,
      stackLevels: SHARED_STACK_LEVELS,

      wordleLevels: [
        { word: 'CATCH', hint: 'What you do with a Pokéball' },
        { word: 'GRASS', hint: 'Where wild Pokémon hide' },
        { word: 'FLAME', hint: 'Charmander breathes this' },
        { word: 'BADGE', hint: 'Win one from a Gym Leader' },
        { word: 'STONE', hint: 'Use an ___ to evolve some Pokémon' },
        { word: 'FIGHT', hint: 'A combat-type Pokémon specialty' },
        { word: 'GHOST', hint: 'Haunter and Gengar are this type' },
        { word: 'RAPID', hint: '___ Spin: a move to clear hazards' },
        { word: 'EEVEE', hint: 'The Evolution Pokémon with 8 forms' },
        { word: 'PICHU', hint: 'The baby form of Pikachu' }
      ],

      mosaicLevels: [
        { num:1,  label:'Pokéball 🔴' },       { num:2,  label:'Pikachu ⚡' },
        { num:3,  label:'Bulbasaur 🌿' },       { num:4,  label:'Charmander 🔥' },
        { num:5,  label:'Squirtle 💧' },         { num:6,  label:'Eevee 🌟' },
        { num:7,  label:'Mewtwo 🔮' },           { num:8,  label:'Gengar 👻' },
        { num:9,  label:'Dragonite 🐉' },        { num:10, label:'Pokémon Master 🏆' }
      ],

      sudokuLevels: { easy: 'Trainer', medium: 'Gym Leader', hard: 'Elite Four' },
      mosaicColors:   [null,'#FFCB05','#cc0000','#1a237e','#43a047','#29b6f6','#7c4dff','#ff6b6b'],
      confettiColors: ['#FFCB05','#cc0000','#1a237e','#43a047','#29b6f6','#7c4dff','#ff6b6b','#ffffff'],
      paintMessages:  ['','Nice start, Trainer! 🎮','A fine Pokédex entry! ⚡','Pokémon Master Painter! 🏆'],
      quest: {
        stage1Title:  'The Trainer Journey',
        stage1PathA:  'Route Alpha ⚡',
        stage1PathB:  'Shortcut 🌿',
        stage1Trap:   '⚡ Team Rocket blocked the way! Try Route Alpha!',
        stage2Title:  'Gym Leader Puzzle',
        stage3Title:  'Victory Celebration',
        stage3BtnText:'⚡ CATCH EM! 🎮',
        finishText:   '🎂 Happy Birthday, Pokémon Master! 🏆'
      }
    },

    // ─────────────────────────────────────────────────────────────────────────
    unicorn: {
      name:   "Unicorn Magic",
      mascot: "🦄",

      colors: {
        "bg":           "#1a0a3e",
        "surface":      "#2d1b69",
        "surface-2":    "#3d2080",
        "text":         "#ffffff",
        "muted":        "#d4b8ff",
        "accent":       "#ff69b4",
        "accent-dark":  "#c2185b",
        "accent-2":     "#a78bfa",
        "danger":       "#ef4444",
        "green-dark":   "#1a0a3e",
        "green-mid":    "#3d2080",
        "green-bright": "#ff69b4",
        "green-light":  "#f9a8d4",
        "green-pale":   "#2d1b69",
        "yellow":       "#fbbf24",
        "yellow-dark":  "#d97706",
        "card-past":    "rgba(167,139,250,0.18)",
        "card-today":   "rgba(255,105,180,0.18)",
        "stripe-color": "rgba(255,105,180,0.07)"
      },

      canvas: {
        bgFill:       "#c8a2c8",
        bgStripe:     "rgba(200,162,200,0.12)",
        bgGround:     "#b39ddb",
        bgGroundDark: "#9575cd",
        bgCloud:      "rgba(255,255,255,0.6)",
        collectFill:  "#ffd700",
        collectDark:  "#ffa000",
        collectAccent:"#fff176",
        enemyFill:    "#6a0dad",
        enemyStripe:  "#4a148c",
        enemyWing:    "rgba(180,100,255,0.5)",
        playerBody:   "#ff69b4",
        playerLight:  "#ff9ecb",
        playerDark:   "#c2185b",
        playerAccent: "#fbbf24"
      },

      icons: {
        player:  "🦄",
        collect: "✨",
        enemy:   "🌑",
        life:    "💖",
        hole:    "🌸"
      },

      strings: {
        appTitle:           "Unicorn Magic Game Pack",
        playBtn:            "Let's Sparkle! 🦄",
        mascotSays:         "Unicorn says",
        howToFallback:      "Sprinkle magic and dive in! 🦄",
        completionPrefix:   "Magic Complete! Score",
        completionSuffix:   "at level",
        winBtn:             "Next Rainbow ✨",
        retryBtn:           "Try Again 🦄",
        resultsBtn:         "See my sparkles 🦄",
        bgTexture:          "wave",
        wordleInstructions: "Guess the 5-letter word in 6 tries. Green = right spot, yellow = wrong spot.",
        wordleHint1:        "What a wizard casts",
        wordleHint2:        "What the sky is full of at night",
        wordleHint3:        "Light coming through the sky",
        wordleWinTitle:     "Magical Victory! 🌈",
        wordleWinSub:       "You think like a real unicorn! 🦄",
        wordleFailSub:      "Even unicorns stumble. Try again! ✨"
      },

      games: {
        day1:  { title: "Star Catch",            clue: "Clue 1: Your first hiding spot." },
        day2:  { title: "Rainbow Memory",        clue: "Clue 2: Your second hiding spot." },
        day3:  { title: "Crystal Stack",         clue: "Clue 3: Your third hiding spot." },
        day4:  { title: "Magic Words",           clue: "Clue 4: Your fourth hiding spot." },
        day5:  { title: "Sparkle Tap",           clue: "Clue 5: Your fifth hiding spot." },
        day6:  { title: "Fairy Sudoku",          clue: "Clue 6: Your sixth hiding spot." },
        day7:  { title: "Rainbow Paint",         clue: "Clue 7: Your seventh hiding spot." },
        day8:  { title: "Crystal Tetris",        clue: "Clue 8: Your eighth hiding spot." },
        day9:  { title: "Spell Breaker",         clue: "Clue 9: Your ninth hiding spot." },
        day10: { title: "The Final Unicorn Quest",clue: "Final clue: Happy Birthday! Your gift is waiting 🎁" }
      },

      memoryLevels: [
        { id:1,  name:"Baby Unicorn",      emoji:"🦄", type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[10,14,18], badge:"🦄 Foal"           },
        { id:2,  name:"Rainbow River",     emoji:"🌈", type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[12,16,20], badge:"🌈 Rainbow"        },
        { id:3,  name:"Crystal Cave",      emoji:"💎", type:"pattern", patternLen:3, gridSize:6,     starMoves:[1,2,3],    badge:"💎 Crystal"        },
        { id:4,  name:"Fairy Ring",        emoji:"🌸", type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[16,20,26], badge:"🌸 Fairy Friend"   },
        { id:5,  name:"Star Field",        emoji:"⭐", type:"pattern", patternLen:4, gridSize:9,     starMoves:[1,2,3],    badge:"⭐ Star Gazer"     },
        { id:6,  name:"Speed Gallop",      emoji:"⚡", type:"speed",   cols:4, rows:3, timeLimit:45, starMoves:[10,13,18], badge:"⚡ Swift Unicorn"  },
        { id:7,  name:"Twin Stars",        emoji:"💫", type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[14,18,24], badge:"💫 Star Twin"      },
        { id:8,  name:"Moon Dance",        emoji:"🌙", type:"pattern", patternLen:5, gridSize:9,     starMoves:[1,2,3],    badge:"🌙 Moon Dancer"    },
        { id:9,  name:"Rainbow Sprint",    emoji:"🌈", type:"speed",   cols:4, rows:4, timeLimit:60, starMoves:[14,18,24], badge:"🌈 Rainbow Racer"  },
        { id:10, name:"UNICORN QUEEN!",    emoji:"👑", type:"memory",  cols:5, rows:4, timeLimit:0,  starMoves:[18,22,28], badge:"👑 Unicorn Queen"  }
      ],

      cardEmojis:    ["🦄","🌈","⭐","💖","🌸","✨","🌙","💎","🌺","🦋","🍭","🌟","💜","💗","🎀","🌷","🎪","🏵️","🌻","🧁"],
      patternEmojis: ["🦄","🌈","⭐","💖","🌸","✨","🌙","💎","🦋"],

      catchLevels: SHARED_CATCH_LEVELS,
      stackLevels: SHARED_STACK_LEVELS,

      wordleLevels: [
        { word: 'MAGIC', hint: 'What unicorns are full of' },
        { word: 'STARS', hint: 'Sparkle like these at night' },
        { word: 'SHINE', hint: 'What a unicorn horn does' },
        { word: 'DREAM', hint: 'Where unicorns often roam' },
        { word: 'FAIRY', hint: 'A tiny magical creature' },
        { word: 'GLOWS', hint: 'What magic light does' },
        { word: 'DANCE', hint: 'What unicorns do under the moon' },
        { word: 'GRACE', hint: 'How a unicorn moves' },
        { word: 'BLOOM', hint: 'What flowers do in spring' },
        { word: 'PETAL', hint: 'Part of a magic flower' }
      ],

      mosaicLevels: [
        { num:1,  label:'Tiny Spark ✨' },        { num:2,  label:'Rainbow Arch 🌈' },
        { num:3,  label:'Crystal Heart 💎' },     { num:4,  label:'Fairy Wings 🦋' },
        { num:5,  label:'Star Crown ⭐' },         { num:6,  label:'Moon Glow 🌙' },
        { num:7,  label:'Magic Mane 🦄' },         { num:8,  label:'Dream Cloud 💫' },
        { num:9,  label:'Galaxy Dash 🌌' },        { num:10, label:'Unicorn Queen 👑' }
      ],

      sudokuLevels: { easy: 'Foal', medium: 'Unicorn', hard: 'Alicorn' },
      mosaicColors:   [null,'#ff69b4','#a78bfa','#fbbf24','#34d399','#60a5fa','#f472b6','#c084fc'],
      confettiColors: ['#ff69b4','#a78bfa','#fbbf24','#34d399','#60a5fa','#f472b6','#c084fc','#ffffff'],
      paintMessages:  ['','A sparkly start! ✨','You paint like a unicorn! 🦄','The most magical masterpiece! 🌈🏆'],
      quest: {
        stage1Title:  'The Magic Journey',
        stage1PathA:  'Rainbow Path 🌈',
        stage1PathB:  'Shortcut 🌸',
        stage1Trap:   '🦄 got lost in the dark forest! Try the rainbow path!',
        stage2Title:  'Crystal Code Gate',
        stage3Title:  'Unicorn Celebration',
        stage3BtnText:'🦄 SPARKLE! ✨',
        finishText:   '🎂 Happy Birthday, Unicorn Queen! 🌈'
      }
    },

    // ─────────────────────────────────────────────────────────────────────────
    space: {
      name:   "Galaxy Explorer",
      mascot: "🚀",

      colors: {
        "bg":           "#050a14",
        "surface":      "#0d1b2a",
        "surface-2":    "#162537",
        "text":         "#e8f4ff",
        "muted":        "#7eb8d4",
        "accent":       "#f9a825",
        "accent-dark":  "#e65100",
        "accent-2":     "#4fc3f7",
        "danger":       "#ef5350",
        "green-dark":   "#050a14",
        "green-mid":    "#162537",
        "green-bright": "#4fc3f7",
        "green-light":  "#b3e5fc",
        "green-pale":   "#0d1b2a",
        "yellow":       "#f9a825",
        "yellow-dark":  "#e65100",
        "card-past":    "rgba(79,195,247,0.15)",
        "card-today":   "rgba(249,168,37,0.18)",
        "stripe-color": "rgba(79,195,247,0.06)"
      },

      canvas: {
        bgFill:       "#05090f",
        bgStripe:     "rgba(79,195,247,0.04)",
        bgGround:     "#0d1b2a",
        bgGroundDark: "#050a14",
        bgCloud:      "rgba(180,220,255,0.12)",
        collectFill:  "#f9a825",
        collectDark:  "#e65100",
        collectAccent:"#fff176",
        enemyFill:    "#ef5350",
        enemyStripe:  "#b71c1c",
        enemyWing:    "rgba(255,120,100,0.55)",
        playerBody:   "#546e7a",
        playerLight:  "#78909c",
        playerDark:   "#37474f",
        playerAccent: "#f9a825"
      },

      icons: {
        player:  "🚀",
        collect: "⭐",
        enemy:   "☄️",
        life:    "🌟",
        hole:    "🕳️"
      },

      strings: {
        appTitle:           "Galaxy Explorer Game Pack",
        playBtn:            "Launch! 🚀",
        mascotSays:         "Mission Control says",
        howToFallback:      "3, 2, 1 — blast off and explore! 🚀",
        completionPrefix:   "Mission Complete! Score",
        completionSuffix:   "at level",
        winBtn:             "Next Mission 🌟",
        retryBtn:           "Retry 🚀",
        resultsBtn:         "Mission Report 🚀",
        bgTexture:          "circuit",
        wordleInstructions: "Guess the 5-letter word in 6 tries. Green = right spot, yellow = wrong spot.",
        wordleHint1:        "What you see above at night",
        wordleHint2:        "The path a planet travels",
        wordleHint3:        "Our nearest space neighbour",
        wordleWinTitle:     "Mission Accomplished! 🚀",
        wordleWinSub:       "Houston, we have a genius!",
        wordleFailSub:      "Even astronauts retry. Blast off again! 🚀"
      },

      games: {
        day1:  { title: "Star Catch",            clue: "Clue 1: Your first hiding spot." },
        day2:  { title: "Constellation Memory",  clue: "Clue 2: Your second hiding spot." },
        day3:  { title: "Rocket Stack",          clue: "Clue 3: Your third hiding spot." },
        day4:  { title: "Space Words",           clue: "Clue 4: Your fourth hiding spot." },
        day5:  { title: "Asteroid Tap",          clue: "Clue 5: Your fifth hiding spot." },
        day6:  { title: "Galaxy Sudoku",         clue: "Clue 6: Your sixth hiding spot." },
        day7:  { title: "Planet Paint",          clue: "Clue 7: Your seventh hiding spot." },
        day8:  { title: "Nebula Tetris",         clue: "Clue 8: Your eighth hiding spot." },
        day9:  { title: "Signal Code Breaker",   clue: "Clue 9: Your ninth hiding spot." },
        day10: { title: "The Final Space Quest", clue: "Final clue: Happy Birthday! Your gift is waiting 🎁" }
      },

      memoryLevels: [
        { id:1,  name:"Moon Base",         emoji:"🌕", type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[10,14,18], badge:"🌕 Moon Cadet"      },
        { id:2,  name:"Asteroid Belt",     emoji:"☄️", type:"memory",  cols:4, rows:3, timeLimit:0,  starMoves:[12,16,20], badge:"☄️ Rock Dodger"     },
        { id:3,  name:"Mars Mission",      emoji:"🔴", type:"pattern", patternLen:3, gridSize:6,     starMoves:[1,2,3],    badge:"🔴 Mars Pioneer"    },
        { id:4,  name:"Jupiter Ring",      emoji:"🪐", type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[16,20,26], badge:"🪐 Ring Explorer"   },
        { id:5,  name:"Deep Space",        emoji:"🌌", type:"pattern", patternLen:4, gridSize:9,     starMoves:[1,2,3],    badge:"🌌 Deep Space"      },
        { id:6,  name:"Speed Orbit",       emoji:"⚡", type:"speed",   cols:4, rows:3, timeLimit:45, starMoves:[10,13,18], badge:"⚡ Orbital Racer"   },
        { id:7,  name:"Star Twins",        emoji:"🌟", type:"memory",  cols:4, rows:4, timeLimit:0,  starMoves:[14,18,24], badge:"🌟 Star Mapper"     },
        { id:8,  name:"Black Hole",        emoji:"🕳️", type:"pattern", patternLen:5, gridSize:9,     starMoves:[1,2,3],    badge:"🕳️ Singularity"    },
        { id:9,  name:"Warp Drive",        emoji:"🚀", type:"speed",   cols:4, rows:4, timeLimit:60, starMoves:[14,18,24], badge:"🚀 Warp Pilot"      },
        { id:10, name:"GALAXY COMMANDER!", emoji:"🏆", type:"memory",  cols:5, rows:4, timeLimit:0,  starMoves:[18,22,28], badge:"🏆 Galaxy Commander" }
      ],

      cardEmojis:    ["🚀","⭐","🌕","☄️","🌌","🪐","🌟","👨‍🚀","🛸","🔭","🌠","💫","🌙","🌞","🌍","🌏","🌎","🛰️","👽","🏆"],
      patternEmojis: ["🚀","⭐","🌕","☄️","🌌","🪐","🌟","🛸","🔭"],

      catchLevels: SHARED_CATCH_LEVELS,
      stackLevels: SHARED_STACK_LEVELS,

      wordleLevels: [
        { word: 'STARS', hint: 'Thousands of them light the night sky' },
        { word: 'ORBIT', hint: 'The path a planet travels around the sun' },
        { word: 'LUNAR', hint: 'Relating to the moon' },
        { word: 'COMET', hint: 'A space rock with an icy tail' },
        { word: 'LASER', hint: 'A beam of focused light used in space tools' },
        { word: 'LIGHT', hint: 'The fastest thing in the universe' },
        { word: 'PROBE', hint: 'An unmanned spacecraft sent to explore' },
        { word: 'SPACE', hint: 'The final frontier' },
        { word: 'PILOT', hint: 'The person who flies a rocket' },
        { word: 'BLAST', hint: '___ off! How rockets launch' }
      ],

      mosaicLevels: [
        { num:1,  label:'Moon Landing 🌕' },      { num:2,  label:'Asteroid Field ☄️' },
        { num:3,  label:'Mars Base 🔴' },          { num:4,  label:'Jupiter Fly-by 🪐' },
        { num:5,  label:'Nebula Cloud 🌌' },       { num:6,  label:'Star Cluster ⭐' },
        { num:7,  label:'Black Hole 🕳️' },         { num:8,  label:'Warp Speed 🚀' },
        { num:9,  label:'Alien Signal 👽' },        { num:10, label:'Galaxy Commander 🏆' }
      ],

      sudokuLevels: { easy: 'Cadet', medium: 'Astronaut', hard: 'Commander' },
      mosaicColors:   [null,'#f9a825','#4fc3f7','#ef5350','#7e57c2','#26c6da','#66bb6a','#ab47bc'],
      confettiColors: ['#f9a825','#4fc3f7','#ef5350','#7e57c2','#26c6da','#66bb6a','#ab47bc','#ffffff'],
      paintMessages:  ['','Mission start, Cadet! 🚀','Houston, we have art! 🌟','A true galactic masterpiece! 🌌🏆'],
      quest: {
        stage1Title:  'Mission Briefing',
        stage1PathA:  'Safe Orbit ⭐',
        stage1PathB:  'Shortcut ☄️',
        stage1Trap:   '🚀 hit an asteroid field! Try the safe orbit!',
        stage2Title:  'Alien Code Puzzle',
        stage3Title:  'Launch Celebration',
        stage3BtnText:'🚀 BLAST OFF! ⭐',
        finishText:   '🎂 Happy Birthday, Galaxy Commander! 🌌'
      }
    }
  }; // end FALLBACK_THEMES

  // ─────────────────────────────────────────────────────────────────────────
  // TEXTURE PATTERNS (body::before background-image)
  // ─────────────────────────────────────────────────────────────────────────
  var TEXTURES = {
    bamboo:  "repeating-linear-gradient(90deg, var(--stripe-color) 0px, var(--stripe-color) 16px, transparent 16px, transparent 80px)",
    circuit: "repeating-linear-gradient(0deg, var(--stripe-color) 0px, var(--stripe-color) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, var(--stripe-color) 0px, var(--stripe-color) 1px, transparent 1px, transparent 40px)",
    ice:     "repeating-linear-gradient(60deg, var(--stripe-color) 0px, var(--stripe-color) 1px, transparent 1px, transparent 60px)",
    wave:    "repeating-radial-gradient(circle at 0 50%, transparent 0, var(--stripe-color) 2px, transparent 4px)"
  };

  function readThemeNameFromQuery() {
    var params = new URLSearchParams(window.location.search || "");
    return params.get("theme") || "";
  }

  function applyThemeObject(themeKey, themeObj) {
    if (!themeObj) return;
    var root = document.documentElement;
    var colors = themeObj.colors || {};
    for (var token in colors) {
      if (Object.prototype.hasOwnProperty.call(colors, token)) {
        root.style.setProperty("--" + token, colors[token]);
      }
    }

    var applyBody = function() {
      if (!document.body) return;
      document.body.style.background = colors["bg"] || "";
      document.body.setAttribute("data-theme", themeKey);
      
      var textureKey = (themeObj.strings && themeObj.strings.bgTexture) || "bamboo";
      var pattern = TEXTURES[textureKey] || TEXTURES.bamboo;
      var styleId = "pa-texture-style";
      var el = document.getElementById(styleId);
      if (!el) { el = document.createElement("style"); el.id = styleId; document.head.appendChild(el); }
      el.textContent = [
        "body::before { background-image: " + pattern + " !important; }",
        ":root { --stripe-texture: " + pattern + "; }"
      ].join("\n");
    };

    if (document.body) {
      applyBody();
    } else {
      document.addEventListener("DOMContentLoaded", applyBody);
    }
  }

  App.Theme = {
    getThemeName: function (config) {
      var q = readThemeNameFromQuery();
      if (q) return q;
      return (config && config.activeTheme) || "panda";
    },

    resolveThemes: function (config) {
      var base = FALLBACK_THEMES;
      if (config && config.themes && Object.keys(config.themes).length) {
        var merged = {};
        for (var baseKey in base) merged[baseKey] = base[baseKey];
        for (var cfgKey in config.themes) {
          if (merged[cfgKey]) {
            var b = merged[cfgKey], c = config.themes[cfgKey];
            merged[cfgKey] = {
              name:         c.name         || b.name,
              mascot:       c.mascot       || b.mascot,
              colors:       Object.assign({}, b.colors,  c.colors  || {}),
              canvas:       Object.assign({}, b.canvas,  c.canvas  || {}),
              icons:        Object.assign({}, b.icons,   c.icons   || {}),
              strings:      Object.assign({}, b.strings, c.strings || {}),
              games:        Object.assign({}, b.games,   c.games   || {}),
              cardEmojis:   c.cardEmojis    || b.cardEmojis,
              patternEmojis:c.patternEmojis || b.patternEmojis,
              memoryLevels: c.memoryLevels  || b.memoryLevels,
              catchLevels:  c.catchLevels   || b.catchLevels,
              stackLevels:  c.stackLevels   || b.stackLevels,
              wordleLevels: c.wordleLevels  || b.wordleLevels,
              mosaicLevels:      c.mosaicLevels      || b.mosaicLevels,
              sudokuLevels:      c.sudokuLevels      || b.sudokuLevels,
              mosaicColors:      c.mosaicColors      || b.mosaicColors,
              confettiColors:    c.confettiColors     || b.confettiColors,
              paintMessages:     c.paintMessages      || b.paintMessages,
              quest:             Object.assign({}, b.quest, c.quest || {}),
              useVectorGraphics: c.useVectorGraphics  !== undefined ? c.useVectorGraphics : b.useVectorGraphics
            };
          } else {
            merged[cfgKey] = config.themes[cfgKey];
          }
        }
        return merged;
      }
      return base;
    },

    applyFromConfig: function (config) {
      var themes = this.resolveThemes(config);
      var key = this.getThemeName(config);
      var selected = themes[key] || themes.panda || FALLBACK_THEMES.panda;
      applyThemeObject(key, selected);
      return selected;
    },

    getGameTitle: function (t, dayId, fallback) {
      var entry = (t && t.games && t.games[dayId]);
      if (typeof entry === 'object' && entry !== null) return entry.title || fallback || dayId;
      return entry || fallback || dayId;
    },

    getGameClue: function (t, dayId, fallback) {
      var entry = (t && t.games && t.games[dayId]);
      if (typeof entry === 'object' && entry !== null) return entry.clue || fallback || "";
      return fallback || "";
    },

    getGameInstructions: function (t, dayId, fallback) {
      var entry = (t && t.games && t.games[dayId]);
      if (typeof entry === 'object' && entry !== null) return entry.instructions || fallback || "";
      return fallback || "";
    },

    getString: function (t, key, fallback) {
      return (t && t.strings && t.strings[key]) || fallback || "";
    },

    getIcon: function (t, key, fallback) {
      return (t && t.icons && t.icons[key]) || fallback || "🎮";
    },

    getCanvas: function (t, key, fallback) {
      return (t && t.canvas && t.canvas[key]) || fallback || "#222";
    }
  };

})(window, document);
