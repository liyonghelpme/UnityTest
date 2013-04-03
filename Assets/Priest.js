#pragma strict

class Priest extends robot {
	virtual function initPrivateState() {
		
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
}