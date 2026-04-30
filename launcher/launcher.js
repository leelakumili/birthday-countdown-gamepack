(function (window, document) {
  var App = window.PandaAdventure = window.PandaAdventure || {};

  var escapeHtml             = App.Utils.escapeHtml.bind(App.Utils);
  var sanitizePlayerName     = App.Utils.sanitizePlayerName.bind(App.Utils);
  var sanitizeInstructionHtml = App.Utils.sanitizeInstructionHtml.bind(App.Utils);
  var MAX_PLAYER_NAME_LEN    = App.Utils.MAX_PLAYER_NAME_LEN;

  var config = App.Config.get();

  var state = App.State.load(config);
  var selectedThemeName = App.Theme.getThemeName(config);
  var activeTheme = App.Theme.applyFromConfig(config);
  var PLAYERS_KEY = "birthday_adventure_players_v1";
  var OLD_PLAYERS_KEY = "panda_adventure_players_v1";
  var OLD_LAUNCHER_KEY = "pandabday_launcher";

  // Migration logic
  (function() {
    var p1 = localStorage.getItem(OLD_PLAYERS_KEY);
    var p2 = localStorage.getItem(OLD_LAUNCHER_KEY);
    var current = localStorage.getItem(PLAYERS_KEY);
    if (!current && (p1 || p2)) {
       // favor the engine's players key first
       if (p1) localStorage.setItem(PLAYERS_KEY, p1);
       else if (p2) localStorage.setItem(PLAYERS_KEY, p2);
    }
  })();

  var dayListEl = document.getElementById("dayList");
  var todayGameEl = document.getElementById("todayGame");

  var completionModalEl = document.getElementById("completionModal");
  var modalTitleEl = document.getElementById("modalTitle");
  var modalMessageEl = document.getElementById("modalMessage");
  var clueRevealEl = document.getElementById("clueReveal");

  var howToModalEl = document.getElementById("howToModal");
  var howToTitleEl = document.getElementById("howToTitle");
  var howToMessageEl = document.getElementById("howToMessage");

  var playerModalEl = document.getElementById("playerModal");
  var playerListEl = document.getElementById("playerList");
  var newPlayerInputEl = document.getElementById("newPlayerInput");

  var selectedPlayerName = state.playerName || "";
  var adventureKidName = config.playerName || "Birthday Kid";

  var parseDate = App.Unlock.parseDate;

  function getNowUTC() {
    var n = new Date();
    return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate(), n.getUTCHours(), n.getUTCMinutes(), n.getUTCSeconds()));
  }

  function getBirthdayUTC() {
    var d = parseDate(config.birthdayDate);
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0));
  }

  function getDayCalendarLabel(dayNumber) {
    var offset = config.totalDays - dayNumber;
    var date = new Date(birthdayUTC.getTime() - (offset * 24 * 60 * 60 * 1000));
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return months[date.getUTCMonth()] + " " + date.getUTCDate();
  }

  var toastEl = null;
  var toastTimer = null;
  function showErrorToast(message) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "pa-toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 3200);
  }

  function countCompletedDays(progressMap) {
    var stars = 0;
    for (var key in progressMap) {
      if (Object.prototype.hasOwnProperty.call(progressMap, key) && progressMap[key]) stars += 1;
    }
    return stars;
  }

  var playersCache = null;

  function loadPlayers() {
    if (playersCache) return playersCache;
    try {
      var raw = localStorage.getItem(PLAYERS_KEY);
      if (!raw) {
        playersCache = [];
        return playersCache;
      }
      var parsed = JSON.parse(raw);
      playersCache = Array.isArray(parsed) ? parsed : [];
      return playersCache;
    } catch (e) {
      playersCache = [];
      return playersCache;
    }
  }

  function savePlayers(players) {
    playersCache = players;
    try {
      localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
    } catch (e) {
      showErrorToast("Couldn't save — your browser storage may be full.");
    }
  }

  function ensureDefaultPlayer() {
    var players = loadPlayers();
    if (!players.length) {
      players.push({ name: state.playerName || "Birthday Kid", stars: 0, streak: 0 });
      savePlayers(players);
    }
    if (!selectedPlayerName) {
      selectedPlayerName = players[0].name;
      state.playerName = selectedPlayerName;
      App.State.save(state);
    }
  }

  function syncCurrentPlayerStats() {
    var players = loadPlayers();
    var stars = countCompletedDays(state.progress);
    for (var i = 0; i < players.length; i++) {
      if (players[i].name === state.playerName) {
        players[i].stars = stars;
        players[i].streak = state.streak;
      }
    }
    savePlayers(players);
  }

  function renderPlayerModal() {
    var players = loadPlayers();
    playerListEl.innerHTML = "";

    for (var i = 0; i < players.length; i++) {
      (function () {
        var p = players[i];
        var row = document.createElement("div");
        row.className = "player-item" + (p.name === selectedPlayerName ? " active" : "");
        row.innerHTML =
          '<div class="player-left">' +
          '  <div class="player-dot">' + escapeHtml(p.name.slice(0, 1).toUpperCase()) + '</div>' +
          '  <div><div class="player-name">' + escapeHtml(p.name) + '</div><div class="player-meta">' + (p.stars || 0) + ' stars 🌟</div></div>' +
          '</div>' +
          '<button class="player-remove" title="Rename">✎</button>' +
          '<button class="player-remove" title="Reset progress">↺</button>' +
          '<button class="player-remove" title="Remove">×</button>';

        row.querySelector(".player-left").addEventListener("click", function () {
          selectedPlayerName = p.name;
          renderPlayerModal();
        });

        row.querySelectorAll(".player-remove")[0].addEventListener("click", function () {
          var newName = window.prompt("Rename player (max " + MAX_PLAYER_NAME_LEN + " chars)", p.name);
          if (newName == null) return;
          newName = sanitizePlayerName(newName);
          if (!newName || newName.toLowerCase() === p.name.toLowerCase()) return;
          for (var k = 0; k < players.length; k++) {
            if (players[k].name.toLowerCase() === newName.toLowerCase()) return;
          }
          for (var m = 0; m < players.length; m++) {
            if (players[m].name === p.name) {
              players[m].name = newName;
              break;
            }
          }
          if (selectedPlayerName === p.name) selectedPlayerName = newName;
          if (state.playerName === p.name) {
            state.playerName = newName;
            App.State.save(state);
          }
          savePlayers(players);
          renderPlayerModal();
          renderHeader();
        });

        row.querySelectorAll(".player-remove")[1].addEventListener("click", function () {
          var typed = window.prompt(
            "To reset " + p.name + "'s progress, type the name \"" + p.name + "\" below.\n\n" +
            "This clears all stars and scores and cannot be undone."
          );
          if (typed == null) return;
          if (sanitizePlayerName(typed).toLowerCase() !== p.name.toLowerCase()) {
            window.alert("Name didn't match — progress is safe.");
            return;
          }
          for (var k = 0; k < players.length; k++) {
            if (players[k].name === p.name) {
              players[k].stars = 0;
              players[k].streak = 0;
              break;
            }
          }
          savePlayers(players);
          if (p.name === state.playerName) {
            for (var dayId in state.progress) {
              if (Object.prototype.hasOwnProperty.call(state.progress, dayId)) {
                state.progress[dayId] = false;
              }
            }
            state.streak = 0;
            state.lastCompletedDay = 0;
            state.lastUnlockedDay = 1;
            state.bestScores = {};
            App.State.save(state);
            renderHeader();
            renderDays();
          }
          renderPlayerModal();
        });

        row.querySelectorAll(".player-remove")[2].addEventListener("click", function () {
          if (players.length <= 1) {
            window.alert("Can't remove the last player.");
            return;
          }
          var typed = window.prompt(
            "To remove " + p.name + ", type the name \"" + p.name + "\" below.\n\n" +
            "This deletes the player and their progress."
          );
          if (typed == null) return;
          if (sanitizePlayerName(typed).toLowerCase() !== p.name.toLowerCase()) {
            window.alert("Name didn't match — player is safe.");
            return;
          }
          var next = [];
          for (var j = 0; j < players.length; j++) {
            if (players[j].name !== p.name) next.push(players[j]);
          }
          if (selectedPlayerName === p.name) selectedPlayerName = next[0].name;
          savePlayers(next);
          renderPlayerModal();
        });

        playerListEl.appendChild(row);
      })();
    }
  }

  function openPlayerModal() {
    renderPlayerModal();
    playerModalEl.classList.add("open");
  }

  function closePlayerModal() {
    playerModalEl.classList.remove("open");
  }

  var msPerDay = 24 * 60 * 60 * 1000;

  function renderCountdown() {
    var now = getNowUTC();
    var birthday = getBirthdayUTC();

    // Derive all units from the same total so nothing can go negative.
    var totalMs = Math.max(0, birthday.getTime() - now.getTime());
    var days  = Math.floor(totalMs / msPerDay);
    var rem   = totalMs - days * msPerDay;
    var hours = Math.floor(rem / (60 * 60 * 1000));
    rem -= hours * 60 * 60 * 1000;
    var mins  = Math.floor(rem / (60 * 1000));
    rem -= mins * 60 * 1000;
    var secs  = Math.floor(rem / 1000);

    document.getElementById("cdDays").textContent    = String(days).padStart(2, "0");
    document.getElementById("cdHours").textContent   = String(hours).padStart(2, "0");
    document.getElementById("cdMinutes").textContent = String(mins).padStart(2, "0");
    document.getElementById("cdSeconds").textContent = String(secs).padStart(2, "0");
  }

  function getGameUrl(day) {
    if (!day) return "";
    var filePath = day.file;
    var joiner = filePath.indexOf("?") === -1 ? "?" : "&";
    var url = filePath + joiner + "theme=" + encodeURIComponent(selectedThemeName);
    if (day.id) url += "&dayId=" + encodeURIComponent(day.id);
    if (selectedPlayerName) url += "&player=" + encodeURIComponent(selectedPlayerName);
    return url;
  }

  function openGame(day) {
    window.location.href = getGameUrl(day);
  }

  function renderTodayCard(todayDay) {
    var today = null;
    for (var i = 0; i < config.days.length; i++) {
      if (config.days[i].dayNumber === todayDay) {
        today = config.days[i];
        break;
      }
    }
    if (!today) {
      document.getElementById("todayLabel").textContent = "TODAY'S GAME";
      document.getElementById("todayTitle").textContent = "Games not unlocked yet!";
      document.getElementById("todayDescription").textContent = "Your first game unlocks when the countdown gets closer. Check back soon!";
      todayGameEl.innerHTML = "";
      return;
    }

    document.getElementById("todayLabel").textContent = "TODAY'S GAME — DAY " + today.dayNumber;
    document.getElementById("todayTitle").textContent = App.Theme.getGameTitle(activeTheme, today.id, today.title);
    document.getElementById("todayDescription").textContent = "Day " + today.dayNumber + " is here! Your adventure begins! Complete all 10 levels to unlock your secret birthday clue! 🎁";

    todayGameEl.innerHTML = "";
    var btn = document.createElement("button");
    btn.className = "pa-btn pa-btn-primary";
    btn.style.width = "100%";
    btn.textContent = App.Theme.getString(activeTheme, "playBtn", "Play Now! 🎮");
    btn.addEventListener("click", function () { openGame(today); });
    todayGameEl.appendChild(btn);
  }



  function renderDays() {
    var todayDay = App.Unlock.getTodayDayNumber(config);
    dayListEl.innerHTML = "";

    for (var i = 0; i < config.days.length; i++) {
      (function () {
        var day = config.days[i];
        var unlocked = App.Unlock.isDayUnlocked(day.dayNumber, todayDay);
        var completed = !!state.progress[day.id];

        var card = document.createElement("div");
        card.className = "day-card";
        if (!unlocked) card.className += " locked mystery";
        if (day.dayNumber === todayDay) card.className += " today";
        if (state.lastUnlockedDay === day.dayNumber) card.className += " newly-unlocked";

        var topLabel = "DAY " + day.dayNumber + " · " + getDayCalendarLabel(day.dayNumber) + (day.dayNumber === todayDay ? " · TODAY!" : "");

        if (!unlocked) {
          card.innerHTML =
            "<div class='dc-badge'>" + escapeHtml(topLabel) + "</div>" +
            '<div class="surprise-box" style="margin-top: 12px;">' +
            '  <div class="mystery-icon" style="font-size:28px;">🎁</div>' +
            '  <div class="surprise-qs" style="margin: 8px 0; font-size: 1.4rem;">? ? ?</div>' +
            '  <div class="surprise-lbl">MYSTERY GAME</div>' +
            '  <div class="surprise-when">' + escapeHtml(day.dayNumber === todayDay + 1 ? "Tomorrow" : "In " + (day.dayNumber - todayDay) + " days") + '</div>' +
            '</div>';
        } else {
          var displayTitle = App.Theme.getGameTitle(activeTheme, day.id, day.title);
          card.innerHTML =
            "<div class='dc-badge'>" + escapeHtml(topLabel) + "</div>" +
            "<h3 class='dc-name' style='font-size: 1.4rem;'>" + escapeHtml(displayTitle) + "</h3>";
          
          if (completed) {
            card.innerHTML += "<div class='dc-stars'>⭐⭐⭐</div>";
            var best = App.State.getBestScore(state, day.id);
            if (best > 0) {
              card.innerHTML += "<div class='dc-meta' style='font-size:0.85rem; color: var(--muted); margin-top:4px;'>Best: " + best + " pts</div>";
            }
          }
        }

        if (unlocked) {
          var btnGroup = document.createElement("div");
          btnGroup.style.display = "flex";
          btnGroup.style.flexDirection = "column";
          btnGroup.style.gap = "8px";
          btnGroup.style.marginTop = "12px";

          var actionBtn = document.createElement("button");
          actionBtn.className = "pa-btn pa-btn-primary";
          actionBtn.style.width = "100%";
          actionBtn.innerHTML = "▶ " + (completed ? "Replay" : App.Theme.getString(activeTheme, "playBtn", "Play Now! 🎮"));
          actionBtn.addEventListener("click", function () { openGame(day); });
          btnGroup.appendChild(actionBtn);

          var howToBtn = document.createElement("button");
          howToBtn.className = "pa-btn pa-btn-ghost";
          howToBtn.style.width = "100%";
          howToBtn.innerHTML = "📖 How to Play";
          howToBtn.addEventListener("click", function() {
              howToTitleEl.textContent = "How to Play " + App.Theme.getGameTitle(activeTheme, day.id, day.title);
              var instructions = App.Theme.getGameInstructions(activeTheme, day.id, day.instructions);
              var fallbackText = App.Theme.getString(activeTheme, "howToFallback", "Hop in and figure it out! 🎮");
              if (instructions) {
                howToMessageEl.innerHTML = sanitizeInstructionHtml(instructions);
              } else {
                howToMessageEl.textContent = fallbackText;
              }
              howToModalEl.classList.add("open");
              howToModalEl.setAttribute("aria-hidden", "false");
          });
          btnGroup.appendChild(howToBtn);

          card.appendChild(btnGroup);
        }
        
        dayListEl.appendChild(card);
      })();
    }

    renderTodayCard(todayDay);

  }

  function renderHeader() {
    document.getElementById("heroMascot").textContent = activeTheme.mascot;
    // sync player modal mascot
    var pmm = document.getElementById("playerModalMascot");
    if (pmm) pmm.textContent = activeTheme.mascot;
    // sync close HowTo button
    var chtb = document.getElementById("closeHowToBtn");
    if (chtb) chtb.textContent = "Got it! " + activeTheme.mascot;
    var appTitleEl = document.getElementById("appTitle");
    var appTitleText = App.Theme.getString(activeTheme, "appTitle", config.appTitle || "Adventure Game Pack");
    appTitleEl.textContent = "";
    var appTitleSegments = appTitleText.split(" Birthday ");
    for (var s = 0; s < appTitleSegments.length; s++) {
      if (s > 0) appTitleEl.appendChild(document.createElement("br"));
      appTitleEl.appendChild(document.createTextNode(appTitleSegments[s]));
    }
    document.getElementById("countdownLabel").textContent = "Birthday Countdown For";
    
    var kidNameHeader = document.getElementById("kidNameHeader");
    if (kidNameHeader) kidNameHeader.textContent = adventureKidName;

    document.getElementById("profileAvatar").textContent = (state.playerName || "A").slice(0, 1).toUpperCase();
    document.getElementById("profileName").textContent = state.playerName;
    var stars = countCompletedDays(state.progress);
    document.getElementById("profileSub").textContent = stars + " stars 🌟";
  }

  function openCompletionModal(day, payload) {
    modalTitleEl.textContent = "You completed Day " + day.dayNumber + "!";
    var mascotSays = App.Theme.getString(activeTheme, "mascotSays", "Game says");
    var prefix = App.Theme.getString(activeTheme, "completionPrefix", "Score");
    var suffix = App.Theme.getString(activeTheme, "completionSuffix", "at level");
    var winMsg = App.Theme.getString(activeTheme,"winMsg",""); modalMessageEl.textContent = mascotSays + ": " + prefix + " " + payload.score + " " + suffix + " " + payload.level + (winMsg ? " — " + winMsg : "") + ".";
    clueRevealEl.classList.remove("visible");
    clueRevealEl.textContent = "";

    document.getElementById("revealClueBtn").onclick = function () {
      var clue = App.Theme.getGameClue(activeTheme, day.id, day.clue);
      clueRevealEl.textContent = clue;
      clueRevealEl.classList.add("visible");
    };

    completionModalEl.classList.add("open");
    completionModalEl.setAttribute("aria-hidden", "false");
  }

  document.getElementById("closeModalBtn").addEventListener("click", function () {
    completionModalEl.classList.remove("open");
    completionModalEl.setAttribute("aria-hidden", "true");
    syncCurrentPlayerStats();
    renderHeader();
    renderDays();
  });

  document.getElementById("closeHowToBtn").addEventListener("click", function() {
    howToModalEl.classList.remove("open");
    howToModalEl.setAttribute("aria-hidden", "true");
  });

  document.getElementById("switchPlayerBtn").addEventListener("click", openPlayerModal);

  document.getElementById("addPlayerBtn").addEventListener("click", function () {
    var name = sanitizePlayerName(newPlayerInputEl.value);
    if (!name) return;

    var players = loadPlayers();
    for (var i = 0; i < players.length; i++) {
      if (players[i].name.toLowerCase() === name.toLowerCase()) return;
    }

    players.push({ name: name, stars: 0, streak: 0 });
    savePlayers(players);
    selectedPlayerName = name;
    newPlayerInputEl.value = "";
    renderPlayerModal();
  });

  document.getElementById("startPlayerBtn").addEventListener("click", function () {
    if (!selectedPlayerName) return;
    state.playerName = selectedPlayerName;
    App.State.save(state);
    closePlayerModal();
    renderHeader();
    renderDays();
  });

  App.Bridge.listen(function (payload) {
    var matchedDay = null;
    for (var i = 0; i < config.days.length; i++) {
      if (config.days[i].id === payload.gameId) {
        matchedDay = config.days[i];
        break;
      }
    }
    if (!matchedDay) return;

    App.State.saveBestScore(state, matchedDay.id, payload.score);
    App.Unlock.updateProgress(state, matchedDay.id, matchedDay.dayNumber);
    App.State.save(state);
    syncCurrentPlayerStats();
    renderHeader();
    renderDays();
    openCompletionModal(matchedDay, payload);
  });

  App.State.onSaveError = function () {
    showErrorToast("Oops — couldn't save progress. Your browser storage may be full.");
  };

  ensureDefaultPlayer();
  var birthdayUTC = getBirthdayUTC();
  renderHeader();
  renderDays();
  renderCountdown();
  var countdownIntervalId = setInterval(renderCountdown, 1000);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      clearInterval(countdownIntervalId);
      countdownIntervalId = null;
    } else if (countdownIntervalId == null) {
      renderCountdown();
      countdownIntervalId = setInterval(renderCountdown, 1000);
    }
  });

  if (!state.playerName || state.playerName === "Explorer") {
    openPlayerModal();
  }
})(window, document);
