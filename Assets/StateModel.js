#pragma strict
//not a component for object
class StateModel{
	var stateName : String;
	var transitionArray: Array;
	var stateMachine : StateMachine; 
	var childrenState : Array;
	var initState : StateModel;
	var stateLevel : int;
	var parent : StateModel;
	var action : Action;//
	
	function StateModel(s : StateMachine, n : String) {
		stateMachine = s;
		transitionArray = new Array();
		stateName = n;
		childrenState = new Array();
		initState = null;
		stateLevel = 0;
		parent = null;
		action = new Action();
		Debug.Log("clear State Model");
	}	
	virtual function setAction(a : Action) {
		Debug.Log("setAction "+stateName+" "+a);
		action = a;
		if(action.name != "null")
			action.state = this;
	}
	//first child is initState
	function addChildState(n : String) {
		var child : StateModel = stateMachine.getState(n);
		if(initState == null) {
			initState = child;
		}
		childrenState.Push(child);
		child.parent = this;
		child.stateLevel = stateLevel+1;
	}
	
	virtual function enter() {
		if(action.name != "null")
			action.enter();
	}
	virtual function exit() {
		if(action.name != "null")
			action.exit();
	}
	function update() {
		for(var t : Transition in transitionArray) {
			if(t.trigger() == true) {
				stateMachine.changeState(t.targetState);
				return;
			}
		}
		if(action.name != "null") {
			action.update();
		} else
			realUpdate();
	}
	virtual function realUpdate() {
	}
	function addTransition(target : String, trigger : Function) {
		//var tar : StateModel = stateMachine.getState(target);
		transitionArray.Push(new Transition(target, trigger));
	}
	virtual function initTransition() {
	}
	virtual function initChildrenState() {
	}
}