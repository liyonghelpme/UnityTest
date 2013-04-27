using UnityEngine;
using System.Collections;

public class Transition0 {
	public string targetState;
	public Trigger trigger;
	public Transition0(string t, Trigger tri) {
		targetState = t;
		trigger = tri;
	}
}
