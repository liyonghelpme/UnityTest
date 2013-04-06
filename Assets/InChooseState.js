#pragma strict
class InChooseState extends StateModel {
	var object : robot;
	var oldColor : Color;
	function InChooseState(en : StateMachine, o : robot) {
		super(en, "InChoose");
		object = o;
	}
	virtual function enter() {
		object.board.changeChoose();
		object.chooseYet = true;
		object.showMoveGrid();
		object.findAttackable();
		var ret : Array = SoldierModel.getChildColor(object.box);
		if(ret[0])
			oldColor = ret[1];
	}
	virtual function exit() {
		object.removeMoveGrid();
		SoldierModel.setChildColor(object.box, oldColor);
		object.chooseYet = false;//doMove
		//doFree clear old choose objects!
		object.clearEnemy();
	}
	virtual function realUpdate() {
		SoldierModel.setChildColor(object.box, Color(oldColor.r, (Mathf.Sin(Time.time*2*Mathf.PI)+1)/2, oldColor.b));
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
	function goBeAttacked() {
		return object.beAttacked;
	}
	virtual function initTransition() {
		addTransition("Free", goFree);
		addTransition("Move", goMove);
		addTransition("Attack", goAttack);
		addTransition("BeAttacked", goBeAttacked);
		//addTransition("Replace", goReplace);
	}
}
