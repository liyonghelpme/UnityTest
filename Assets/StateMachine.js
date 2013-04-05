#pragma strict
class StateMachine {
	var stateArray : Array;
	var currentState : StateModel;
	function StateMachine() {
		stateArray = new Array();
		currentState = null;
	}
	
	function update () {
		if(currentState == null)
			return;
		currentState.update();
	}
	function initTransition() {
		for(var s : StateModel in stateArray) {
			s.initTransition();
		}
	}
	//if state exist replace old same name sate
	function addState(state : StateModel) {
		removeState(state.stateName);
		stateArray.Push(state);
	}
	function changeState(nextState : String) {
		var ns : StateModel = getState(nextState);
		if(currentState != null) {
			currentState.exit();
			exitParentState(currentState, ns.stateLevel);
			currentState = null;
		}
		//Debug.Log("next State "+nextState);
		//currentState = getState(nextState);
		
		currentState = getLowestLevelState(ns);
		currentState.enter();
	}
	function exitParentState(cs : StateModel, level : int) {
		if(cs.parent != null) {
			if(cs.stateLevel > level) {
				cs.parent.exit();
				exitParentState(cs.parent, level);
			}
		}
	}
	function getLowestLevelState(ns : StateModel) : StateModel {
		var tempState : StateModel;
		if(ns.initState != null) {
			ns.enter();
			tempState = getLowestLevelState(ns.initState);
		} else {
			tempState = ns;
		}
		return tempState;
	}
	
	function removeState(n : String) {
		for(var i = 0; i < stateArray.length; i++) {
			if((stateArray[i] as StateModel).stateName == n)
				stateArray.RemoveAt(i);
		}
	}
	function getState(n : String) {
		for(var state : StateModel in stateArray) {
			if(state.stateName  == n)
				return state;
		}
		return null;
	}

}