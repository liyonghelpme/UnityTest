#pragma strict

class MagicFindEnemy extends StateModel {
	var object : robot;
	var attackGlobal : MagicAttack;
	var findYet : boolean;
	function MagicFindEnemy(en : StateMachine, o : robot) {
		super(en, "MagicFindEnemy");
		object = o;
	}
	function findEnemy() {
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
			if(!attackGlobal.attackList.Contains(nx*1000+nz)) {
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
			attackGlobal.enemy = find;
			return true;
		} 
		return false;
	}
	virtual function enter() {
		attackGlobal = parent as MagicAttack;
		findYet = false;
		if(attackGlobal.attackList.Count < 3) {
			findYet = findEnemy();
		}
	}
	virtual function exit() {
	}
	virtual function realUpdate() {
	}
	
	function goAttack() {
		return findYet;
	}
	function goBack() {
		if(attackGlobal.attackList.Count >= 3)
			return true;
		return !findYet;
	}
	virtual function initTransition() {
		addTransition("MagicAttackEnemy", goAttack);
		addTransition("MagicBackHome", goBack);
	}
}