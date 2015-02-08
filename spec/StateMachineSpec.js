
describe("State Machine", function() {

  var fsm;

  var config = {
    initial: 'sleeping',
    events: {
      sleep:  { from: 'awake',                    to: 'sleeping' },
      wake:   { from: [ 'napping', 'sleeping' ],  to: 'awake' },
      nap:    { from: [ 'awake' ],                to: 'napping' } 
    }
  };


  describe("setting the initial state", function() {
    beforeEach(function() { fsm = SOD.create(config); });

    it("should have a configured initial state", function() {
      expect(fsm.initial).toEqual('sleeping');
    });

    it("should not let you change the initial state", function() {
      fsm.initial = 'dozing'; 
      expect(fsm.initial).toEqual('sleeping');
    });

    it("should set the current state initially", function() {
      expect(fsm.current).toEqual('sleeping');
    });

  });

  describe("building the events", function() {
    beforeEach(function() { fsm = SOD.create(config); });

    it("should create the events", function() {
      expect(fsm.sleep).toBeDefined();
      expect(fsm.wake).toBeDefined();
      expect(fsm.nap).toBeDefined();
    });

    it("should create the event before callback", function() {
      expect(fsm.onBeforeSleep).toBeDefined();
      expect(fsm.onBeforeWake).toBeDefined();
      expect(fsm.onBeforeNap).toBeDefined();
    });
    it("should create the event on callback", function() {
      expect(fsm.onSleep).toBeDefined();
      expect(fsm.onWake).toBeDefined();
      expect(fsm.onNap).toBeDefined();
    });

    it("should create the event after callback", function() {
      expect(fsm.onAfterSleep).toBeDefined();
      expect(fsm.onAfterWake).toBeDefined();
      expect(fsm.onAfterNap).toBeDefined();
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

});
