#pragma strict
//not a component for object
class StateModel{
	var stateName : String;
	var transitionArray: Array;
	var stateMachine : StateMachine; 
	function StateModel(s : StateMachine, n : String) {
		stateMachine = s;
		transitionArray = new Array();
		stateName = n;
	}	
	
	function enter() {
	}
	function exit() {
	}
	function update() {
		for(var t : Transition in transitionArray) {
			if(t.trigger() == true) {
				stateMachine.changeState(t.targetState);
				return;
			}
		}
		realUpdate();
	}
	virtual function realUpdate() {
	}
	function addTransition(target : String, trigger : Function) {
		var tar : StateModel = stateMachine.getState(target);
		transitionArray.Push(new Transition(tar, trigger));
	}
	virtual function initTransition() {
	}
}