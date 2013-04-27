using UnityEngine;
using System.Collections;

public class AttackState0 : StateModel0 {
    Robot obj ;
	Robot enemy ;
	float startTime ;
	Vector3 dir ;
	Vector3 startPos ;
	Vector3 endPos ;
	bool finishAttack;
	public AttackState0(StateMachine0 en, Robot o) 
        : base(en, "Attack") {
		obj = o;
		finishAttack = false;
	}
	public override void RealUpdate() {
		var passTime = Time.time-startTime; 
		if(passTime >= 1.0f)
			finishAttack = true;
			
		passTime = Mathf.Min(passTime, 1.0f);
		var inter = Mathf.Sin(passTime/2.0f*2*Mathf.PI);
		var np = Vector4.Lerp(startPos, endPos, inter);
		obj.transform.localPosition = np;
	}
	public override void Enter() {
		Debug.Log("attack state enter");
		if(action == null) {
			finishAttack = false;
			enemy = obj.enemy;
			startPos = obj.transform.localPosition;
			endPos = enemy.transform.localPosition;
			startTime = Time.time;
			dir = enemy.transform.localPosition - obj.transform.localPosition;
			obj.transform.localRotation = Quaternion.LookRotation(dir);
		} else 
			base.Enter();
	}
	public override void Exit() {
		if(action == null) {
			SoldierModel0.CalHurt(obj, enemy, -obj.DoAttack());
			obj.attacking = false;
			obj.transform.localPosition = startPos;
		} else
			action.Exit();
			
		var roundManager = GameObject.FindGameObjectWithTag("GameController").GetComponent<RoundManager0>();
		roundManager.SwitchTurn();
	}
	bool GoFree() {
		return finishAttack;
	}
	public override void InitTransition() {
		AddTransition("Free", GoFree);
	}
}
