using UnityEngine;
using System.Collections;

public class InChooseState0 : StateModel0 {
    Robot obj;
	Color oldColor;
	
	public InChooseState0(StateMachine0 en, Robot o)
    :base(en, "InChoose"){
		obj = o;
	}
	public override void Enter() {
        Debug.Log("enter InChoose");
		obj.board.ChangeChoose();
		obj.chooseYet = true;
		obj.ShowMoveGrid();
		obj.FindAttackable();
	}
	public override void Exit() {
		obj.RemoveMoveGrid();
        obj.chooseYet = false;//doMove
		//doFree clear old choose objects!
		obj.ClearEnemy();
	}
	public override void RealUpdate() {
	}
    bool GoFree() {
		return !obj.chooseYet;
	}
	bool GoMove() {
		return obj.inMove;
	}
	bool GoAttack() {
		return obj.attacking;
	}
	bool GoBeAttacked() {
		return obj.beAttacked;
	}
	public override void InitTransition() {
		AddTransition("Free", GoFree);
		AddTransition("Move", GoMove);
		AddTransition("Attack", GoAttack);
		AddTransition("BeAttacked", GoBeAttacked);
	}
}
