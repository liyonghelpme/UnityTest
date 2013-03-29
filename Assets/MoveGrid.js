#pragma strict
var logic : GameObject;
var infoScript : singleHex;
var box : robot;
function Start () {
	logic = GameObject.Find("GameLogic");
	infoScript = logic.GetComponent(singleHex);
	gameObject.AddComponent(SphereCollider);
	
	var sc : SphereCollider = gameObject.GetComponent(SphereCollider);
	sc.radius = infoScript.r;
	sc.center = Vector3.zero;
	
	/*
	var sc : CapsuleCollider = gameObject.GetComponent(CapsuleCollider);
	sc.radius = infoScript.r;
	sc.center = Vector3.zero;
	sc.height = 0.1;
	sc.direction = 1;
	*/
}
static function makeMoveGrid(hex: GameObject, b : robot) {
	hex.AddComponent(MoveGrid);
	var mg = hex.GetComponent(MoveGrid);
	mg.box = b;
}
function OnMouseDrag() {
}
function OnMouseUp() {
	box.setMoveTarget(this);
}
function OnMouseDown() {
	
}

function Update () {

}