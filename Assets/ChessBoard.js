#pragma strict

var target : Vector3;
var smooth : float;
var plane : Plane;
var startWorldPos : Vector3;
var startChessPos : Vector3;
var curTurn : int;
var showTurnWord : float;
var logic : singleHex;


function Start () {
	Debug.Log("ChessBoard ");
	logic = GameObject.Find("GameLogic").GetComponent(singleHex);
	target = transform.localPosition;
	smooth = 5.0;
	plane = new Plane(Vector3.up, Vector3.zero);
	curTurn = 0;
}
/*
function OnGUI() {
	if(showTurnWord < 5.0) {
		var style = new GUIStyle();
		style.fontSize = 30;
		if(curTurn == 0) {
			style.normal.textColor = Color.red;
			GUI.Label(Rect(20, 20, 100, 100), "Red Ture", style);
		} else {
			style.normal.textColor = Color.blue;
			GUI.Label(Rect(20, 20, 100, 100), "Blue Ture", style);
		}
		showTurnWord += Time.deltaTime;
	}
}
*/
/*
function switchTurn() {
	curTurn = 1-curTurn;
	showTurnWord = 0;
}
*/
function Update () {

}
function FixedUpdate() {
	//Debug.Log("fixed update"+target);
	var np = Vector3.Lerp(transform.localPosition, target, Time.deltaTime*smooth);
	transform.localPosition = np;
}
function OnMouseDown() {
	
	var ray : Ray = Camera.mainCamera.ScreenPointToRay(Input.mousePosition);
	var dist : float;
	var inter : boolean = plane.Raycast(ray, dist);
	if(inter) {
		startWorldPos = ray.GetPoint(dist);
	}
	startChessPos = transform.localPosition; 
	
	//Debug.Log("down mouse ");
	logic.clearChoose();
}
function OnMouseUp() {
	//Debug.Log("OnMouseUp");
}
function OnMouseDrag() {
	
	var ray : Ray = Camera.mainCamera.ScreenPointToRay(Input.mousePosition);
	var dist : float;
	var inter : boolean = plane.Raycast(ray, dist);
	//Debug.Log("drag mouse "+dist+"inter"+inter);
	if(inter) {
		var curPos = ray.GetPoint(dist);
		var dif : Vector3 = curPos-startWorldPos;
		target = startChessPos + Vector3(dif.x, 0, dif.z);
	}
}
