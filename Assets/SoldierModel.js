#pragma strict
class SoldierModel {
	static function calHurt(att : robot, ene : robot, attack : int) {
		if(att.attackType == 0) {
			ene.changeHealth(attack*(1-ene.physicDefense));
		} else {
			ene.changeHealth(attack*(1-ene.magicDefense));
		}
	}
	static function setChildColor(o : GameObject, c : Color) {
		//Debug.Log("child color "+o.name);
		if(o.name.IndexOf("Feature") != -1) {
			if(o.renderer != null) {
				var mats = o.renderer.materials;
				
				for(var m = 0; m < mats.Length; m++) {
					mats[m].color = c;
				}
				o.renderer.materials = mats;
			}
		}
		for(var child : Transform in o.transform) {
			setChildColor(child.gameObject, c);
		}
	}
	//not find 
	static function getChildColor(o : GameObject) : Array {
		var ret : Array = new Array(false, Color(0, 0, 0));
		var retColor : Color;
		var find : boolean = false;
		if(o.name.IndexOf("Feature") != -1) {
			if(o.renderer != null) {
				if(o.renderer.material != null) {
					retColor = o.renderer.material.color; 
					find = true;
				}
			}
		}
		if(find)
			return new Array(find, retColor);
			
		for(var child : Transform in o.transform) {
			ret = getChildColor(child.gameObject);
			if(ret[0])
				break;
		}
		return ret;
	}
}
