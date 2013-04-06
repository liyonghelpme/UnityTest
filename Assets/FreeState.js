#pragma strict
class FreeState extends StateModel {
	var object : robot;
	var startTime : float;
		
	function FreeState (e : StateMachine, o : robot) {
		super(e, "Free");
		object = o;
	}
	function goMove() {
		return object.inMove;
	}
	function goInAttack() {
		return object.inAttackRange;
	}
	virtual function realUpdate() {
		//var old = object.transform.localPosition;
		//object.transform.localPosition = Vector3(old.x, Mathf.Sin(Time.time-startTime), old.z);
	}
	function goInChoose() {
		return object.chooseYet;
	}
	function goAttack() {
		return object.attacking;
	}
	function goDead() {
		return object.health <= 0;
	}
	
	function goBeAttacked() {
		return object.beAttacked;
	}
	virtual function initTransition() {
		//addTransition("Move", goMove);
		addTransition("InAttack", goInAttack);
		addTransition("InChoose", goInChoose);
		addTransition("Attack", goAttack);
		addTransition("Dead", goDead);
		//addTransition("KnockBack", goKnockBack);
		//addTransition("Replace", goReplace);
		addTransition("BeAttacked", goBeAttacked);
	}
	virtual function enter() {
		startTime = Time.time;
	}
	virtual function exit() {
		var old : Vector3 = object.transform.localPosition;
		object.transform.localPosition = Vector3(old.x, 0, old.z);
	}
	
}