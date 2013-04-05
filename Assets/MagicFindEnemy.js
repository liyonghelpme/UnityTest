#pragma strict

class MagicFindEnemy extends StateModel {
	var object : robot;
	function MagicFindEnemy(en : StateMachine, o : robot) {
		super(en, "MagicFindEnemy");
		object = o;
	}
	virtual function initTransition() {
	}
}