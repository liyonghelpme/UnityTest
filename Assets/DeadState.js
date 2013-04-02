#pragma strict
class DeadState extends StateModel {
	var object : robot;
	var startTime : float;
	function DeadState(en : StateMachine, o : robot) {
		super(en, "Dead");
		object = o;
	}
	virtual function enter() {
		object.inDead = true;
		startTime = Time.time;
	}
	virtual function exit() {
		object.inDead = false;
	}
	//become a sphere 
	virtual function realUpdate() {
		var passTime : float = Time.time-startTime;
		if(passTime < 1.0) {
			var np : Vector3 = Vector3.Slerp(Vector3.forward, Vector3.up, passTime);
			var quan : Quaternion = Quaternion.FromToRotation(Vector3.forward, np);
			object.transform.localRotation = quan;
			var sz : Vector3 = Vector3.Lerp(Vector3(1, 1, 1), Vector3(1, 1, 0.1), passTime);
			object.transform.localScale = sz;
		}
	}
	virtual function initTransition() {
		
	}
}