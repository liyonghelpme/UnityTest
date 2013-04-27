using UnityEngine;
using System.Collections;

public class FreeState0 : StateModel0 {
	public Robot obj;
	float startTime;
		
	public FreeState0(StateMachine0 e, Robot o) 
        : base(e, "Free") {
		obj = o;
	}
	bool GoMove() {
		return obj.inMove;
	}
	bool GoInAttack() {
		return obj.inAttackRange;
	}
	public override void RealUpdate() {
        //Debug.LogError("Freeupdate");
		//var old = object.transform.localPosition;
		//object.transform.localPosition = Vector3(old.x, Mathf.Sin(Time.time-startTime), old.z);
	}
	bool GoInChoose() {
		return obj.chooseYet;
	}
	bool GoAttack() {
		return obj.attacking;
	}
	bool GoDead() {
		return obj.health <= 0;
	}
	bool GoBeAttacked() {
		return obj.beAttacked;
	}
	public override void InitTransition() {
		AddTransition("InAttack", GoInAttack);
		AddTransition("InChoose", GoInChoose);
		AddTransition("Attack", GoAttack);
		AddTransition("Dead", GoDead);
		AddTransition("BeAttacked", GoBeAttacked);
	}
	public override void Enter() {
		startTime = Time.time;
	}
	public override void Exit() {
		Vector3 old = obj.transform.localPosition;
		obj.transform.localPosition = new Vector3(old.x, 0, old.z);
	}
}
