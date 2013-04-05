#pragma strict

class Magic extends robot {
	virtual function initPrivateState() {
		var magicAttack : StateModel = new MagicAttack(stateMachine, this);
		stateMachine.addState(magicAttack);
		var magicAttackEnemy : StateModel = new MagicAttackEnemy(stateMachine, this);
		stateMachine.addState(magicAttackEnemy);
		var magicFindEnemy : StateModel = new MagicFindEnemy(stateMachine, this);
		stateMachine.addState(magicFindEnemy);
		var magicBackHome : StateModel = new MagicBackHome(stateMachine, this);
		stateMachine.addState(magicBackHome);
		
		magicAttack.addChildState("MagicAttackEnemy");
		magicAttack.addChildState("MagicFindEnemy");
		magicAttack.addChildState("MagicBackHome");
		
	}
	static function makeRobot(s : singleHex) {
		var go = new GameObject();
		//var b = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
		var b : GameObject =  Instantiate(Resources.Load("Monk"));
		b.transform.parent = go.transform;
		
		var newVertices : Vector3[] = [Vector3(-0.5, -1, -0.5), Vector3(0.5, -1, -0.5), Vector3(0, -1, 0.5), Vector3(0, 1, 0)];
		var newUV : Vector2[] = [Vector2(0, 0), Vector2(0, 1), Vector2(0.5, 0.5), Vector2(1, 1)];
		var newTriangles : int[] = [0, 3, 1, 0, 1, 2, 1, 3, 2, 0, 2, 3];
		
		/*
		var mesh : Mesh = new Mesh();
		b.GetComponent(MeshFilter).mesh = mesh;
		mesh.vertices = newVertices;
		mesh.uv = newUV;
		mesh.triangles = newTriangles;
		mesh.RecalculateNormals();
		*/
		 
		var r = go.AddComponent(Magic);
		
		r.board = s;
		r.moveRange = 2;
		r.attackRange = 2;
		r.box = b;
		r.attackType = 1;
		r.physicDefense = 0;
		r.magicDefense = 0.1;
		r.health = 800;
		r.attack = 200;
		
		return r;
	}
}