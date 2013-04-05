#pragma strict
class ArcherAttack extends StateModel {
	var object : robot;
	var enemy : robot;
	var startTime : float;
	var dir : Vector3;
	var startPos : Vector3;
	var endPos : Vector3;
	function ArcherAttack(en : StateMachine, o : robot) {
		super(en, "Attack");
		object = o;
	}
	virtual function realUpdate() {
		/*
		var passTime : float = Time.time-startTime; 
		passTime = Mathf.Min(passTime, 1.0);
		var inter : float = Mathf.Sin(passTime/2.0*2*Mathf.PI);
		var np = Vector4.Lerp(startPos, endPos, inter);
		object.transform.localPosition = np;
		*/
	}
	virtual function enter() {
		enemy = object.enemy;
		startPos = object.transform.localPosition;
		endPos = enemy.transform.localPosition;
		startTime = Time.time;
		dir = enemy.transform.localPosition - object.transform.localPosition;
		object.transform.localRotation = Quaternion.LookRotation(dir);
		
		var arrow = GameObject.Instantiate(Resources.Load("Arrow")) as GameObject;
		var script : Arrow = arrow.GetComponent(Arrow);
		script.sol = object;
		script.target = enemy; 
		arrow.transform.parent = object.transform.parent;
	}
	virtual function exit() {
		object.attacking = false;
		object.transform.localPosition = startPos;
	}
	function goFree() {
		var diff : float = Time.time-startTime;
		if(diff >= 1.0)
			return true;
		return false;
	}
	virtual function initTransition() {
		addTransition("Free", goFree);
	}
}
