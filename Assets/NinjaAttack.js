#pragma strict
class NinjaAttack extends StateModel {
	var object : robot;
	var enemy : robot;
	var startTime : float;
	var dir : Vector3;
	var startPos : Vector3;
	var endPos : Vector3;
	
	function NinjaAttack(en : StateMachine, o : robot) {
		super(en, "Attack");
		object = o;
	}
	virtual function enter() {
		enemy = object.enemy;
		startPos = object.transform.localPosition;
		endPos = enemy.transform.localPosition;
		startTime = Time.time;
		dir = enemy.transform.localPosition - object.transform.localPosition;
		object.transform.localRotation = Quaternion.LookRotation(dir);
	}
	virtual function exit() {
		var dist = object.board.minDistance(object.myGridX, object.myGridZ, enemy.myGridX, enemy.myGridZ);
		if(dist == 1)
			enemy.changeHealth(-object.attack);
		else
			enemy.changeHealth(-object.attack/2);
			
		object.attacking = false;
		object.transform.localPosition = startPos;
	}
	virtual function realUpdate() {
		var passTime : float = Time.time-startTime; 
		passTime = Mathf.Min(passTime, 1.0);
		var inter : float = Mathf.Sin(passTime/2.0*2*Mathf.PI);
		var np = Vector4.Lerp(startPos, endPos, inter);
		object.transform.localPosition = np;
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