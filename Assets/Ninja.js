#pragma strict
class Ninja extends robot {
	virtual function initPrivateState() {
		stateMachine.addState(new NinjaAttack(stateMachine, this));
		stateMachine.addState(new NinjaChoose(stateMachine, this));
		stateMachine.initTransition();
		stateMachine.setCurrentState("Free");
	}
	
	static function makeRobot(s : singleHex) {
		var go = new GameObject();
		var b = GameObject.CreatePrimitive(PrimitiveType.Capsule);
		b.transform.parent = go.transform;
		var r = go.AddComponent(Ninja);
		
		r.board = s;
		r.moveRange = 2;
		r.attackRange = 2;
		r.box = b;
		r.attackType = 2;
		return r;
	}
} 