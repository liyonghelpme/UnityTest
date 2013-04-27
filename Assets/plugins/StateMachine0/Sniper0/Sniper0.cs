using UnityEngine;
using System.Collections;

public class Sniper0 : Robot {

	public override void InitPrivateState() {
		stateMachine.AddState(new SniperAttack0(stateMachine, this));
	}
	public static new Robot MakeRobot(SingleHex s) {
		var go = new GameObject();
		var b = (GameObject)Instantiate(Resources.Load("JujiTexture"));
		
		b.transform.parent = go.transform;
		var r = go.AddComponent<Sniper0>();
		
		r.board = s;
		r.moveRange = 2;
		r.attackRange = 2;
		r.box = b;
		r.attackType = 0;
		r.physicDefense = 0f;
		r.magicDefense = 0;
		r.SetHealth(800);
		r.attack = 300;
		
		return r;
	}
}
