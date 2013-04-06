#pragma strict
class ReplaceAction extends Action {
	var object : robot;
	var other : robot;
	var startTime : float;
	var myPos : Vector3;
	var otherPos : Vector3;
	var beAttackState : BeAttackedState;
	
	function ReplaceAction(o : robot, a : robot) {
		name = "ReplaceAction";
		object = o;
		other = a;
	}
	virtual function enter() {
		beAttackState = state as BeAttackedState;
		beAttackState.finishAni = false;
		
		startTime = Time.time;
		myPos = object.transform.localPosition;
		otherPos = other.transform.localPosition;
		object.clearMap();
		Debug.Log("replace Action enter "+myPos+" "+otherPos);
	}
	virtual function exit() {
		object.transform.localPosition = otherPos;
		object.updateMap();
		object.beAttacked = false;
	}
	virtual function update() {
		var dif = Time.time - startTime;
		if(dif >= 1.0) {
			beAttackState.finishAni = true;
		}
		dif = Mathf.Min(dif, 1.0);
		//Debug.Log("replace "+myPos+" "+otherPos+" "+dif);
		object.transform.localPosition = Vector3.Lerp(myPos, otherPos, dif);
	}
}