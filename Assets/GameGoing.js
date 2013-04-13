#pragma strict
class GameGoing extends StateModel {
	var object : robot;
	function GameGoing(en : StateMachine, o : robot) {
		super(en, "GameGoing");
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
