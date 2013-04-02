#pragma strict
class InAttack extends StateModel {
	var object : robot;
	var oldColor : Color;
	var attacker : robot;
	
	function InAttack(en : StateMachine, o : robot) {
		super(en, "InAttack");
		object = o;
	}
	virtual function enter()
	{
		oldColor = object.box.renderer.material.color;
		attacker = object.attackObject;
	}
	virtual function exit() 
	{
		object.box.renderer.material.color = oldColor;
	}
	virtual function realUpdate() {
		var power = (Mathf.Sin(Time.time*2*Mathf.PI)+1)/2;
		object.box.renderer.material.color = oldColor*power;
	}
	function goFree() {
		return !object.inAttackRange;
	}
	virtual function initTransition() {
		addTransition("Free", goFree);
	}
}
