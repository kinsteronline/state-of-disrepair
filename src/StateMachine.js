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
  const capitalize = str => { return str.charAt(0).toUpperCase() + str.slice(1); };

  function create(config) {

    // FF is good
    //let events = Object.assign(config.events);
    let events = config.events;
    let currentState;

    let stateMachine = {};

    function changeState(event) {
      let fromStates = Array.isArray(events[event].from) ? events[event].from : [ events[event].from ];
      let toState = events[event].to;

      return () => {
        // Firing the current state, effective noop
        if (currentState === toState) return;

        if (fromStates.indexOf(currentState) !== -1) {
          currentState = toState;
        }
      };
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
      let capitalized = capitalize(event);

      stateMachine[event] = changeState(event);

      stateMachine[`onBefore${capitalized}`] = noop;
      stateMachine[`on${capitalized}`] = noop;
      stateMachine[`onAfter${capitalized}`] = noop;
    }

    currentState = stateMachine.initial;
    return Object.create(stateMachine);
  }

  return {
    create
  };

}());

