#pragma strict
class Fighter extends robot {
	virtual function initPrivateState() {
		stateMachine.addState(new FighterAttackState(stateMachine, this));
	}
	static function makeRobot(s : singleHex) {
		var go = new GameObject();
		//var b = GameObject.CreatePrimitive(PrimitiveType.Sphere);
		var b : GameObject = Instantiate(Resources.Load("Fighter"));
		
		b.transform.parent = go.transform;
		var r = go.AddComponent(Fighter);
		
		r.board = s;
		r.moveRange = 2;
		r.attackRange = 3;
		r.box = b;
		r.attackType = 1;
		r.physicDefense = 0;
		r.magicDefense = 0;
		r.setHealth(650);
		r.attack = 300;
		
		return r;
	}
}
