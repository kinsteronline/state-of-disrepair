"use strict";

/*
 * This is a basic retread of what jakesgordon did in
 * his state machine, but with less quality. I wanted 
 * to learn.
 *
 * Currently in a State of Disrepair
 *
 * So much learned & lifted from underscore.js
 *
 */
var SOD = (function StateOfDisrepair() {
  "use strict";

  var noop = function () {};

  function create(config) {
    var executeCallbacks = regeneratorRuntime.mark(function executeCallbacks(event) {
      return regeneratorRuntime.wrap(function executeCallbacks$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return callbacks[event].before.call();
          case 2:
            context$3$0.next = 4;
            return callbacks[event].on.call();
          case 4:
            context$3$0.next = 6;
            return callbacks[event].after.call();
          case 6:
          case "end":
            return context$3$0.stop();
        }
      }, executeCallbacks, this);
    });

    var events = config.events; // should dupe this
    var callbacks = {};
    var stateMachine = {};
    var currentState = undefined;

    // I'm not wild about this...
    function changeState(event) {
      var fromStates = Array.isArray(events[event].from) ? events[event].from : [events[event].from];
      var toState = events[event].to;

      return function () {
        // Firing the current state, effective noop
        if (currentState === toState) return;

        if (fromStates.indexOf(currentState) !== -1) {
          var cbs = executeCallbacks(event);
          // how do this moar smart?
          cbs.next(); // before
          cbs.next(); // on
          cbs.next(); // after
          currentState = toState;
        }
      };
    }

    Object.defineProperties(stateMachine, {
      initial: {
        value: config.initial
      },
      current: {
        get: function () {
          return currentState;
        }
      }
    });

    for (var _event in events) {
      stateMachine[_event] = changeState(_event);

      callbacks[_event] = {};
      callbacks[_event].on = events[_event].on || noop;
      callbacks[_event].before = events[_event].before || noop;
      callbacks[_event].after = events[_event].after || noop;
    }

    currentState = stateMachine.initial;
    return Object.create(stateMachine);
  }

  return {
    create: create
  };
})();