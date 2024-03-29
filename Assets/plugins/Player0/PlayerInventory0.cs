using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class PlayerInventory0 : MonoBehaviour {
    Robot mainRobot ;
    List<Goods0> buffers ;
    PlayerBuffer0 bufferState ;

    void Awake() {
        buffers = new List<Goods0>();
    }
    void Start () {
        mainRobot = GetComponent<Robot>();
        bufferState = GetComponent<PlayerBuffer0>();
    }

    void Update () {

    }

    public void PickObject(Goods0 obj) {
        if(obj.health > 0) {
            mainRobot.health += (int)(obj.health*mainRobot.baseHealth);
            return;
        }
        foreach(var c in buffers) {
            if(c.gid == obj.gid)
                return;
        }
        buffers.Add(obj);
    }

    void RemoveKind(string attribute)
    {
        var removeBuffer = new List<Goods0>();
        foreach (var e in buffers)
        {
            if (e.attribute == attribute)
            {
                removeBuffer.Add(e);
            }
        }
        foreach (var e in removeBuffer)
        {
            buffers.Remove(e);
        }
    }
    public int DoMoveDistance() {
        var totalMoveDistance = GetValue("distance");
        RemoveKind("distance");
        return (int)totalMoveDistance;
    }
    public float GetValue(string attribute)
    {
        float total = 0;
        if (attribute == "attack")
            total = mainRobot.attack;
        else if (attribute == "distance")
            total = mainRobot.moveRange;
        else if (attribute == "physic")
            total = mainRobot.physicDefense;
        else if (attribute == "magic")
            total = mainRobot.magicDefense;
        foreach(var e in buffers) {
            if (attribute == "attack")
                total += (int)(e.attack * mainRobot.attack);
            else if (attribute == "distance")
                total += e.distance;
            else if (attribute == "physic")
                total += e.physic;
            else if (attribute == "magic")
                total += e.magic;
        }
        return total;
    }
    public int DoAttack() {
        var totalAttack = GetValue("attack");
        RemoveKind("attack");
        return (int)totalAttack;
    }
    //physic magic
    public Vector2 DoDefense(){
        var totalPhysicDefense = GetValue("physic");
        var totalMagicDefense = GetValue("magic");
        RemoveKind("physic");
        RemoveKind("magic");

        var defense = new Vector2(totalPhysicDefense, totalMagicDefense);
        return defense;
    }
}
