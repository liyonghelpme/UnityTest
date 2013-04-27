using UnityEngine;
using System.Collections;

public class MoveGrid0 : MonoBehaviour {
    GameObject logic;
    SingleHex infoScript;
    Robot box;
    void Start () {
        logic = GameObject.FindGameObjectWithTag("GameController");
        infoScript = logic.GetComponent<SingleHex>();
        var sc = gameObject.AddComponent<SphereCollider>();
        sc.radius = infoScript.r*0.5f;
        sc.center = Vector3.zero;
    }
    public static void MakeMoveGrid(GameObject hex, Robot b) {
        hex.AddComponent<MoveGrid0>();
        var mg = hex.GetComponent<MoveGrid0>();
        mg.box = b;
    }
    void OnMouseDrag() {
    }
    void OnMouseUp() {
        var pos = transform.localPosition;
        pos = infoScript.PosToGrid(pos.x, pos.z);
        var gx = (int)pos.x;
        var gz = (int)pos.z;
        if(!infoScript.boardMap.ContainsKey(gx*1000+gz)) {
            Debug.Log("inMove "+gx+" "+gz);
            box.SetMoveTarget(this);
        }
    }
    void OnMouseDown() {
        
    }

    void Update () {

    }
}
