(function (window) {
  var App = window.PandaAdventure = window.PandaAdventure || {};

  function parseDate(raw) {
    var parts = raw.split("-");
    return new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)));
  }

  function getTodayISO(config) {
    if (config.todayOverride) return config.todayOverride;
    var now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString().slice(0, 10);
  }

  App.Unlock = {
    parseDate: parseDate,

    getTodayDayNumber: function (config) {
      var today = parseDate(getTodayISO(config));
      var birthday = parseDate(config.birthdayDate);
      var msPerDay = 24 * 60 * 60 * 1000;
      var diffDays = Math.floor((birthday - today) / msPerDay);
      var todayDay = config.totalDays - diffDays;
      if (todayDay > config.totalDays) return config.totalDays;
      return todayDay;
    },

    isDayUnlocked: function (dayNumber, todayDay) {
      return todayDay >= 1 && dayNumber <= todayDay;
    },

    updateProgress: function (state, dayId, dayNumber) {
      if (!state.progress[dayId]) {
        state.progress[dayId] = true;
        state.streak += 1;
      }
      if (dayNumber > state.lastCompletedDay) {
        state.lastCompletedDay = dayNumber;
      }
      if (dayNumber + 1 > state.lastUnlockedDay) {
        state.lastUnlockedDay = dayNumber + 1;
      }
    }
  };
})(window);
