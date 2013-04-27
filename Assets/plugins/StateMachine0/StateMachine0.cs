using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class StateMachine0{
	List<StateModel0> stateArray;
	StateModel0 currentState;
    public StateMachine0() {
		stateArray = new List<StateModel0>();
		currentState = null;
	}
	
	public void Update () {
		if(currentState == null)
			return;
        //Debug.LogError("UpdateState "+currentState);
		currentState.Update();
	}
	public void InitTransition() {
		foreach(var s in stateArray) {
			s.InitTransition();
		}
	}
	//if state exist replace old same name sate
	public void AddState(StateModel0 state) {
		RemoveState(state.stateName);
		stateArray.Add(state);
	}
    public void ChangeState(string nextState) {
        //Debug.LogWarning("changeState "+nextState);
		StateModel0 ns  = GetState(nextState);
		if(currentState != null) {
			currentState.Exit();
			ExitParentState(currentState, ns.stateLevel);
			currentState = null;
		}
		//Debug.Log("next State "+nextState);
		//currentState = getState(nextState);
		
		currentState = GetLowestLevelState(ns);
		currentState.Enter();

        //Debug.LogWarning("ChangeState "+nextState+"Free "+currentState);
	}
	void ExitParentState(StateModel0 cs, int level) {
		if(cs.parent != null) {
			if(cs.stateLevel > level) {
				cs.parent.Exit();
				ExitParentState(cs.parent, level);
			}
		}
	}
	StateModel0 GetLowestLevelState(StateModel0 ns) {
		StateModel0 tempState;
		if(ns.initState != null) {
			ns.Enter();
			tempState = GetLowestLevelState(ns.initState);
		} else {
			tempState = ns;
		}
		return tempState;
	}
	
	void RemoveState(string n) {
		for(var i = 0; i < stateArray.Count; i++) {
			if(stateArray[i].stateName == n)
				stateArray.RemoveAt(i);
		}
	}
    public StateModel0 GetState(string n) {
		foreach(StateModel0 state in stateArray) {
			if(state.stateName  == n)
				return state;
		}
		return null;
	}
}
