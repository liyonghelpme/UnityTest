using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public interface IMessage {
	void ReceiveMessage(string key, object param);
}
public class MessageCenter{
	private Dictionary<string, List<IMessage>> callbacks;
	private static MessageCenter instance = null;
	private MessageCenter() {
		callbacks = new Dictionary<string, List<IMessage>>();
	}
	public static MessageCenter Instance {
		get {
			if(instance == null) {
				instance = new MessageCenter();
			}
			return instance;
		}
	}
	public void Register(string key, IMessage obj) {
		if(!callbacks.ContainsKey(key)){
			callbacks.Add(key, new List<IMessage>());
		}
		callbacks[key].Add(obj);
	}
	public void RemoveCallback(string key, IMessage obj) {
		if(callbacks.ContainsKey(key)) {
			callbacks[key].Remove(obj);
		}
	}
	public void SendMsg(string key, object param) {
		if(callbacks.ContainsKey(key)) {
			foreach(IMessage m in callbacks[key]) {
				m.ReceiveMessage(key, param);
			}
		}
	}
}
