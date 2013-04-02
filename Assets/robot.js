#pragma strict

var color : int;
var board : singleHex;
var moveRange : int;
var moveGrid : GameObject;
var box : GameObject;
var target : Vector3;
var smooth : float;
var logic : ChessBoard;
var attackRange : int;
var myGridX : int;
var myGridZ : int;

var oldColor : Color;
var attackType : int;

//show number 
var health : int;
var attack : int;
var stateMachine : StateMachine;

//@script RequireComponent(StateMachine)
class robot extends MonoBehaviour {
	function Start () {
		logic = board.board.GetComponent(ChessBoard);
		smooth = 5.0;
		target = transform.localPosition;
		inAttackRange = false;
		//inMove = false;
		health = 100;
		attack = 30;
		fontStyle = new GUIStyle();
		
		initStateMachine();
	}
	function initStateMachine() {
		stateMachine = new StateMachine();
		var free : StateModel = new FreeState(stateMachine, this);
		stateMachine.addState(free);
		var move : StateModel = new MoveState(stateMachine, this);
		stateMachine.addState(move);
		//free.initTransition();
		//move.initTransition();
		stateMachine.initTransition();
		
		stateMachine.setCurrentState("Free");
	}
	function setPosition(row : int, col : int) {
		transform.localPosition = board.gridToPos(row, col);
	}
	static function makeRobot(s : singleHex) {
		var go = new GameObject();
		var b = GameObject.CreatePrimitive(PrimitiveType.Cube);
		b.transform.parent = go.transform;
		go.AddComponent(robot);
		go.AddComponent(StateMachine);
		var r = go.GetComponent(robot);
		r.board = s;
		r.moveRange = 2;
		r.attackRange = 1;
		r.box = b;
		r.chooseYet = false;
		r.setMapYet = false;
		r.attackType = 0;
		return r;
	}
	function setColor(c) {
		color = c;
		if(color == 0)
			box.renderer.material.color = Color.red;
		else
			box.renderer.material.color = Color.blue;
		oldColor = box.renderer.material.color;
	}
	function changeChoose() {
		if(chooseYet) {
			chooseYet = false;
			removeMoveGrid();
		}
		if(inAttackRange) {
			inAttackRange = false;
			box.renderer.material.color = oldColor;
		}
		if(attackLayer != null) {
			Destroy(attackLayer);
			attackLayer = null;
		}
	}
	var fontStyle : GUIStyle;
	function OnGUI() {
		var scPos : Vector3 = Camera.mainCamera.WorldToScreenPoint(transform.position+Vector3(0, 0.5, 0));
		GUI.Label(Rect(scPos.x, Camera.mainCamera.pixelHeight-scPos.y, 100, 100), ""+health, fontStyle);
	}
	function myMouseDown() {
	}
	function startAttack(enemyObject : robot) {
		board.changeChoose();
		chooseYet = true;
		enemyObject.health -= attack;
	}
	function myMouseUp() {
		if(inAttackRange) {
			attackObject.startAttack(this);
			inAttackRange = false;
		} else {
			board.changeChoose();
			chooseYet = true;
			showMoveGrid();
			board.shipLayer.BroadcastMessage("checkAttackable", this);
		}
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
		myGridX = grid.x;
		myGridZ = grid.z;
		board.updateMap(grid.x, grid.z, this);
		setMapYet = true;
	}
	function clearMap() {
		var grid : Vector3 = board.posToGrid(transform.localPosition.x, transform.localPosition.z);
		board.clearMap(grid.x, grid.z, this);
		setMapYet = false;
	}
	var inAttackRange : boolean;
	var attackLayer : GameObject;
	var attackObject : robot;
	function checkAttackable(attacker : robot) {
		Debug.Log("checkAttackble "+attacker.color+" "+color);
		if(color != attacker.color) {
			var dist : int = board.minDistance(myGridX, myGridZ, attacker.myGridX, attacker.myGridZ);
			Debug.Log("min dist "+dist+" range"+attacker.attackRange);
			if(dist <= attacker.attackRange) {
				var mx : int;
				var mz : int;
				var ax : int;
				var az : int;
				var arr = new Array();
				arr.length = 2;
				
				board.normalToAffine(myGridX, myGridZ, arr);
				mx = arr[0];
				mz = arr[1];
				board.normalToAffine(attacker.myGridX, attacker.myGridZ, arr);
				ax = arr[0];
				az = arr[1];
				Debug.Log("affine pos "+mx+" "+mz+" "+ax+" "+az);
				
				var path = new Array();
				var ret : boolean = board.realPathLength(mx, mz, ax, az, path, attacker);
				Debug.Log("realPathLength "+ret);
				if(ret) {
					inAttackRange = true;
					attackObject = attacker;
				}
				Debug.Log("path length "+path.length);
				Debug.Log("path is "+path);
				attackLayer = new GameObject();
				attackLayer.transform.parent = transform.parent;
				attackLayer.transform.localPosition = Vector3.zero;
				
				
				for(var c : Array in path) {
					var hint = GameObject.CreatePrimitive(PrimitiveType.Cube);
					hint.transform.parent = attackLayer.transform;
					hint.transform.localScale = Vector3(0.3, 0.3, 0.3);
					hint.transform.localPosition = board.gridToPos(c[1], c[0]);
					hint.renderer.material.color = Color.green;
				}
				
				
			} 
		}
	}
	
	
	function showMoveGrid() {
		moveGrid = new GameObject();
		moveGrid.name = "moveGrid";
		moveGrid.transform.parent = transform.parent;
		moveGrid.transform.localPosition = Vector3.zero;
		var hex : GameObject;
		var points = findMoveOrAttackPoints(moveRange);
		Debug.Log("move point num "+points);
		var temp = new Array(points);
		Debug.Log("array "+temp);
		//myself should not contain in points
		for(var p : int in points) {
			var gx = p/1000;
			var gz = p%1000;
			if(gx == myGridX && gz == myGridZ) 
				continue;
			hex = makePiece();
			hex.transform.parent = moveGrid.transform;
			hex.transform.localPosition = board.gridToPos(gz, gx);
			//hex.renderer.material.SetColor("_TintColor", Color.red);
			MoveGrid.makeMoveGrid(hex, this);
		}
	}
	
	
	var setMapYet : boolean;
	//in same box
	function FixedUpdate() {
		stateMachine.update();
		/*
		var dif : Vector3;
		if(inMove) {
			if(moveStep >= movePath.length) {
				inMove = false;
			} else {
				//if near target position stop and change target
				//if not near go to target 
				var curStep : int = movePath[moveStep];
				var tempTarget = board.gridToPos(curStep%1000, curStep/1000);
				dif = tempTarget - transform.localPosition;
				if(dif.sqrMagnitude > board.s/3) {
					target = tempTarget;
				} else {
					moveStep++;
				}
			}
		}
		
		var np : Vector3 = Vector3.Lerp(transform.localPosition, target, Time.deltaTime*smooth);
		transform.localPosition = np;
		//not in move status
		if(!inMove) {
			if(!setMapYet) {
				dif = target - transform.localPosition;
				if(dif.sqrMagnitude <= board.s/3) {
					setMapYet = true;
					updateMap();
				}
			}
		}
		//color shrink
		if(inAttackRange) {
			//Debug.Log("inAttackRange "+);
			var power = (Mathf.Sin(Time.time*2*Mathf.PI)+1)/2;
			box.renderer.material.color = oldColor*power;
		}
		*/
	}
	var movePath : Array;
	//var inMove : boolean;
	var moveStep : int;
	function setMoveTarget(tar : MoveGrid) {
		var p : Vector3 = tar.gameObject.transform.localPosition;
		var grid = board.posToGrid(p.x, p.z);
		var path = findMovePath(grid.x, grid.z);
		movePath = path;
		//inMove = true;
		//moveStep = 0;
		//target = p;
		
		changeChoose();
		logic.switchTurn();
		//clearMap();
		
		stateMachine.changeState("Move");
	}
	
	function Update () {
	
	}
	//
	function findTarget() {
	
	}
	//from current pos to  target pos
	//gridInfo  key ----> [parent, dist]
	function findMovePath(tarX : int, tarZ : int) {
		var gridInfo = {};
		var openList = new Array();
		var closedList = {};
		var grid = board.posToGrid(transform.localPosition.x, transform.localPosition.z);
		var gx : int = Mathf.RoundToInt(grid.x);
		var gz : int = Mathf.RoundToInt(grid.z);
		var nx : int;
		var nz : int;
		var dist : int;
		
		openList.Add([gx, gz, 0]);//x y distance
		gridInfo[gx*1000+gz] = new Array(-1, 0);
		
		while(openList.length > 0) {
			var pos : Array = openList.Shift();
			gx = pos[0];
			gz = pos[1];
			if(gx == tarX && gz == tarZ)
				break;
			dist = pos[2];
			var key : int;
			var parent : int = gx*1000+gz;
			if(dist < moveRange) {
				//check neibor and add neibor
				if(gz % 2 == 0) {
					nx = gx+1;
					nz = gz;
					key = nx*1000+nz;
					if(board.boardMap[nx*1000+nz] == null && !closedList[key] && gridInfo[key] == null) {
						openList.Add([nx, nz, dist+1]);
						gridInfo[key] = new Array(parent, dist+1);
					}
					nx = gx;
					nz = gz+1;
					key = nx*1000+nz;
					if(board.boardMap[nx*1000+nz] == null && !closedList[key] && gridInfo[key] == null) {
						openList.Add([nx, nz, dist+1]);
						gridInfo[key] = new Array(parent, dist+1);
					}
					nx = gx-1;
					nz = gz+1;
					key = nx*1000+nz;
					if(board.boardMap[nx*1000+nz] == null && !closedList[key] && gridInfo[key] == null) {
						openList.Add([nx, nz, dist+1]);
						gridInfo[key] = new Array(parent, dist+1);
					}
					nx = gx-1;
					nz = gz;
					key = nx*1000+nz;
					if(board.boardMap[nx*1000+nz] == null && !closedList[key] && gridInfo[key] == null) {
						openList.Add([nx, nz, dist+1]);
						gridInfo[key] = new Array(parent, dist+1);
					}
					nx = gx-1;
					nz = gz-1;
					key = nx*1000+nz;
					if(board.boardMap[nx*1000+nz] == null && !closedList[key] && gridInfo[key] == null) {
						openList.Add([nx, nz, dist+1]);
						gridInfo[key] = new Array(parent, dist+1);
					}
					nx = gx;
					nz = gz-1;
					key = nx*1000+nz;
					if(board.boardMap[nx*1000+nz] == null && !closedList[key] && gridInfo[key] == null) {
						openList.Add([nx, nz, dist+1]);
						gridInfo[key] = new Array(parent, dist+1);
					}
				} else {
					nx = gx+1;
					nz = gz;
					key = nx*1000+nz;
					if(board.boardMap[nx*1000+nz] == null && !closedList[key] && gridInfo[key] == null) {
						openList.Add([nx, nz, dist+1]);
						gridInfo[key] = new Array(parent, dist+1);
					}
					nx = gx+1;
					nz = gz+1;
					key = nx*1000+nz;
					if(board.boardMap[nx*1000+nz] == null && !closedList[key] && gridInfo[key] == null) {
						openList.Add([nx, nz, dist+1]);
						gridInfo[key] = new Array(parent, dist+1);
					}
					nx = gx;
					nz = gz+1;
					key = nx*1000+nz;
					if(board.boardMap[nx*1000+nz] == null && !closedList[key] && gridInfo[key] == null) {
						openList.Add([nx, nz, dist+1]);
						gridInfo[key] = new Array(parent, dist+1);
					}
					nx = gx-1;
					nz = gz;
					key = nx*1000+nz;
					if(board.boardMap[nx*1000+nz] == null && !closedList[key] && gridInfo[key] == null) {
						openList.Add([nx, nz, dist+1]);
						gridInfo[key] = new Array(parent, dist+1);
					}
					nx = gx;
					nz = gz-1;
					key = nx*1000+nz;
					if(board.boardMap[nx*1000+nz] == null && !closedList[key] && gridInfo[key] == null) {
						openList.Add([nx, nz, dist+1]);
						gridInfo[key] = new Array(parent, dist+1);
					}
					nx = gx+1;
					nz = gz-1;
					key = nx*1000+nz;
					if(board.boardMap[nx*1000+nz] == null && !closedList[key] && gridInfo[key] == null) {
						openList.Add([nx, nz, dist+1]);
						gridInfo[key] = new Array(parent, dist+1);
					}
				}
			}
			key = gx*1000+gz;
			closedList[key] = true;
		}
		var path = new Array();
		var point = tarX*1000+tarZ;
		path.Push(point);
		Debug.Log("gridInfo "+gridInfo);
		while(point != -1) {
			Debug.Log("find Move Path "+point);
			point = (gridInfo[point]as Array)[0];
			if(point != -1)
				path.Push(point);
		}
		path.Reverse();
		Debug.Log("move Path "+path);
		return path;
	}
	
	function findMoveOrAttackPoints(ra : int) {
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
			
			if(dist < ra) {
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

}