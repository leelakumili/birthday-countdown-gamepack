(function (window, document) {
  var App = window.PandaAdventure = window.PandaAdventure || {};

  function getPlayerName() {
    try {
      // App.State is provided by state-manager.js, which must be loaded before game-shell.js.
      if (App.State && window.APP_CONFIG) return App.State.load(window.APP_CONFIG).playerName || "Explorer";
      return "Explorer";
    } catch (e) {
      return "Explorer";
    }
  }

  App.GameShell = {
    mountTopBar: function (options) {
      if (App.Theme) App.Theme.applyFromConfig(null);

      var playerName = getPlayerName();
      var root = document.getElementById(options.rootId || "game-root");
      var bar = document.createElement("div");
      bar.className = "pa-topbar";
      bar.innerHTML =
        '<div class="top-left">' +
        '  <div class="top-avatar" style="background:var(--accent-2,#3b82f6)">' + playerName.slice(0, 1).toUpperCase() + '</div>' +
        '  <strong>' + playerName + '</strong>' +
        '</div>' +
        '<div style="display:flex; gap:8px; align-items:center;">' +
        '  <div class="stat-row">' +
        '    <div class="pa-stat">Score<strong id="statScore">0</strong></div>' +
        '    <div class="pa-stat">Level<strong id="statLevel">1</strong></div>' +
        '    <div class="pa-stat">Lives<strong id="statLives">3</strong></div>' +
        '    <div class="pa-stat">Timer<strong id="statTimer">60</strong></div>' +
        '  </div>' +
        '  <button class="pa-btn pa-btn-ghost" id="btnBack">🏠 Launcher</button>' +
        '</div>';
      root.prepend(bar);

      document.getElementById("btnBack").addEventListener("click", function () {
        window.location.href = "../launcher/index.html";
      });
    },

    setStats: function (stats) {
      if (stats.score != null) document.getElementById("statScore").textContent = stats.score;
      if (stats.level != null) document.getElementById("statLevel").textContent = stats.level;
      if (stats.lives != null) document.getElementById("statLives").textContent = stats.lives;
      if (stats.timer != null) document.getElementById("statTimer").textContent = stats.timer;
    }
  };
})(window, document);
