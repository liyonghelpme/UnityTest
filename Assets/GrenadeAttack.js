#pragma strict
class GrenadeAttack extends StateModel {
	var object : robot;
	var enemy : robot;
	var startTime : float;
	var dir : Vector3;
	var startPos : Vector3;
	var endPos : Vector3;
	var gameLogic : singleHex;
	var boardMap : Hashtable;
	
	function GrenadeAttack(en : StateMachine, o : robot) {
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
	}
	virtual function exit() {
		var attack : float = object.doAttack();
		var dist : int = SoldierModel.minDistance(object.myGridX, object.myGridZ, enemy.myGridX, enemy.myGridZ);
		if(dist == 1) {
			SoldierModel.calHurt(object, enemy, -attack*0.7f);
			object.attacking = false;
			object.transform.localPosition = startPos;
		} else {
			SoldierModel.calHurt(object, enemy, -attack);
			object.attacking = false;
			object.transform.localPosition = startPos;
			
			var neibors : Array = SoldierModel.getNeibors(enemy.myGridX, enemy.myGridZ);
			for(var i : int = 0; i < neibors.length; i += 2) {
				var nv0 : int = neibors[i];
				var nv1 : int = neibors[i+1];
				
				var ene : robot = boardMap[nv0*1000+nv1];
				if(ene != null) {
					SoldierModel.calHurt(object, ene, -attack*.5);
				}
			}
		}
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
