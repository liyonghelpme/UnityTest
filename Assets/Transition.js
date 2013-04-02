#pragma strict
class Transition {
	var targetState : String;
	var trigger : Function;
	function Transition(t : String, tri : Function) {
		targetState = t;
		trigger = tri;
	}
}