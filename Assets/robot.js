#pragma strict

@script RequireComponent(BoxCollider)
@script RequireComponent(PlayerInventory)
@script RequireComponent(Rigidbody)
@script RequireComponent(PlayerState)
@script RequireComponent(PlayerBufferState)
class robot extends MonoBehaviour {
	var attackableList : Array;
	var color : int;
	var board : singleHex;
	var moveRange : int;
	var moveGrid : GameObject;
	var box : GameObject;
	//var target : Vector3;
	var smooth : float;
	var logic : ChessBoard;
	var attackRange : int;
	var myGridX : int;
	var myGridZ : int;
	var inAttack : boolean;
	var inMove : boolean;
	var attacking : boolean;
	//var inReplace : boolean;
	
	//var oldColor : Color;
	var attackType : int;
	
	var baseHealth : int;
	//show number 
	var health : int;
	var attack : int;
	var stateMachine : StateMachine;
	var inDead : boolean;
	//var inKnockBack : boolean;
	//var knockBacker : robot;
	
	var physicDefense : float;
	var magicDefense : float;
	var beAttacked : boolean;
	
	var inventory : PlayerInventory;
	var roundManager : RoundManager;
	
	function Awake() {
		var bc : BoxCollider = GetComponent(BoxCollider);
		bc.center = Vector3(0, 0.5, 0);
		var rb : Rigidbody = GetComponent(Rigidbody);
		//rb.freezeRotation = true;
		rb.constraints = RigidbodyConstraints.FreezeAll;
		
		inventory = GetComponent(PlayerInventory);
		GetComponent(PlayerBufferState).mainRobot = this;
	}

	function Start () {
		roundManager = GameObject.Find("GameLogic").GetComponent(RoundManager);
		
		attackableList = new Array();
		logic = board.board.GetComponent(ChessBoard);
		
		smooth = 5.0;
		//target = transform.localPosition;
		inAttackRange = false;
		inAttack = false;
		inMove = false;
		inDead = false;
		//inKnockBack = false;
		//inReplace = false;
		chooseYet = false;
		beAttacked = false;
		
		//health = 100;
		//attack = 30;
		gameObject.tag = "Player";
		initStateMachine();
		baseHealth = 800;
		
	}
	virtual function initStateMachine() {
		stateMachine = new StateMachine();
		var free : StateModel = new FreeState(stateMachine, this);
		stateMachine.addState(free);
		var move : StateModel = new MoveState(stateMachine, this);
		stateMachine.addState(move);
		stateMachine.addState(new InAttack(stateMachine, this));
		stateMachine.addState(new DeadState(stateMachine, this));
		stateMachine.addState(new KnockBackState(stateMachine, this));
		//stateMachine.addState(new ReplaceState(stateMachine, this));
		stateMachine.addState(new InChooseState(stateMachine, this));
		stateMachine.addState(new AttackState(stateMachine, this));
		stateMachine.addState(new BeAttackedState(stateMachine, this));
		initPrivateState();
		stateMachine.initTransition();
		stateMachine.changeState("Free");
	}
	virtual function initPrivateState() {
		Debug.Log("robot init Private State");
	}
	function doAttack() : float {
		return inventory.doAttack();
	}
	function setPosition(row : int, col : int) {
		transform.localPosition = board.gridToPos(row, col);
	}
	function setHealth(h : int) {
		health = h;
		baseHealth = h;
	}
	static function makeRobot(s : singleHex) {
		var go = new GameObject();
		var b = GameObject.CreatePrimitive(PrimitiveType.Cube);
		b.transform.parent = go.transform;
		go.AddComponent(robot);
		
		var r = go.GetComponent(robot);
		r.board = s;
		r.moveRange = 2;
		r.attackRange = 1;
		r.box = b;
		r.attackType = 0;
		r.physicDefense = 0.2;
		r.magicDefense = 0.2;
		return r;
	}
	function setColor(c) {
		color = c;
		if(color == 0) {
			SoldierModel.setChildColor(box, Color.red);
		}else {
			SoldierModel.setChildColor(box, Color.blue);
		}
	}
	function changeChoose() {
		if(chooseYet) {
			chooseYet = false;
			//removeMoveGrid();
		}
		if(inAttackRange) {
			Debug.Log("inAttackRange exit");
			inAttackRange = false;
			//stateMachine.changeState("Free");
			//box.renderer.material.color = oldColor;
		}
		if(attackLayer != null) {
			Destroy(attackLayer);
			attackLayer = null;
		}
	}
	
	
	function OnMouseDown() {
	}
	var enemy : robot;
	//var other : robot;
	
	virtual function startAttack(enemyObject : robot) {
		Debug.Log("robot startAttack");
		enemy = enemyObject;
		attacking = true;
	}
	function OnMouseUp() { 
		if(inAttackRange) {
			attackObject.startAttack(this);
			inAttackRange = false;
		} else {
			if(roundManager.curTurn != color || roundManager.inAction)
				return;
			chooseYet = true;
		}
	}
	function OnMouseDrag() {
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
		//setMapYet = true;
	}
	function clearMap() {
		var grid : Vector3 = board.posToGrid(transform.localPosition.x, transform.localPosition.z);
		board.clearMap(grid.x, grid.z, this);
		//setMapYet = false;
	}
	virtual function clearEnemy() {
		for(var r : robot in attackableList) {
			r.inAttackRange = false;
			r.attackObject = null;
		}
		attackableList.Clear();
	}
	virtual function clearAttackable(attacker : robot) {
		if(inAttackRange && attackObject == attacker) {
			inAttackRange = false;
			attackObject = null;
		}
	}
	virtual function acceptAttack() {
		
	}
	
	//similar to checkReplacable 
	//same check different action
	//distance limit 
	//find attable enemy change their state in inAttackRange
	function getAttackable(attacker : robot){
		if(color != attacker.color) {
			var dist : int = board.minDistance(myGridX, myGridZ, attacker.myGridX, attacker.myGridZ);
			//Debug.Log("min dist "+dist+" range"+attacker.attackRange);
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
				//Debug.Log("affine pos "+mx+" "+mz+" "+ax+" "+az);
				
				var path = new Array();
				var ret : boolean = board.realPathLength(mx, mz, ax, az, path, attacker);
				//Debug.Log("realPathLength "+ret);
				if(ret) {
					inAttackRange = true;
					attackObject = attacker;
					//stateMachine.changeState("InAttack");
				}
				//Debug.Log("path length "+path.length);
				//Debug.Log("path is "+path);
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
		return inAttackRange;
	}
	virtual function findAttackable() {
		for(var r : robot in board.ships) {
			var ret = r.getAttackable(this);
			if(ret)
				attackableList.Push(r);
		}
	}
	
	var inAttackRange : boolean;
	var attackLayer : GameObject;
	var attackObject : robot;
	
	
	function showMoveGrid() {
		moveGrid = new GameObject();
		moveGrid.name = "moveGrid";
		moveGrid.transform.parent = transform.parent;
		moveGrid.transform.localPosition = Vector3.zero;
		var hex : GameObject;
		var points = findMoveOrAttackPoints(inventory.getMoveDistance());
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
	
	
	//var setMapYet : boolean;
	//in same box
	function Update() {
		stateMachine.update();
	}
	var movePath : Array;
	//var inMove : boolean;
	var moveStep : int;
	function setMoveTarget(tar : MoveGrid) {
		Debug.Log("set Move ");
		if(roundManager.curTurn != color || roundManager.inAction)
			return;
			
		Debug.Log("setMoveTarget "+tar);
		var p : Vector3 = tar.gameObject.transform.localPosition;
		var grid = board.posToGrid(p.x, p.z);
		var path = findMovePath(grid.x, grid.z);
		movePath = path;
		inMove = true;
		inventory.doMoveDistance();
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
			if(dist < inventory.getMoveDistance()) {
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
					if(nx < board.width && nz < board.height) {
						key = nx*1000+nz;
						if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
							openList.Add([nx, nz, dist+1]);
						}
					}
					nx = gx;
					nz = gz+1;
					key = nx*1000+nz;
					if(nx < board.width && nz < board.height) {
						if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
							openList.Add([nx, nz, dist+1]);
						}
					}
					nx = gx-1;
					nz = gz+1;
					key = nx*1000+nz;
					if(nx < board.width && nz < board.height) {
						if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
							openList.Add([nx, nz, dist+1]);
						}
					}
					nx = gx-1;
					nz = gz;
					key = nx*1000+nz;
					if(nx < board.width && nz < board.height) {

					if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
						openList.Add([nx, nz, dist+1]);
					}
					}
					nx = gx-1;
					nz = gz-1;
					key = nx*1000+nz;
					if(nx < board.width && nz < board.height) {
						if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
							openList.Add([nx, nz, dist+1]);
						}
					}
					nx = gx;
					nz = gz-1;
					key = nx*1000+nz;
					if(nx < board.width && nz < board.height) {
						if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
							openList.Add([nx, nz, dist+1]);
						}
					}
				} else {
					nx = gx+1;
					nz = gz;
					key = nx*1000+nz;
					if(nx < board.width && nz < board.height) {
						if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
							openList.Add([nx, nz, dist+1]);
						}
					}
					nx = gx+1;
					nz = gz+1;
					key = nx*1000+nz;
					if(nx < board.width && nz < board.height) {
						if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
							openList.Add([nx, nz, dist+1]);
						}
					}
					nx = gx;
					nz = gz+1;
					key = nx*1000+nz;
					if(nx < board.width && nz < board.height) {
						if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
							openList.Add([nx, nz, dist+1]);
						}
					}
					nx = gx-1;
					nz = gz;
					key = nx*1000+nz;
					if(nx < board.width && nz < board.height) {
						if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
							openList.Add([nx, nz, dist+1]);
						}
					}
					nx = gx;
					nz = gz-1;
					key = nx*1000+nz;
					if(nx < board.width && nz < board.height) {
						if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
							openList.Add([nx, nz, dist+1]);
						}
					}
					nx = gx+1;
					nz = gz-1;
					key = nx*1000+nz;
					if(nx < board.width && nz < board.height) {
						if(board.boardMap[nx*1000+nz] == null && !closedList[key]) {
							openList.Add([nx, nz, dist+1]);
						}
					}
				}
			}
			key = gx*1000+gz;
			closedList[key] = true;
		}
		return closedList.Keys;
	}
	function changeHealth(c : int) {
		if(health <= 0 && c > 0) {
			health = c;
		} else
			health += c;
	}
	virtual function setAction(s : String, a : Action) {
		
		var state : StateModel = stateMachine.getState(s);
		Debug.Log("set action "+s+" "+a+" "+state);
		state.setAction(a);
		Debug.Log("state action "+state.action);
	}
}
