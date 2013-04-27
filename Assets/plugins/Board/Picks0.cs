using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class Picks0 : MonoBehaviour {
    SingleHex controller;
    Goods0[] goods;
    void Awake() {
        goods = new Goods0[8];
        controller = GetComponent<SingleHex>();
    }
    void Start () {
        var keys = Resources.Load("Keys");
        
        var allAtt = new Dictionary<string, float>[]{
        new Dictionary<string, float>(){{"attack", 0.5f}},
        new Dictionary<string, float>(){{"physic", 0.2f}},
        new Dictionary<string, float>(){{"magic", 0.2f}},
        new Dictionary<string, float>(){{"health", 0.5f}},
        new Dictionary<string, float>(){{"distance", 2}}
        };
        for(var i = 0; i < 4; ) {
            Debug.Log("add Keys");
            var w = (int)(Random.value*controller.width);
            var h = (int)(Random.value*controller.height);
            bool notIn0 = controller.boardMap.ContainsKey(w * 1000 + h);
            bool notIn1 = controller.boardMap.ContainsKey((controller.width-1-w)*1000+(controller.height-1-h));
            if (notIn0 || notIn1)
            {
                continue;
            }
            Debug.LogWarning("not In "+notIn0 + " "+notIn1);
            var kind = Random.Range(0, 1);
            var att = Random.Range(0, 5);
            
            var nk = (GameObject)Instantiate(keys);
            var g = nk.AddComponent<Goods0>();
            nk.transform.parent = controller.board.transform;
            g.SetPosition(w, h);
            g.SetKind(kind);
            g.SetGid(2*i);
            g.SetAttribute(allAtt[att]);
            goods[i*2] = g;
            
            att = Random.Range(0, 5);
            nk = (GameObject)Instantiate(keys);
            g = nk.AddComponent<Goods0>();
            nk.transform.parent = controller.board.transform;
            g.SetPosition(controller.width-1-w, controller.height-1-h);
            g.SetKind(kind);
            g.SetGid(i*2+1);
            g.SetAttribute(allAtt[att]);
            goods[i*2+1] = g;

            i++;
        }
    }

    void Update () {

    }
}
