#pragma strict
class Action {
	var name : String;
	var state : StateModel;
	function Action() {
		name = "null";
	}
	virtual function enter() {
	}
	virtual function exit() {
	}
	virtual function update() {
	}
}