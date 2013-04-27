using UnityEngine;
using System.Collections;

public class DeadState0 :StateModel0 {  
    Robot obj;
	float startTime ;
	Quaternion oldRotation ;
	Vector3 oldScale ;
	RoundManager0 roundManager ;
	
	public DeadState0(StateMachine0 en, Robot o)
    :base(en, "Dead") {
		obj = o;
		roundManager = GameObject.FindGameObjectWithTag("GameController").GetComponent<RoundManager0>();
	}
	public override void Enter() {
		Debug.Log("dead State");	
		obj.inDead = true;
		startTime = Time.time;
		oldRotation = obj.transform.localRotation;
		oldScale = obj.transform.localScale;
		
		Debug.Log("CheckWin At turn start");
		//roundManager.CheckWin();
	}
	public override void Exit() {
		obj.inDead = false;
		obj.transform.localRotation = oldRotation;
		obj.transform.localScale = oldScale;
		
		
	}
	//become a sphere 
	public override void RealUpdate() {
		var passTime = Time.time-startTime;
		if(passTime < 1.0f) {
			Vector3 np = Vector3.Slerp(Vector3.forward, Vector3.up, passTime);
			var quan  = Quaternion.FromToRotation(Vector3.forward, np);
			obj.transform.localRotation = quan;
			var sz = Vector3.Lerp(new Vector3(1, 1, 1), new Vector3(1, 1, 0.5f), passTime);
			obj.transform.localScale = sz;
		}
	}
	bool GoFree() {
		return obj.health > 0;
	}
	public override void InitTransition() {
		AddTransition("Free", GoFree);
	}

}
