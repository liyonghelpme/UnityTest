using UnityEngine;
using System.Collections;

public class BoardScale : MonoBehaviour {
	float startDistance;
	float oldY;
	float moveFactor = 0.1f;
	public bool inZoom = false;
	public float maxScale = 100;
	public float minScale = 30;
	float fieldOfView;
	//field of view = 60
	// Use this for initialization
	//use default construct is not right 
	//should in Awake
	void Awake() {
		moveFactor = 0.1f;
		inZoom = false;
		maxScale = 100;
		minScale = 30;
	}
	void Start () {
	
	}
	void OnGUI() {
		if(inZoom) {
			if(GUI.Button(new Rect(0, 200, 100, 100), "In Zoom")) {
				inZoom = false;
			}
		} else {
			if(GUI.Button(new Rect(0, 200, 100, 100), "Not In Zoom")) {
				inZoom = true;
			}
		}
	}
	// Update is called once per frame
	//make sure both finger in same state
	void Update () {
		if(inZoom) {
			//start one finger touchBegan
			if(Input.touchCount == 2 && (Input.GetTouch(0).phase == TouchPhase.Began || Input.GetTouch(1).phase == TouchPhase.Began)) {
				Vector3 temp = Input.GetTouch(0).position-Input.GetTouch(1).position;
				startDistance = temp.magnitude;
				oldY = transform.position.y;
				fieldOfView = camera.fieldOfView;
			}
			//Input.GetAxis("Mouse ScrollWheel")
			//move two finger move
			if(Input.touchCount == 2 
					&& (Input.GetTouch(0).phase == TouchPhase.Moved || Input.GetTouch(0).phase == TouchPhase.Stationary)
					&& (Input.GetTouch(1).phase == TouchPhase.Moved || Input.GetTouch(1).phase == TouchPhase.Stationary)) {
				
				Touch touch0 = Input.GetTouch(0);
				Touch touch1 = Input.GetTouch(1);
				Vector3 temp = touch0.position-touch1.position;
				float curDistance = temp.magnitude;
				
				//Vector3 preDist = (touch0.position-touch0.deltaPosition)-(touch1.position-touch1.deltaPosition);
				float touchDelta = curDistance-startDistance;
				float newField = fieldOfView + moveFactor*-touchDelta;
				Debug.Log("field of view "+newField + " "+touchDelta + " "+fieldOfView);
				newField = Mathf.Clamp(newField, minScale, maxScale);
				Debug.Log("new Field "+newField);
				
				camera.fieldOfView = newField;
				
				
				/*
				float newY = oldY + moveFactor*-touchDelta;
				
				newY = Mathf.Clamp(newY, minScale, maxScale);
				
				Debug.Log("current newY "+newY);
				Vector3 oldTrans = transform.position;
				transform.position = new Vector3(oldTrans.x, newY, oldTrans.z);
				*/
					
			}
			//two finger end 
			if(Input.touchCount == 2 && (Input.GetTouch(0).phase == TouchPhase.Ended && Input.GetTouch(1).phase == TouchPhase.Ended)) {
			}
		}
	}
	void LateUpdate() {
		
	}
}
