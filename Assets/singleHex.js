#pragma strict
var s : float;
var h : float;
var r : float;
var b : float;
var a : float;
var board : GameObject;
var width : int;
var height: int;
var ships : Array;
var shipLayer : GameObject;

var boardMap : Hashtable;
function updateMap(x : int, y : int, obj : robot) {
	boardMap.Add(x*1000+y, obj);
}
function clearMap(x : int, y : int, obj : robot) {
	boardMap.Remove(x*1000+y);
}

function Start (){
	ships = new Array();
	boardMap = new Hashtable();
	
	s = 1.0;
	h = Mathf.Sin(Mathf.Deg2Rad*30)*s;
	r = Mathf.Cos(Mathf.Deg2Rad*30)*s;
	b = s+2*h;
	a = 2*r;
	board = new GameObject();
	width = 13;
	height = 13;
	
	//var colObj = new GameObject();
	//colObj.transform.parent = board.transform;
	//colObj.transform.localPosition = Vector3.zero;
	
	for(var row : int = 0; row < width; row++) {
		for(var col : int = 0; col < height; col++) {
			var hex : GameObject = makeSingle();
			if(row%2 == 0) {
				hex.transform.localPosition = new Vector3(col*2*r, 0, row*(s+h));
			} else if(row%2 == 1) {
				hex.transform.localPosition = new Vector3(col*2*r+r, 0, row*(s+h));
			}
			hex.transform.parent = board.transform;
		}
	}
	
	
	board.AddComponent(ChessBoard);
	//board.AddComponent(MouseDelegate);
	board.AddComponent(BoxCollider);
	var collider : BoxCollider = board.GetComponent(BoxCollider);
	collider.size = new Vector3(2*r*(width)+r, 0.01, (s+h)*height+h);
	collider.center = Vector3.zero+Vector3(-r+collider.size.x/2, 0, -(s/2+h)+collider.size.z/2);//+new Vector3((2*r*width+2*r)/2, 0, ((s+h)*height+2*(s/2+h))/2);
	
	
	shipLayer = new GameObject();
	shipLayer.name = "shipLayer";
	shipLayer.transform.parent = board.transform;
	
	var rob : robot;
	rob = robot.makeRobot(this);
	rob.setColor(0);
	rob.setPosition(0, 0);
	rob.gameObject.AddComponent(MouseDelegate);
	
	rob.transform.parent = shipLayer.transform;
	//rob.showMoveGrid();
	ships.push(rob);
	rob.updateMap();
	
	//testBoard();
	
	rob = robot.makeRobot(this);
	rob.setColor(1);
	rob.setPosition(10, 10);
	rob.gameObject.AddComponent(MouseDelegate);
	rob.transform.parent = shipLayer.transform;
	ships.push(rob);
	rob.updateMap();
	
}
//https://groups.google.com/forum/?fromgroups=#!topic/rec.games.design/-5n_Km1SqWc
function minDistance(x0 : int, y0 : int, x1 : int, y1 : int) {
	var nx0 : int = x0-y0/2;
	var nx1 : int = x1-y1/2;
	return realDistance(nx0, y0, nx1, y1);		
}
function realDistance(x0 : int, y0 : int, x1 : int, y1 : int) : int {
	if(x0 > x1)
		return realDistance(x1, y1, x0, y0);
	if(y1 > y0)
		return x1-x0+y1-y0;
	return Mathf.FloorToInt(Mathf.Max(x1-x0, y0-y1));
}



function update() {

}

//move 
function FixedUpdate() {
	
}

function changeChoose() {
	shipLayer.BroadcastMessage("changeChoose");
}

function gridToPos(row : int, col : int) {
	if(row%2 == 0) {
		return new Vector3(col*2*r, 0, row*(s+h));
	} else {
		return new Vector3(col*2*r+r, 0, row*(s+h));
	}
}
//six block
function posToGrid(x : float, z : float) {
	var gx : int = Mathf.FloorToInt(x/2/r); 
	var gz : int = Mathf.FloorToInt(z/(s+h));
	var difX : float = x - gx*2*r;
	var difZ : float = z - gz*(s+h);
	//Debug.Log("gzPos " + gz%2 + "difX "+difX+"difZ "+difZ+"x"+x+"z"+z);
	if(gz%2 == 0) {
		if(difZ >= s/2+h) {
			return new Vector3(gx, 0, gz+1);
		}
	
		if(difX <= r && difZ <= s/2) {
			return new Vector3(gx, 0, gz);
		}
		if(difX <= r && (difZ-s/2+h/r*difX) <= h && difZ >= s/2) {
			return new Vector3(gx, 0, gz);
		}	
		if(difX >= r && difZ <= s/2) {
			return new Vector3(gx+1, 0, gz);
		}
		if(difX >= r && (difZ-s/2-h/r*(difX-r)) <= 0 && difZ >= s/2)
			return new Vector3(gx+1, 0, gz);	
		
		if(difX <= r && (difZ-s/2+h/r*difX) >= 0 && difZ >= s/2)
			return new Vector3(gx, 0, gz+1);
		
		if(difX >= r && (difZ-h/r*(difX-r)) > 0)
			return new Vector3(gx, 0, gz+1);
	} else {
		if(difZ <= s/2) {
			return new Vector3(gx, 0, gz);
		}
		if(difX <= r && difZ-s/2-h/r*difX <= 0 && difZ >= s/2) {
			return new Vector3(gx, 0, gz);
		}
		if(difX >= r && difZ-s/2+(h/r)*(difX-r) <= h && difZ >= s/2) {
			return new Vector3(gx, 0, gz);
		}
		
		if(difX <= r && difZ >= s/2+h) {
			return new Vector3(gx, 0, gz+1);
		}
		if(difX <= r && difZ-h/r*difX >= 0)
			return new Vector3(gx, 0, gz+1);
		
		if(difX >= r && difZ >= s/2+h) {
			return new Vector3(gx+1, 0, gz+1);
		}
		if(difX >= r && difZ+(h/r)*(difX-r) >= 0) {
			return new Vector3(gx+1, 0, gz+1);
		}
		
	}
}
function testBoard() {
	var pos = [0.6, 0.2, 1.3, 1.4];
	for(var i = 0; i < 1000; i++) {
		var px = Random.value*5;
		var pz = Random.value*5;
		//px = pos[i*2];
		//pz = pos[i*2+1];
		var sp : GameObject = GameObject.CreatePrimitive(PrimitiveType.Sphere);
		sp.transform.parent = board.transform;
		sp.transform.localScale = new Vector3(0.1, 0.1, 0.1);
		sp.transform.localPosition = new Vector3(px, 0, pz);
		var grid : Vector3 = posToGrid(px, pz);
		var gx = Mathf.RoundToInt(grid.x);
		if(Mathf.RoundToInt(grid.z) % 2 == 0) {
			if(gx % 3 == 0)
				sp.renderer.material.color = new Color(1.0, 0, 0);
			else if(gx % 3 == 1) 
				sp.renderer.material.color = new Color(0.0, 0, 1.0);
			else
				sp.renderer.material.color = new Color(0, 1.0, 0);
		} else {
			if(gx % 3 == 0) 
				sp.renderer.material.color = new Color(0, 1.0, 0);
			else if(gx % 3 == 1) 
				sp.renderer.material.color = new Color(1.0, 0, 0);
			else
				sp.renderer.material.color = new Color(0, 0, 1.0);
		}
	}
}

function makeSingle() {	
	var go = new GameObject();
	go.AddComponent(LineRenderer);
	var line : LineRenderer = go.GetComponent(LineRenderer);
	line.SetVertexCount(7);
	line.SetWidth(0.1, 0.1);
	line.SetPosition(0, new Vector3(0, 0, b/2));
	line.SetPosition(1, new Vector3(-r, 0, s/2));
	line.SetPosition(2, new Vector3(-r, 0, -s/2));
	line.SetPosition(3, new Vector3(0, 0, -b/2));
	line.SetPosition(4, new Vector3(r, 0, -s/2));
	line.SetPosition(5, new Vector3(r, 0, s/2));
	line.SetPosition(6, new Vector3(0, 0, b/2));
	line.useWorldSpace = false;
	line.material = Instantiate(Resources.Load("hexMat") as Material);
	
	return go;
}
function Update () {
	var ray : Ray = Camera.mainCamera.ScreenPointToRay(Input.mousePosition);
	if(Physics.Raycast(ray)) {
		Debug.DrawRay(ray.origin, ray.direction*20, Color.red, 0.3);
	}
}