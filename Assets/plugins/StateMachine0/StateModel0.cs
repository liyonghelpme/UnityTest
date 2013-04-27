using UnityEngine;
using System.Collections;
using System.Collections.Generic;

//TODO: use c# delegate to set trigger function
public delegate bool Trigger();

public class StateModel0 {
	public string stateName;
    List<Transition0> transitionArray;
	StateMachine0 stateMachine; 
	List<StateModel0> childrenState;
	public StateModel0 initState;
	public int stateLevel;
	public StateModel0 parent;
	public Action0 action;
	
	public StateModel0(StateMachine0 s, string n) {
		stateMachine = s;
		transitionArray = new List<Transition0>();
		stateName = n;
		childrenState = new List<StateModel0>();
		initState = null;
		stateLevel = 0;
		parent = null;
        //TODO: action = null not use EmptyAction
		action = null;
		Debug.Log("clear State Model");
	}	
	public virtual void SetAction(Action0 a) {
		Debug.Log("setAction "+stateName+" "+a);
		action = a;
		action.state = this;
	}
	//first child is initState
	public void AddChildState(string n) {
		StateModel0 child = stateMachine.GetState(n);
		if(initState == null) {
			initState = child;
		}
		childrenState.Add(child);
		child.parent = this;
		child.stateLevel = stateLevel+1;
	}
	
	public virtual void Enter() {
        if(action != null)
			action.Enter();
	}
	public virtual void Exit() {
        if(action != null)
			action.Exit();
	}
	public void Update() {
		foreach(Transition0 t in transitionArray) {
			if(t.trigger() == true) {
				stateMachine.ChangeState(t.targetState);
				return;
			}
		}
		if(action != null) {
			action.Update();
		} else
			RealUpdate();
	}
	public virtual void RealUpdate() {
        Debug.LogWarning("StateModel RealUpdate");
	}
	public void AddTransition(string target, Trigger trigger) {
		//var tar : StateModel = stateMachine.getState(target);
		transitionArray.Add(new Transition0(target, trigger));
	}
	public virtual void InitTransition() {
	}
	public virtual void InitChildrenState() {
	}
}
