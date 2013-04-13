#pragma strict
class EngineerAttackState extends StateModel {
	var object : robot;
	var enemy : robot;
	var startTime : float;
	var dir : Vector3;
	var startPos : Vector3;
	var endPos : Vector3;
	var gameLogic : singleHex;
	var boardMap : Hashtable;
	
	function EngineerAttackState(en : StateMachine, o : robot) {
		super(en, "Attack");
		object = o;
		gameLogic = GameObject.Find("GameLogic").GetComponent(singleHex);
		boardMap = gameLogic.boardMap;
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
	//knock back enemy position
	//knock back only belong to knight not belong to others 
	virtual function exit() {
		if(enemy.color != object.color) {
			SoldierModel.calHurt(object, enemy, -object.doAttack());
			object.attacking = false;
			object.transform.localPosition = startPos;
		} else {
			enemy.gameObject.AddComponent(RobotEffect);
			object.attacking = false;
			object.transform.localPosition = startPos;
		}
		
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