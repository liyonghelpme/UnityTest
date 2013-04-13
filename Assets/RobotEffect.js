#pragma strict
var box : GameObject;
function Awake() {
}
 
function doAttack() {
}

function doDefense() {
	Destroy(box);
	Destroy(this);
	return true;
}

function Start () {
	box = GameObject.CreatePrimitive(PrimitiveType.Cube);
	box.transform.parent = transform;
	box.transform.localPosition = Vector3.zero;
	Destroy(box.GetComponent(Collider));
	box.name = "EffectBox";
}

function Update () {

}