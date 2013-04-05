#pragma strict
class MagicBackHome extends StateModel {
	var object : robot;
	function MagicBackHome(en : StateMachine, o : robot) {
		super(en, "MagicBackHome");
		object = o;
	}
	virtual function enter() {
	}
	virtual function exit() {
	}
	function goFree() {
	}
	virtual function initTransition() {
		addTransition("Free", goFree);
	}
}