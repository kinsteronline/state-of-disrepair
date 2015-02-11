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
    var executeCallbacks = regeneratorRuntime.mark(

    // Store each as a *fn() above
    function executeCallbacks(event) {
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

    var events = Object.create(config.events);
    var callbacks = {};
    var stateMachine = {};
    var currentState = undefined;

    // I'm not wild about this...
    function changeState(event) {
      // states lists could be:
      //   1. Array
      //   2. An object with keys & null values
      //   3. A Set()
      var fromStates = Array.isArray(events[event].from) ? events[event].from : Array.of(events[event].from);
      var toState = events[event].to;

      // return *() => ...
      return function () {
        // Firing the current state, effective noop
        if (currentState === toState) return;
        //
        // Some jsperfs have noted that the indexOf is now
        // a bit faster than Object.in with keys & null values.
        //
        // The array.includes() is forward looking.
        //
        //if (fromStates.indexOf(currentState) !== -1) {
        if (fromStates.includes(currentState)) {
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