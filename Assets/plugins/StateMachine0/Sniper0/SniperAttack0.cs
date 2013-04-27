using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class SniperAttack0 : StateModel0 {
	Robot obj;
	Robot enemy;
	float startTime;
	Vector3 dir;
	Vector3 startPos ;
	Vector3 endPos ;
	SingleHex gameLogic ;
	Dictionary<int, Robot> boardMap;
	bool attackYet = false;
	
	public SniperAttack0(StateMachine0 en , Robot o) : base(en, "Attack") {
		obj = o;
		gameLogic = GameObject.FindGameObjectWithTag("GameController").GetComponent<SingleHex>();
		boardMap = gameLogic.boardMap;
	}
	public override void RealUpdate() {
		var passTime = Time.time - startTime;
		if(passTime >= 0.5f && !attackYet) {
			attackYet = true;
			enemy.beAttacked = true;
		}
	}
	public override void Enter() {
		attackYet = false;
		enemy = obj.enemy;
		startPos = obj.transform.localPosition;
		endPos = enemy.transform.localPosition;
		startTime = Time.time;
		dir = enemy.transform.localPosition - obj.transform.localPosition;
		obj.transform.localRotation = Quaternion.LookRotation(dir);
		
		var roundManager = GameObject.FindGameObjectWithTag("GameController").GetComponent<RoundManager0>();
		roundManager.StartAction();
		
		var dist = gameLogic.MinDistance(obj.myGridX, obj.myGridZ, enemy.myGridX, enemy.myGridZ);
		if(dist > 1)
			obj.anim.SetBool(obj.attack0, true);
		else 
			obj.anim.SetBool(obj.attack1, true);
	}
	public override void Exit() {
		var attack = obj.DoAttack();
		var dist = gameLogic.MinDistance(obj.myGridX, obj.myGridZ, enemy.myGridX, enemy.myGridZ);
		//close attack
		if(dist == 1) {
			SoldierModel0.CalHurt(obj, enemy, -(int)(attack*1.0f));
			obj.attacking = false;
			obj.transform.localPosition = startPos;
		//far row
		} else {
			SoldierModel0.CalHurt(obj, enemy, -(int)(attack*0.6f));
			obj.attacking = false;
			obj.transform.localPosition = startPos;
			
            List<Vector2> adj;
			var frontArray = SoldierModel0.GetAdjacent(obj.myGridX, obj.myGridZ, enemy.myGridX, enemy.myGridZ, out adj);
			Debug.Log("myGrid "+obj.myGridX+" "+obj.myGridZ);
			Debug.Log("eneGrid "+enemy.myGridX+" "+enemy.myGridZ);
			Debug.Log("find neibor "+frontArray);
			//affine to normal
			if(frontArray){
				var n0 = adj[0];
				var n1 = adj[1];
                Vector2 norAtt;
				norAtt = SoldierModel0.AffineToNormal((int)n0.x, (int)n0.y);
				var nx = norAtt.x;
				var nz = norAtt.y;
				Debug.Log("nx nz "+nx+" "+nz);
				
                int key = (int)(nx*1000+nz);
				if(boardMap.ContainsKey(key) && boardMap[key].color != obj.color)
					SoldierModel0.CalHurt(obj, boardMap[key], -(int)(attack*0.6f));
			
				norAtt = SoldierModel0.AffineToNormal((int)n1.x, (int)n1.y);
				nx = norAtt[0];
				nz = norAtt[1];
				Debug.Log("nx nz "+nx+" "+nz);
				
                key = (int)(nx*1000+nz);
				if(boardMap.ContainsKey(key) && boardMap[key].color != obj.color)
					SoldierModel0.CalHurt(obj, boardMap[key], -(int)(attack*0.6f));
			
			}
		}
		
		obj.anim.SetBool(obj.attack0, false);
		obj.anim.SetBool(obj.attack1, false);
		
		
		var roundManager = GameObject.FindGameObjectWithTag("GameController").GetComponent<RoundManager0>();
		roundManager.FinishAction();
	}
	
	
	bool GoFree() {
		var diff  = Time.time-startTime;
		if(diff >= 2.0)
			return true;
		return false;
	}
	public override void InitTransition() {
		AddTransition("Free", GoFree);
	}
}
