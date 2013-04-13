#pragma strict
class KnightAttack extends StateModel {
	var object : robot;
	var enemy : robot;
	var startTime : float;
	var dir : Vector3;
	var startPos : Vector3;
	var endPos : Vector3;
	function KnightAttack(en : StateMachine, o : robot) {
		super(en, "Attack");
		object = o;
	}
	virtual function realUpdate() {
		var passTime : float = Time.time-startTime; 
		passTime = Mathf.Min(passTime, 1.0);
		var inter : float = Mathf.Sin(passTime/2.0*2*Mathf.PI);
		var np = Vector4.Lerp(startPos, endPos, inter);
		object.transform.localPosition = np;
	}
	virtual function enter() {
		
		enemy = object.enemy;
		startPos = object.transform.localPosition;
		endPos = enemy.transform.localPosition;
		startTime = Time.time;
		dir = enemy.transform.localPosition - object.transform.localPosition;
		object.transform.localRotation = Quaternion.LookRotation(dir);
	}
	//knock back enemy position
	//knock back only belong to knight not belong to others 
	virtual function exit() {
		SoldierModel.calHurt(object, enemy, -object.doAttack());
		object.attacking = false;
		object.transform.localPosition = startPos;
		
		Debug.Log("inKnockBack");
		//enemy.knockBacker = object;
		//enemy.inKnockBack = true;
		
		var knockBackAction : KnockBackAction = new KnockBackAction(enemy, object);
		enemy.setAction("BeAttacked", knockBackAction);
		enemy.beAttacked = true;
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