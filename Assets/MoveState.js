#pragma strict
class MoveState extends StateModel {
	var object : robot;
	var movePath : Array;
	var moveStep : int;
	var target : Vector3;
	
	
	function MoveState(en : StateMachine, o : robot) {
		super(en, "Move");
		object = o;
	}
	function goFree() {
		return moveStep >= movePath.length;
	}
	virtual function initTransition() {
		addTransition("Free", goFree);
	}
	
	virtual function enter() {	
		movePath = object.movePath;
		moveStep = 0;
		target = object.transform.localPosition;
		object.clearMap();
	}
	virtual function exit() {
		object.updateMap();
		object.inMove = false;
		object.logic.switchTurn();
	}
	virtual function realUpdate() {
		//if near target position stop and change target
		//if not near go to target 
		var curStep : int = movePath[moveStep];
		var tempTarget = object.board.gridToPos(curStep%1000, curStep/1000);
		var dif : Vector3 = tempTarget - object.transform.localPosition;
		if(dif.sqrMagnitude > 0.01) {
			target = tempTarget;
		} else {
			moveStep++;
		}
		
		var np : Vector3 = Vector3.Lerp(object.transform.localPosition, target, Time.deltaTime*object.smooth);
		object.transform.localPosition = np;
	}
}