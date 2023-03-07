const quasarValue = -1;

class Player {
    constructor(id, numberOfQuasars) {
        this.id = id;
        this.remainingQuasars = numberOfQuasars;
        this.quods = [];
    }
}

class Game {
    constructor(startingPlayer = 0, numberOfQuasars = 6, boardSize = 11) {
        this.board = [];
        this.boardSize = boardSize;
        this.currPlayer = startingPlayer;
        this.numberOfQuasars = numberOfQuasars;
        this.players = [
            new Player(numberOfQuasars),
            new Player(numberOfQuasars)];
        
        for (let i = 0; i < boardSize; ++i) {
            this.board.push([]);
            for (let j = 0; j < boardSize; ++j) {
                this.board[i].push(null);
            }
        }

        this.board[0][0] = quasarValue;
        this.board[0][boardSize-1] = quasarValue;
        this.board[boardSize-1][0] = quasarValue;
        this.board[boardSize-1][boardSize-1] = quasarValue;
        this.end = false;
    }

    getCurrPlayer() {
        return this.players[this.currPlayer];
    }
    
    findSquare() {
        const quods = this.getCurrPlayer().quods;
        if (quods.length < 4)
            return [null,null,null,null];
    
        // One of the points must be new - last added quod
        const a = quods[quods.length-1];
        
        // Iterate over the others
        for (let i = 0; i < quods.length-1; ++i)
        {
            const b = quods[i];
            const vec = vOrtho(vSub(b,a));
            
            const [x,y] = [vAdd(a,vec), vAdd(b,vec)]; // First two candidates
            const [z,w] = [vSub(a,vec), vSub(b,vec)]; // Second two candidates
            
            const p = this.currPlayer;
            if (this.boardAt(x) == p && this.boardAt(y) == p)
            {
                this.end = true;
                return [a,b,x,y];
            }
            else if (this.boardAt(z) == p && this.boardAt(w) == p)
            {
                this.end = true;
                return [a,b,z,w];
            }
        }
        
        return [null,null,null,null];
    }
    
    boardAt(coords) {
        if (coords[0] < 0 ||
            coords[1] < 0 ||
            coords[0] >= game.boardSize ||
            coords[1] >= game.boardSize)
            return quasarValue;

        return this.board[coords[0]][coords[1]];
    }

    switchPlayers() {
        this.currPlayer = 1 - this.currPlayer;
    }
    
    moveQuod(row,col) {
        if (this.board[row][col] != null)
            return false;

        this.board[row][col] = this.currPlayer;
        this.getCurrPlayer().quods.push([row,col]);
        return true;
    }
    
    moveQuasar(row,col) {
        const player = this.getCurrPlayer();
        if (this.board[row][col] != null || player.remainingQuasars <= 0)
            return false;

        player.remainingQuasars--;
        this.board[row][col] = quasarValue;
        return true;
    }
}