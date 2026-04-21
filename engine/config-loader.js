(function (window) {
  var App = window.PandaAdventure = window.PandaAdventure || {};

  App.Config = {
    get: function () {
      if (!window.APP_CONFIG) {
        throw new Error("APP_CONFIG missing. Load config/app-config.js before launcher.js");
      }
      return window.APP_CONFIG;
    }
  };
})(window);
