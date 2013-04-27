using UnityEngine;
using System.Collections;
using System.Collections.Generic;

[RequireComponent (typeof(BoxCollider))]
[RequireComponent (typeof(Rigidbody))]
[RequireComponent (typeof(PlayerInventory0))]
[RequireComponent (typeof(PlayerBuffer0))]
[RequireComponent (typeof(PlayerState0))]
public class Robot : MonoBehaviour {
    //when select Me check enemy Attackable
	List<Robot> attackableList;
    public int color;
	public SingleHex board;
	public int moveRange;
	public int attackRange;

    //Show My Move Abilility For Test
	GameObject moveGrid;
	
    //model represent robot
    public GameObject box;

    //move smooth * Time.deltaTime
    
    //TODO: use RoundManager to switch Turn

    //cache gridPosition
	public int myGridX;
	public int myGridZ;
    
    //state machine condition
	public bool inAttack;
	public bool inMove;
	public bool attacking;
	public bool inDead;
	public bool beAttacked;
    public bool inAttackRange;
    public bool chooseYet;
	
    //energy attack or physic attack
    public int attackType;
	
	public int baseHealth;
	//show number 
	public int health;
	public int attack;
	
    public StateMachine0 stateMachine;

	public float physicDefense;
	public float magicDefense;
    
    PlayerInventory0 inventory;
	RoundManager0 roundManager;
	
    public Animator anim;
	//Animator argument Hash
	public int attack0;
	public int fly;
	public int attack1;
	public int beAttackHash;

    //Attack Hint block
    GameObject attackLayer;
    public Robot enemy;
    //if in AttackRange attackObject is curSelect soldier
    public Robot attackObject;
    void InitAnimator()
    {
		anim = GetComponentInChildren<Animator>();
		fly = Animator.StringToHash("fly");
		attack0 = Animator.StringToHash("attack0");
		attack1 = Animator.StringToHash("attack1");
		beAttackHash = Animator.StringToHash("beAttacked");
    }
	void Awake() {
		BoxCollider bc = GetComponent<BoxCollider>();
		bc.center = new Vector3(0, 0.5f, 0);
		Rigidbody rb = GetComponent<Rigidbody>();
		rb.constraints = RigidbodyConstraints.FreezeAll;
		
		inventory = GetComponent<PlayerInventory0>();
		//GetComponent(PlayerBufferState).mainRobot = this;
        InitAnimator();	

		attackableList = new List<Robot>();

		inAttackRange = false;
		inAttack = false;
		inMove = false;
		inDead = false;
		chooseYet = false;
		beAttacked = false;

		gameObject.tag = "Player";
		baseHealth = 800;

        InitStateMachine();
	}
    public void InitStateMachine()
    {
		stateMachine = new StateMachine0();
		stateMachine.AddState(new FreeState0(stateMachine, this));
		stateMachine.AddState(new MoveState0(stateMachine, this));
		stateMachine.AddState(new InChooseState0(stateMachine, this));
        //TODO: add More State
		stateMachine.AddState(new InAttack0(stateMachine, this));
		stateMachine.AddState(new DeadState0(stateMachine, this));

		stateMachine.AddState(new AttackState0(stateMachine, this));
		stateMachine.AddState(new BeAttackedState0(stateMachine, this));

		InitPrivateState();
		stateMachine.InitTransition();
		stateMachine.ChangeState("Free");
    }

	void Start () {
		roundManager = GameObject.Find("GameLogic").GetComponent<RoundManager0>();
        board = GameObject.FindGameObjectWithTag("GameController").GetComponent<SingleHex>();
	}
    //Set AttackState set State Transition
	public virtual void InitPrivateState() {
		Debug.LogError("robot init Private State");
	}

    //TODO: Attack calculate with buffer state
	public int DoAttack(){
        return inventory.DoAttack();
    }
	public void SetPosition(int row, int col) {
		transform.localPosition = board.GridToPos(row, col);
	}

	public void SetHealth(int h) {
		health = h;
		baseHealth = h;
	}

	public static Robot MakeRobot(SingleHex s) {
		var go = new GameObject();
		var b = GameObject.CreatePrimitive(PrimitiveType.Cube);
		b.transform.parent = go.transform;
		var r = go.AddComponent<Robot>();
        r.board = s;
		r.moveRange = 2;
		r.attackRange = 3;
		r.box = b;
		r.attackType = 0;
		r.physicDefense = 0.2f;
		r.magicDefense = 0.2f;
        r.SetHealth(800);
		return r;
	}

	public void SetColor(int c) {
		color = c;
		Light light;
		if(color == 0) {
			light = GetComponentInChildren<Light>();
			if(light != null) {
				light.color = Color.red;
			}
		}else {
			transform.localEulerAngles = new Vector3(0, 180, 0);
			light = GetComponentInChildren<Light>();
			if(light != null) {
				light.color = Color.blue;
			}
		}
	}

    //Select Other Soldier
    //Move
    //Attack
    //Touch Board
	public void ChangeChoose() {
		if(chooseYet) {
			chooseYet = false;
		}
		if(inAttackRange) {
			//Debug.Log("inAttackRange exit");
			inAttackRange = false;
		}
		if(attackLayer != null) {
			Destroy(attackLayer);
			attackLayer = null;
		}
	}

	void OnMouseDown() {
	}

    //Select  TouchEnemy StartAttack
	public virtual void StartAttack(Robot enemyObject) {
		//Debug.Log("robot startAttack");
		enemy = enemyObject;
		attacking = true;
	}

	void OnMouseUp() {
        //Debug.Log("OnMouseUp "+chooseYet);
		if(inAttackRange) {
			attackObject.StartAttack(this);
			inAttackRange = false;
		} else {
			if(roundManager.curTurn != color || roundManager.inAction)
				return;

			chooseYet = true;
		}
	}
	public void OnMouseDrag() {
	}

	public void RemoveMoveGrid() {
		Destroy(moveGrid);
	}

	GameObject MakePiece() {
		var go = new GameObject();
		LineRenderer line = go.AddComponent<LineRenderer>();
		line.SetVertexCount(2);
		line.SetPosition(0, new Vector3(-0.5f, 0, 0));
		line.SetPosition(1, new Vector3(0.5f, 0, 0));
		line.material = (Material)Instantiate(Resources.Load("hexMat"));
		line.useWorldSpace = false;
		return go;
	}

	public void UpdateMap() {
		Vector3 grid = board.PosToGrid(transform.localPosition.x, transform.localPosition.z);
		myGridX = (int)grid.x;
		myGridZ = (int)grid.z;
		board.UpdateMap(myGridX, myGridZ, this);
	}
    //Clear Old Grid Number Map Not current pos
	public void ClearMap() {
        /*
		Vector3 grid = board.PosToGrid(transform.localPosition.x, transform.localPosition.z);
		myGridX = (int)grid.x;
		myGridZ = (int)grid.z;
        */
		board.ClearMap(myGridX, myGridZ, this);
	}
	
    //change select
    //begin attack 
    //need to clear current enemy state
	public virtual void ClearEnemy() {
		foreach(Robot r in attackableList) {
			r.inAttackRange = false;
			r.attackObject = null;
		}
		attackableList.Clear();
	}

    //TODO: when clearAttackable excute ?
	public virtual void ClearAttackable(Robot attacker) {
		if(inAttackRange && attackObject == attacker) {
			inAttackRange = false;
			attackObject = null;
		}
	}

    //Attacker check enemy's realPath to determine whether can attack It
	public bool GetAttackable(Robot attacker){
		if(color != attacker.color) {
			int dist = board.MinDistance(myGridX, myGridZ, attacker.myGridX, attacker.myGridZ);
            //Debug.LogWarning("dist "+dist);
			//Debug.Log("min dist "+dist+" range"+attacker.attackRange);
			if(dist <= attacker.attackRange) {
				int mx;
				int mz;
				int ax;
				int az;
                Vector2 arr;
				arr = board.NormalToAffine(myGridX, myGridZ);
				mx = (int)arr.x;
				mz = (int)arr.y;
				arr = board.NormalToAffine(attacker.myGridX, attacker.myGridZ);
				ax = (int)arr.x;
				az = (int)arr.y;
				
				var path = new List<int[]>();
				var ret = board.RealPathLength(mx, mz, ax, az, path, attacker);
				//Debug.Log("realPathLength "+ret);
				if(ret) {
					inAttackRange = true;
					attackObject = attacker;
				}
			} 
		}
		return inAttackRange;
	}

    //Check All Enemy to Determine who can be attacked
	public virtual void FindAttackable() {
        //Debug.LogError("Ships Number "+board.ships.Count);
        foreach(Robot r in board.ships) {
			var ret = r.GetAttackable(this);
			if(ret)
				attackableList.Add(r);
		}
	}

    //put Move Collider for touch Event trigger
	public void ShowMoveGrid() {
		moveGrid = new GameObject();
		moveGrid.name = "moveGrid";
		moveGrid.transform.parent = transform.parent;
		moveGrid.transform.localPosition = Vector3.zero;
		GameObject hex;
		var points = FindMoveOrAttackPoints((int)inventory.GetValue("distance"));
		Debug.Log("move point num "+points);
		//myself should not contain in points
		foreach(var p in points) {
			var gx = p/1000;
			var gz = p%1000;
			if(gx == myGridX && gz == myGridZ) 
				continue;
			hex = MakePiece();
			hex.transform.parent = moveGrid.transform;
			hex.transform.localPosition = board.GridToPos(gz, gx);
			//hex.renderer.material.SetColor("_TintColor", Color.red);
            
			MoveGrid0.MakeMoveGrid(hex, this);
		}
	}

	Dictionary<int, bool>.KeyCollection FindMoveOrAttackPoints(int ra) {
		var openList = new List<int[]>();
		var closedList = new Dictionary<int, bool>();
		var grid = board.PosToGrid(transform.localPosition.x, transform.localPosition.z);
		var gx = Mathf.RoundToInt(grid.x);
		var gz = Mathf.RoundToInt(grid.z);
	    int nx;
		int nz;
		int dist;

		openList.Add(new int[]{gx, gz, 0});//x y distance
		while(openList.Count > 0) {
			var pos = openList[0];
            openList.RemoveAt(0);
			gx = pos[0];
			gz = pos[1];
			dist = pos[2];
			int key;
			int[] neibors;
            int i;
            int t0;
            int t1;
			if(dist < ra) {
				//check neibor and add neibor
				if(gz % 2 == 0) {
                    neibors = new int[]{
						1, 0,
						0, 1,
						-1, 1,
						-1, 0,
						-1, -1,
						0, -1
                    };
                    for(i = 0; i < neibors.Length; i += 2) {
                        t0 = neibors[i];
                        t1 = neibors[i+1]; 
                        nx = gx+t0;
                        nz = gz+t1;

                        if(nx < board.width && nx >= 0 && nz < board.height && nz >= 0) {
                            key = nx*1000+nz;
                            if(!board.boardMap.ContainsKey(key) && !closedList.ContainsKey(key)) {
    							openList.Add(new int[]{nx, nz, dist+1});
                            }
                        }
                    }

				} else {
					neibors = new int[]{
						1, 0,
						1, 1,
						0, 1,
						-1, 0,
						0, -1,
						1, -1
					};

                    for(i = 0; i < neibors.Length; i += 2) {
                        t0 = neibors[i];
                        t1 = neibors[i+1]; 
                        nx = gx+t0;
                        nz = gz+t1;

                        if(nx < board.width && nx >= 0 && nz < board.height && nz >= 0) {
                            key = nx*1000+nz;
                            if(!board.boardMap.ContainsKey(key) && !closedList.ContainsKey(key)) {
    							openList.Add(new int[]{nx, nz, dist+1});
                            }
                        }
                    }

				}
			}
			key = gx*1000+gz;
			closedList[key] = true;
		}
		return closedList.Keys;
	}
    void Update() {
        stateMachine.Update();
    }

    //select touch MoveGrid  move
    public List<int> movePath;
    int moveStep;
    public void SetMoveTarget(MoveGrid0 tar) {
		Debug.Log("set Move ");
        //TODO: RoundManager  current Turn inAction State
		if(roundManager.curTurn != color || roundManager.inAction)
			return;
			
		Debug.Log("setMoveTarget "+tar);
		Vector3 p = tar.gameObject.transform.localPosition;
		Vector3 grid = board.PosToGrid((int)p.x, (int)p.z);
		var path = FindMovePath((int)grid.x, (int)grid.z);
		movePath = path;
		inMove = true;

        inventory.DoMoveDistance();
    }

    //Find real Path from current pos to target pos
	public List<int> FindMovePath(int tarX, int tarZ) {
		var gridInfo = new Dictionary<int, int[]>();
		var openList = new List<int[]>();
		var closedList = new Dictionary<int, bool>();
		var grid = board.PosToGrid(transform.localPosition.x, transform.localPosition.z);
		var gx = Mathf.RoundToInt(grid.x);
		var gz = Mathf.RoundToInt(grid.z);
		int nx;
		int nz;
		int dist;
		openList.Add(new int[]{gx, gz, 0});//x y distance
        //parent distance
		gridInfo[gx*1000+gz] = new int[]{-1, 0};
        int[] neibors;
        int i;
        int t0;
        int t1;
		
		while(openList.Count > 0) {
			var pos = openList[0];
            openList.RemoveAt(0);
			gx = pos[0];
			gz = pos[1];
            Debug.LogWarning("find Path "+gx+" "+gz);
			if(gx == tarX && gz == tarZ)
				break;
			dist = pos[2];
			int key;
		    int parent = gx*1000+gz;

			if(dist < inventory.GetValue("distance")) {
				//check neibor and add neibor
				if(gz % 2 == 0) { 
                    neibors = new int[]{
                        1, 0,
                        0, 1,
                        -1, 1,
                        -1, 0,
                        -1, -1,
                        0, -1
                    };

                    for(i = 0; i < neibors.Length; i += 2) {
                        t0 = neibors[i];
                        t1 = neibors[i+1]; 
                        nx = gx+t0;
                        nz = gz+t1;
                        
                        if(nx < board.width && nx >= 0 && nz < board.height && nz >= 0) {
                            key = nx*1000+nz;
                            //TODO: change all closedList to ContainKey
                            if(!board.boardMap.ContainsKey(key) && !closedList.ContainsKey(key) && !gridInfo.ContainsKey(key)) {
    							openList.Add(new int[]{nx, nz, dist+1});
                                gridInfo[key] = new int[]{parent, dist+1};
                            }
                        }
                    }

				} else {
					neibors = new int[]{
						1, 0,
						1, 1,
						0, 1,
						-1, 0,
						0, -1,
						1, -1
					};

                    for(i = 0; i < neibors.Length; i += 2) {
                        t0 = neibors[i];
                        t1 = neibors[i+1]; 
                        nx = gx+t0;
                        nz = gz+t1;

                        if(nx < board.width && nx >= 0 && nz < board.height && nz >= 0) {
                            key = nx*1000+nz;
                            if(!board.boardMap.ContainsKey(key) && !closedList.ContainsKey(key) && !gridInfo.ContainsKey(key)) {
    							openList.Add(new int[]{nx, nz, dist+1});
                                gridInfo[key] = new int[]{parent, dist+1};
                            }
                        }
                    }

				}
			}
			key = gx*1000+gz;
			closedList[key] = true;
		}
		var path = new List<int>();
		var point = tarX*1000+tarZ;
		path.Add(point);
		while(point != -1) {
			Debug.Log("find Move Path "+point);
			point = gridInfo[point][0];
			if(point != -1)
				path.Add(point);
		}
		path.Reverse();
		Debug.Log("move Path "+path);
		return path;
	}

	public void ChangeHealth(int c) {
		if(health <= 0 && c > 0) {
			health = c;
		} else
			health += c;
	}

    //TODO: add state machine to set Action
    
	public virtual void SetAction(string s, Action0 a) {
		
		StateModel0 state = stateMachine.GetState(s);
		Debug.Log("set action "+s+" "+a+" "+state);
		state.SetAction(a);
		Debug.Log("state action "+state.action);
	}
    
}