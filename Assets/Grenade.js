#pragma strict
class Grenade extends robot {
	virtual function initPrivateState() {
		stateMachine.addState(new GrenadeAttack(stateMachine, this));
	}
	static function makeRobot(s : singleHex) {
		var go = new GameObject();
		var b : GameObject = Instantiate(Resources.Load("Grenade"));
		
		b.transform.parent = go.transform;
		var r = go.AddComponent(Grenade);
		
		r.board = s;
		r.moveRange = 2;
		r.attackRange = 3;
		r.box = b;
		r.attackType = 1;
		r.physicDefense = 0;
		r.magicDefense = 0;
		r.setHealth(800);
		r.attack = 200;
		
		return r;
	}
}