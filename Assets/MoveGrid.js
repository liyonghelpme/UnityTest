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
}
static function makeMoveGrid(hex: GameObject, b : robot) {
	hex.AddComponent(MoveGrid);
	var mg = hex.GetComponent(MoveGrid);
	mg.box = b;
}
function OnMouseDrag() {
}
function OnMouseUp() {
	var pos : Vector3 = transform.localPosition;
	var grid : Array = new Array(0, 0);
	pos = infoScript.posToGrid(pos.x, pos.z);
	var gx : int = pos.x;
	var gz : int = pos.z;
	if(infoScript.boardMap[gx*1000+gz] == null) {
		Debug.Log("inMove "+gx+" "+gz);
		box.setMoveTarget(this);
	}
}
function OnMouseDown() {
	
}

function Update () {

}