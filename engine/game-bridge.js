(function (window) {
  var App = window.PandaAdventure = window.PandaAdventure || {};
  var BRIDGE_KEY = "birthday_adventure_just_completed";
  var OLD_BRIDGE_KEY = "panda_just_completed";

  App.Bridge = {
    // Exposed for testing — override in tests to suppress navigation.
    _navigate: function (url) {
      window.location.href = url;
    },

    sendComplete: function (payload) {
      payload.type = "GAME_COMPLETE";
      localStorage.setItem(BRIDGE_KEY, JSON.stringify(payload));
      App.Bridge._navigate("../launcher/index.html");
    },

    listen: function (onComplete) {
      window.addEventListener("message", function (event) {
        if (event.origin !== window.location.origin) return;
        var data = event.data || {};
        if (data.type !== "GAME_COMPLETE") return;
        onComplete(data);
      });

      try {
        // Read new key first; fall back to old key for in-flight completions.
        var raw = localStorage.getItem(BRIDGE_KEY) || localStorage.getItem(OLD_BRIDGE_KEY);
        if (raw) {
          localStorage.removeItem(BRIDGE_KEY);
          localStorage.removeItem(OLD_BRIDGE_KEY);
          var payload = JSON.parse(raw);
          if (payload && payload.type === "GAME_COMPLETE") {
            onComplete(payload);
          }
        }
      } catch (e) {}
    }
  };
})(window);
