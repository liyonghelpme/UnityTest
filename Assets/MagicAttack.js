#pragma strict
//decided possible 
//
class MagicAttack extends StateModel {
	var object : robot;
	var end : boolean;
	var enemy : robot;
	var startTime : float;
	var attackList : Hashtable;
	var startPos : Vector3;
	var endPos : Vector3;
	var dir : Vector3;
	
	var originPos : Vector3;
	function MagicAttack(en : StateMachine, o : robot){
		super(en, "Attack");
		object = o;
		
	}
	virtual function enter() {
		attackList = new Hashtable();
		originPos = object.transform.localPosition;
		Debug.Log("init origin pos "+originPos);
		enemy = object.enemy;
		end = false;
		object.clearMap();
		initAttackState();
	}
	function initAttackState() {
		startTime = Time.time;
		startPos = object.transform.localPosition;
		endPos = enemy.transform.localPosition;
		attackList[enemy.myGridX*1000+enemy.myGridZ] = true;
		
	}
	
	virtual function exit() {
		object.transform.localPosition = originPos;
		object.attacking = false;
		object.updateMap();
		Debug.Log("exit magic "+originPos);
	}
	function attackEnemy() {
		var dist = endPos - object.transform.localPosition;
		if(dist.sqrMagnitude < 0.01) {
			var power : float = 1.0;
			if(attackList.Count == 2)
				power = 0.8;
			else if(attackList.Count == 3)
				power = 0.5;
				
			enemy.changeHealth(-object.attack*power);
			startTime = Time.time;
			startPos = endPos;
			findEnemy();
		} else {
			var passTime = Time.time - startTime;
			passTime = Mathf.Min(1.0, passTime);
			var np : Vector3 = Vector3.Lerp(startPos, endPos, passTime);
			object.transform.localPosition = np;
		}
	}
	function findEnemy() {
		Debug.Log("findEnemy "+attackList.Count);
		if(attackList.Count >= 3) {
			end = true;
		} else {
			var myAffine : Array = new Array(0, 0);
			
			var grid : Vector3 = object.board.posToGrid(object.transform.localPosition.x, object.transform.localPosition.z);
			var myGridX = grid.x;
			var myGridZ = grid.z;
			object.board.normalToAffine(myGridX, myGridZ, myAffine);
			
			
			var mx : int = myAffine[0];
			var mz : int = myAffine[1];
			var neibors : int[] = [
				mx, mz+1,
				mx+1, mz,
				mx+1, mz-1,
				mx, mz-1,
				mx-1, mz,
				mx-1, mz+1
			];
			//not attack yet other color then attack
			var find : robot = null;
			for(var i = 0; i < 6; i++) {
				var neiNormal = new Array(0, 0);
				object.board.affineToNormal(neibors[i*2], neibors[i*2+1], neiNormal);
				var nx : int = neiNormal[0];
				var nz : int = neiNormal[1];
				Debug.Log("check Neibor "+nx+" "+nz);
				if(!attackList.Contains(nx*1000+nz)) {
					if(object.board.boardMap[nx*1000+nz] != null) {
						var ene : robot = object.board.boardMap[nx*1000+nz];
						if(ene.color != object.color) {
							find = ene;
							break;
						}
					}
				}
			}
			if(find != null) {
				enemy = find;
				attackList.Add(enemy.myGridX*1000+enemy.myGridZ, true);
				initAttackState();
			} else {
				end = true;
			}
		}
	}
	function returnHome() {
	}
	
	virtual function realUpdate() {
		if(!end) {	
			attackEnemy();
		}
	}
	
	function goFree() {
		return end;
	}
	virtual function initTransition() {
		addTransition("Free", goFree);
	}
	 
}