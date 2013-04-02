#pragma strict
class FreeState extends StateModel {
	var object : robot;
	var startTime : float;
		
	function FreeState (e : StateMachine, o : robot) {
		super(e, "Free");
		//addTransition(new MoveState(e), goMove);
		object = o;
	}
	function goMove() {
		return false;
	}
	virtual function realUpdate() {
		var old = object.transform.localPosition;
		object.transform.localPosition = Vector3(old.x, Mathf.Sin(Time.time-startTime), old.z);
	}
	virtual function initTransition() {
		addTransition("Move", goMove);
	}
	virtual function enter() {
		startTime = Time.time;
	}
	virtual function exit() {
		var old : Vector3 = object.transform.localPosition;
		object.transform.localPosition = Vector3(old.x, 0, old.z);
	}
	
}