using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class  Goods0 : MonoBehaviour {
    public int myGridX ;
    public int myGridZ ;
    public SingleHex board ;

    public bool once ;
    public int effectTime ;
    public float attack ;
    public float physic ;
    public float magic ;
    public float health ;
    public int distance ;
    public string attribute;

    public int gid ;
    void Awake() {
        board = GameObject.FindGameObjectWithTag("GameController").GetComponent<SingleHex>();
        var box = GetComponent<BoxCollider>();
        box.isTrigger = true;
        box.center = new Vector3(0, 0, 0);
        box.size = new Vector3(0.3f, 0.3f, 0.3f);
        once = true;
        effectTime = 1;
        attack = 0;
        physic = 0;
        magic = 0;
        health = 0;
        distance = 0;
    }
    public void SetAttribute(Dictionary<string, float> att) {
        foreach(string c in att.Keys) {
            if(c == "attack")
                attack = att[c];
            else if(c == "physic")
                physic = att[c];
            else if(c == "magic")
                magic = att[c];
            else if(c == "health")
                health = att[c];
            else if(c == "distance")
                distance = (int)att[c];
            attribute = c;
        }
    }
    void OnGUI() {
        var style = new GUIStyle();
        style.normal.textColor = Color.blue;
        var scPos = Camera.mainCamera.WorldToScreenPoint(transform.position+new Vector3(0, 0.5f, 0));
        if(attack > 0f){
            GUI.Label(new Rect(scPos.x, Camera.mainCamera.pixelHeight-scPos.y, 100, 100), "攻击", style);
        } 
        if(physic > 0) {
            GUI.Label(new Rect(scPos.x, Camera.mainCamera.pixelHeight-scPos.y, 100, 100), "物理", style);
        }
        if(magic > 0) {
            GUI.Label(new Rect(scPos.x, Camera.mainCamera.pixelHeight-scPos.y, 100, 100), "魔法", style);
        }
        if(health > 0) {
            GUI.Label(new Rect(scPos.x, Camera.mainCamera.pixelHeight-scPos.y, 100, 100), "生命值", style);
        }
        if(distance > 0)
            GUI.Label(new Rect(scPos.x, Camera.mainCamera.pixelHeight-scPos.y, 100, 100), "距离", style);
    }
    public void SetGid(int g ) {
        gid = g;
    }
    public void SetPosition(int w, int h) {
        myGridX = w;
        myGridZ = h;
        transform.localPosition = board.GridToPos(h, w);
        Debug.Log("setPosition "+transform.localPosition);
    }
    public void SetChildColor(GameObject o, Color c) {
        if(o.renderer != null) {
            var mats = o.renderer.materials;
            
            for(var m = 0; m < mats.Length; m++) {
                mats[m].color = c;
            }
            o.renderer.materials = mats;
        }
        foreach(Transform child in o.transform) {
            SetChildColor(child.gameObject, c);
        }
    } 
    public void SetKind(int k) {
        if(k == 0) {
            once = true;
            SetChildColor(gameObject, Color.green);
        } else {
            once = false;
            SetChildColor(gameObject, Color.yellow);
        }
    }
    void Start () {
        
    }

    void Update () {

    }

    void OnTriggerEnter(Collider other) {
        Debug.Log("OnTriggerEnter "+ other.gameObject.tag);
        if(other.gameObject.tag == "Player") {
            var inventory  = other.gameObject.GetComponent<PlayerInventory0>();
            inventory.PickObject(this);
            if(once) {	
                Destroy(gameObject);
            } 
        }
    }

}
