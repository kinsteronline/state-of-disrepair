
describe("State Machine", function() {

  var fsm;

  var beforeSleep = function() { console.log('BEFORE Sleep'); };
  var onSleep = function() { console.log('ON Sleep'); };
  var afterSleep = function() { console.log('AFTER Sleep'); };

  var beforeWake = function() { console.log('BEFORE Wake'); };
  var onWake = function() { console.log('ON Wake'); };
  var afterWake = function() { console.log('AFTER Wake'); };


  var config = {
    initial: 'sleeping',
    events: {
      sleep:  {
        from: 'awake', to: 'sleeping',
        before: beforeSleep, on: onSleep, after: afterSleep
      },
      wake: {
        from: [ 'napping', 'sleeping' ],  to: 'awake',
        before: beforeWake, on: onWake, after: afterWake
      },
      nap: { from: [ 'awake' ], to: 'napping' } 
    }
  };


  describe("setting the initial state", function() {
    beforeEach(function() { fsm = SOD.create(config); });

    it("should set the current state initially", function() {
      expect(fsm.current).toEqual('sleeping');
    });

    it("should have a configured initial state", function() {
      expect(fsm.initial).toEqual('sleeping');
    });

    it("should not let you change the initial state", function() {
      fsm.initial = 'dozing'; 
      expect(fsm.initial).toEqual('sleeping');
    });
  });

  describe("building the events", function() {
    beforeEach(function() { fsm = SOD.create(config); });

    it("should create the events", function() {
      expect(fsm.sleep).toBeDefined();
      expect(fsm.wake).toBeDefined();
      expect(fsm.nap).toBeDefined();
    });
  });

  describe("changing states", function() {
    beforeEach(function() { fsm = SOD.create(config); });

    it("should not change the state from \"sleeping\" when sleep'd is called", function() {
      fsm.sleep();
      expect(fsm.current).toEqual("sleeping");
    });

    it("should change the state from \"sleeping\" to \"awake\" when wake'd while sleeping", function() {
      fsm.wake();
      expect(fsm.current).toEqual("awake");
    });

    it("should not change the state from \"sleeping\" to \"napping\" when nap'd while sleeping", function() {
      fsm.nap();
      expect(fsm.current).toEqual("sleeping");
    });
  });

  describe("executing callbacks", function() {
    it("should execute the before callback", function() {
      fsm.wake();
    });
  });

});
