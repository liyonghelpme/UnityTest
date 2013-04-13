#pragma strict
class SoldierModel {
	static function calHurt(att : robot, ene : robot, attack : int) {
		var inventory : PlayerInventory = ene.gameObject.GetComponent(PlayerInventory);
		var defense : Vector2 = inventory.doDefense();
		var effect = ene.GetComponent(RobotEffect);
		if(effect != null) {
			var ef : RobotEffect = effect;
			ef.doDefense();
		} else {
			if(att.attackType == 0) {
				ene.changeHealth(attack*(1-defense.x));
			} else {
				ene.changeHealth(attack*(1-defense.y));
			}
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
	static function getAdjacent(attGridX : int, attGridZ : int, eneGridX : int, eneGridZ : int) : Array {
		var ax : int;
		var az : int;
		var ex : int;
		var ez : int;
		var outArr : Array = new Array(2);
		normalToAffine(attGridX, attGridZ, outArr);
		ax = outArr[0];
		az = outArr[1];
		normalToAffine(eneGridX, eneGridZ, outArr);
		ex = outArr[0];
		ez = outArr[1];
		
		var dx : int = ax - ex;
		var dz : int = az - ez;
		
		var n0 = null;
		var n1 = null;
		if(dx == 0) {
			if(dz > 0) {
				n0 = new Vector2(ex-1, ez+1);
				n1 = new Vector2(ex+1, ez);
			} else {
				n0 = new Vector2(ex-1, ez);
				n1 = new Vector2(ex+1, ez-1);
			} 
		} 
		else if(dz == 0) {
			if(dx > 0) {
				n0 = new Vector2(ex, ez+1);
				n1 = new Vector2(ex+1, ez-1);
			} else {
				n0 = new Vector2(ex-1, ez+1);
				n1 = new Vector2(ex, ez-1);
			}
		} else if(dx > 0 && dz < 0 && dx == -dz){
			n0 = new Vector2(ex+1, ez);
			n1 = new Vector2(ex, ez-1);
		} else if(dx < 0 && dz > 0 && dx == -dz){
			n0 = new Vector2(ex-1, ez);
			n1 = new Vector2(ex, ez+1);
		}
		var ret : Array = new Array(n0, n1);
		return ret; 
	}
	static function getNeibors(myGridX : int, myGridZ : int) {
		var outArr : Array = new Array(2);
		normalToAffine(myGridX, myGridZ, outArr);
		//neibor affine coordinate
		var mx : int = outArr[0];
		var mz : int = outArr[1];
		var neibors : int[] = [
			mx, mz+1,
			mx+1, mz,
			mx+1, mz-1,
			mx, mz-1,
			mx-1, mz,
			mx-1, mz+1
		];
		//neibor normal coordinate
		var neiborNormal : Array = new Array();
		for(var i = 0; i < neibors.length; i += 2) {
			var nor : Array = new Array(2);
			affineToNormal(neibors[i], neibors[i+1], nor);
			neiborNormal.Add(nor[0]);
			neiborNormal.Add(nor[1]);
		}
		return neiborNormal;
	}
	
	static function normalToAffine(x : int, y : int, outValue : Array) {
		x = Mathf.FloorToInt(x);
		y = Mathf.FloorToInt(y);
		outValue[0] = x-y/2;
		outValue[1] = y;
	}
	static function affineToNormal(x : int, y : int, outValue : Array) {
		x = Mathf.FloorToInt(x);
		y = Mathf.FloorToInt(y);
		outValue[0] = x+y/2;
		outValue[1] = y;
	}
	
	static function minDistance(x0 : int, y0 : int, x1 : int, y1 : int) {
		var nx0 : int = x0-y0/2;
		var nx1 : int = x1-y1/2;
		return realDistance(nx0, y0, nx1, y1);		
	}
	
	static function realDistance(x0 : int, y0 : int, x1 : int, y1 : int) : int {
		if(x0 > x1)
			return realDistance(x1, y1, x0, y0);
		if(y1 > y0)
			return x1-x0+y1-y0;
		return Mathf.FloorToInt(Mathf.Max(x1-x0, y0-y1));
	}
}
