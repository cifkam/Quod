const ordA = ord('A');
var player = 0;
var playerClass = ["player1", "player2"]
var playerQuods = [[],[]]
var finished = false;

function cellIdToCoords(id)
{
    return [ord(id[0])-ordA, ord(id[1])-ordA];
}

function resetGame()
{
    
    const board = document.querySelector("table.board");
    Array.from(board.children).forEach((row) => {
        Array.from(row.children).forEach((data) => {
            const cell = data.querySelector("a")
            if (cell != undefined)
            {
                cell.classList.remove(playerClass[0]);
                cell.classList.remove(playerClass[1]);
            }
        })
    });
 
    const square = document.querySelector("table.board #square");
    square.style.display = "";
    square.classList.remove(playerClass[0]);
    square.classList.remove(playerClass[1]);
    playerQuods = [[],[]];
    finished = false;
    player = 0;
}


function mark(cell, i, j) {
    if (finished)
    {
        resetGame();
        return;
    }


    var coords = [i,j];
    if (cell.classList.contains(playerClass[0]) || cell.classList.contains(playerClass[1]))
        return;

    cell.classList.add(playerClass[player]);
    playerQuods[player].push(coords);
    var [a,b,c,d] = findSquare();
    if (a !== undefined)
    {
        drawSquare(a,b,c,d);
        finished = true;
    }

    /* end of move - switch player */
    player = 1 - player;
}

function chr(code) {
    return String.fromCharCode(code);
}

function ord(char) {
    return char.charCodeAt(0);
}


function createControls()
{
    const controls1 = document.querySelector(".player1.player-controls");
    const controls2 = document.querySelector(".player2.player-controls");

    var q1 = document.createElement("a");
    var q2 = document.createElement("a");

    controls1.appendChild(q1);
    controls2.appendChild(q2);
    for (let i = 0; i < 6; ++i)
    {
        q1 = document.createElement("a");
        q2 = document.createElement("a");

        controls1.appendChild(q1);
        controls2.appendChild(q2);
    }


}

function createBoard()
{
    const board = document.querySelector("table.board");
    for (let i = 0; i < 11; ++i)
    {
        const tr = document.createElement("tr");
        for (let j = 0; j < 11; ++j)
        {

            const td = document.createElement("td");
            
            if (i == 0 && j == 0) // prepare the square
            {
                const square = document.createElement("div");
                square.id = "square";
                td.appendChild(square);
                square.onclick = function(){resetGame();};
            }

            if (!(i == 0 && (j == 0 || j == 10) || i == 10 && (j == 0 || j == 10)))
            {
                const cell = document.createElement("a");
                cell.id = chr(i+ordA) + chr(j+ordA);
                cell.onclick = function(){mark(cell, i, j);};
                cell.classList.add("cell")
                const stone = document.createElement("span");
                stone.classList.add("stone");
                cell.appendChild(stone);
                td.appendChild(cell);
            }

            tr.appendChild(td);
        }
        board.appendChild(tr);
    }
}

function bodyOnLoad()
{
    createControls();
    createBoard();
}


function findSquare()
{
    const quods = playerQuods[player];
    if (quods.length < 4)
        return [undefined, undefined, undefined, undefined];

    
    // One of the points must be new - last item in playerQuods[player] array:
    const a = quods.length-1;
    const qa = quods[a];

    // Iterate over the others
    for (let b = 0; b < quods.length-1; ++b)
    {
        const qb = quods[b];
        const vec = vOrtho(vSub(qb,qa));

        // We already have 2 points, so we can generate only 4 candidates
        // and check if we already have the right ones in the list
        const candidates = [vAdd(qa,vec), vAdd(qb,vec), vSub(qa,vec), vSub(qb,vec)];
        // 2 ← qa → 0
        //     ↓
        // 3 ← qb → 1
        
        for (let c = 0; c < quods.length-1; ++c)
        {
            const qc = quods[c];
            
            // Check if qc is a candidate
            const idx = candidates.findIndex((item) => {
                return vEquals(item, qc);
            });
            
            if (idx === -1)
                continue;
            

            const qd = candidates[ idx+(idx+1)%2*2-1 ];

            // Check if qd is in the list
            for (let d = 0; d < quods.length-1; ++d)
            {
                if (vEquals(qd, quods[d]))
                    return[qa, qb, qc, qd];
            }
        }
    }
    
    return [undefined, undefined, undefined, undefined];
}


function drawSquare(a,b,c,d)
{
    const cellSizeMultiplier = 1.0413
    var vec = vSub(b,a);
    var angle = vAngle(vec, [0,1]);
    if (vec[0] < 0)
        angle = -angle;

    var squareSize = vLength(vSub(a,b));
    let [sy, sx] = vMean([a,b,c,d]);

    sx = sx + 1/2 - squareSize/2;
    sy = sy + 1/2 - squareSize/2;

    const td = document.querySelector("table.board").children[0].children[0];
    td.style.position = "relative";

    const square = document.getElementById("square");

    square.style.display = "block";
    square.style.width = squareSize*100*cellSizeMultiplier + "%";
    square.style.height = squareSize*100*cellSizeMultiplier + "%";
    square.style.left = sx*100*cellSizeMultiplier + "%"
    square.style.top = sy*100*cellSizeMultiplier + "%"
    square.style.transform = "rotate("+angle+"deg)";
    square.classList.add(playerClass[player]);
}