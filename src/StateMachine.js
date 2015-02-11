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

    let events = Object.create(config.events);
    let callbacks = {};
    let stateMachine = {};
    let currentState;

    // I'm not wild about this...
    function changeState(event) {

      // states lists could be:
      //   1. Array
      //   2. An object with keys & null values
      //   3. A Set()
      let fromStates = Array.isArray(events[event].from) ? events[event].from : Array.of(events[event].from);
      let toState = events[event].to;

      // return *() => ...
      return () => {
        // Firing the current state, effective noop
        if (currentState === toState) { return; }
        //
        // Some jsperfs have noted that the indexOf is now
        // a bit faster than Object.in with keys & null values.
        //
        // The array.includes() is forward looking.
        //
        //if (fromStates.indexOf(currentState) !== -1) {
        if (fromStates.includes(currentState)) {
          let cbs = executeCallbacks(event);
          // how do this moar smart?
          cbs.next(); // before
          cbs.next(); // on
          cbs.next(); // after
          currentState = toState;
        }
      };
    }

    // Store each as a *fn() above
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

