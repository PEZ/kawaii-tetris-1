// ==========================================
//          Kawaii Tetris - sketch.js
// ==========================================

// --- Constants ---
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30; // pixels
const INITIAL_DROP_INTERVAL = 1000; // Milliseconds per row drop (1 second)
const SCORE_PER_LINE = [0, 100, 300, 500, 800]; // Points for 0, 1, 2, 3, 4 lines cleared

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

/**
 * Returns a random tetromino type key (e.g., 'I', 'L', 'T').
 */
function getRandomPieceType() {
    const randomIndex = Math.floor(Math.random() * PIECE_TYPES.length);
    return PIECE_TYPES[randomIndex];
}

/**
 * Checks if a given piece position/rotation is valid on the board.
 */
function isPositionValid(piece, board) {
    if (!piece || !TETROMINOES[piece.type]) return false;

    const pieceDefinition = TETROMINOES[piece.type];
    const rotationIndex = piece.rotation % pieceDefinition.shapes.length;
    const shape = pieceDefinition.shapes[rotationIndex];

    if (!shape) return false;

    for (const offset of shape) {
        const blockRow = piece.y + offset[0];
        const blockCol = piece.x + offset[1];

        // 1. Check boundaries
        if (blockCol < 0 || blockCol >= BOARD_WIDTH || blockRow >= BOARD_HEIGHT) {
            return false;
        }

        // 2. Check collision with settled blocks (only if within board vertically)
        if (blockRow >= 0) {
            if (!board[blockRow] || board[blockRow][blockCol] !== 0) {
                return false;
            }
        }
    }
    return true;
}


/**
 * Attempts to move the current piece left. Returns new state or original state.
 */
function moveLeft(currentState) {
    const { currentPiece, board, isGameOver } = currentState;
    if (!currentPiece || isGameOver) return currentState;
    const nextPiece = { ...currentPiece, x: currentPiece.x - 1 };
    return isPositionValid(nextPiece, board) ? { ...currentState, currentPiece: nextPiece } : currentState;
}

/**
 * Attempts to move the current piece right. Returns new state or original state.
 */
function moveRight(currentState) {
    const { currentPiece, board, isGameOver } = currentState;
    if (!currentPiece || isGameOver) return currentState;
    const nextPiece = { ...currentPiece, x: currentPiece.x + 1 };
    return isPositionValid(nextPiece, board) ? { ...currentState, currentPiece: nextPiece } : currentState;
}

/**
 * Attempts to move the current piece down (player input). Returns new state or original state.
 * Resets the gravity timer if the move is successful.
 */
function moveDown(currentState) {
    const { currentPiece, board, isGameOver } = currentState;
    if (!currentPiece || isGameOver) return currentState;

    const nextPiece = { ...currentPiece, y: currentPiece.y + 1 };

    if (isPositionValid(nextPiece, board)) {
        // Player moved down successfully, reset gravity timer for responsiveness
        lastDropTime = millis();
        return { ...currentState, currentPiece: nextPiece };
    } else {
        // Player tried to move down into an invalid spot, just ignore
        return currentState;
    }
}

/**
 * Handles the automatic downward movement due to gravity.
 * Returns new state if moved, or original state if locking is needed.
 */
function applyGravity(currentState) {
    const { currentPiece, board, isGameOver } = currentState;
    if (!currentPiece || isGameOver) return currentState;

    const nextPiece = { ...currentPiece, y: currentPiece.y + 1 };

    if (isPositionValid(nextPiece, board)) {
        // Gravity move successful
        return { ...currentState, currentPiece: nextPiece };
    } else {
        // Gravity move failed - piece needs to lock
        // Signal this by returning the original state
        return currentState;
    }
}

/**
 * Attempts to rotate the current piece clockwise.
 * Includes basic wall kick checks (left/right 1).
 * @param {object} currentState - The current game state.
 * @returns {object} - New state if rotation is valid, otherwise the original state.
 */
function rotatePiece(currentState) {
    const { currentPiece, board, isGameOver } = currentState;
    if (!currentPiece || isGameOver) return currentState;

    const pieceDefinition = TETROMINOES[currentPiece.type];
    const currentRotation = currentPiece.rotation;
    const nextRotation = (currentRotation + 1) % pieceDefinition.shapes.length;

    const nextPiece = { ...currentPiece, rotation: nextRotation };

    // 1. Try direct rotation
    if (isPositionValid(nextPiece, board)) {
        return { ...currentState, currentPiece: nextPiece };
    }

    // 2. Try Wall Kick: Shift Left 1
    const nextPieceLeft = { ...nextPiece, x: nextPiece.x - 1 };
    if (isPositionValid(nextPieceLeft, board)) {
        console.log("Wall kick: Rotated left 1");
        return { ...currentState, currentPiece: nextPieceLeft };
    }

    // 3. Try Wall Kick: Shift Right 1
    const nextPieceRight = { ...nextPiece, x: nextPiece.x + 1 };
    if (isPositionValid(nextPieceRight, board)) {
        console.log("Wall kick: Rotated right 1");
        return { ...currentState, currentPiece: nextPieceRight };
    }

    // If all attempts fail, return original state
    console.log("Rotation failed.");
    return currentState;
}


/**
 * Checks a board for completed lines and returns a new board with lines cleared
 * and shifted down, plus the count of lines cleared.
 */
function checkForLineClears(board) {
    let linesCleared = 0;
    const newBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
    let newBoardRow = BOARD_HEIGHT - 1;

    for (let r = BOARD_HEIGHT - 1; r >= 0; r--) {
        const isRowFull = board[r].every(cell => cell !== 0);
        if (isRowFull) {
            linesCleared++;
        } else {
            if (newBoardRow >= 0) {
                 newBoard[newBoardRow] = board[r]; // Copy non-full row
                 newBoardRow--;
            }
        }
    }
    return { board: newBoard, linesCleared: linesCleared };
}


/**
 * Spawns a new piece. Returns the updated game state.
 */
function spawnPiece(currentState) {
    const type = getRandomPieceType();
    const initialX = Math.floor(BOARD_WIDTH / 2) - 1;
    const initialY = 0;
    const newPiece = { type: type, rotation: 0, x: initialX, y: initialY };

    // TODO: Implement Game Over check here:
    // if (!isPositionValid(newPiece, currentState.board)) {
    //     return { ...currentState, currentPiece: newPiece, isGameOver: true };
    // }

    return { ...currentState, currentPiece: newPiece };
}

/**
 * Creates the initial game state, including the first spawned piece.
 */
function getInitialState() {
    const initialBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
    const baseState = {
        board: initialBoard, currentPiece: null, nextPiece: null,
        score: 0, level: 1, isGameOver: false,
    };
    const initialState = spawnPiece(baseState);
    return initialState;
}

/**
 * Locks the current piece onto the board, checks/clears lines, updates score,
 * and spawns the next piece.
 */
function lockPieceAndSpawnNext(currentState) {
    const { currentPiece, board } = currentState;
    if (!currentPiece) return currentState; // Safety check

    // 1. Merge Piece onto Board (Immutable Update)
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
        } else { console.warn(`Warn: Locked block at [${blockRow}, ${blockCol}] out of bounds.`); }
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
        currentPiece: null, // Clear the locked piece
        score: currentState.score + scoreUpdate,
        // TODO: Update level based on lines cleared/score?
    };

    // 5. Spawn the next piece
    const nextState = spawnPiece(stateBeforeSpawn);

    if (linesClearedCount > 0) {
         console.log(`${linesClearedCount} lines cleared! Score +${scoreUpdate}`);
    }
    console.log("Piece Locked. New piece spawned. Current Score:", nextState.score);
    return nextState;
}


// --- P5.js Functions ---

function setup() {
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
        lastDropTime = currentTime;

        // Check if gravity failed -> time to lock!
        if (gameState === stateBeforeGravity && gameState.currentPiece) {
             console.log("DRAW LOOP: Locking piece...");
             gameState = lockPieceAndSpawnNext(gameState); // Update state with result of locking
        }
    } else if (!gameState.currentPiece && !gameState.isGameOver) {
        console.error("Error: No current piece in game state during draw loop!");
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
    // TODO: Draw Score display using gameState.score
    // TODO: Draw Level display using gameState.level
    // TODO: Draw Next Piece Preview
}

// --- Rendering Functions ---

/** Draws a single block with kawaii styling */
function drawBlock(row, col, colorIndex) {
    if (colorIndex === 0) return;
    const blockColor = COLORS[colorIndex] || [128, 128, 128];
    const x = col * BLOCK_SIZE;
    const y = row * BLOCK_SIZE;
    fill(blockColor);
    stroke(BORDER_COLOR);
    strokeWeight(1.5);
    rect(x, y, BLOCK_SIZE, BLOCK_SIZE, 3);
}

/** Draws the game board (background and settled pieces) */
function drawBoard(board) {
    background(COLORS[0]);
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            if (board[r][c] !== 0) { drawBlock(r, c, board[r][c]); }
        }
    }
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


// --- Input Handling ---

/** Handles keyboard input for controlling the piece */
function keyPressed() {
    if (gameState.isGameOver) return;
    let newState = gameState;
    let stateChanged = false;

    if (keyCode === LEFT_ARROW) {
        newState = moveLeft(gameState);
        stateChanged = newState !== gameState;
    } else if (keyCode === RIGHT_ARROW) {
        newState = moveRight(gameState);
        stateChanged = newState !== gameState;
    } else if (keyCode === DOWN_ARROW) {
        newState = moveDown(gameState); // Also resets gravity timer
        stateChanged = newState !== gameState;
        // TODO: Add score for soft drop later
    } else if (keyCode === UP_ARROW) { // Handle rotation
        newState = rotatePiece(gameState);
        stateChanged = newState !== gameState;
    }
    // --- Placeholder for future controls ---
    // else if (key === ' ') { /* Hard Drop */ }
    // else if (key === 'c' || key === 'C') { /* Hold Piece */ }
    // else if (key === 'p' || key === 'P') { /* Pause */ }

    if (stateChanged) {
        gameState = newState;
        console.log("State updated by input:", keyCode);
    }
}

// --- Helper Functions (Logic - To be implemented) ---
// function hardDrop(currentState) { /* ... return updatedState */ }
// function calculateLevel(score) { /* return level */ } // For difficulty scaling
// function updateDropInterval(level) { /* return interval_ms */ } // For difficulty scaling