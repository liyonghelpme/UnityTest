#pragma strict
class MagicBackHome extends StateModel {
	var object : robot;
	var startPos : Vector3;
	var endPos : Vector3;
	var attackGlobal : MagicAttack;
	var startTime : float;
	
	function MagicBackHome(en : StateMachine, o : robot) {
		super(en, "MagicBackHome");
		object = o;
	}
	virtual function realUpdate() {
		var passTime = Time.time - startTime;
		passTime = Mathf.Min(1.0, passTime);
		var np : Vector3 = Vector3.Lerp(startPos, endPos, passTime);
		object.transform.localPosition = np;
	}
	virtual function enter() {
		attackGlobal = parent as MagicAttack;
		startPos = object.transform.localPosition;	
		endPos = attackGlobal.originPos;
		startTime = Time.time;
	}
	virtual function exit() {
	}
	function goFree() {
		var passTime = Time.time - startTime;
		return passTime >= 1.0;
	}
	virtual function initTransition() {
		addTransition("Free", goFree);
	}
}