#pragma strict

function Start () {
	mouseYet = false;
	
}
var mouseYet : boolean;
function Update() {
	var down = Input.GetMouseButtonDown(0);
	var up = Input.GetMouseButtonUp(0);
	var pos = Input.mousePosition;
	var child : Transform;
	var ret : boolean;
	var ray : Ray;
	var hit : RaycastHit;
	var distance : float = Mathf.Infinity;
	
	var inBox = false;
	ray = Camera.mainCamera.ScreenPointToRay(pos);
	for(child in transform) {
		if(child.gameObject.collider != null) {
			
			ret = child.gameObject.collider.Raycast(ray, hit, distance);
			//Debug.Log("check collider in child "+ray+" "+ret);
			if(ret) {
				inBox = true;
				break;
			}
		}
	}
	//Debug.Log("fixedupdate "+inBox);
	if(inBox) {
		if(down) {
			if(!mouseYet) {
				mouseYet = true;
				SendMessage("myMouseDown");
			} else {
				SendMessage("myMouseDrag");
			}
		} else if(up) {
			if(mouseYet) {
				mouseYet = false;
				SendMessage("myMouseUp");
			} else {
			}	
		}
	}
}