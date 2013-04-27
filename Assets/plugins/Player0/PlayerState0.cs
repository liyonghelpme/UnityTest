using UnityEngine;
using System.Collections;

public class PlayerState0 : MonoBehaviour {
    Robot mainRobot;
	// Use this for initialization
	void Start () {
        mainRobot = GetComponent<Robot>();
	}
	
	// Update is called once per frame
	void Update () {
	
	}
    void OnGUI()
    {
        var scPos  = Camera.mainCamera.WorldToScreenPoint(transform.position+new Vector3(0, 4, 0));
        GUI.Label(new Rect(scPos.x, Camera.mainCamera.pixelHeight-scPos.y, 100, 100), ""+mainRobot.health);
    }
}
