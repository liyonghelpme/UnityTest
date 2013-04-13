#pragma strict

class Engineer extends robot {
	virtual function initPrivateState() {
		stateMachine.addState(new EngineerAttackState(stateMachine, this));
	}
	static function makeRobot(s : singleHex) {
		var go = new GameObject();
		//var b = GameObject.CreatePrimitive(PrimitiveType.Sphere);
		var b : GameObject = Instantiate(Resources.Load("Engineer"));
		
		b.transform.parent = go.transform;
		var r = go.AddComponent(Engineer);
		
		r.board = s;
		r.moveRange = 2;
		r.attackRange = 1;
		r.box = b;
		r.attackType = 0;
		r.physicDefense = 0;
		r.magicDefense = 0;
		r.setHealth(800);
		r.attack = 200;
		
		go.AddComponent(GoodsGreat);
		
		return r;
	}
	
	virtual function findAttackable() {
		super.findAttackable();
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