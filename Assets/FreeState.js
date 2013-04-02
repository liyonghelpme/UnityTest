#pragma strict
class FreeState extends StateModel {
	var obj : robot;
	function FreeState (e : StateMachine, o : robot) {
		super(e, "Free");
		//addTransition(new MoveState(e), goMove);
		obj = o;
	}
	function goMove() {
		return false;
	}
	virtual function realUpdate() {
	}
	virtual function initTransition() {
		addTransition("Move", goMove);
	}
}