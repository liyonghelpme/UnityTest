#pragma strict
class PriestCure extends StateModel {
	var object : robot;
	var enemy : robot;
	var startTime : float;
	var dir : Vector3;
	var startPos : Vector3;
	var endPos : Vector3;
	function PriestCure(en : StateMachine, o : robot) {
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
		
		var roundManager = GameObject.Find("GameLogic").GetComponent(RoundManager);
		roundManager.startAction();
	}
	//health += attack
	virtual function exit() {
		//relive + 1/3 health
		//priest don't care magicDefense
		if(enemy.color == object.color) {
			if(enemy.stateMachine.currentState.stateName == "Dead")
				enemy.changeHealth(object.doAttack()*2/3);
			else
				enemy.changeHealth(object.doAttack()*3);
		} else {
			SoldierModel.calHurt(object, enemy, -object.doAttack());
			enemy.beAttacked = true;
		}
		
		object.attacking = false;
		object.transform.localPosition = startPos;
		
		var roundManager = GameObject.Find("GameLogic").GetComponent(RoundManager);
		roundManager.finishAction();
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
