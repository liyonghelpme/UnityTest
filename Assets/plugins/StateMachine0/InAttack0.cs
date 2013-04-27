using UnityEngine;
using System.Collections;

public class InAttack0 : StateModel0 {
	Robot obj;
	Color oldColor;
	Robot attacker;
	Light light;
	
	public InAttack0(StateMachine0 en, Robot o) : 
       base(en, "InAttack") {
		obj = o;
        light = obj.gameObject.GetComponentInChildren<Light>();
	}
	public override void Enter()
	{
		attacker = obj.attackObject;
	}
	public override void Exit() 
	{
		if(light != null) {
			light.intensity = 1.0f;
		}
	}
	public override void RealUpdate() {
		if(light != null)
			light.intensity = (Mathf.Sin(Time.time*Mathf.PI*2)+1)/2.0f;
	}
	bool GoFree() {
		return !obj.inAttackRange;
	}
	public override void InitTransition() {
		AddTransition("Free", GoFree);
	}

}
