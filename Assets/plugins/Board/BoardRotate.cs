using UnityEngine;
using System.Collections;

public class BoardRotate : MonoBehaviour {
	float distance;
	Vector3 origin;
	float x = 0.0f;
	float y = 0.0f;
	float xSpeed = 10.0f;
	float ySpeed = 10.0f;
	float distanceMin = 5.0f;
	float distanceMax = 15.0f;
	float yMinLimit = -20;
	float yMaxLimit = 80;
	public bool inRotate = false;
    CameraMove0 cameraMove;

	
	void Awake() {
        cameraMove = GetComponent<CameraMove0>();
	}
	
	//http://wiki.unity3d.com/index.php?title=MouseOrbitImproved
	// Use this for initialization
	void Start () {
		ResetAngle();
	}
    //from current position look At 
	void ResetAngle() {
		origin = new Vector3(11f, 0, 11f);
        transform.LookAt(origin);
		Vector3 diff = transform.position-origin;
		distance = diff.magnitude;
		Vector3 angles = transform.eulerAngles;
		x = angles.y;
		y = angles.x;
	}
	void OnEnable() {
		ResetAngle();
	}
	
	void OnGUI() {
		if(inRotate) {
			if(GUI.Button(new Rect(0, 100, 100, 100), "InScale")) {
				inRotate = false;
                cameraMove.inMove = true;
                cameraMove.target = transform.position;
			}
		} else {
			if(GUI.Button(new Rect(0, 100, 100, 100), "NotInScale")) {
				ResetAngle();
				inRotate = true;
                cameraMove.inMove = false;
			}
		}
	}
	void Update() {
		
		if(Input.GetMouseButton(0) && inRotate && Input.touchCount <= 1) {//one finger rotate camera
			float px = Input.GetAxis("Mouse X");
			float py = Input.GetAxis("Mouse Y");
			if(Input.touchCount > 0) {
				px = Input.touches[0].deltaPosition.x;
				py = Input.touches[0].deltaPosition.y;
			}
			
			x += px*xSpeed;
			y -= py*ySpeed;
			y = ClampAngle(y, yMinLimit, yMaxLimit);
			
			Quaternion rotation = Quaternion.Euler(y, x, 0);
			//distance = Mathf.Clamp(distance-Input.GetAxis("Mouse ScrollWheel")*5, distanceMin, distanceMax);
			Vector3 negDistance = new Vector3(0, 0, -distance);
			Vector3 position = rotation*negDistance+origin;
			transform.rotation = rotation;
			transform.position = position;

            //cameraMove.target = transform.position;
		}
	}
	static float ClampAngle(float angle, float min, float max) {
		if(angle < -360F)
			angle += 360F;
		if(angle > 360F)
			angle -= 360F;
		return Mathf.Clamp(angle, min, max);
	}
}
