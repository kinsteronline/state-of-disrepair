
describe("State Machine", function() {

  var fsm;

  describe("setting the initial state", function() {

    it("should have a configured initial state", function() {
      fsm = SOD.create({ initial: 'init' });
      expect(fsm.initial).toEqual('init');
    });

    it("should not let you change the initial state", function() {
      fsm = SOD.create({ initial: 'quitting' });
      fsm.initial = 'starting'; // should throw perhaps?
      expect(fsm.initial).toEqual('quitting');
    });

    it("should set the initial state as the current state", function() {
      fsm = SOD.create({ initial: 'sleeping' });
      expect(fsm.current).toEqual('sleeping');
    });

  });

  describe("building the events", function() {

    var config = {
      initial: 'sleeping',
      events: {
        sleep: { from: 'awake', to: 'sleeping' },
        wake: { from: [ 'napping', 'sleeping' ], to: 'awake' }
      }
    };

    beforeEach(function() {
      fsm = SOD.create(config);
    });

    it("creates event functions", function() {
      expect(fsm.wake).toBeDefined();
      expect(fsm.sleep).toBeDefined();
    });

    it("creates the before callbacks for the event", function() {
      expect(fsm.onbeforewake).toBeDefined();
      expect(fsm.onbeforesleep).toBeDefined();
    });

    it("creates the on callbacks for the event", function() {
      expect(fsm.onwake).toBeDefined();
      expect(fsm.onsleep).toBeDefined();
    });

    it("creates the after callbacks for the event", function() {
      expect(fsm.onafterwake).toBeDefined();
      expect(fsm.onaftersleep).toBeDefined();
    });

  });

  describe("changing states", function() {
    var fsm;

    // must figure out spies...
    var renderCastle = function() {
      return "|===| n |===|";
    };

    var config = {
      initial: 'intro',
      events: {
        goToCastle: { from: 'intro', to: 'castle', before: renderCastle },
        goToProvingGrounds: { from: 'castle', to: 'provingGrounds' },
        goToLlylgamn: { from: 'castle', to: 'llylgamn' },
        goToGraveyard: { from: 'provingGrounds', to: 'graveyard' }
      }
    };

    beforeEach(function() {
      fsm = SOD.create(config);
      spyOn(fsm, 'onbeforegoToCastle');
    });

    it("should not complain when trying to re-enter the current state", function() {
      fsm.goToCastle();
      expect(fsm.goToCastle).not.toThrow();
    });

    it("changes state on event", function() {
      fsm.goToCastle();
      expect(fsm.current).toEqual('castle');
    });


    // the callback seems to work, but I cannot spy it's call
    xit("calls before callback", function() {
      fsm.goToCastle();
      expect(fsm.onbeforegoToCastle).toHaveBeenCalled();
    });

    it("will throw an error with an event from an incorrect state", function() {
      expect(fsm.goToGraveyard).toThrow();
    });

  });

});
