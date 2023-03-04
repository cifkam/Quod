const playerClass = ["player0", "player1"];
var currentPlayer = null;
var playerQuods = null;
var quasars = null;
var gameEnd = null;
var quodsMode = null;

function getPlayerControls(player = null)
{
    if (player == null) player = currentPlayer;
    return document.querySelector(".player-controls."+playerClass[player]);
}

function activateQuods(player = null)
{
    if (player == null) player = currentPlayer;
    else if (player != currentPlayer || quodsMode || gameEnd)
        return;
    
    const controls = getPlayerControls(player);
    const quod = controls.querySelector(".quod");
    quod.classList.remove("grayscale");
    controls.querySelectorAll(".quasar").forEach((q) => {
        q.classList.remove("selected");
    });

    quodsMode = true;
}

function activateQuasars(player = null, quasar = null)
{
    if (player == null) player = currentPlayer;
    else if (player != currentPlayer || gameEnd) return false;
    
    const controls = getPlayerControls(player);
    if (quasar == null)
    {
        // Get the the last (rightmost) unselected quasar
        quasar = Array.from(getPlayerControls().querySelectorAll(".quasar"))
            .reverse()
            .find(q => !q.classList.contains("used"));

        if (quasar == null)
            return false;
    }

    if (!quasar.classList.contains("selected"))
    {
        controls.querySelectorAll(".quasar").forEach((q) => {
            q.classList.remove("selected");
        });
        quasar.classList.add("selected");
        controls.querySelector(".quod").classList.add("grayscale");
    }
    

    quodsMode = false;
    return true;
}

function resetGame()
{
    // Remove all quads and quasars from the board
    document.querySelectorAll("table.board .cell .quod").forEach(el => el.classList.remove("quod"));
    document.querySelectorAll("table.board .cell .quasar").forEach(el => el.classList.remove("quasar"));
    document.querySelectorAll("table.board .cell").forEach(cell => {
        cell.classList.remove(playerClass[0]);
        cell.classList.remove(playerClass[1]);
    });

    // Hide square
    const square = document.querySelector("table.board #square");
    square.style.visibility = "";
    square.style.opacity = "";

    // Reset controls' appereance
    getPlayerControls(0).classList.remove("grayscale"); // player0 starts
    getPlayerControls(1).classList.add("grayscale");
    document.querySelectorAll(".used").forEach(q => q.classList.remove("used"));
    document.querySelectorAll(".taken").forEach(q => q.classList.remove("taken"));
    
    // Reset variables
    playerQuods = [[],[]];
    quasars = [];
    gameEnd = false;
    currentPlayer = 0;

    activateQuods();
}


function switchPlayers()
{
    getPlayerControls(currentPlayer).classList.add("grayscale");
    getPlayerControls(1-currentPlayer).classList.remove("grayscale");
    activateQuods();

    currentPlayer = 1 - currentPlayer;
}

function addQuod(coords, cell)
{
    if (cell == null)
        cell = document.querySelector(".row "+coords[0]+".col"+coords[1] + " .cell");
    cell.parentElement.classList.add("taken");
    cell.classList.add(playerClass[currentPlayer]);
    playerQuods[currentPlayer].push(coords);
    cell.querySelector("span").classList.add("quod");
    var [a,b,c,d] = findSquare();
    if (a !== null)
    {
        drawSquare(a,b,c,d);
        gameEnd = true;
        return;
    }
}

function addQuasar(coords, cell)
{
    if (cell == null)
        cell = document.querySelector(".row "+coords[0]+".col"+coords[1] + " .cell");

    cell.parentElement.classList.add("taken");
    quasars.push(coords);
    cell.querySelector("span").classList.add("quasar");
    const controls = getPlayerControls();
    quasar = Array.from(controls.querySelectorAll(".quasar"))
        .reverse()
        .find(q => !q.classList.contains("used"));
    quasar.classList.remove("selected");
    quasar.classList.add("used");
}

function move(i, j, cell = null) {
    if (gameEnd)
    {
        resetGame();
        return;
    }

    var coords = [i,j];
    
    // Check that cell doesn't contain quod
    for (let p = 0; p < 2; ++p)
        for (let i = 0; i < playerQuods[p].length; ++i)
            if (vEquals(playerQuods[p][i], coords))
                return;
    
    // Check that cell doesn't contain quasar
    for (let i = 0; i < quasars.length; ++i)
        if (vEquals(quasars[i], coords))
            return;

    if (quodsMode)
    {
        addQuod(coords, cell);
    }
    else
    {
        addQuasar(coords, cell);
        if (!activateQuasars())
            activateQuods();
        return;
    }

    if (!gameEnd)
        switchPlayers();
}


function createControls()
{
    const controls0 = getPlayerControls(0);
    const controls1 = getPlayerControls(1);
    
    const quod0 = document.createElement("a");
    const quod1 = document.createElement("a");
    quod0.classList.add(playerClass[0]);
    quod1.classList.add(playerClass[1]);
    quod0.classList.add("quod");
    quod1.classList.add("quod");
    quod0.onclick = function(){activateQuods(0)};
    quod1.onclick = function(){activateQuods(1)};
    
    const span0 = document.createElement("span");
    const span1 = document.createElement("span");
    span0.appendChild(quod0);
    span1.appendChild(quod1);

    controls0.appendChild(span0);
    controls1.appendChild(span1);
    for (let i = 0; i < 6; ++i)
    {
        const q0 = document.createElement("a");
        const q1 = document.createElement("a");
        q0.classList.add("quasar")
        q1.classList.add("quasar")
        q0.onclick = function(){activateQuasars(0,q0)};
        q1.onclick = function(){activateQuasars(1,q1)};
        
        const s0 = document.createElement("span");
        const s1 = document.createElement("span");
        s0.appendChild(q0);
        s1.appendChild(q1);

        controls0.appendChild(s0);
        controls1.appendChild(s1);
    }


}

function createBoard()
{
    const board = document.querySelector("table.board");
    for (let i = 0; i < 11; ++i)
    {
        const tr = document.createElement("tr");
        tr.classList.add("row"+i);
        for (let j = 0; j < 11; ++j)
        {
            const td = document.createElement("td");
            td.classList.add("col"+j);

            
            if (i == 0 && j == 0) // prepare the square
            {
                const square = document.createElement("div");
                square.id = "square";
                const svg = document.createElement("img");
                svg.src = "arrow-rotate-right.svg";

                square.appendChild(svg);
                td.appendChild(square);
                square.onclick = function(){resetGame();};
            }

            if (!(i == 0 && (j == 0 || j == 10) || i == 10 && (j == 0 || j == 10)))
            {
                const cell = document.createElement("a");
                cell.onclick = function(){move(i, j, cell);};
                cell.classList.add("cell")
                const quod = document.createElement("span");
                //quod.classList.add("quod");
                cell.appendChild(quod);
                td.appendChild(cell);
            }

            tr.appendChild(td);
        }
        board.appendChild(tr);
    }
}



function findSquare()
{
    const quods = playerQuods[currentPlayer];
    if (quods.length < 4)
        return [null, null, null, null];

    
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
            
            // 0 <--> 1 ; 2 <--> 3
            const qd = candidates[ idx+(idx+1)%2*2-1 ];
            
            // Check if qd is in the list
            for (let d = 0; d < quods.length-1; ++d)
            {
                if (vEquals(qd, quods[d]))
                return[qa, qb, qc, qd];
            }
        }
    }
    
    return [null, null, null, null];
}


function drawSquare(a,b,c,d)
{
    const square = document.getElementById("square");
    
    // Compute square rotation angle
    var vec = vSub(b,a);
    var angle = vAngle(vec, [0, vec[0] > 0 ? 1 : -1]);// % 90;
    square.style.transform = "rotate("+angle+"deg)";
    
    // Compute square position in number of cells as units    
    var squareSize = vLength(vSub(a,b));
    let center = vMean([a,b,c,d]);
    // Subtract squareSize/2 to get shift from top-left corner
    // Add 1/2 [cell] to shift to the cell center
    let [sx, sy] = sSub(center, squareSize/2 - 1/2) 


    square.style.top = sx*100 + "%"
    square.style.left = sy*100 + "%"
    square.style.width = squareSize*100 + "%";
    
    square.style.height = square.style.width;
    square.style.visibility = "visible";
    square.style.opacity = 1;
}

function bodyOnLoad()
{
    createControls();
    createBoard();
    resetGame();
    // Show the page  - hide the fact the board and controls are created dynamically by JS
    // and also show nice smooth animation (transition)
    document.querySelector("main").style.opacity = "";
}
