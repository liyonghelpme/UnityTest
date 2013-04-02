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
	
	function addState(state : StateModel) {
		stateArray.Push(state);
	}
	function changeState(state : StateModel) {
		if(currentState != null) {
			currentState.exit();
			currentState = null;
		}
		
		currentState = state;
		currentState.enter();
	}
	function getState(n : String) {
		for(var state : StateModel in stateArray) {
			if(state.stateName  == n)
				return state;
		}
		return null;
	}
	function setCurrentState(s : String) {
		if(currentState != null) {
			currentState.exit();
			currentState = null;
		}
		var newState : StateModel = getState(s);
		currentState = newState;
		currentState.enter();
	}
}