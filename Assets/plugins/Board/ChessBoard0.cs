using UnityEngine;
using System.Collections;

public class ChessBoard0 : MonoBehaviour {
    Vector3 target ;
    float smooth ;
    Plane plane ;
    Vector3 startWorldPos ;
    Vector3 startChessPos ;
    SingleHex logic ;
    BoardRotate boardMovement ;
    BoardScale boardScale ;
    CameraMove0 cameraMove;

    void Awake() {
        boardMovement = Camera.main.GetComponent<BoardRotate>();
        boardScale = Camera.main.GetComponent<BoardScale>();
        cameraMove = Camera.main.GetComponent<CameraMove0>();
    }
    void Start () {
        Debug.Log("ChessBoard ");
        logic = GameObject.FindGameObjectWithTag("GameController").GetComponent<SingleHex>();
        //target = Camera.main.transform.position;
        //smooth = 5.0f;
        plane = new Plane(Vector3.up, Vector3.zero);
    }
    void Update () {

    }
    void FixedUpdate() {
        //var np = Vector3.Lerp(Camera.main.transform.position, target, Time.deltaTime*smooth);
        //Camera.main.transform.position = np;
    }
    void OnMouseDown() {
        var ray  = Camera.mainCamera.ScreenPointToRay(Input.mousePosition);
        float dist ;
        bool inter = plane.Raycast(ray, out dist);
        if(inter) {
            startWorldPos = ray.GetPoint(dist);
        }
        startChessPos = Camera.main.transform.position; 
        
        logic.ClearChoose();
    }
    void OnMouseUp() {
    }
    //Move Camera Not Board
    void OnMouseDrag() {
        if(!boardMovement.inRotate && !boardScale.inZoom) {
            var ray  = Camera.mainCamera.ScreenPointToRay(Input.mousePosition);
            float dist ;
            var inter  = plane.Raycast(ray, out dist);
            if(inter) {
                var curPos = ray.GetPoint(dist);
                var dif = curPos-startWorldPos;
                target = startChessPos + new Vector3(-dif.x, 0, -dif.z);
                cameraMove.target = target; 
            }
        }
    }
}
