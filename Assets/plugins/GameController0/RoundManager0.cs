using UnityEngine;
using System.Collections;

public class RoundManager0 : MonoBehaviour {
    public int curTurn;
    public bool inAction;
    public bool win;
    public int whoWin;
     
    void Awake() {
        curTurn = 0;
        inAction = false;
        win = false;
    }
    //after Attack  Move
    public void CheckWin() {
        int liveRed  = 0;
        int liveBlue  = 0;
        int liveRedFlag  = 0;
        int liveBlueFlag  = 0;
        
        var mechs  = GameObject.FindGameObjectsWithTag("Player");
        //check Health or state not my Turn 
        //at each turn over clear bodies
        
        foreach(var g in mechs) {
            var r = g.GetComponent<Robot>();
            if(r != null) {
                if(r.health > 0) {
                    if(r.GetType() == typeof(Flag0)) {
                        if(r.color == 0)
                            liveRedFlag++;
                        else 
                            liveBlueFlag++;
                    } else {
                        if(r.color == 0)
                            liveRed++;
                        else 
                            liveBlue++;
                    }
                }
            }
        }
        Debug.Log("CheckWin "+liveRed + " "+liveBlue);
        if(liveRed == 0 || liveRedFlag == 0) {
            win = true;
            whoWin = 1;
        } else if(liveBlue == 0 || liveBlueFlag == 0) {
            win = true;
            whoWin = 0;
        }
    }

    void Start () {

    }

    public void StartAction() {
        inAction = true;
    }
    public bool CheckInAction() {
        return inAction;
    }
    public void FinishAction() {
        inAction = false;
        SwitchTurn();
    }
    public void SwitchTurn() {
        curTurn = 1-curTurn;
        CheckWin();
    }

    void ShowWin() {
        var style  = new GUIStyle();
        if(whoWin == 0) {
            style.normal.textColor = Color.red;
            GUI.Label(new Rect(Screen.width/4, Screen.height/2, Screen.width*3/4, 100), "Red Win", style);
        } else {
            style.normal.textColor = Color.blue;
            GUI.Label(new Rect(Screen.width/4, Screen.height/2, Screen.width*3/4, 100), "Blue Win", style);
        }
        if(GUI.Button(new Rect(0, 0, 100, 100), "RestartGame")) {
            Application.LoadLevel(0);
        }
    }
    void OnGUI(){
        if(!win) {
            var style  = new GUIStyle();
            if(curTurn == 0) {
                style.normal.textColor = Color.red;
                GUI.Label(new Rect(100, 100, 100, 100), "Red Turn", style);
            } else {
                style.normal.textColor = Color.blue;
                GUI.Label(new Rect(100, 100, 100, 100), "Blue Turn", style);
            }
        } else {
            ShowWin();
        }
    }

    void Update () {

    }
}
