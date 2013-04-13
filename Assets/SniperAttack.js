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
		
		var roundManager = GameObject.Find("GameLogic").GetComponent(RoundManager);
		roundManager.startAction();
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
			Debug.Log("myGrid "+object.myGridX+" "+object.myGridZ);
			Debug.Log("eneGrid "+enemy.myGridX+" "+enemy.myGridZ);
			Debug.Log("find neibor "+frontArray);
			//affine to normal
			if(frontArray[0] != null){
				var n0 : Vector2 = frontArray[0];
				var n1 : Vector2 = frontArray[1];
				var norAtt : Array = new Array(0, 0);
				
				
				SoldierModel.affineToNormal(n0.x, n0.y, norAtt);
				var nx : int = norAtt[0];
				var nz : int = norAtt[1];
				Debug.Log("nx nz "+nx+" "+nz);
				
				var r0 : robot = boardMap[nx*1000+nz];
				if(r0 != null && r0.color != object.color)
					SoldierModel.calHurt(object, r0, -attack*0.6f);
			
				SoldierModel.affineToNormal(n1.x, n1.y, norAtt);
				nx = norAtt[0];
				nz = norAtt[1];
				Debug.Log("nx nz "+nx+" "+nz);
				
				var r1 : robot = boardMap[nx*1000+nz];
				if(r1 != null && r1.color != object.color)
					SoldierModel.calHurt(object, r1, -attack*0.6f);
			
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
