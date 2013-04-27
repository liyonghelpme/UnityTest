using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class SoldierModel0 {
	public static void CalHurt(Robot att, Robot ene, int attack) {
		var inventory  = ene.gameObject.GetComponent<PlayerInventory0>();
		Vector2 defense = inventory.DoDefense();
        //TODO: RobotEffect
        Debug.LogError("calhurt "+attack+" defense "+defense);
        if(att.attackType == 0) {
            ene.ChangeHealth((int)(attack*(1-defense.x)));
        } else {
            ene.ChangeHealth((int)(attack*(1-defense.y)));
        }
	}

	public static Vector2 NormalToAffine(int x, int y) {
        return new Vector2(x-y/2, y);
	}
	public static Vector2 AffineToNormal(int x, int y) {
        return new Vector2(x+y/2, y);
	}

	public static bool GetAdjacent(int attGridX, int attGridZ, int eneGridX, int eneGridZ, out List<Vector2> adj) {
		int ax ;
		int az ;
		int ex ;
		int ez ;
        Vector2 outArr;
		outArr = NormalToAffine(attGridX, attGridZ);
		ax = (int)outArr.x;
		az = (int)outArr.y;
		outArr = NormalToAffine(eneGridX, eneGridZ);
		ex = (int)outArr.x;
		ez = (int)outArr.y;
		
		var dx  = ax - ex;
		var dz  = az - ez;
        bool find = false;
        Vector2 n0 = Vector2.zero;
        Vector2 n1 = Vector2.zero;
		if(dx == 0) {
			if(dz > 0) {
                find = true;
				n0 = new Vector2(ex-1, ez+1);
				n1 = new Vector2(ex+1, ez);
			} else {
                find = true;
				n0 = new Vector2(ex-1, ez);
				n1 = new Vector2(ex+1, ez-1);
			} 
		} 
		else if(dz == 0) {
			if(dx > 0) {
                find = true;
				n0 = new Vector2(ex, ez+1);
				n1 = new Vector2(ex+1, ez-1);
			} else {
                find = true;
				n0 = new Vector2(ex-1, ez+1);
				n1 = new Vector2(ex, ez-1);
			}
		} else if(dx > 0 && dz < 0 && dx == -dz){
            find = true;
			n0 = new Vector2(ex+1, ez);
			n1 = new Vector2(ex, ez-1);
		} else if(dx < 0 && dz > 0 && dx == -dz){
            find = true;
			n0 = new Vector2(ex-1, ez);
			n1 = new Vector2(ex, ez+1);
		}
        adj = new List<Vector2>() { n0, n1 };
        return find;
	}
}
