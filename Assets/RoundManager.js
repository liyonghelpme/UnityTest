#pragma strict
var curTurn : int;
var inAction : boolean;

function Awake() {
	curTurn = 0;
	inAction = false;
}

function Start () {

}

function startAction() {
	inAction = true;
}
function checkInAction() {
	return inAction;
}
function finishAction() {
	inAction = false;
	switchTurn();
}
function switchTurn() {
	curTurn = 1-curTurn;
}
function OnGUI(){
	var style : GUIStyle = new GUIStyle();
	if(curTurn == 0) {
		style.normal.textColor = Color.red;
		GUI.Label(Rect(100, 100, 100, 100), "Red Turn", style);
	} else {
		style.normal.textColor = Color.blue;
		GUI.Label(Rect(100, 100, 100, 100), "Blue Turn", style);
	}
}

function Update () {

}