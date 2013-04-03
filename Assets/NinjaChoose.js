#pragma strict
class NinjaChoose extends StateModel {
var object : robot;
	function NinjaChoose(en : StateMachine, o : robot) {
		super(en, "InChoose");
		object = o;
	}
	virtual function enter() {
		object.board.changeChoose();
		object.chooseYet = true;
		object.showMoveGrid();
		object.board.shipLayer.BroadcastMessage("checkAttackable", object);
		object.board.shipLayer.BroadcastMessage("checkReplaceable", object);
	}
	virtual function exit() {
		object.removeMoveGrid();
		object.box.renderer.material.color.g = 0;
		object.chooseYet = false;//doMove
		//doFree clear old choose objects!
		object.board.shipLayer.BroadcastMessage("clearAttackable", object);//clear my enemy
		object.board.shipLayer.BroadcastMessage("clearReplaceable", object);
		//inform my attackable object clear their state 
		//object.board.changeChoose();
	}
	virtual function realUpdate() {
		var oldColor = object.box.renderer.material.color;
		object.box.renderer.material.color = Color(oldColor.r, (Mathf.Sin(Time.time*2*Mathf.PI)+1)/2, oldColor.b);
	}
	function goFree() {
		return !object.chooseYet;
	}
	function goMove() {
		return object.inMove;
	}
	function goAttack() {
		return object.attacking;
	}
	function goReplace() {
		return object.inReplace;
	}
	virtual function initTransition() {
		addTransition("Free", goFree);
		addTransition("Move", goMove);
		addTransition("Attack", goAttack);
		addTransition("Replace", goReplace);
	}
}
