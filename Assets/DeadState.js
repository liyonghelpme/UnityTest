#pragma strict
class DeadState extends StateModel {
	var object : robot;
	var startTime : float;
	var oldRotation : Quaternion;
	var oldScale : Vector3;
	function DeadState(en : StateMachine, o : robot) {
		super(en, "Dead");
		object = o;
	}
	virtual function enter() {
		object.inDead = true;
		startTime = Time.time;
		oldRotation = object.transform.localRotation;
		oldScale = object.transform.localScale;
	}
	virtual function exit() {
		object.inDead = false;
		object.transform.localRotation = oldRotation;
		object.transform.localScale = oldScale;
	}
	//become a sphere 
	virtual function realUpdate() {
		var passTime : float = Time.time-startTime;
		if(passTime < 1.0) {
			var np : Vector3 = Vector3.Slerp(Vector3.forward, Vector3.up, passTime);
			var quan : Quaternion = Quaternion.FromToRotation(Vector3.forward, np);
			object.transform.localRotation = quan;
			var sz : Vector3 = Vector3.Lerp(Vector3(1, 1, 1), Vector3(1, 1, 0.5), passTime);
			object.transform.localScale = sz;
		}
	}
	function goFree() {
		return object.health > 0;
	}
	virtual function initTransition() {
		addTransition("Free", goFree);
	}
}