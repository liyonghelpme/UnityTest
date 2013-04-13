#pragma strict
class Sniper extends robot {
	virtual function initPrivateState() {
		stateMachine.addState(new SniperAttack(stateMachine, this));
	}
	static function makeRobot(s : singleHex) {
		var go = new GameObject();
		//var b = GameObject.CreatePrimitive(PrimitiveType.Sphere);
		var b : GameObject = Instantiate(Resources.Load("Sniper"));
		
		b.transform.parent = go.transform;
		var r = go.AddComponent(Sniper);
		
		r.board = s;
		r.moveRange = 2;
		r.attackRange = 2;
		r.box = b;
		r.attackType = 0;
		r.physicDefense = 0.2;
		r.magicDefense = 0;
		r.setHealth(800);
		r.attack = 300;
		
		return r;
	}
}