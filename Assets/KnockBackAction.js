#pragma strict
class KnockBackAction extends Action {
	var attacker : robot;
	var object : robot;
	var startTime : float;
	var attackerGrid : Vector3;
	var backGrid : Vector3;
	var target : Vector3;
	var startPos : Vector3;
	var beAttackState : BeAttackedState;
	function KnockBackAction(o : robot, a : robot) {
		attacker = a;
		object = o;
		target = object.transform.localPosition;
	}
	virtual function enter() {
		beAttackState = state as BeAttackedState;
		beAttackState.finishAni = false;
		startTime = Time.time;
		attackerGrid = object.board.posToGrid(attacker.transform.localPosition.x, attacker.transform.localPosition.z);
		backGrid = object.board.posToGrid(object.transform.localPosition.x, object.transform.localPosition.z);
		var att : Array = new Array(2);
		var back : Array = new Array(2);
		object.board.normalToAffine(Mathf.FloorToInt(attackerGrid.x), Mathf.FloorToInt(attackerGrid.z), att);
		object.board.normalToAffine(Mathf.FloorToInt(backGrid.x), Mathf.FloorToInt(backGrid.z), back);
		Debug.Log("affine pos "+attackerGrid+" "+backGrid+" "+att[0]+" "+att[1]+" "+back[0]+" "+back[1]);
		
		var ax : int;
		var az : int;
		var bx : int;
		var bz : int;
		ax = att[0];
		az = att[1];
		bx = back[0];
		bz = back[1];
		var dx : int = bx-ax;
		var dz : int = bz-az;
		
		bx += dx;
		bz += dz;
		object.board.affineToNormal(bx, bz, back);
		startPos = object.transform.localPosition;
		object.clearMap();
		if(object.board.checkMapMovable(back[0], back[1])) {
			target = object.board.gridToPos(back[1], back[0]);	
		}else {
			target = startPos;
		}
		Debug.Log("KnockBackState "+startPos+" "+target+" "+back[0]+" "+back[1]);
	}
	virtual function exit() {
		object.beAttacked = false;
		object.transform.localPosition = target;
		object.updateMap();
	}
	virtual function update() {
		var dif : float = (Time.time - startTime)/1.0;
		if(dif > 1.0)
			beAttackState.finishAni = true;
		dif = Mathf.Min(dif, 1);
		object.transform.localPosition = Vector3.Lerp(startPos, target, dif);
	}
}