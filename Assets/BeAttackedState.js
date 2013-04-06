#pragma strict
class BeAttackedState extends StateModel {
	var object : robot;
	var attackObject : robot;
	var startTime : float;
	var oldScale : Vector3;
	var finishAni : boolean;
		
	function BeAttackedState(en : StateMachine, o : robot) {
		super(en, "BeAttacked");
		object = o;
		Debug.Log("call BeAttackedState "+en+" "+o);
	}
	virtual function realUpdate() {
		var diff : float = Time.time - startTime;
		if(diff > 1.0)
			finishAni = true;
		diff = Mathf.Min(1.0, diff);
		var scale = Mathf.Sin(diff*Mathf.PI);
		var newScale = oldScale + Vector3(scale, scale, scale);
		object.transform.localScale = newScale;
		
	}
	virtual function enter() {
		Debug.Log("BeAttacked enter "+action.name);
		if(action.name == "null") {
			finishAni = false;
			attackObject = object.attackObject;
			startTime = Time.time;
			oldScale = object.transform.localScale;
		} else {
			super.enter();
		}
	}
	virtual function exit() {
		if(action.name == "null") {
			object.beAttacked = false;
		} else {
			super.exit();
		}
	}
	function goFree() {
		return finishAni;
	}
	virtual function initTransition() {
		addTransition("Free", goFree);
	}
}
