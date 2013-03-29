#pragma strict

var color : int;
var board : singleHex;
var moveRange : int;
var moveGrid : GameObject;
var box : GameObject;
var target : Vector3;
var smooth : float;
var logic : ChessBoard;

function Start () {
	logic = board.board.GetComponent(ChessBoard);
	
	smooth = 5.0;
	target = transform.localPosition;
}
function setPosition(row : int, col : int) {
	transform.localPosition = board.gridToPos(row, col);
}
static function makeRobot(s : singleHex) {
	var go = new GameObject();
	var b = GameObject.CreatePrimitive(PrimitiveType.Cube);
	b.transform.parent = go.transform;
	go.AddComponent(robot);
	var r = go.GetComponent(robot);
	r.board = s;
	r.moveRange = 2;
	r.box = b;
	r.chooseYet = false;
	return r;
}
function setColor(c) {
	color = c;
	if(color == 0)
		box.renderer.material.color = Color.red;
	else
		box.renderer.material.color = Color.blue;
}
function changeChoose() {
	if(chooseYet) {
		chooseYet = false;
		removeMoveGrid();
	}
}

function myMouseDown() {
}
function myMouseUp() {
	board.changeChoose();
	chooseYet = true;
	showMoveGrid();
}
function myMouseDrag() {
}

var chooseYet : boolean;


function getNeibor() {
	
}
function removeMoveGrid() {
	Destroy(moveGrid);
}
function makePiece() {
	var go = new GameObject();
	go.AddComponent(LineRenderer);
	var line : LineRenderer = go.GetComponent(LineRenderer);
	line.SetVertexCount(2);
	line.SetPosition(0, Vector3(-0.5, 0, 0));
	line.SetPosition(1, Vector3(0.5, 0, 0));
	line.material = Instantiate(Resources.Load("hexMat") as Material);
	line.useWorldSpace = false;
	return go;
}
function updateMap() {
	var grid : Vector3 = board.posToGrid(transform.localPosition.x, transform.localPosition.z);
	board.updateMap(grid.x, grid.z, this);
}
function clearMap() {
	var grid : Vector3 = board.posToGrid(transform.localPosition.x, transform.localPosition.z);
	board.clearMap(grid.x, grid.z, this);
}
//limit show range not out of boundary
//neibor grid num related to curPos gx gz
function showMoveGrid() {
	moveGrid = new GameObject();
	moveGrid.name = "moveGrid";
	moveGrid.transform.parent = transform.parent;
	moveGrid.transform.localPosition = Vector3.zero;
	
	var i : int;
	var j : int;
	var hex : GameObject;
	var grid : Vector3 = board.posToGrid(transform.localPosition.x, transform.localPosition.z);
	var gx = Mathf.RoundToInt(grid.x);
	var gz = Mathf.RoundToInt(grid.z);
	
	for(i = -moveRange; i <= moveRange; i++) {
		if(i != 0) {
			if(gx+i >= 0 && gx+i < board.width) {
			
				hex = makePiece();
				hex.transform.parent = moveGrid.transform;
				hex.transform.localPosition = board.gridToPos(grid.z, grid.x+i);
				hex.renderer.material.SetColor("_TintColor", Color.red);
				MoveGrid.makeMoveGrid(hex, this);
				//Debug.Log("hex renderer "+hex.renderer+"material "+hex.renderer.material);
			}
		}
	}
	var tempX : int;
	var tempZ : int;
	for(i = 1; i <= moveRange; i++) {
		if(i % 2 == 0) {
			for(j = -moveRange+i/2; j <= moveRange-i/2; j++) {
				if(gx+j >= 0 && gx+j < board.width && gz+i >= 0 && gz+i < board.height) {
					
					hex = makePiece();
					hex.transform.parent = moveGrid.transform;
					hex.transform.localPosition = board.gridToPos(grid.z+i, grid.x+j);
					hex.renderer.material.SetColor("_TintColor", Color.red);
					MoveGrid.makeMoveGrid(hex, this);
					
				}
				
				if(gx+j >= 0 && gx+j < board.width && gz-i >= 0 && gz-i < board.height) {
					
					hex = makePiece();
					hex.transform.parent = moveGrid.transform;
					hex.transform.localPosition = board.gridToPos(grid.z-i, grid.x+j);
					hex.renderer.material.SetColor("_TintColor", Color.red);
					
					MoveGrid.makeMoveGrid(hex, this);
				}
			}
		} else {
			for(j = -moveRange+i/2; j < moveRange-i/2; j = tempX+1) {
				tempX = j;
				if(gz % 2 == 1)
					j++;
					
				if(gx+j >= 0 && gx+j < board.width && gz+i >= 0 && gz+i < board.height) {
					hex = makePiece();
					hex.transform.parent = moveGrid.transform;
					hex.transform.localPosition = board.gridToPos(grid.z+i, grid.x+j);
					hex.renderer.material.SetColor("_TintColor", Color.red);
					
					MoveGrid.makeMoveGrid(hex, this);
				}
				if(gx+j >= 0 && gx+j < board.width && gz-i >= 0 && gz-i < board.height) {
					hex = makePiece();
					hex.transform.parent = moveGrid.transform;
					hex.transform.localPosition = board.gridToPos(grid.z-i, grid.x+j);
					hex.renderer.material.SetColor("_TintColor", Color.red);
					
					MoveGrid.makeMoveGrid(hex, this);
				}
			}
		}
	}
	
}
function FixedUpdate() {
	var np = Vector3.Lerp(transform.localPosition, target, Time.deltaTime*smooth);
	transform.localPosition = np;
}
function setMoveTarget(tar : MoveGrid) {
	var p : Vector3 = tar.gameObject.transform.localPosition;
	target = p;
	changeChoose();
	logic.switchTurn();
}

function Update () {

}
//
function findTarget() {

}


function findMovePoints() : Array {
	var openList = new Array();
	var closedList = {};
	var grid = board.posToGrid(transform.localPosition.x, transform.localPosition.z);
	var gx : int = Mathf.RoundToInt(grid.x);
	var gz : int = Mathf.RoundToInt(grid.z);
	var nx : int;
	var nz : int;
	var dist : int;
	openList.Add([gx, gz, 0]);//x y distance
	while(openList.length > 0) {
		var pos : Array = openList.Shift();
		gx = pos[0];
		gz = pos[1];
		dist = pos[2];
		var key : int;
		
		if(dist < moveRange) {
			//check neibor and add neibor
			if(gz % 2 == 0) {
				nx = gx+1;
				nz = gz;
				key = nx*1000+nz;
				if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
					openList.Add([nx, nz, dist+1]);
				}
				nx = gx;
				nz = gz+1;
				key = nx*1000+nz;
				if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
					openList.Add([nx, nz, dist+1]);
				}
				nx = gx-1;
				nz = gz+1;
				key = nx*1000+nz;
				if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
					openList.Add([nx, nz, dist+1]);
				}
				nx = gx-1;
				nz = gz;
				key = nx*1000+nz;
				if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
					openList.Add([nx, nz, dist+1]);
				}
				nx = gx-1;
				nz = gz-1;
				key = nx*1000+nz;
				if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
					openList.Add([nx, nz, dist+1]);
				}
				nx = gx;
				nz = gz-1;
				key = nx*1000+nz;
				if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
					openList.Add([nx, nz, dist+1]);
				}
			} else {
				nx = gx+1;
				nz = gz;
				key = nx*1000+nz;
				if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
					openList.Add([nx, nz, dist+1]);
				}
				nx = gx+1;
				nz = gz+1;
				key = nx*1000+nz;
				if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
					openList.Add([nx, nz, dist+1]);
				}
				nx = gx;
				nz = gz+1;
				key = nx*1000+nz;
				if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
					openList.Add([nx, nz, dist+1]);
				}
				nx = gx-1;
				nz = gz;
				key = nx*1000+nz;
				if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
					openList.Add([nx, nz, dist+1]);
				}
				nx = gx;
				nz = gz-1;
				key = nx*1000+nz;
				if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
					openList.Add([nx, nz, dist+1]);
				}
				nx = gx+1;
				nz = gz-1;
				key = nx*1000+nz;
				if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
					openList.Add([nx, nz, dist+1]);
				}
			}
		}
		key = gx*1000+gz;
		closedList[key] = true;
	}
	return closedList.Keys;
}