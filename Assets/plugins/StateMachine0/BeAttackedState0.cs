using UnityEngine;
using System.Collections;

public class BeAttackedState0 : StateModel0 {
	Robot obj;
	Robot attackObject ;
	float startTime ;
	Vector3 oldScale ;
	bool finishAni ;
		
	public BeAttackedState0(StateMachine0 en, Robot o)
        :base(en, "BeAttacked") {
		obj = o;
		Debug.Log("call BeAttackedState "+en+" "+o);
		
	}
	public override void RealUpdate() {
		var diff = Time.time - startTime;
		if(diff > 1.0f)
			finishAni = true;
	}
	public override void Enter() {
		if(action == null) {
			finishAni = false;
			attackObject = obj.attackObject;
			startTime = Time.time;
			oldScale = obj.transform.localScale;
		    obj.anim.SetBool(obj.beAttackHash, true);
		} else {
			base.Enter();
		}

	}
	public override void Exit() {
		if(action == null) {
			obj.beAttacked = false;
		    obj.anim.SetBool(obj.beAttackHash, false);
		} else {
			base.Exit();
		}

	}
	bool GoFree() {
		return finishAni;
	}
	public override void InitTransition() {
		AddTransition("Free", GoFree);
	}
}
