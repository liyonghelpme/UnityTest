#pragma strict
class Ninja extends robot {
	virtual function initPrivateState() {
		stateMachine.addState(new NinjaAttack(stateMachine, this));
	}
	
	static function makeRobot(s : singleHex) {
		var go = new GameObject();
		//var b = GameObject.CreatePrimitive(PrimitiveType.Capsule);
		var b = Instantiate(Resources.Load("Ninja")) as GameObject;
		b.transform.parent = go.transform;
		var r = go.AddComponent(Ninja);
		
		r.board = s;
		r.attackRange = 2;
		r.moveRange = 3;
		r.box = b;
		r.attackType = 0;
		r.physicDefense = 0;
		r.magicDefense = 0;
		r.health = 800;
		r.attack = 300;
		return r;
	}
	//attack
	//replace
	virtual function findAttackable() {
		super.findAttackable();
		for(var r : robot in board.ships) {
			if(r.color == color) {
				r.inAttackRange = true;
				r.attackObject = this;
				attackableList.Push(r);
			}
		}
	}
	virtual function startAttack(enemyObject : robot) {
		if(enemyObject.color == color) {
			inReplace = true;
			other = enemyObject;
			
			enemyObject.inReplace = true;
			enemyObject.other = this;
		} else {
			attacking = true;
			enemy = enemyObject;
		}
	}
} 