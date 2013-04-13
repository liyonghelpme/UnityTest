#pragma strict

class FighterAttackState extends StateModel {
	var object : robot;
	var enemy : robot;
	var startTime : float;
	var dir : Vector3;
	var startPos : Vector3;
	var endPos : Vector3;
	var gameLogic : singleHex;
	var boardMap : Hashtable;
	
	function FighterAttackState(en : StateMachine, o : robot) {
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
		SoldierModel.calHurt(object, enemy, -object.doAttack());
		object.attacking = false;
		object.transform.localPosition = startPos;
		
		var knockBackAction : KnockBackAction = new KnockBackAction(enemy, object);
		enemy.setAction("BeAttacked", knockBackAction);
		enemy.beAttacked = true;
		
		var frontArray : Array = SoldierModel.getAdjacent(object.myGridX, object.myGridZ, enemy.myGridX, enemy.myGridZ);
		if(frontArray[0] != null){
			var n0 : Vector2 = frontArray[0];
			var n1 : Vector2 = frontArray[1];
			var norAtt : Array = new Array(0, 0);
			
			
			SoldierModel.affineToNormal(n0.x, n0.y, norAtt);
			var nx : int = norAtt[0];
			var nz : int = norAtt[1];
			
			var r0 : robot = boardMap[nx*1000+nz];
			if(r0 != null && r0.color != object.color) {
				var knockBackAction1 : KnockBackAction = new KnockBackAction(r0, object);
				r0.setAction("BeAttacked", knockBackAction1);
				r0.beAttacked = true;
			}
			
			SoldierModel.affineToNormal(n1.x, n1.y, norAtt);
			nx = norAtt[0];
			nz = norAtt[1];
			Debug.Log("nx nz "+nx+" "+nz);
			
			var r1 : robot = boardMap[nx*1000+nz];
			if(r1 != null && r1.color != object.color) {
				var knockBackAction2 : KnockBackAction = new KnockBackAction(r1, object);
				r1.setAction("BeAttacked", knockBackAction2);
				r1.beAttacked = true;
			}
			
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