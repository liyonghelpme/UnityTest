#pragma strict
class MoveState extends StateModel {
	var object : robot;
	function MoveState(en : StateMachine, o : robot) {
		super(en, "Move");
		object = o;
	}
}