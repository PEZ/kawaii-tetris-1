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

/**
 * Returns a random tetromino type key (e.g., 'I', 'L', 'T').
 * Pure function (assuming Math.random is acceptable).
 */
function getRandomPieceType() {
    const randomIndex = Math.floor(Math.random() * PIECE_TYPES.length);
    return PIECE_TYPES[randomIndex];
}

/**
 * Checks if a given piece position/rotation is valid on the board.
 * @param {object} piece - The piece object { type, rotation, x, y }.
 * @param {Array<Array<number>>} board - The game board data.
 * @returns {boolean} - True if the position is valid, false otherwise.
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
        console.log("Gravity: Piece needs to lock!"); // Placeholder log
        // In the future, this will trigger locking & spawning next piece
        // return lockPieceAndSpawnNext(currentState);
        return currentState; // For now, piece just stops falling
    }
}


/**
 * Spawns a new piece. Returns the updated game state.
 */
function spawnPiece(currentState) {
    const type = getRandomPieceType();
    const initialX = Math.floor(BOARD_WIDTH / 2) - 1;
    const initialY = 0; // Adjust if needed based on shape definitions
    const newPiece = { type: type, rotation: 0, x: initialX, y: initialY };

    // TODO: Implement Game Over check here:
    // if (!isPositionValid(newPiece, currentState.board)) {
    //     return { ...currentState, currentPiece: newPiece, isGameOver: true }; // Keep piece for render, but flag game over
    // }

    // Return new state with the spawned piece
    return { ...currentState, currentPiece: newPiece };
}

/**
 * Creates the initial game state, including the first spawned piece.
 */
function getInitialState() {
    const initialBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
    const baseState = {
        board: initialBoard,
        currentPiece: null,
        nextPiece: null, // TODO: Implement next piece queue
        score: 0,
        level: 1,
        isGameOver: false,
    };
    // Spawn the first piece into the base state
    const initialState = spawnPiece(baseState);
    // TODO: Implement 'nextPiece' generation here as well
    return initialState;
}


// --- P5.js Functions ---

function setup() {
    // Create canvas normally - p5 will append it to the body by default
    createCanvas(BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
    console.log("Canvas created:", width, "x", height);

    // Initialize the game state
    gameState = getInitialState();

    // Confirm piece exists after initialization
    if (gameState && gameState.currentPiece) {
        console.log("Initial state created. Piece type:", gameState.currentPiece.type);
    } else {
        console.error("Initial state creation failed or has no piece!");
        // Optionally set a dummy piece to prevent immediate errors, though spawn should work
        // gameState.currentPiece = { type: 'T', rotation: 0, x: 4, y: 0 }; // Example fallback
    }

    // Initialize gravity timer
    lastDropTime = millis();
    // Set frame rate (30 is often fine for Tetris)
    frameRate(30);
}

function draw() {
    // --- 1. Handle Timing and Game Logic Update ---
    const currentTime = millis();

    // Apply gravity if enough time has passed and game is running
    if (!gameState.isGameOver && gameState.currentPiece && currentTime - lastDropTime > currentDropInterval) {
        const stateBeforeGravity = gameState;
        gameState = applyGravity(gameState);
        lastDropTime = currentTime; // Reset timer

        // Check if gravity resulted in a state where locking is needed
        // (This simple check works because applyGravity returns the *same object instance* if it couldn't move)
        if (gameState === stateBeforeGravity && gameState.currentPiece) {
             console.log("DRAW LOOP: Triggering Lock Sequence (TBD)");
             // In the future, call the locking function:
             // gameState = lockPieceAndSpawnNext(gameState);
        }
    } else if (!gameState.currentPiece && !gameState.isGameOver) {
        // Safety check: Log if piece mysteriously disappears
        console.error("Error: No current piece in game state during draw loop!");
    }

    // --- 2. Render Game State ---
    drawBoard(gameState.board); // Draw the background and settled pieces

    // Draw the currently falling piece if it exists
    if (gameState.currentPiece) {
        // You can uncomment this for debugging piece position:
        // console.log(`DEBUG: Drawing piece type ${gameState.currentPiece.type} at y=${gameState.currentPiece.y}`);
        drawPiece(gameState.currentPiece);
    } else {
        // You can uncomment this for debugging:
        // console.log("DEBUG: No currentPiece to draw.");
    }

    // Display Game Over overlay if applicable
    if (gameState.isGameOver) {
        fill(0, 0, 0, 150); // Semi-transparent black overlay
        rect(0, 0, width, height);
        fill(255, 100, 100); // Red text
        textSize(32);
        textAlign(CENTER, CENTER);
        textFont('Nunito'); // Ensure font is applied
        text("GAME OVER 😭", width / 2, height / 2); // Added emoji!
    }
    // Draw other UI elements (Score, Level, Next Piece - TBD)
}

// --- Rendering Functions ---

/**
 * Draws a single block at a given board coordinate (row, col)
 * with a specified color index. Includes kawaii styling.
 */
function drawBlock(row, col, colorIndex) {
    // Don't draw anything for empty cells (index 0)
    if (colorIndex === 0) return;

    // Fallback color for safety, though all pieces should have valid colors
    const blockColor = COLORS[colorIndex] || [128, 128, 128];
    const x = col * BLOCK_SIZE;
    const y = row * BLOCK_SIZE;

    fill(blockColor); // Use the kawaii color
    stroke(BORDER_COLOR); // Use the kawaii border color
    strokeWeight(1.5); // Slightly thicker border
    rect(x, y, BLOCK_SIZE, BLOCK_SIZE, 3); // Added slight corner rounding
}

/**
 * Draws the entire game board (background and settled pieces).
 */
function drawBoard(board) {
    // Draw background color covering the whole canvas
    background(COLORS[0]);

    // Draw settled blocks stored in the board state
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            const colorIndex = board[r][c];
            if (colorIndex !== 0) { // Only draw blocks that are part of the settled state
                drawBlock(r, c, colorIndex);
            }
            // Optional: Draw grid lines for debugging/styling
            // else { stroke(220); strokeWeight(0.5); noFill(); rect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE); }
        }
    }
}

/**
 * Draws the currently falling piece based on its state.
 */
function drawPiece(piece) {
    // Basic safety checks
    if (!piece || !TETROMINOES[piece.type]) return;

    const pieceDefinition = TETROMINOES[piece.type];
    // Ensure rotation index is valid
    const rotationIndex = piece.rotation % pieceDefinition.shapes.length;
    const shape = pieceDefinition.shapes[rotationIndex];

    if (!shape) { // Safety check for missing shape definition
         console.error(`Invalid shape for piece type ${piece.type} at rotation ${rotationIndex}`);
         return;
    }

    const colorIndex = pieceDefinition.color;

    // Iterate through the blocks defined in the shape's offsets
    shape.forEach(offset => {
        // Calculate the absolute board row and column for this block part
        const blockRow = piece.y + offset[0];
        const blockCol = piece.x + offset[1];

        // Call drawBlock to handle the actual drawing at the calculated position
        drawBlock(blockRow, blockCol, colorIndex);
    });
}


// --- Input Handling ---

/**
 * Handles keyboard input for moving the piece.
 * Called automatically by p5.js when a key is pressed.
 */
function keyPressed() {
    // Ignore input if game is over
    if (gameState.isGameOver) return;

    let newState = gameState; // Start with the current state
    let stateChanged = false; // Track if player input resulted in a change

    // Handle movement keys using p5.js keyCode constants
    if (keyCode === LEFT_ARROW) {
        newState = moveLeft(gameState);
        stateChanged = newState !== gameState;
    } else if (keyCode === RIGHT_ARROW) {
        newState = moveRight(gameState);
        stateChanged = newState !== gameState;
    } else if (keyCode === DOWN_ARROW) {
        // Player manually moves piece down (also resets gravity timer via moveDown function)
        newState = moveDown(gameState);
        stateChanged = newState !== gameState;
        // TODO: Add scoring for manual downward movement (soft drop score) later
    }
    // --- Placeholder for future controls ---
    // else if (keyCode === UP_ARROW) {
    //     // newState = rotatePiece(gameState); // Implement rotation logic
    //     // stateChanged = newState !== gameState;
    // }
    // else if (key === ' ') { // Space bar for hard drop
    //     // newState = hardDrop(gameState); // Implement hard drop logic
    //     // stateChanged = newState !== gameState;
    // }
    // else if (key === 'p' || key === 'P') { // Example pause key
    //     // Toggle pause state (TBD)
    // }

    // Update the global game state ONLY if the input caused a change
    if (stateChanged) {
         gameState = newState;
         console.log("State updated by input:", keyCode); // Log for debugging
    }
}

// --- Helper Functions (Logic - To be implemented) ---

/**
 * Locks the current piece onto the board, checks for line clears,
 * and spawns the next piece. Returns the updated game state.
 */
// function lockPieceAndSpawnNext(currentState) {
//     // 1. Merge currentPiece onto board data
//     // 2. Check for and clear completed lines (update board, score, level)
//     // 3. Spawn the next piece (using spawnPiece)
//     // 4. Handle Game Over condition if spawn fails
//     // Return the fully updated state
// }

/**
 * Rotates the current piece. Returns new state or original state.
 * Needs to handle wall kicks (SRS).
 */
// function rotatePiece(currentState) { /* ... return updatedState */ }

/**
 * Instantly moves the piece down until it locks (Hard Drop).
 */
// function hardDrop(currentState) { /* ... return updatedState */ }

/**
 * Optional: A main update function called once per frame (or on timer)
 * to orchestrate gravity, locking, clearing, etc.
 */
// function updateGame(currentState) { /* ... return updatedState */ }