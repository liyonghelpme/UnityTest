using UnityEngine;
using System.Collections;

public class CameraMove0 : MonoBehaviour {
    public Vector3 target;
    float smooth;
    public bool inMove;
	// Use this for initialization
	void Start () {
        target = transform.position;
        smooth = 5.0f;
        inMove = true;
    }
	
	// Update is called once per frame
	void Update () {

	}
    void FixedUpdate()
    {
        if (inMove)
        {
            var np = Vector3.Lerp(transform.position, target, Time.deltaTime * smooth);
            transform.position = np;
        }
    }
}
