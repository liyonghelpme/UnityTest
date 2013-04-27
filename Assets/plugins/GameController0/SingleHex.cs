using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class SingleHex : MonoBehaviour {
    public float s;
    public float h;
    public float r;
    public float b;
   
    float a;
    public GameObject board ;
    public int width ;
    public int height;
    public List<Robot> ships;
    GameObject shipLayer ;

    public Dictionary<int, Robot> boardMap ;
    GameObject boardGrid ;

    bool inScale ;

    void UpdateBoardGrid() {
        Destroy(boardGrid);
        boardGrid = new GameObject();
        boardGrid.transform.parent = board.transform;
        boardGrid.transform.localPosition = Vector3.zero;
        foreach(int i in boardMap.Keys) {
            var nx = i/1000;
            var nz = i%1000;
            Vector3 g = GridToPos(nz, nx);
            GameObject h  = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            h.transform.parent = boardGrid.transform;
            h.transform.localScale = new Vector3(0.5f, 0.5f, 0.5f);
            h.transform.localPosition = g;
        }
    }


    public void UpdateMap(int x, int y, Robot obj) {
        boardMap.Add(x*1000+y, obj);
        UpdateBoardGrid();
    }
    public void ClearMap(int x, int y, Robot obj) {
        boardMap.Remove(x*1000+y);
        UpdateBoardGrid();
    }

    void Awake() {
        boardGrid = new GameObject();
        ships = new List<Robot>();
        boardMap = new Dictionary<int, Robot>();
        board = new GameObject();
        
        s = 1.0f;
        h = Mathf.Sin(Mathf.Deg2Rad*30)*s;
        r = Mathf.Cos(Mathf.Deg2Rad*30)*s;
        b = s+2*h;
        a = 2*r;

        width = 13;
        height = 13;
    }
    void OnGUI()
    {
        if (GUI.Button(new Rect(Screen.width - 100, 100, 100, 100), "Add New"))
        {
            AddRobot();
        }
    }
    int totalNum;
    void AddRobot()
    {
        Robot rob;
		rob = Sniper0.MakeRobot(this);
		rob.transform.parent = shipLayer.transform;
		rob.SetColor(0);
		rob.SetPosition(0, totalNum);

		ships.Add(rob);
		rob.UpdateMap();


		rob = Sniper0.MakeRobot(this);
		rob.transform.parent = shipLayer.transform;
		rob.SetColor(1);
		rob.SetPosition(12, totalNum);

		ships.Add(rob);
		rob.UpdateMap();

        totalNum++;
    }
    void InitRobot() {
        Robot rob;
        int i;
        totalNum = 0;
        /*
		rob = Sniper0.MakeRobot(this);
		rob.transform.parent = shipLayer.transform;
		rob.SetColor(0);
		rob.SetPosition(0, 0);

		ships.Add(rob);
		rob.UpdateMap();
        */
		rob = Flag0.MakeRobot(this);
		rob.transform.parent = shipLayer.transform;
		rob.SetColor(0);
		rob.SetPosition(1, 6);

		ships.Add(rob);
		rob.UpdateMap();

        /*
		rob = Sniper0.MakeRobot(this);
		rob.transform.parent = shipLayer.transform;
		rob.SetColor(1);
		rob.SetPosition(3, 3);

		ships.Add(rob);
		rob.UpdateMap();
        */

		rob = Flag0.MakeRobot(this);
		rob.transform.parent = shipLayer.transform;
		rob.SetColor(1);
		rob.SetPosition(11, 6);

		ships.Add(rob);
		rob.UpdateMap();
    }
    void InitBoard() {
        for(int row = 0; row < width; row++) {
            for(int col = 0; col < height; col++) {
                GameObject hex = MakeSingle();
                if(row%2 == 0) {
                    hex.transform.localPosition = new Vector3(col*2*r, 0, row*(s+h));
                } else if(row%2 == 1) {
                    hex.transform.localPosition = new Vector3(col*2*r+r, 0, row*(s+h));
                }
                hex.transform.parent = board.transform;
            }
        }
        board.AddComponent<ChessBoard0>();
        board.AddComponent<BoxCollider>();
        var collider = board.GetComponent<BoxCollider>();
        collider.size = new Vector3(2*r*(width)+r, 0.01f, (s+h)*height+h);
        collider.center = Vector3.zero+new Vector3(-r+collider.size.x/2, 0, -(s/2+h)+collider.size.z/2);//+new Vector3((2*r*width+2*r)/2, 0, ((s+h)*height+2*(s/2+h))/2);
    }
    void InitShip() {
        shipLayer = new GameObject();
        shipLayer.name = "shipLayer";
        shipLayer.tag = "ShipLayer";
        shipLayer.transform.parent = board.transform;
    }


    void Start (){
        InitBoard();
        InitShip();
        InitRobot();
    }

    //when touch board clear choose of soldier
    public void ClearChoose(){
        foreach(Robot r in ships) {
            r.ChangeChoose();
        }
    }
    //check Attackable MinDistance == Path to Enemy
    public int MinDistance(int x0, int y0, int x1, int y1) {
        int nx0 = x0-y0/2;
        int nx1 = x1-y1/2;
        return RealDistance(nx0, y0, nx1, y1);		
    }

    public int RealDistance(int x0, int y0, int x1, int y1){
        if(x0 > x1)
            return RealDistance(x1, y1, x0, y0);
        if(y1 > y0)
            return x1-x0+y1-y0;
        return Mathf.FloorToInt(Mathf.Max(x1-x0, y0-y1));
    }

    //GetAttackable enemy real Path to each Enemy use Affine Coordinate
    public Vector2 NormalToAffine(int x, int y) {
        return new Vector2(x-y/2, y);
    }
    public Vector2 AffineToNormal(int x, int y) {
        return new Vector2(x+y/2, y);
    }
    //Get Real Attack Path to enemy  check If enemy block my way
    public bool CheckPosPassable(int nx, int ny, int color) {
        return !boardMap.ContainsKey(nx*1000+ny) || boardMap[nx*1000+ny].color == color;
    }

    //check if I can move to certain point
    public bool CheckMapMovable(int nx, int ny) {
        return !boardMap.ContainsKey(nx * 1000 + ny);
    }
    //attacker goto enemy real Path length  (my Color soldier won't block my Way)
    public bool RealPathLength(int x0, int y0, int x1, int y1, List<int[]> path, Robot attacker){
        int difx = x1-x0;
        int dify = y1-y0;
        if(difx < 0)
            return RealPathLength(x1, y1, x0, y0, path, attacker);
        int dx;
        int dy;
        
        bool disA = false;
        bool disB = false;
        if(difx == 0 && dify == 0)
            return true;
        if(difx == 1 && dify == -1)
            return true;
        if(difx == 0 && Mathf.Abs(dify) == 1)
            return true;
        if(dify == 0 && Mathf.Abs(difx) == 1)
            return true;
        
        int nx;
        int ny;
        Vector2 arr;
        List<int[]> next = new List<int[]>();
        if (difx == 0)
        {
            if (dify > 0)
                next.Add(new int[] { 0, 1 });
            else
                next.Add(new int[] { 0, -1 });
        }
        //difx > 0
        else if (dify == 0)
        {
            next.Add(new int[] { 1, 0 });
        }
        else if (difx > 0 && dify < 0)
        {
            next.Add(new int[] {0, -1 });
            next.Add(new int[]{1, -1});
        }
        else if (difx > 0 && dify > 0)
        {
            next.Add(new int[] { 1, 0 });
            next.Add(new int[] { 0, 1 });
        }

        foreach (int[] i in next)
        {
            arr = AffineToNormal(x0 + i[0], y0 + i[1]);
            nx = (int)arr.x;
            ny = (int)arr.y;		
            if(CheckPosPassable(nx, ny, attacker.color)) {
                path.Add(new int[]{nx, ny});
                return RealPathLength(x0+i[0], y0+i[1], x1, y1, path, attacker);
            }
        }
        return false;
    }
    //when choose one robot clear other choose state
    public void ChangeChoose() {
        ClearChoose();
    }

    //target grid Number  calculate position
    public Vector3 GridToPos(int row, int col) {
        if(row%2 == 0) {
            return new Vector3(col*2*r, 0, row*(s+h));
        } else {
            return new Vector3(col*2*r+r, 0, row*(s+h));
        }
    }
    //target position calculate grid number
    public Vector3 PosToGrid(float x, float z) {
        int gx = Mathf.FloorToInt(x/2/r); 
        int gz = Mathf.FloorToInt(z/(s+h));
        float difX = x - gx*2*r;
        float difZ = z - gz*(s+h);
        //Debug.Log("gzPos " + gz%2 + "difX "+difX+"difZ "+difZ+"x"+x+"z"+z);
        if(gz%2 == 0) {
            if(difZ >= s/2+h) {
                return new Vector3(gx, 0, gz+1);
            }
        
            if(difX <= r && difZ <= s/2) {
                return new Vector3(gx, 0, gz);
            }
            if(difX <= r && (difZ-s/2+h/r*difX) <= h && difZ >= s/2) {
                return new Vector3(gx, 0, gz);
            }	
            if(difX >= r && difZ <= s/2) {
                return new Vector3(gx+1, 0, gz);
            }
            if(difX >= r && (difZ-s/2-h/r*(difX-r)) <= 0 && difZ >= s/2)
                return new Vector3(gx+1, 0, gz);	
            
            if(difX <= r && (difZ-s/2+h/r*difX) >= 0 && difZ >= s/2)
                return new Vector3(gx, 0, gz+1);
            
            if(difX >= r && (difZ-h/r*(difX-r)) > 0)
                return new Vector3(gx, 0, gz+1);
        } else {
            if(difZ <= s/2) {
                return new Vector3(gx, 0, gz);
            }
            if(difX <= r && difZ-s/2-h/r*difX <= 0 && difZ >= s/2) {
                return new Vector3(gx, 0, gz);
            }
            if(difX >= r && difZ-s/2+(h/r)*(difX-r) <= h && difZ >= s/2) {
                return new Vector3(gx, 0, gz);
            }
            
            if(difX <= r && difZ >= s/2+h) {
                return new Vector3(gx, 0, gz+1);
            }
            if(difX <= r && difZ-h/r*difX >= 0)
                return new Vector3(gx, 0, gz+1);
            
            if(difX >= r && difZ >= s/2+h) {
                return new Vector3(gx+1, 0, gz+1);
            }
            if(difX >= r && difZ+(h/r)*(difX-r) >= 0) {
                return new Vector3(gx+1, 0, gz+1);
            }
            
        }
        return Vector3.zero;
    }

    GameObject MakeSingle() {	
        var go = new GameObject();
        LineRenderer line = go.AddComponent<LineRenderer>();
        line.SetVertexCount(7);
        line.SetWidth(0.1f, 0.1f);
        line.SetPosition(0, new Vector3(0, 0, b/2));
        line.SetPosition(1, new Vector3(-r, 0, s/2));
        line.SetPosition(2, new Vector3(-r, 0, -s/2));
        line.SetPosition(3, new Vector3(0, 0, -b/2));
        line.SetPosition(4, new Vector3(r, 0, -s/2));
        line.SetPosition(5, new Vector3(r, 0, s/2));
        line.SetPosition(6, new Vector3(0, 0, b/2));
        line.useWorldSpace = false;
        line.material = (Material)Instantiate(Resources.Load("hexMat"));
        
        return go;
    }
}
