(function (window) {
  var App = window.PandaAdventure = window.PandaAdventure || {};

  var MAX_PLAYER_NAME_LEN = 20;
  var CTRL_CHARS = /[\u0000-\u001F\u007F\u2028\u2029]/g;

  App.Utils = {
    MAX_PLAYER_NAME_LEN: MAX_PLAYER_NAME_LEN,

    escapeHtml: function (str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/`/g, '&#96;');
    },

    sanitizePlayerName: function (raw) {
      if (raw == null) return "";
      return String(raw)
        .replace(CTRL_CHARS, "")
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, MAX_PLAYER_NAME_LEN);
    },

    // Allows a small set of formatting tags (<br>, <b>, <strong>, <i>, <em>,
    // <u>, <span>, <ul>, <ol>, <li>, <p>, <div>) in developer-authored strings
    // while stripping everything else. NEVER call with user-provided content.
    sanitizeInstructionHtml: function (str) {
      var tpl = document.createElement('template');
      tpl.innerHTML = String(str || '');
      var allowedTags = {
        BR: 1, B: 1, STRONG: 1, I: 1, EM: 1, U: 1,
        SPAN: 1, UL: 1, OL: 1, LI: 1, P: 1, DIV: 1
      };
      var allowedAttrs = { style: 1, class: 1 };
      (function walk(node) {
        var children = Array.prototype.slice.call(node.childNodes);
        for (var i = 0; i < children.length; i++) {
          var child = children[i];
          if (child.nodeType === 1) {
            if (!allowedTags[child.nodeName]) {
              node.removeChild(child);
              continue;
            }
            var attrs = Array.prototype.slice.call(child.attributes);
            for (var j = 0; j < attrs.length; j++) {
              if (!allowedAttrs[attrs[j].name.toLowerCase()]) {
                child.removeAttribute(attrs[j].name);
              }
            }
            walk(child);
          } else if (child.nodeType !== 3) {
            node.removeChild(child);
          }
        }
      })(tpl.content);
      return tpl.innerHTML;
    }
  };
})(window);
