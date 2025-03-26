// --- Constants ---
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30; // pixels

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
// IMPORTANT: Verify these shapes/rotations!
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

// --- Core Game Logic Functions (Data Transformation) ---

/**
 * Returns a random tetromino type key.
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
    if (!piece || !TETROMINOES[piece.type]) return false; // Basic sanity check

    const pieceDefinition = TETROMINOES[piece.type];
    const rotationIndex = piece.rotation % pieceDefinition.shapes.length;
    const shape = pieceDefinition.shapes[rotationIndex];

    if (!shape) return false; // Shape definition missing

    // Check each block of the piece's shape
    for (const offset of shape) {
        const blockRow = piece.y + offset[0];
        const blockCol = piece.x + offset[1];

        // 1. Check boundaries (left, right, bottom)
        if (blockCol < 0 || blockCol >= BOARD_WIDTH || blockRow >= BOARD_HEIGHT) {
            return false; // Out of bounds (left, right, or below bottom)
        }

        // 2. Check collision with settled blocks on the board
        // Only check if the block is within the visible board vertically (row >= 0)
        if (blockRow >= 0) {
            // Ensure board[blockRow] exists before accessing board[blockRow][blockCol]
            if (!board[blockRow] || board[blockRow][blockCol] !== 0) {
                // Collision detected with a non-empty cell
                return false;
            }
        }
        // Note: We allow blocks to be above the top boundary (blockRow < 0) during spawn/movement
    }

    // If all blocks passed the checks, the position is valid
    return true;
}


/**
 * Attempts to move the current piece left.
 * @param {object} currentState - The current game state.
 * @returns {object} - New state if move is valid, otherwise the original state.
 */
function moveLeft(currentState) {
    const { currentPiece, board } = currentState;
    if (!currentPiece) return currentState; // No piece to move

    // Create hypothetical new piece position
    const nextPiece = { ...currentPiece, x: currentPiece.x - 1 };

    // Check if the hypothetical position is valid
    if (isPositionValid(nextPiece, board)) {
        // Return new state with updated piece
        return { ...currentState, currentPiece: nextPiece };
    } else {
        // Return original state if move is invalid
        return currentState;
    }
}

/**
 * Attempts to move the current piece right.
 * @param {object} currentState - The current game state.
 * @returns {object} - New state if move is valid, otherwise the original state.
 */
function moveRight(currentState) {
    const { currentPiece, board } = currentState;
    if (!currentPiece) return currentState;

    const nextPiece = { ...currentPiece, x: currentPiece.x + 1 };

    if (isPositionValid(nextPiece, board)) {
        return { ...currentState, currentPiece: nextPiece };
    } else {
        return currentState;
    }
}

/**
 * Attempts to move the current piece down.
 * @param {object} currentState - The current game state.
 * @returns {object} - New state if move is valid, otherwise the original state.
 */
function moveDown(currentState) {
    const { currentPiece, board } = currentState;
    if (!currentPiece) return currentState;

    const nextPiece = { ...currentPiece, y: currentPiece.y + 1 };

    if (isPositionValid(nextPiece, board)) {
        return { ...currentState, currentPiece: nextPiece };
    } else {
        // If moving down is invalid, it means the piece should lock (or game over)
        // TODO: Implement piece locking logic here or in the main game loop/update function
        // For now, just return the original state
        console.log("Cannot move down, potential lock position reached."); // Placeholder log
        return currentState;
    }
}


/**
 * Spawns a new piece and returns the updated game state.
 * @param {object} currentState The current game state.
 * @returns {object} A new game state object with the new piece.
 */
function spawnPiece(currentState) {
    const type = getRandomPieceType();
    const initialX = Math.floor(BOARD_WIDTH / 2) - 1;
    const initialY = 0; // Adjust if pieces consistently spawn too high/low based on shapes

    const newPiece = { type: type, rotation: 0, x: initialX, y: initialY };

    // TODO: Add game over check: if (!isPositionValid(newPiece, currentState.board)) -> set isGameOver = true
    // For now, assume valid spawn
    return { ...currentState, currentPiece: newPiece };
}

/**
 * Creates the initial game state, including the first spawned piece.
 * @returns {object} The complete initial game state.
 */
function getInitialState() {
    const initialBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
    const baseState = {
        board: initialBoard, currentPiece: null, nextPiece: null,
        score: 0, level: 1, isGameOver: false,
    };
    const initialState = spawnPiece(baseState);
    // TODO: Implement 'nextPiece' generation
    return initialState;
}


// --- P5.js Functions ---
function setup() {
    createCanvas(BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
    console.log("Canvas created:", width, "x", height);
    gameState = getInitialState();
    console.log("Initial game state:", gameState);
    frameRate(60);
}

function draw() {
    // --- 1. Update Game Logic ---
    // (Gravity will call moveDown periodically - coming soon)

    // --- 2. Render Game State ---
    drawBoard(gameState.board);
    if (gameState.currentPiece) {
        drawPiece(gameState.currentPiece);
    }
    // Draw UI elements (Score, etc. - coming later)
}

// --- Rendering Functions ---

/** Draws a single block */
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

/** Draws the game board */
function drawBoard(board) {
    background(COLORS[0]);
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            if (board[r][c] !== 0) {
                drawBlock(r, c, board[r][c]);
            }
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

/**
 * Handles keyboard input for moving the piece.
 * Called automatically by p5.js when a key is pressed.
 */
function keyPressed() {
    if (gameState.isGameOver) return; // Don't handle input if game is over

    let newState = gameState; // Start with the current state

    // Use p5.js key codes
    if (keyCode === LEFT_ARROW) {
        newState = moveLeft(gameState);
    } else if (keyCode === RIGHT_ARROW) {
        newState = moveRight(gameState);
    } else if (keyCode === DOWN_ARROW) {
        newState = moveDown(gameState);
        // Optional: Add scoring for manual downward movement later
    }
    // else if (keyCode === UP_ARROW) {
    //     newState = rotatePiece(gameState); // Rotation TBD
    // }
    // else if (key === ' ') {
    //     // Hard drop TBD
    // }

    // Update the global game state ONLY if it changed
    if (newState !== gameState) {
         gameState = newState;
         console.log("State updated by input:", keyCode); // Log for debugging
    }
}

// --- Helper Functions (Logic - To be implemented) ---

// function rotatePiece(currentState) { /* return updatedState */ }
// function lockPieceAndClearLines(currentState) { /* return updatedState */ }
// function updateGame(currentState) { /* Handles gravity, locking, clearing, etc. */ }