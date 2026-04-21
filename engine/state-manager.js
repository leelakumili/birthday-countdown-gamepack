(function (window) {
  var App = window.PandaAdventure = window.PandaAdventure || {};
  var STORAGE_KEY = "birthday_adventure_state_v2";
  var OLD_KEY = "panda_adventure_state_v2";

  // Migration logic
  (function() {
    var old = localStorage.getItem(OLD_KEY);
    var current = localStorage.getItem(STORAGE_KEY);
    if (old && !current) {
       localStorage.setItem(STORAGE_KEY, old);
       // we keep OLD_KEY for a bit to avoid accidental loss if theme switches back
    }
  })();

  function buildEmptyState(config) {
    var progress = {};
    for (var i = 0; i < config.days.length; i++) {
      progress[config.days[i].id] = false;
    }

    return {
      playerName: config.playerName || "Explorer",
      progress: progress,
      streak: 0,
      lastCompletedDay: 0,
      lastUnlockedDay: 1
    };
  }

  App.State = {
    load: function (config) {
      var saved = null;
      try {
        saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      } catch (err) {
        saved = null;
      }

      var base = buildEmptyState(config);
      if (!saved) return base;

      // Merge to protect against config changes (new days added later).
      for (var dayId in base.progress) {
        if (Object.prototype.hasOwnProperty.call(base.progress, dayId)) {
          base.progress[dayId] = !!(saved.progress && saved.progress[dayId]);
        }
      }

      base.playerName = saved.playerName || base.playerName;
      base.streak = typeof saved.streak === "number" ? saved.streak : 0;
      base.lastCompletedDay = typeof saved.lastCompletedDay === "number" ? saved.lastCompletedDay : 0;
      base.lastUnlockedDay = typeof saved.lastUnlockedDay === "number" ? saved.lastUnlockedDay : 1;
      return base;
    },

    save: function (state) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (err) {
        if (typeof App.State.onSaveError === 'function') {
          App.State.onSaveError(err);
        }
      }
    },

    // Optional hook — launcher overrides this to show a kid-readable toast.
    onSaveError: null,

    saveBestScore: function (state, gameId, score) {
      if (!state.bestScores) state.bestScores = {};
      if (!state.bestScores[gameId] || score > state.bestScores[gameId]) {
        state.bestScores[gameId] = score;
        return true; // new record
      }
      return false;
    },

    getBestScore: function (state, gameId) {
      return (state.bestScores && state.bestScores[gameId]) || 0;
    }
  };
})(window);
