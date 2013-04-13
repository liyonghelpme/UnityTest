#pragma strict
class SniperAttack extends StateModel {
	var object : robot;
	var enemy : robot;
	var startTime : float;
	var dir : Vector3;
	var startPos : Vector3;
	var endPos : Vector3;
	var gameLogic : singleHex;
	var boardMap : Hashtable;
	
	function SniperAttack(en : StateMachine, o : robot) {
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
		//close attack
		if(dist == 1) {
			SoldierModel.calHurt(object, enemy, -attack*1.0f);
			object.attacking = false;
			object.transform.localPosition = startPos;
		//far row
		} else {
			SoldierModel.calHurt(object, enemy, -attack*0.6f);
			object.attacking = false;
			object.transform.localPosition = startPos;
			
			var frontArray : Array = SoldierModel.getAdjacent(object.myGridX, object.myGridZ, enemy.myGridX, enemy.myGridZ);
			var n0 : Vector2 = frontArray[0];
			var n1 : Vector2 = frontArray[1];
			if(n0 != null) {
				var r0 : robot = boardMap[Mathf.FloorToInt(n0.x*1000+n0.y)];
				if(r0 != null)
					SoldierModel.calHurt(object, enemy, -attack*0.6f);
			}
			if(n1 != null) {
				var r1 : robot = boardMap[Mathf.FloorToInt(n1.x*1000+n1.y)];
				if(r1 != null)
					SoldierModel.calHurt(object, enemy, -attack*0.6f);
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
