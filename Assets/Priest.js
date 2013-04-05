#pragma strict

class Priest extends robot {
	
	virtual function initPrivateState() {
		stateMachine.addState(new PriestCure(stateMachine, this));
	} 
	static function makeRobot(s : singleHex) {
		var go = new GameObject();
		var b = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
		b.transform.parent = go.transform;
		var r = go.AddComponent(Priest);
		
		r.board = s;
		r.moveRange = 2;
		r.attackRange = 3;
		r.box = b;
		r.attackType = 3;
		return r;
	}
	virtual function findAttackable() {
		for(var r : robot in board.ships) {
			if(r.color == color) {
				var dist : int = board.minDistance(myGridX, myGridZ, r.myGridX, r.myGridZ);
				if(dist <= attackRange) {
					r.inAttackRange = true;
					r.attackObject = this;
					attackableList.Push(r);
				}
			}
		}
	}
	
}