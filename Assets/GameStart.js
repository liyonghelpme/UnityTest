#pragma strict
class GameStart extends StateModel {
	var object : singleHex;
	function GameStart(en : StateMachine, o : singleHex) {
		super(en, "GameStart");
		object = o;
	}
	virtual function realUpdate() {
	}
	virtual function enter() {
	}
	virtual function exit() {
	}
	virtual function initTransition() {
	}
}
