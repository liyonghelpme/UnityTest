#pragma strict
class ReplaceState extends StateModel {
	var object : robot;
	var other : robot;
	var startTime : float;
	var myPos : Vector3;
	var otherPos : Vector3;
	function ReplaceState(en : StateMachine, o : robot) {
		super(en, "Replace");
		object = o;
	}
	virtual function enter() {
		other = object.other;
		startTime = Time.time;
		myPos = object.transform.localPosition;
		otherPos = other.transform.localPosition;
		object.clearMap();
	}
	virtual function exit() {
		object.transform.localPosition = otherPos;
		object.updateMap();
		object.inReplace = false;
	}
	virtual function realUpdate() {
		var dif = Time.time - startTime;
		dif = Mathf.Min(dif, 1.0);
		Debug.Log("replace "+myPos+" "+otherPos+" "+dif);
		object.transform.localPosition = Vector3.Lerp(myPos, otherPos, dif);
	}
	//ExitTime
	function goFree() {
		var dif = Time.time - startTime;
		if(dif >= 1.0)
			return true;
		return false;
	}
	virtual function initTransition()  {
		addTransition("Free", goFree);
	}
}