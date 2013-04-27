using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class MoveState0 : StateModel0 {
	Robot obj;
    List<int> movePath;
	int moveStep;
    Vector3 target;
	RoundManager0 roundManager;
	float turnSmooth = 5.5f;
    float moveSmooth = 5.0f;
	public MoveState0(StateMachine0 en, Robot o)
    :base(en, "Move"){
		obj = o;
	}
	bool GoFree() {
		return moveStep >= movePath.Count;
	}
	public override void InitTransition() {
		AddTransition("Free", GoFree);
	}
	
	public override void Enter() {	
		roundManager = GameObject.FindGameObjectWithTag("GameController").GetComponent<RoundManager0>();	
		movePath = obj.movePath;
		moveStep = 0;
		target = obj.transform.localPosition;
		obj.ClearMap();
		obj.anim.SetBool(obj.fly, true);
	}
	public override void Exit() {
		obj.UpdateMap();
		obj.inMove = false;
        //TODO: Player Buffer State
        /*
		var bufferState : PlayerBufferState = object.GetComponent(PlayerBufferState);
		if(bufferState.hasEffect) {
			GameObject.FindGameObjectWithTag("ShipLayer").BroadcastMessage("checkSoldierInEffectList", object);
		}
		bufferState.updateSoldierInEffectList();
		*/
        //TODO:: roundManager Switch Turn
		roundManager.SwitchTurn();
		obj.anim.SetBool(obj.fly, false);
	}
	public override void RealUpdate() {
		//if near target position stop and change target
		//if not near go to target 
		int curStep = movePath[moveStep];
		var tempTarget = obj.board.GridToPos(curStep%1000, curStep/1000);
		Vector3 dif = tempTarget - obj.transform.localPosition;
		if(dif.sqrMagnitude > 0.01) {
			target = tempTarget;
		} else {
			moveStep++;
		}
		
		var targetDirection = target - obj.transform.localPosition;
        if (targetDirection.x == 0 && targetDirection.z == 0)
            return;
		var targetRotation = Quaternion.LookRotation(targetDirection, Vector3.up);
		var newRotation = Quaternion.Lerp(obj.transform.rotation, targetRotation, turnSmooth*Time.deltaTime);
		obj.transform.rotation = newRotation;
		
		var np = Vector3.Lerp(obj.transform.localPosition, target, Time.deltaTime*moveSmooth);
		obj.transform.localPosition = np;
	}
}
