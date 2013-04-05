#pragma strict
//decided possible 
//
class MagicAttack extends StateModel {
	var object : robot;
	var end : boolean;
	var enemy : robot;
	var startTime : float;
	var attackList : Hashtable;
	var startPos : Vector3;
	var endPos : Vector3;
	var dir : Vector3;
	
	var originPos : Vector3;
	function MagicAttack(en : StateMachine, o : robot){
		super(en, "Attack");
		object = o;
		
	}
	virtual function enter() {
		attackList = new Hashtable();
		originPos = object.transform.localPosition;
		Debug.Log("init origin pos "+originPos);
		enemy = object.enemy;
		end = false;
		object.clearMap();
	
	}
	
	virtual function exit() {
		object.transform.localPosition = originPos;
		object.attacking = false;
		object.updateMap();
		Debug.Log("exit magic "+originPos);
	}
	
	virtual function realUpdate() {
	}
	virtual function initTransition() {
		//addTransition("Free", goFree);
	}
	 
}