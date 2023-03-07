const query = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
}); //usage: var x = query.name

const playerClass = ["player0", "player1"];
var numberOfQuasars = 6;
var boardSize = 11;

var startingPlayer = 0;
var game = null;
var quodsMode = null;


/* ==================== */

function switchPlayers() {
    getPlayerControls(game.currPlayer).classList.add("grayscale");
    getPlayerControls(1-game.currPlayer).classList.remove("grayscale");
    activateQuods();

    game.switchPlayers();
}


function addQuod(row, col, cell = null) {
    if (!game.moveQuod(row, col))
        return false;

    if (cell == null)
    cell = document.querySelector(".row "+row+".col"+col + " .cell");

    cell.parentElement.classList.add("taken");
    cell.classList.add(playerClass[game.currPlayer]);
    cell.querySelector("span").classList.add("quod");
    
    var [a,b,c,d] = game.findSquare();
    if (a !== null)
        drawSquare(a,b,c,d);

    return true;
}


function addQuasar(row, col, cell = null) {
    if (!game.moveQuasar(row, col))
        return false;
    
    if (cell == null)
        cell = document.querySelector(".row "+row + ".col"+col + " .cell");

    cell.parentElement.classList.add("taken");
    cell.querySelector("span").classList.add("quasar");
    const controls = getPlayerControls();
    quasar = Array.from(controls.querySelectorAll(".quasar"))
        .reverse()
        .find(q => !q.classList.contains("used"));
    quasar.classList.remove("selected");
    quasar.classList.add("used");
    return true;
}


/* ==================== */

function move(i, j, cell = null) {
    if (game.end) {
        resetGame();
        return;
    }

    if (quodsMode) {
        if (!addQuod(i,j, cell))
            return false;
    }
    else {
        if (!addQuasar(i, j, cell))
            return false;

        if (!activateQuasars())
            activateQuods();

        return true;
    }

    if (!game.end)
        switchPlayers();

    return true;
}


function resetGame() {
    if (game.numberOfQuasars != numberOfQuasars)
        createControls();

    createGameInstance();
    resetGameGUI();
}


function setDynamicStyle() {
    document.getElementById("dynamicStyle").innerHTML = ".player-controls span {\n"+
    "width:  calc( (100vw - 10px) / "+(game.numberOfQuasars+1)+");\n"+
    "height: calc( (100vw - 10px) / "+(game.numberOfQuasars+1)+");\n"+
    "}";
}


function setNumberOfQuasars(n) {
    numberOfQuasars = n;
    setDynamicStyle();
}


function getPlayerControls(player = null) {
    if (player == null) player = game.currPlayer;
    return document.querySelector(".player-controls."+playerClass[player]);
}


function activateQuods(player = null) {
    if (player == null) player = game.currPlayer;
    else if (player != game.currPlayer || quodsMode || game.end)
        return;
    
    const controls = getPlayerControls(player);
    const quod = controls.querySelector(".quod");
    quod.classList.remove("grayscale");
    controls.querySelectorAll(".quasar").forEach((q) => {
        q.classList.remove("selected");
    });

    quodsMode = true;
}


function activateQuasars(player = null, quasar = null) {
    if (player == null) player = game.currPlayer;
    else if (player != game.currPlayer || game.end) return false;
    
    const controls = getPlayerControls(player);
    if (quasar == null) {
        // Get the the last (rightmost) unselected quasar
        quasar = Array.from(getPlayerControls().querySelectorAll(".quasar"))
            .reverse()
            .find(q => !q.classList.contains("used"));

        if (quasar == null)
            return false;
    }

    if (!quasar.classList.contains("selected")) {
        controls.querySelectorAll(".quasar").forEach((q) => {
            q.classList.remove("selected");
        });
        quasar.classList.add("selected");
        controls.querySelector(".quod").classList.add("grayscale");
    }
    

    quodsMode = false;
    return true;
}


function createGameInstance()
{
    game = new Game(startingPlayer, numberOfQuasars, boardSize);
}


function resetGameGUI() {
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
    getPlayerControls(startingPlayer).classList.remove("grayscale"); // player0 starts
    getPlayerControls(1-startingPlayer).classList.add("grayscale");
    document.querySelectorAll(".used").forEach(q => q.classList.remove("used"));
    document.querySelectorAll(".taken").forEach(q => q.classList.remove("taken"));
    
    activateQuods();
}


function drawSquare(a,b,c,d) {
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


function createControls()
{
    const controls0 = getPlayerControls(0);
    const controls1 = getPlayerControls(1);
    controls0.innerHTML = "";
    controls1.innerHTML = "";
    
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
    for (let i = 0; i < numberOfQuasars; ++i) {
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
    for (let i = 0; i < 11; ++i) {
        const tr = document.createElement("tr");
        tr.classList.add("row"+i);
        for (let j = 0; j < 11; ++j) {
            const td = document.createElement("td");
            td.classList.add("col"+j);
            
            if (i == 0 && j == 0) { // prepare the #square element
                const square = document.createElement("div");
                square.id = "square";
                const svg = document.createElement("img");
                svg.src = "arrow-rotate-right.svg";

                square.appendChild(svg);
                td.appendChild(square);
                square.onclick = function(){resetGame();};
            }

            if (!(i == 0 && (j == 0 || j == 10) || i == 10 && (j == 0 || j == 10))) {
                const cell = document.createElement("a");
                cell.onclick = function(){move(i, j, cell);};
                cell.classList.add("cell")
                const quod = document.createElement("span");
                cell.appendChild(quod);
                td.appendChild(cell);
            }
            tr.appendChild(td);
        }
        board.appendChild(tr);
    }
}


function bodyOnLoad() {
    createGameInstance();
    createControls();
    createBoard();
    
    resetGameGUI();
    setDynamicStyle();
    
    // Show the page  - hide the fact the board and controls are created dynamically by JS
    // and also show nice smooth animation (transition)
    document.querySelector("main").style.opacity = "";
}
