#pragma strict

var sol : robot;
var target : robot;
var startTime : float;

function Start () {
	transform.localPosition = sol.transform.localPosition;
	startTime = Time.time;
}

function Update () {
	var passTime = Time.time - startTime;
	if(passTime >= 1.0) {
		Destroy(gameObject);
		var dist : float = sol.board.minDistance(sol.myGridX, sol.myGridZ, target.myGridX, target.myGridZ);
		if(dist == 1)
			SoldierModel.calHurt(sol, target, -sol.attack/2);
		else
			SoldierModel.calHurt(sol, target, -sol.attack);
	}
	passTime = Mathf.Min(1.0, passTime);
	var np : Vector3 = Vector3.Lerp(sol.transform.localPosition, target.transform.localPosition, passTime);
	transform.localPosition = np;
	
}