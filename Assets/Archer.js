#pragma strict
class Archer extends robot {
	virtual function initPrivateState() {
		stateMachine.addState(new ArcherAttack(stateMachine, this));
	}
	static function makeRobot(s : singleHex) {
		var go = new GameObject();
		//var b = GameObject.CreatePrimitive(PrimitiveType.Sphere);
		var b : GameObject = Instantiate(Resources.Load("Archer"));
		
		b.transform.parent = go.transform;
		var r = go.AddComponent(Archer);
		
		r.board = s;
		r.moveRange = 2;
		r.attackRange = 3;
		r.box = b;
		r.attackType = 0;
		r.physicDefense = 0;
		r.magicDefense = 0;
		r.setHealth(800);
		r.attack = 300;
		
		return r;
	}
}