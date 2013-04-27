using UnityEngine;
using System.Collections;

public class Flag0 : Robot {
	public static new Robot MakeRobot(SingleHex s) {
        Debug.LogError("add Flag0");
		var go = new GameObject();
		var b = (GameObject)Instantiate(Resources.Load("Flag"));
		b.transform.parent = go.transform;
		var r = go.AddComponent<Flag0>();
		
		r.board = s;
		r.moveRange = 0;
		r.attackRange = 0;
		r.box = b;
		r.attackType = 0;
		r.physicDefense = 0;
		r.magicDefense = 0;
		r.SetHealth(4500);
		r.attack = 0;
		return r;
	}
	public override void InitPrivateState() {
        stateMachine.AddState(new FlagFree0(stateMachine, this));
    }
	public override void SetAction(string n, Action0 a) {
		if(n == "BeAttacked")//just scale
			return;
		else 
			base.SetAction(n, a);
	}
}
