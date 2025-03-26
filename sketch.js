// --- Constants ---
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30;
const INITIAL_DROP_INTERVAL = 1000; // Milliseconds per row drop (1 second)

// SUPER KAWAII Color definitions! ✨💖🍬
const COLORS = { /* ... colors remain the same ... */ };
const BORDER_COLOR = [120, 100, 110];

// --- Tetromino Definitions ---
const TETROMINOES = { /* ... definitions remain the same ... */ };
const PIECE_TYPES = Object.keys(TETROMINOES);

// --- Game State ---
let gameState;
let lastDropTime = 0; // Track time for gravity
let currentDropInterval = INITIAL_DROP_INTERVAL; // Allow changing speed later

// --- Core Game Logic Functions (Data Transformation) ---

// ... (getRandomPieceType, isPositionValid remain the same) ...

/**
 * Attempts to move the current piece left.
 */
function moveLeft(currentState) {
    const { currentPiece, board } = currentState;
    if (!currentPiece || currentState.isGameOver) return currentState;
    const nextPiece = { ...currentPiece, x: currentPiece.x - 1 };
    return isPositionValid(nextPiece, board) ? { ...currentState, currentPiece: nextPiece } : currentState;
}

/**
 * Attempts to move the current piece right.
 */
function moveRight(currentState) {
    const { currentPiece, board } = currentState;
    if (!currentPiece || currentState.isGameOver) return currentState;
    const nextPiece = { ...currentPiece, x: currentPiece.x + 1 };
    return isPositionValid(nextPiece, board) ? { ...currentState, currentPiece: nextPiece } : currentState;
}

/**
 * Attempts to move the current piece down (used by player input).
 * Also resets the gravity timer if successful.
 */
function moveDown(currentState) {
    const { currentPiece, board } = currentState;
    if (!currentPiece || currentState.isGameOver) return currentState;

    const nextPiece = { ...currentPiece, y: currentPiece.y + 1 };

    if (isPositionValid(nextPiece, board)) {
        // Move was valid, return new state and reset gravity timer
        lastDropTime = millis(); // Reset timer on manual down move
        return { ...currentState, currentPiece: nextPiece };
    } else {
        // If moving down is invalid, player action doesn't lock the piece,
        // but gravity will handle it soon. Just return original state.
        return currentState;
    }
}

/**
 * Handles the automatic downward movement due to gravity.
 * Separated from player-controlled moveDown.
 * @param {object} currentState
 * @returns {object} New state if moved, original state if needs locking.
 */
function applyGravity(currentState) {
    const { currentPiece, board } = currentState;
    if (!currentPiece || currentState.isGameOver) return currentState;

    const nextPiece = { ...currentPiece, y: currentPiece.y + 1 };

    if (isPositionValid(nextPiece, board)) {
        // Gravity move successful
        return { ...currentState, currentPiece: nextPiece };
    } else {
        // Gravity move failed - piece should lock
        console.log("Gravity: Piece needs to lock!"); // Placeholder log
        // Trigger locking logic (returns state *after* locking and spawning next)
        // return lockPieceAndSpawnNext(currentState); // << Future implementation
        return currentState; // For now, return original state (piece stops falling)
    }
}


/**
 * Spawns a new piece.
 */
function spawnPiece(currentState) {
    // ... (spawnPiece logic remains the same) ...
    const type = getRandomPieceType();
    const initialX = Math.floor(BOARD_WIDTH / 2) - 1;
    const initialY = 0;
    const newPiece = { type: type, rotation: 0, x: initialX, y: initialY };

    // TODO: Game Over check: if (!isPositionValid(newPiece, currentState.board)) ...
    return { ...currentState, currentPiece: newPiece };
}

/**
 * Creates the initial game state.
 */
function getInitialState() {
    // ... (getInitialState logic remains the same) ...
    const initialBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
    const baseState = {
        board: initialBoard, currentPiece: null, nextPiece: null,
        score: 0, level: 1, isGameOver: false,
    };
    return spawnPiece(baseState);
}


// --- P5.js Functions ---
function setup() {
    createCanvas(BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
    // Place canvas inside the container div
    const canvas = createCanvas(BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
    canvas.parent('canvas-container'); // Attach canvas to the main element

    console.log("Canvas created:", width, "x", height);
    gameState = getInitialState();
    console.log("Initial game state:", gameState);
    lastDropTime = millis(); // Initialize gravity timer
    frameRate(30); // Lower frame rate slightly? Optional.
}

function draw() {
    // --- 1. Handle Timing and Game Logic Update ---
    const currentTime = millis();

    // Check if it's time for gravity to apply
    if (!gameState.isGameOver && currentTime - lastDropTime > currentDropInterval) {
        const stateBeforeGravity = gameState;
        gameState = applyGravity(gameState);
        lastDropTime = currentTime; // Reset timer *after* attempting gravity

        // Check if gravity failed (piece needs to lock)
        // This check assumes applyGravity returns the *same object* if locking is needed
        // (or alternatively, sets a flag in the returned state)
        if (gameState === stateBeforeGravity && gameState.currentPiece) {
             // applyGravity tried to move down but couldn't.
             // This means the piece hit something. Time to lock!
             console.log("DRAW LOOP: Triggering Lock Sequence (TBD)");
             // gameState = lockPieceAndSpawnNext(gameState); // << Future implementation
        }
    }

    // --- 2. Render Game State ---
    drawBoard(gameState.board);
    if (gameState.currentPiece) {
        drawPiece(gameState.currentPiece);
    }

    // Display Game Over message if applicable
    if (gameState.isGameOver) {
        fill(0, 0, 0, 150); // Semi-transparent black overlay
        rect(0, 0, width, height);
        fill(255, 100, 100); // Red text
        textSize(32);
        textAlign(CENTER, CENTER);
        textFont('Nunito'); // Ensure font is applied here too
        text("GAME OVER", width / 2, height / 2);
    }
    // Draw other UI elements (Score, etc. - coming later)
}

// --- Rendering Functions ---
// ... (drawBlock, drawBoard, drawPiece remain the same) ...

// --- Input Handling ---
function keyPressed() {
    if (gameState.isGameOver) return;

    let newState = gameState; // Start with the current state
    let stateChanged = false; // Track if player input did something

    if (keyCode === LEFT_ARROW) {
        newState = moveLeft(gameState);
        stateChanged = newState !== gameState;
    } else if (keyCode === RIGHT_ARROW) {
        newState = moveRight(gameState);
        stateChanged = newState !== gameState;
    } else if (keyCode === DOWN_ARROW) {
        newState = moveDown(gameState); // moveDown now also resets timer
        stateChanged = newState !== gameState;
        // Optional: Add scoring for manual downward movement later
    }
    // ... (other keys like UP_ARROW for rotation later) ...

    // Update the global game state ONLY if it changed
    if (stateChanged) {
         gameState = newState;
         console.log("State updated by input:", keyCode);
    }
}

// --- Helper Functions (Logic - To be implemented) ---

// function lockPieceAndSpawnNext(currentState) { /* ... return updatedState */ }
// function rotatePiece(currentState) { /* return updatedState */ }
// function updateGame(currentState) { /* Main update loop combining logic */ }