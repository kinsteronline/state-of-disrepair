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


  var noop = function() { };


  function create(config) {

    var _availableStates = [];
    var _currentState = undefined;

    var stateMachine = {
      get current() { return _currentState; }
    };

    // You cannot change the initial state later on
    Object.defineProperty(stateMachine, "initial", {
      value: config.initial,
      writable: false 
    });

    var eventList = config.events || { };

    Object.keys(eventList).forEach(function(e) {
      (function(event) {
        //
        // Associate the callbacks if provided
        //
        var beforeCallbackName = "onbefore" + event;
        Object.defineProperty(stateMachine, beforeCallbackName, {
          enumerable: false,
          writable: true,
          value: eventList[event].before || noop
        });

        var onCallbackName = 'on' + event;
        Object.defineProperty(stateMachine, onCallbackName, {
          enumerable: false,
          writable: true,
          value: eventList[event].on || noop
        });

        var afterCallbackName = 'onafter' + event; 
        Object.defineProperty(stateMachine, afterCallbackName, {
          enumerable: false,
          writable: true,
          value: eventList[event].after || noop
        });


        stateMachine[event] = function() {
          //
          // Firing the current state, effective noop
          if (_currentState === eventList[event].to) return;

          //
          // Coerce the from to an array
          if (!Array.isArray(eventList[event].from)) {
            eventList[event].from = [ eventList[event].from ];
          }

          //
          // Attempting to fire an event with an incorrect current state (bad from on event)
          if (eventList[event].from.indexOf(_currentState) === -1) {
            if (typeof(stateMachine.onStateMachineError) === 'function') {
              stateMachine.onStateMachineError.call();
            } else {
              throw Error('BAD STATE'); //harsh, add a general onbadstateerror()
            }

          } else {

            if (typeof(stateMachine[beforeCallbackName]) === 'function') {
              stateMachine[beforeCallbackName].call(); // better calling
            }

            _currentState = eventList[event].to;

            if (typeof(stateMachine[onCallbackName]) === 'function')  {
              stateMachine[onCallbackName].call();
            }

            if(typeof(stateMachine[afterCallbackName]) === 'function') {
              stateMachine[afterCallbackName]();
            }

          }
        };

        // Build states list 
        if (_availableStates.indexOf(eventList[event].from) === -1) {
          _availableStates.concat(eventList[event].from);
        }

        if (_availableStates.indexOf(eventList[event].to) === -1) {
          _availableStates.push(eventList[event].to);
        }

      })(e);
    });

    _currentState = stateMachine.initial;

    return Object.create(stateMachine);
  }

  return {
    create: create
  };

}());

