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

  const noop = () => { };

  function create(config) {

    let events = config.events; // should dupe this
    let callbacks = {};
    let stateMachine = {};
    let currentState;

    // I'm not wild about this...
    function changeState(event) {

      let fromStates = Array.isArray(events[event].from) ? events[event].from : [ events[event].from ];
      let toState = events[event].to;

      return () => {
        // Firing the current state, effective noop
        if (currentState === toState) return;

        if (fromStates.indexOf(currentState) !== -1) {
          let cbs = executeCallbacks(event);
          // how do this moar smart?
          cbs.next(); // before
          cbs.next(); // on
          cbs.next(); // after
          currentState = toState;
        }
      };
    }

    function *executeCallbacks(event) {
      yield callbacks[event].before.call();
      yield callbacks[event].on.call();
      yield callbacks[event].after.call();
    }

    Object.defineProperties(stateMachine, {
      "initial": {
        value: config.initial
      },
      "current": {
        get: () => { return currentState; }
      }
    });

    for (let event in events) {

      stateMachine[event] = changeState(event);

      callbacks[event] = {};
      callbacks[event].on = events[event].on || noop;
      callbacks[event].before = events[event].before || noop;
      callbacks[event].after = events[event].after || noop;

    }

    currentState = stateMachine.initial;
    return Object.create(stateMachine);
  }

  return {
    create
  };

}());

