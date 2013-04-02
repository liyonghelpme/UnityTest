#pragma strict
class Transition {
	var targetState : StateModel;
	var trigger : Function;
	function Transition(t : StateModel, tri : Function) {
		targetState = t;
		trigger = tri;
	}
}