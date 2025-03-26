// ==========================================
//          Kawaii Tetris - sketch.js
// ==========================================

// --- Constants ---
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30; // pixels
const INITIAL_DROP_INTERVAL = 1000; // Milliseconds per row drop (1 second)

// SUPER KAWAII Color definitions! ✨💖🍬
const COLORS = {
    0: [250, 240, 245], // Background (empty cell) - Very Light Pink/Off-white
    1: [137, 207, 240], // Baby Blue (I piece?)
    2: [255, 182, 193], // Light Pink (L piece?)
    3: [255, 253, 150], // Pastel Yellow (O piece?)
    4: [191, 155, 219], // Lavender (J piece?)
    5: [144, 238, 144], // Light Green (S piece?)
    6: [255, 160, 190], // Soft Coral/Pink (T piece?)
    7: [255, 218, 185]  // Peach Puff (Z piece?)
};
const BORDER_COLOR = [120, 100, 110]; // A slightly muted purple/gray border

// --- Tetromino Definitions ---
// IMPORTANT: Verify these shapes/rotations against SRS if needed later!
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
let gameState; // Holds the single source of truth for the game
let lastDropTime = 0; // Timestamp of the last gravity-induced drop
let currentDropInterval = INITIAL_DROP_INTERVAL; // How often gravity applies (ms)

// --- Core Game Logic Functions (Data Transformation) ---

/** Returns a random tetromino type key */
function getRandomPieceType() { /* ... remains the same ... */
    const randomIndex = Math.floor(Math.random() * PIECE_TYPES.length);
    return PIECE_TYPES[randomIndex];
}

/** Checks if a given piece position/rotation is valid */
function isPositionValid(piece, board) { /* ... remains the same ... */
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
function moveLeft(currentState) { /* ... remains the same ... */
    const { currentPiece, board, isGameOver } = currentState;
    if (!currentPiece || isGameOver) return currentState;
    const nextPiece = { ...currentPiece, x: currentPiece.x - 1 };
    return isPositionValid(nextPiece, board) ? { ...currentState, currentPiece: nextPiece } : currentState;
}

/** Attempts to move the current piece right */
function moveRight(currentState) { /* ... remains the same ... */
    const { currentPiece, board, isGameOver } = currentState;
    if (!currentPiece || isGameOver) return currentState;
    const nextPiece = { ...currentPiece, x: currentPiece.x + 1 };
    return isPositionValid(nextPiece, board) ? { ...currentState, currentPiece: nextPiece } : currentState;
}

/** Attempts to move the current piece down (player input) */
function moveDown(currentState) { /* ... remains the same ... */
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
function applyGravity(currentState) { /* ... remains the same ... */
    const { currentPiece, board, isGameOver } = currentState;
    if (!currentPiece || isGameOver) return currentState;
    const nextPiece = { ...currentPiece, y: currentPiece.y + 1 };
    if (isPositionValid(nextPiece, board)) {
        return { ...currentState, currentPiece: nextPiece };
    } else {
        // Gravity failed, signal that locking is needed by returning original state
        return currentState;
    }
}


/**
 * Spawns a new piece. Returns the updated game state.
 */
function spawnPiece(currentState) { /* ... remains the same ... */
    const type = getRandomPieceType();
    const initialX = Math.floor(BOARD_WIDTH / 2) - 1;
    const initialY = 0;
    const newPiece = { type: type, rotation: 0, x: initialX, y: initialY };
    // TODO: Implement Game Over check: if (!isPositionValid(newPiece, currentState.board)) ...
    return { ...currentState, currentPiece: newPiece };
}

/**
 * Creates the initial game state.
 */
function getInitialState() { /* ... remains the same ... */
    const initialBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
    const baseState = {
        board: initialBoard, currentPiece: null, nextPiece: null,
        score: 0, level: 1, isGameOver: false,
    };
    return spawnPiece(baseState);
}


/**
 * Locks the current piece onto the board and spawns the next piece.
 * @param {object} currentState - The state where the piece needs to be locked.
 * @returns {object} The new state after locking and spawning.
 */
function lockPieceAndSpawnNext(currentState) {
    const { currentPiece, board } = currentState;

    // Safety check: Should not happen if called correctly, but good practice
    if (!currentPiece) return currentState;

    // --- 1. Merge Piece onto Board (Immutable Update) ---
    // Create a deep copy of the board to modify
    const newBoard = board.map(row => [...row]); // Creates new rows and copies values

    const pieceDefinition = TETROMINOES[currentPiece.type];
    const rotationIndex = currentPiece.rotation % pieceDefinition.shapes.length;
    const shape = pieceDefinition.shapes[rotationIndex];
    const colorIndex = pieceDefinition.color;

    if (!shape) {
        console.error("Locking error: Invalid shape definition.");
        return currentState; // Avoid modifying state if shape is bad
    }

    // Place the piece's blocks onto the newBoard
    shape.forEach(offset => {
        const blockRow = currentPiece.y + offset[0];
        const blockCol = currentPiece.x + offset[1];
        // Ensure the block is within valid board coordinates before writing
        if (blockRow >= 0 && blockRow < BOARD_HEIGHT && blockCol >= 0 && blockCol < BOARD_WIDTH) {
            newBoard[blockRow][blockCol] = colorIndex;
        } else {
            // This might happen if a piece locks partially off-screen? Log for now.
             console.warn(`Warning: Locked block at [${blockRow}, ${blockCol}] might be out of bounds.`);
        }
    });

    // --- 2. Line Clearing (Placeholder) ---
    // TODO: Implement check for completed lines on `newBoard`
    // TODO: If lines cleared, update score, level, and create `boardAfterClearing`
    // let boardAfterClearing = checkForLineClears(newBoard); // Conceptual
    // let scoreUpdate = calculateScore(linesCleared); // Conceptual
    const boardAfterLocking = newBoard; // Use this for now until clearing is done
    const scoreUpdate = 0; // Placeholder

    // --- 3. Prepare state for spawning next piece ---
    const stateBeforeSpawn = {
        ...currentState,
        board: boardAfterLocking,
        currentPiece: null, // Clear the locked piece before spawning next
        score: currentState.score + scoreUpdate, // Add score from line clears
        // TODO: Update level based on lines cleared/score?
    };

    // --- 4. Spawn the next piece ---
    const nextState = spawnPiece(stateBeforeSpawn);

    console.log("Piece Locked. New piece spawned."); // Log successful lock & spawn
    return nextState;
}


// --- P5.js Functions ---

function setup() { /* ... remains the same ... */
    createCanvas(BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
    console.log("Canvas created:", width, "x", height);
    gameState = getInitialState();
    if (!gameState || !gameState.currentPiece) { console.error("Initial state creation failed!"); }
    else { console.log("Initial state created. Piece type:", gameState.currentPiece.type); }
    lastDropTime = millis();
    frameRate(30);
}

function draw() {
    // --- 1. Handle Timing and Game Logic Update ---
    const currentTime = millis();

    // Apply gravity if needed
    if (!gameState.isGameOver && gameState.currentPiece && currentTime - lastDropTime > currentDropInterval) {
        const stateBeforeGravity = gameState;
        gameState = applyGravity(gameState);
        lastDropTime = currentTime; // Reset timer

        // Check if gravity failed -> time to lock!
        if (gameState === stateBeforeGravity && gameState.currentPiece) {
             console.log("DRAW LOOP: Locking piece...");
             // Update the game state by calling the locking function
             gameState = lockPieceAndSpawnNext(gameState);
        }
    } else if (!gameState.currentPiece && !gameState.isGameOver) {
        console.error("Error: No current piece in game state during draw loop!");
        // Attempt recovery? Maybe just log for now.
        // gameState = spawnPiece(gameState); // Risky - could cause infinite loop if spawn fails
    }

    // --- 2. Render Game State ---
    drawBoard(gameState.board); // Draw background and settled pieces

    if (gameState.currentPiece) { // Draw falling piece
        drawPiece(gameState.currentPiece);
    }

    // --- 3. Render UI / Overlays ---
    if (gameState.isGameOver) { // Draw Game Over screen
        fill(0, 0, 0, 150); rect(0, 0, width, height);
        fill(255, 100, 100); textSize(32); textAlign(CENTER, CENTER);
        textFont('Nunito'); text("GAME OVER 😭", width / 2, height / 2);
    }
    // TODO: Draw Score, Level, Next Piece Preview
}

// --- Rendering Functions ---
function drawBlock(row, col, colorIndex) { /* ... remains the same ... */
    if (colorIndex === 0) return;
    const blockColor = COLORS[colorIndex] || [128, 128, 128];
    const x = col * BLOCK_SIZE; const y = row * BLOCK_SIZE;
    fill(blockColor); stroke(BORDER_COLOR); strokeWeight(1.5);
    rect(x, y, BLOCK_SIZE, BLOCK_SIZE, 3);
}
function drawBoard(board) { /* ... remains the same ... */
    background(COLORS[0]);
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            if (board[r][c] !== 0) { drawBlock(r, c, board[r][c]); }
        }
    }
}
function drawPiece(piece) { /* ... remains the same ... */
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

// --- Input Handling ---
function keyPressed() { /* ... remains the same ... */
    if (gameState.isGameOver) return;
    let newState = gameState; let stateChanged = false;
    if (keyCode === LEFT_ARROW) { newState = moveLeft(gameState); stateChanged = newState !== gameState; }
    else if (keyCode === RIGHT_ARROW) { newState = moveRight(gameState); stateChanged = newState !== gameState; }
    else if (keyCode === DOWN_ARROW) { newState = moveDown(gameState); stateChanged = newState !== gameState; }
    // ... (placeholders for other keys) ...
    if (stateChanged) { gameState = newState; console.log("State updated by input:", keyCode); }
}

// --- Helper Functions (Logic - To be implemented) ---
// function checkForLineClears(board) { /* return { updatedBoard, linesClearedCount }; */ }
// function rotatePiece(currentState) { /* ... return updatedState */ }
// function hardDrop(currentState) { /* ... return updatedState */ }