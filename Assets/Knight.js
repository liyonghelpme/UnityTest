#pragma strict
class Knight extends robot {
	function Start () {
		super.Start();	
	}
	virtual function initPrivateState() {
		stateMachine.addState(new KnightAttack(stateMachine, this));
	}
	static function makeRobot(s : singleHex) {
		var go = new GameObject();
		var b = GameObject.CreatePrimitive(PrimitiveType.Sphere);
		b.transform.parent = go.transform;
		var r = go.AddComponent(Knight);
		
		r.board = s;
		r.moveRange = 2;
		r.attackRange = 1;
		r.box = b;
		r.attackType = 1;
		return r;
	}
}