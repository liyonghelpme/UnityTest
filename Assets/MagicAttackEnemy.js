#pragma strict
class MagicAttackEnemy extends StateModel {
	var object : robot;
	var attackGlobal : MagicAttack;
	var startTime : float;
	var startPos : Vector3;
	var endPos : Vector3;
	
	function MagicAttackEnemy(en : StateMachine, o : robot) {
		super(en, "MagicAttackEnemy");
		object = o;
	}
	//attackList enemy
	virtual function enter() {
		attackGlobal = parent as MagicAttack;
		startTime = Time.time;
		startPos = object.transform.localPosition;	
		endPos = attackGlobal.enemy.transform.localPosition;
		attackGlobal.attackList[attackGlobal.enemy.myGridX*1000+attackGlobal.enemy.myGridZ] = true;
	}
	virtual function exit() {
		var power : float = 1.0;
		if(attackGlobal.attackList.Count == 2)
			power = 0.8;
		else if(attackGlobal.attackList.Count == 3)
			power = 0.6;
			
		SoldierModel.calHurt(object, attackGlobal.enemy, -object.attack*power);
	}
	virtual function realUpdate() {
		var passTime : float = Time.time - startTime;
		passTime = Mathf.Min(0.5, passTime);
		var np : Vector3 = Vector3.Lerp(startPos, endPos, passTime*2);
		object.transform.localPosition = np;
	}
	function goFind() {
		var dist = endPos - object.transform.localPosition;
		if(dist.sqrMagnitude < 0.01)
			return true;
		return false;
	}
	virtual function initTransition() {
		addTransition("MagicFindEnemy", goFind);
	}
}
