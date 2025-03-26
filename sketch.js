// ==========================================
//          Kawaii Tetris - sketch.js
// ==========================================

// --- Constants ---
const BOARD_WIDTH = 10; // Blocks
const BOARD_HEIGHT = 20; // Blocks
const BLOCK_SIZE = 30; // pixels
const UI_WIDTH = 5 * BLOCK_SIZE; // Width for Score/Next Piece area (pixels)
const CANVAS_WIDTH = BOARD_WIDTH * BLOCK_SIZE + UI_WIDTH; // Total canvas width
const CANVAS_HEIGHT = BOARD_HEIGHT * BLOCK_SIZE; // Total canvas height
const BOARD_X_OFFSET = 0; // Where the board starts drawing horizontally (pixels)
const BOARD_Y_OFFSET = 0; // Where the board starts drawing vertically (pixels)
const UI_X_OFFSET = BOARD_WIDTH * BLOCK_SIZE; // Where UI area starts (pixels)

const INITIAL_DROP_INTERVAL = 1000; // Milliseconds
const SCORE_PER_LINE = [0, 100, 300, 500, 800]; // Points for 0-4 lines

// SUPER KAWAII Color definitions! ✨💖🍬
const COLORS = {
    0: [250, 240, 245], 1: [137, 207, 240], 2: [255, 182, 193],
    3: [255, 253, 150], 4: [191, 155, 219], 5: [144, 238, 144],
    6: [255, 160, 190], 7: [255, 218, 185]
};
const BORDER_COLOR = [120, 100, 110];

// --- Tetromino Definitions ---
const TETROMINOES = {
    'I': { color: 1, shapes: [ [[1, -1], [1, 0], [1, 1], [1, 2]], [[-1, 1], [0, 1], [1, 1], [2, 1]], [[2, -1], [2, 0], [2, 1], [2, 2]], [[-1, 0], [0, 0], [1, 0], [2, 0]], ] },
    'L': { color: 2, shapes: [ [[0, -1], [1, -1], [1, 0], [1, 1]], [[0, 0], [1, 0], [2, 0], [0, 1]], [[1, -1], [1, 0], [1, 1], [2, 1]], [[2, -1], [0, 0], [1, 0], [2, 0]], ] },
    'J': { color: 4, shapes: [ [[0, 1], [1, -1], [1, 0], [1, 1]], [[0, 0], [1, 0], [2, 0], [2, -1]], [[1, -1], [1, 0], [1, 1], [2, -1]], [[0, 0], [0, 1], [1, 0], [2, 0]], ] },
    'O': { color: 3, shapes: [ [[0, 0], [0, 1], [1, 0], [1, 1]] ] },
    'S': { color: 5, shapes: [ [[0, 0], [0, 1], [1, -1], [1, 0]], [[0, 0], [1, 0], [1, 1], [2, 1]], [[2, 0], [2, 1], [1, -1], [1, 0]], [[0, -1], [1, -1], [1, 0], [2, 0]], ] },
    'T': { color: 6, shapes: [ [[0, 0], [1, -1], [1, 0], [1, 1]], [[0, 0], [1, 0], [1, 1], [2, 0]], [[1, -1], [1, 0], [1, 1], [2, 0]], [[0, 0], [1, -1], [1, 0], [2, 0]], ] },
    'Z': { color: 7, shapes: [ [[0, -1], [0, 0], [1, 0], [1, 1]], [[0, 1], [1, 0], [1, 1], [2, 0]], [[1, -1], [1, 0], [2, 0], [2, 1]], [[0, 0], [1, -1], [1, 0], [2, -1]], ] }
};

const PIECE_TYPES = Object.keys(TETROMINOES);

// --- Game State ---
let gameState;
let lastDropTime = 0;
let currentDropInterval = INITIAL_DROP_INTERVAL;

// --- Core Game Logic Functions (Data Transformation) ---

/** Returns a random tetromino type key */
function getRandomPieceType() {
    const randomIndex = Math.floor(Math.random() * PIECE_TYPES.length);
    return PIECE_TYPES[randomIndex];
}

/** Checks if a given piece position/rotation is valid */
function isPositionValid(piece, board) {
    if (!piece || !TETROMINOES[piece.type]) return false;
    const pieceDefinition = TETROMINOES[piece.type];
    const rotationIndex = piece.rotation % pieceDefinition.shapes.length;
    const shape = pieceDefinition.shapes[rotationIndex];
    if (!shape) return false;
    for (const offset of shape) {
        const blockRow = piece.y + offset[0];
        const blockCol = piece.x + offset[1];
        if (blockCol < 0 || blockCol >= BOARD_WIDTH || blockRow >= BOARD_HEIGHT) return false;
        if (blockRow >= 0) {
            if (!board[blockRow] || board[blockRow][blockCol] !== 0) return false;
        }
    }
    return true;
}

/** Attempts to move the current piece left */
function moveLeft(currentState) {
    const { currentPiece, board, isGameOver } = currentState;
    if (!currentPiece || isGameOver) return currentState;
    const nextPiece = { ...currentPiece, x: currentPiece.x - 1 };
    return isPositionValid(nextPiece, board) ? { ...currentState, currentPiece: nextPiece } : currentState;
}

/** Attempts to move the current piece right */
function moveRight(currentState) {
    const { currentPiece, board, isGameOver } = currentState;
    if (!currentPiece || isGameOver) return currentState;
    const nextPiece = { ...currentPiece, x: currentPiece.x + 1 };
    return isPositionValid(nextPiece, board) ? { ...currentState, currentPiece: nextPiece } : currentState;
}

/** Attempts to move the current piece down (player input) */
function moveDown(currentState) {
    const { currentPiece, board, isGameOver } = currentState;
    if (!currentPiece || isGameOver) return currentState;
    const nextPiece = { ...currentPiece, y: currentPiece.y + 1 };
    if (isPositionValid(nextPiece, board)) {
        lastDropTime = millis();
        return { ...currentState, currentPiece: nextPiece };
    } else {
        return currentState;
    }
}

/** Handles the automatic downward movement due to gravity */
function applyGravity(currentState) {
    const { currentPiece, board, isGameOver } = currentState;
    if (!currentPiece || isGameOver) return currentState;
    const nextPiece = { ...currentPiece, y: currentPiece.y + 1 };
    if (isPositionValid(nextPiece, board)) {
        return { ...currentState, currentPiece: nextPiece };
    } else {
        return currentState; // Signal lock needed
    }
}

/** Attempts to rotate the current piece clockwise */
function rotatePiece(currentState) {
    const { currentPiece, board, isGameOver } = currentState;
    if (!currentPiece || isGameOver) return currentState;
    const pieceDefinition = TETROMINOES[currentPiece.type];
    const currentRotation = currentPiece.rotation;
    const nextRotation = (currentRotation + 1) % pieceDefinition.shapes.length;
    const nextPiece = { ...currentPiece, rotation: nextRotation };
    // Try direct rotation
    if (isPositionValid(nextPiece, board)) return { ...currentState, currentPiece: nextPiece };
    // Try Wall Kick Left 1
    const nextPieceLeft = { ...nextPiece, x: nextPiece.x - 1 };
    if (isPositionValid(nextPieceLeft, board)) return { ...currentState, currentPiece: nextPieceLeft };
    // Try Wall Kick Right 1
    const nextPieceRight = { ...nextPiece, x: nextPiece.x + 1 };
    if (isPositionValid(nextPieceRight, board)) return { ...currentState, currentPiece: nextPieceRight };
    // Failed
    return currentState;
}

/** Checks a board for completed lines */
function checkForLineClears(board) {
    let linesCleared = 0;
    const newBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
    let newBoardRow = BOARD_HEIGHT - 1;
    for (let r = BOARD_HEIGHT - 1; r >= 0; r--) {
        const isRowFull = board[r].every(cell => cell !== 0);
        if (!isRowFull) {
            if (newBoardRow >= 0) newBoard[newBoardRow--] = board[r];
        } else {
            linesCleared++;
        }
    }
    return { board: newBoard, linesCleared: linesCleared };
}

/**
 * Spawns the next piece, checks for game over, and updates the piece queue.
 */
function spawnNextPieceAndUpdateQueue(currentState) {
    let typeToSpawn = currentState.nextPieceType;
    if (!typeToSpawn) typeToSpawn = getRandomPieceType(); // Fallback

    const initialX = Math.floor(BOARD_WIDTH / 2) - 1;
    const initialY = 0;
    const newCurrentPiece = { type: typeToSpawn, rotation: 0, x: initialX, y: initialY };
    const newNextPieceType = getRandomPieceType();

    // --- Game Over Check ---
    if (!isPositionValid(newCurrentPiece, currentState.board)) {
        console.log("GAME OVER detected during spawn!");
        // Set game over, but KEEP the piece that caused it for rendering
        return {
            ...currentState,
            currentPiece: newCurrentPiece, // Keep invalid piece
            nextPieceType: newNextPieceType, // Still update queue
            isGameOver: true
        };
    }

    // Game not over, proceed normally
    return {
        ...currentState,
        currentPiece: newCurrentPiece,
        nextPieceType: newNextPieceType
    };
}

/** Creates the initial game state */
function getInitialState() {
    const initialBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
    const firstNextType = getRandomPieceType();
    const baseState = {
        board: initialBoard, currentPiece: null, nextPieceType: firstNextType,
        score: 0, level: 1, isGameOver: false,
    };
    const initialState = spawnNextPieceAndUpdateQueue(baseState);
    console.log("Game Initialized/Restarted.");
    return initialState;
}

/** Locks the current piece, checks/clears lines, updates score, and spawns the next piece */
function lockPieceAndSpawnNext(currentState) {
    const { currentPiece, board } = currentState;
    if (!currentPiece) return currentState;
    // 1. Merge Piece onto Board
    const newBoardBeforeClear = board.map(row => [...row]);
    const pieceDefinition = TETROMINOES[currentPiece.type];
    const rotationIndex = currentPiece.rotation % pieceDefinition.shapes.length;
    const shape = pieceDefinition.shapes[rotationIndex];
    const colorIndex = pieceDefinition.color;
    if (!shape) { console.error("Locking error: Invalid shape."); return currentState; }
    shape.forEach(offset => {
        const blockRow = currentPiece.y + offset[0];
        const blockCol = currentPiece.x + offset[1];
        if (blockRow >= 0 && blockRow < BOARD_HEIGHT && blockCol >= 0 && blockCol < BOARD_WIDTH) {
            newBoardBeforeClear[blockRow][blockCol] = colorIndex;
        }
    });
    // 2. Check for and Clear Lines
    const clearResult = checkForLineClears(newBoardBeforeClear);
    const boardAfterClearing = clearResult.board;
    const linesClearedCount = clearResult.linesCleared;
    // 3. Calculate Score Update
    const scoreUpdate = SCORE_PER_LINE[Math.min(linesClearedCount, SCORE_PER_LINE.length - 1)] || 0;
    // 4. Prepare state for spawning next piece
    const stateBeforeSpawn = {
        ...currentState,
        board: boardAfterClearing,
        currentPiece: null, // Clear locked piece
        score: currentState.score + scoreUpdate,
        // nextPieceType remains
        // TODO: Update level
    };
    // 5. Spawn the next piece (handles game over check inside)
    const nextState = spawnNextPieceAndUpdateQueue(stateBeforeSpawn);
    if (linesClearedCount > 0) { console.log(`${linesClearedCount} lines cleared! Score +${scoreUpdate}`); }
    return nextState;
}

// --- P5.js Functions ---

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    console.log("Canvas created:", width, "x", height);
    gameState = getInitialState(); // Initialize
    lastDropTime = millis();
    frameRate(30);
    textFont('Nunito');
    textAlign(CENTER, CENTER);
}

function draw() {
    // --- 1. Handle Timing and Game Logic Update ---
    const currentTime = millis();
    if (!gameState.isGameOver && gameState.currentPiece && currentTime - lastDropTime > currentDropInterval) {
        const stateBeforeGravity = gameState;
        gameState = applyGravity(gameState);
        lastDropTime = currentTime;
        if (gameState === stateBeforeGravity && gameState.currentPiece) {
             gameState = lockPieceAndSpawnNext(gameState);
        }
    } else if (!gameState.currentPiece && !gameState.isGameOver) {
        console.error("Error: No current piece in game state during draw loop!");
    }

    // --- 2. Render Game State ---
    background(COLORS[0]);
    // Draw Board Area
    push();
    translate(BOARD_X_OFFSET, BOARD_Y_OFFSET);
    drawBoard(gameState.board);
    // Draw the current piece *even if game is over* to show the collision
    if (gameState.currentPiece) {
        drawPiece(gameState.currentPiece);
    }
    pop();
    // Draw UI Area
    push();
    translate(UI_X_OFFSET, BOARD_Y_OFFSET);
    drawUI(gameState.score, gameState.nextPieceType);
    pop();

    // --- 3. Render Game Over Overlay (if applicable) ---
    if (gameState.isGameOver) {
        fill(0, 0, 0, 170); rect(0, 0, width, height); // Overlay entire canvas
        // Main Text
        fill(255, 80, 80); textSize(40); textAlign(CENTER, CENTER);
        text("GAME OVER 😭", width / 2, height / 2 - 40);
        // Score Text
        textSize(24); fill(250, 240, 245);
        text(`Final Score: ${gameState.score}`, width / 2, height / 2 + 10);
        // Restart Instruction
        textSize(18); fill(220, 220, 255); // Lighter color for instruction
        text("Press 'R' to Restart", width / 2, height / 2 + 50);
    }
}

// --- Rendering Functions ---

/** Draws a single block with kawaii styling */
function drawBlock(row, col, colorIndex) {
    if (colorIndex === 0) return;
    const blockColor = COLORS[colorIndex] || [128, 128, 128];
    const x = col * BLOCK_SIZE; const y = row * BLOCK_SIZE;
    fill(blockColor); stroke(BORDER_COLOR); strokeWeight(1.5);
    rect(x, y, BLOCK_SIZE, BLOCK_SIZE, 3);
}

/** Draws the game board (settled pieces and border) */
function drawBoard(board) {
    // Settled blocks
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            if (board[r][c] !== 0) drawBlock(r, c, board[r][c]);
        }
    }
    // Border
    stroke(BORDER_COLOR); strokeWeight(2); noFill();
    rect(0, 0, BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
}

/** Draws the currently falling piece */
function drawPiece(piece) {
    if (!piece || !TETROMINOES[piece.type]) return;
    const pieceDefinition = TETROMINOES[piece.type];
    const rotationIndex = piece.rotation % pieceDefinition.shapes.length;
    const shape = pieceDefinition.shapes[rotationIndex];
    if (!shape) return;
    const colorIndex = pieceDefinition.color;
    shape.forEach(offset => {
        drawBlock(piece.y + offset[0], piece.x + offset[1], colorIndex);
    });
}

/** Draws the UI elements (Score, Next Piece) in the UI area */
function drawUI(score, nextPieceType) {
    const PADDING = 15;
    // Score
    fill(50, 40, 50); textSize(24); textAlign(LEFT, TOP);
    text("Score", PADDING, PADDING);
    textSize(32); text(score, PADDING, PADDING + 30);
    // Next Piece Preview
    const previewLabelY = PADDING + 80;
    const previewBoxX = PADDING; const previewBoxY = previewLabelY + 30;
    const previewBlockSize = BLOCK_SIZE * 0.8;
    const previewBoxW = 4 * previewBlockSize + PADDING;
    const previewBoxH = 4 * previewBlockSize + PADDING;
    // Label
    textSize(24); textAlign(LEFT, TOP); fill(50, 40, 50);
    text("Next", PADDING, previewLabelY);
    // Box background
    fill(240, 230, 235); stroke(BORDER_COLOR); strokeWeight(1.5);
    rect(previewBoxX, previewBoxY, previewBoxW, previewBoxH, 5);
    // Draw piece inside
    if (nextPieceType && TETROMINOES[nextPieceType]) {
        const pieceDefinition = TETROMINOES[nextPieceType];
        const shape = pieceDefinition.shapes[0];
        const colorIndex = pieceDefinition.color;
        let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
        shape.forEach(offset => { minR = Math.min(minR, offset[0]); maxR = Math.max(maxR, offset[0]); minC = Math.min(minC, offset[1]); maxC = Math.max(maxC, offset[1]); });
        const pieceHeight = (maxR - minR + 1); const pieceWidth = (maxC - minC + 1);
        const totalPiecePixelW = pieceWidth * previewBlockSize; const totalPiecePixelH = pieceHeight * previewBlockSize;
        const offsetX = (previewBoxW - totalPiecePixelW) / 2; const offsetY = (previewBoxH - totalPiecePixelH) / 2;
        push();
        translate(previewBoxX + offsetX, previewBoxY + offsetY);
        shape.forEach(offset => {
            const blockX = (offset[1] - minC) * previewBlockSize; const blockY = (offset[0] - minR) * previewBlockSize;
            fill(COLORS[colorIndex] || [128,128,128]); stroke(BORDER_COLOR); strokeWeight(1);
            rect(blockX, blockY, previewBlockSize, previewBlockSize, 2);
        });
        pop();
    }
}

// --- Input Handling ---

/** Handles keyboard input for controlling the piece and restarting */
function keyPressed() {
    // Handle Restart first, only if game is over
    if (gameState.isGameOver) {
        // Check if the key pressed is 'r' or 'R'
        if (key === 'r' || key === 'R') {
            console.log("Restarting game...");
            gameState = getInitialState(); // Reset the entire game state
            lastDropTime = millis(); // Reset gravity timer
        }
        return; // Ignore other input if game is over
    }

    // If game is not over, handle piece controls
    let newState = gameState;
    let stateChanged = false;

    if (keyCode === LEFT_ARROW) { newState = moveLeft(gameState); stateChanged = newState !== gameState; }
    else if (keyCode === RIGHT_ARROW) { newState = moveRight(gameState); stateChanged = newState !== gameState; }
    else if (keyCode === DOWN_ARROW) { newState = moveDown(gameState); stateChanged = newState !== gameState; }
    else if (keyCode === UP_ARROW) { newState = rotatePiece(gameState); stateChanged = newState !== gameState; }
    // ... other controls ...

    if (stateChanged) {
        gameState = newState;
    }
}

// --- Helper Functions (Logic - To be implemented) ---
// function hardDrop(currentState) { /* ... */ }
// function calculateLevel(score) { /* ... */ }
// function updateDropInterval(level) { /* ... */ }