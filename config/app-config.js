(function () {
  // ─────────────────────────────────────────────────────────────────────────
  // BIRTHDAY GAME PACK — app-config.js
  //
  // HOW THEMING WORKS:
  //   • Set activeTheme to any key below to switch the entire look instantly.
  //   • Each theme in engine/theme-manager.js defines:
  //       colors  — all CSS variables (background, surface, accent, etc.)
  //       strings — UI text (play button label, mascot name, modal copy)
  //       games   — per-day title overrides shown in the launcher
  //   • You never need to touch global.css or launcher.js to change a theme.
  //   • To create a new theme, add a new entry to FALLBACK_THEMES in
  //     engine/theme-manager.js following the same structure.
  //
  // AVAILABLE THEMES:  "panda" | "penguin" | "brainrot" | "transformer" | "pirate" | "dino" | "minecraft"
  //   Bonus themes (fully supported): "pokemon" | "unicorn" | "space"
  // ─────────────────────────────────────────────────────────────────────────
  window.APP_CONFIG = {

    // ✏️ App-level title (shown in the launcher header)
    appTitle: "Birthday Adventure Game Pack",

    // ✏️ Replace with your child's name
    playerName: "Liora",

    // ✏️ Replace with the actual birthday date (YYYY-MM-DD)
    birthdayDate: "2026-05-26",

    totalDays: 10,

    // Optional: set a date here to preview a specific day (e.g. "2026-03-19")
    todayOverride: "",

    // ─────────────────────────────────────────────────────────────────────
    // ✏️ CHANGE THIS ONE LINE to switch the entire theme.
    //    See AVAILABLE THEMES list at the top of this file.
    // ─────────────────────────────────────────────────────────────────────
    activeTheme: "panda",

    // ─────────────────────────────────────────────────────────────────────
    // THEME OVERRIDES — Customize per-theme specific text here.
    // Labels, titles, and secret clues can be defined for each theme.
    // ─────────────────────────────────────────────────────────────────────
    themes: {
      panda: {
        games: {
          day1: { title: "Panda Catch", clue: "Clue 1: Check near the bamboo plant!" },
          day2: { title: "Panda Memory", clue: "Clue 2: Look under the panda plushie!" },
          day3: { title: "Panda Stack", clue: "Clue 3: Your next gift is in the kitchen drawer." },
          day4: { title: "Panda Wordle", clue: "Clue 4: Check behind the green curtain." },
          day5: { title: "Bamboo Tap", clue: "Clue 5: Look inside the empty cookie jar!" },
          day6: { title: "Panda Sudoku", clue: "Clue 6: It's hiding in the shoe rack." },
          day7: { title: "Panda Paint By Number", clue: "Clue 7: Check the bookshelf on the 3rd shelf." },
          day8: { title: "Panda Tetris", clue: "Clue 8: Look under the sofa cushions!" },
          day9: { title: "Panda Code Breaker", clue: "Clue 9: Check the garden near the roses." },
          day10: { title: "Panda Birthday Quest", clue: "Final clue: Happy Birthday! Your main gift is in the trunk of the car! 🎁" }
        }
      },
      transformer: {
        games: {
          day1: { title: "Energon Harvest", clue: "Clue 1: Your first piece of energon is near the toaster!" },
          day2: { title: "Matrix Memory", clue: "Clue 2: The second matrix shard is behind the TV." },
          day3: { title: "Scrapheap Stack", clue: "Clue 3: Scraps are gathering in the laundry room." },
          day4: { title: "Cyber-Words", clue: "Clue 4: Decrypt the signal in the hallway closet." },
          day5: { title: "Energon Tap", clue: "Clue 5: Tap into the power source in the garage." },
          day6: { title: "Vector Sudoku", clue: "Clue 6: Calculate the coordinates in the study." },
          day7: { title: "Blueprint Paint", clue: "Clue 7: The blueprint is hidden in the toy box." },
          day8: { title: "Alloy Tetris", clue: "Clue 8: Assemble the alloy in the pantry." },
          day9: { title: "Encryption Breaker", clue: "Clue 9: Break the cipher in your bedside table." },
          day10: { title: "The Prime Final Quest", clue: "Final clue: Happy Birthday! Roll out to the backyard for your gift! 🎁" }
        }
      },
      penguin: {
        games: {
          day1: { title: "Fish Catch", clue: "Clue 1: Check the freezer for a chilly surprise!" },
          day2: { title: "Ice Memory", clue: "Clue 2: Look under the welcome mat." },
          day3: { title: "Iceberg Stack", clue: "Clue 3: Your gift is resting on the bookshelf." },
          day4: { title: "Penguin Wordle", clue: "Clue 4: Decipher the code in the laundry room." },
          day5: { title: "Fish Tap", clue: "Clue 5: Look inside the penguin jar in the kitchen!" },
          day6: { title: "Arctic Sudoku", clue: "Clue 6: Check the coat rack pocket." },
          day7: { title: "Penguin Paint", clue: "Clue 7: Look behind the sofa." },
          day8: { title: "Ice Tetris", clue: "Clue 8: Check under the dining table." },
          day9: { title: "Igloo Breaker", clue: "Clue 9: Look in the garden shed." },
          day10: { title: "Penguin Birthday Quest", clue: "Final clue: Happy Birthday! Your gift is waiting in the garage! 🎁" }
        }
      },
      brainrot: {
        games: {
          day1: { title: "Tax Collector", clue: "Clue 1: No cap, check the fridge!" },
          day2: { title: "Mewing Match", clue: "Clue 2: Big Yikes, look in the mailbox." },
          day3: { title: "Sigma Stack", clue: "Clue 3: Absolute W, check the shoe box." },
          day4: { title: "Vibe Words", clue: "Clue 4: No cap, look under your bed." },
          day5: { title: "Rizz Tap", clue: "Clue 5: Skibidi! Check the toilet tank (jk, check the vanity)." },
          day6: { title: "Ohio Sudoku", clue: "Clue 6: Only in Ohio... check the trash can (clean one!)." },
          day7: { title: "Brainrot Paint", clue: "Clue 7: Look behind the TV, fr fr." },
          day8: { title: "Sigma Tiles", clue: "Clue 8: Slay! Look in the microwave." },
          day9: { title: "Aura Code", clue: "Clue 9: Main character energy! Check the car." },
          day10: { title: "The Final Fanum Tax", clue: "Final clue: Happy Birthday! Fanum Taxed your gift to the backyard! 🎁" }
        }
      },
      pirate: {
        games: {
          day1:  { title: "Treasure Catch",          clue: "Clue 1: X marks the spot — check near the front door, ye scurvy scallywag!" },
          day2:  { title: "Pirate Memory",           clue: "Clue 2: A pirate's memory never fails — search the bookshelf for your next prize!" },
          day3:  { title: "Cannon Stack",            clue: "Clue 3: Load the cannons! Your loot is hiding in the kitchen cupboard." },
          day4:  { title: "Sea-Words",               clue: "Clue 4: The sea holds secrets — decode the message hidden in the coat closet!" },
          day5:  { title: "Doubloon Tap",            clue: "Clue 5: Pieces of eight! Check near the sofa cushions, matey." },
          day6:  { title: "Captain's Sudoku",        clue: "Clue 6: Navigate by the stars — your treasure is in the bathroom cabinet!" },
          day7:  { title: "Treasure Map Paint",      clue: "Clue 7: Follow the painted map! The next clue is under the dining table." },
          day8:  { title: "Kraken Tetris",           clue: "Clue 8: The Kraken guards this prize — brave the toy box to find it!" },
          day9:  { title: "Code Breaker's Chest",    clue: "Clue 9: Break the code! Look in the garden near the biggest plant." },
          day10: { title: "The Final Treasure Quest", clue: "Final clue: Ahoy! Happy Birthday! Your biggest treasure is in the car boot! 🎁" }
        }
      },
      dino: {
        games: {
          day1:  { title: "Egg Catch",            clue: "Clue 1: The first fossil is hidden near the couch — stomp over and check!" },
          day2:  { title: "Dino Memory",          clue: "Clue 2: A diplodocus never forgets — look behind the TV for your prize!" },
          day3:  { title: "Boulder Stack",        clue: "Clue 3: Roll those boulders! Your next find is in the kitchen drawer." },
          day4:  { title: "Dino-Words",           clue: "Clue 4: Decipher the prehistoric script — check the bookshelf for clues!" },
          day5:  { title: "Fossil Tap",           clue: "Clue 5: Tap like a raptor! Your fossil is hiding in the shoe rack." },
          day6:  { title: "Jurassic Sudoku",      clue: "Clue 6: Jurassic puzzle solved — check under your pillow for the prize!" },
          day7:  { title: "Dino Paint By Number", clue: "Clue 7: Paint the dino! Look in the toy box for your next surprise." },
          day8:  { title: "Meteor Tetris",        clue: "Clue 8: Dodge the meteors! Your treasure is waiting in the laundry room." },
          day9:  { title: "Fossil Code",          clue: "Clue 9: The fossil code is cracked — search the garden for the final clue!" },
          day10: { title: "The Final Dino Quest", clue: "Final clue: ROAR! Happy Birthday! Your main gift is hidden in the car boot! 🎁" }
        }
      },
      minecraft: {
        games: {
          day1:  { title: "Diamond Catch",       clue: "Clue 1: Mine the front door area — a gift block has spawned near the entrance!" },
          day2:  { title: "Crafting Memory",     clue: "Clue 2: Open the crafting table! Your next recipe is hiding in the kitchen." },
          day3:  { title: "Block Stack",         clue: "Clue 3: Stack those blocks! Build up to the bookshelf to find your prize." },
          day4:  { title: "Mine-Words",          clue: "Clue 4: Dig deeper for words — check under the sofa for buried treasure!" },
          day5:  { title: "Creeper Tap",         clue: "Clue 5: SSSSSS... don't explode! Your gift is waiting near the shoe rack." },
          day6:  { title: "Redstone Sudoku",     clue: "Clue 6: Activate the redstone circuit in the hallway cupboard!" },
          day7:  { title: "Pixel Art Paint",     clue: "Clue 7: Craft your pixel art! The next chest is hidden behind the TV." },
          day8:  { title: "TNT Tetris",          clue: "Clue 8: Don't blow up! Your loot chest is in the toy box." },
          day9:  { title: "Chest Code Breaker",  clue: "Clue 9: Break the chest code — check the garden for your final clue!" },
          day10: { title: "The Final Boss Quest", clue: "Final clue: You defeated the Ender Dragon! Happy Birthday! Your gift is in the car boot! 🎁" }
        }
      }
    },

    // ─────────────────────────────────────────────────────────────────────
    // DAYS — The sequence of games. Titles and clues are now resolved 
    //        automatically based on your activeTheme.
    //
    // • "id"           — internal ID (day1, day2...)
    // • "file"         — path to the game HTML.
    // • "instructions" — shown in the How to Play modal.
    // ─────────────────────────────────────────────────────────────────────
    days: [
      {
        id: "day1", dayNumber: 1,
        file: "../games/catch.html",
        instructions: "<span style='color: var(--accent); font-weight: 800;'>Goal:</span> Catch the falling objects!<br><br>Move your basket left and right using the arrow keys or by tapping the sides of the screen. Avoid the bad items or you'll lose a life!"
      },
      {
        id: "day2", dayNumber: 2,
        file: "../games/memory-match.html",
        instructions: "<span style='color: var(--accent); font-weight: 800;'>Goal:</span> Find all the matching pairs!<br><br>Tap on two cards to flip them over. Try to remember where the items are so you can match them all before time runs out."
      },
      {
        id: "day3", dayNumber: 3,
        file: "../games/stack.html",
        instructions: "<span style='color: var(--accent); font-weight: 800;'>Goal:</span> Build the tallest tower!<br><br>Click or tap anywhere to drop the moving block. Time your drops perfectly to keep the tower balanced and stable."
      },
      {
        id: "day4", dayNumber: 4,
        file: "../games/wordle.html",
        instructions: "<span style='color: var(--accent); font-weight: 800;'>Goal:</span> Guess the secret word!<br><br>Type a word and hit Enter. A green letter is in the correct spot. A yellow letter is in the word but wrong spot. Grey means the letter is not in the word."
      },
      {
        id: "day5", dayNumber: 5,
        file: "../games/dressup.html",
        instructions: "<span style='color: var(--accent); font-weight: 800;'>Goal:</span> Tap targets and dodge enemies!<br><br>Targets pop up around the screen. Tap them for points, but avoid enemies or you lose hearts. Reach the target score before time runs out!"
      },
      {
        id: "day6", dayNumber: 6,
        file: "../games/sudoku.html",
        instructions: "<span style='color: var(--accent); font-weight: 800;'>Goal:</span> Fill the entire grid!<br><br>Every row, column, and 3x3 square must contain the numbers 1 through 9 exactly once. Tap an empty square and select a number to fill it."
      },
      {
        id: "day7", dayNumber: 7,
        file: "../games/by-numbers.html",
        instructions: "<span style='color: var(--accent); font-weight: 800;'>Goal:</span> Color the canvas!<br><br>Select a color from the palette at the bottom. Then tap all the sections on the canvas that match that number to paint them."
      },
      {
        id: "day8", dayNumber: 8,
        file: "../games/tetris-mosaic.html",
        instructions: "<span style='color: var(--accent); font-weight: 800;'>Goal:</span> Clear lines to score points!<br><br>Move the falling blocks left or right and rotate them to fit together. Completing a full horizontal line clears it from the board!"
      },
      {
        id: "day9", dayNumber: 9,
        file: "../games/code-breaker.html",
        instructions: "<span style='color: var(--accent); font-weight: 800;'>Goal:</span> Crack the secret code!<br><br>Solve 8 logic and math puzzles. Each correct answer reveals one letter. Solve all 8 to spell the hidden birthday word!"
      },
      {
        id: "day10", dayNumber: 10,
        file: "../games/birthday-quest.html",
        instructions: "<span style='color: var(--accent); font-weight: 800;'>Goal:</span> Complete the epic quest!<br><br>Run through 3 stages — choose your path, crack the code, and complete the final challenge. Finish all 3 to unlock your birthday message!"
      }
    ]
  };
})();
