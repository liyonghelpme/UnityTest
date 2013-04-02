#pragma strict
var s : float;
var h : float;
var r : float;
var b : float;
var a : float;
var nor : Vector3;
var hash : Hashtable;
function Start () {
	s = 1.0;
	h = Mathf.Sin(Mathf.Deg2Rad*30)*s;
	r = Mathf.Cos(Mathf.Deg2Rad*30)*s;
	b = s+2*h;
	a = 2*r;
	nor = Vector3(1, 0, -Mathf.Tan(Mathf.Deg2Rad*60));
	nor.Normalize();
	Debug.Log("normal"+nor);
	var plane = new Plane(nor, Vector3(-r, 0, h+s/2));
	var gx = plane.distance/1.5/r;
	Debug.Log(plane.distance+" "+Mathf.RoundToInt(gx));
	hash = new Hashtable();
	
	hash.Add([1, 2], "one");
	Debug.Log(hash);
	Debug.Log(hash.ContainsKey([1, 2]));
	
	var ppp = {};
	ppp.Add(1, "hahah world");
	if(!ppp[1]) {
		Debug.Log("not ppp");
	}
	Debug.Log("find ppp"+ppp[1]);
	Debug.Log(ppp.Keys);
	for(var c in ppp.Keys) {
		Debug.Log(c);
	}
	
	var si = new singleHex();
	var arr = new Array();
	arr.length = 2;
	var brr = new Array();
	brr.length = 2;
	si.affineToNormal(4, 4, arr);
	si.normalToAffine(arr[0], arr[1], brr);
	Debug.Log("arr brr "+arr+" "+brr);
}

function Update () {
	Debug.DrawLine(Vector3.zero, nor*100, Color.red, 0);
}