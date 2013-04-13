#pragma strict

class Flag extends robot {
	static function makeRobot(s : singleHex) {
		var go = new GameObject();
		//var b = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
		var b = Instantiate(Resources.Load("Flag")) as GameObject;
		b.transform.parent = go.transform;
		var r = go.AddComponent(Flag);
		
		r.board = s;
		r.moveRange = 0;
		r.attackRange = 0;
		r.box = b;
		r.attackType = 0;
		r.physicDefense = 0;
		r.magicDefense = 0;
		r.setHealth(800);
		r.attack = 0;
		return r;
	}
	virtual function initPrivateState() {
	}
	virtual function setAction(n : String, a : Action) {
		if(n == "BeAttacked")//just scale
			return;
		else 
			super.setAction(n, a);
	}
}