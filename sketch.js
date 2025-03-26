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
    // Feel free to tweak these hex/RGB values!
};
const BORDER_COLOR = [120, 100, 110]; // A slightly muted purple/gray border

// --- Tetromino Definitions ---
// Shapes defined via [row, col] offsets relative to pivot.
// IMPORTANT: Verify these against a standard like SRS (Super Rotation System)
// if precise Tetris behavior (like wall kicks) is desired later.
// Pivot point assumed to be near the center of the 3x3 or 4x4 grid the piece occupies.
const TETROMINOES = {
    'I': {
        color: 1, // Cyan
        shapes: [
            [[1, -1], [1, 0], [1, 1], [1, 2]], // Rotation 0 (Horizontal)
            [[-1, 1], [0, 1], [1, 1], [2, 1]], // Rotation 1 (Vertical)
            [[2, -1], [2, 0], [2, 1], [2, 2]], // Rotation 2 (Horizontal - check SRS offsets)
            [[-1, 0], [0, 0], [1, 0], [2, 0]], // Rotation 3 (Vertical - check SRS offsets)
        ]
    },
    'L': {
        color: 2, // Orange
        shapes: [
            [[0, -1], [1, -1], [1, 0], [1, 1]], // Rotation 0
            [[0, 0], [1, 0], [2, 0], [0, 1]],   // Rotation 1
            [[1, -1], [1, 0], [1, 1], [2, 1]],   // Rotation 2
            [[2, -1], [0, 0], [1, 0], [2, 0]],   // Rotation 3
        ]
    },
    'J': {
        color: 4, // Blue
        shapes: [
            [[0, 1], [1, -1], [1, 0], [1, 1]], // Rotation 0
            [[0, 0], [1, 0], [2, 0], [2, -1]], // Rotation 1
            [[1, -1], [1, 0], [1, 1], [2, -1]], // Rotation 2
            [[0, 0], [0, 1], [1, 0], [2, 0]],   // Rotation 3
        ]
    },
    'O': {
        color: 3, // Yellow
        shapes: [ // Only one rotation state needed
            [[0, 0], [0, 1], [1, 0], [1, 1]]
        ]
    },
    'S': {
        color: 5, // Green
        shapes: [
            [[0, 0], [0, 1], [1, -1], [1, 0]], // Rotation 0
            [[0, 0], [1, 0], [1, 1], [2, 1]], // Rotation 1
            [[2, 0], [2, 1], [1, -1], [1, 0]], // Rotation 2 (Check SRS) - Often same as 0
            [[0, -1], [1, -1], [1, 0], [2, 0]], // Rotation 3 (Check SRS) - Often same as 1
        ]
    },
    'T': {
        color: 6, // Purple
        shapes: [
            [[0, 0], [1, -1], [1, 0], [1, 1]], // Rotation 0
            [[0, 0], [1, 0], [1, 1], [2, 0]],   // Rotation 1
            [[1, -1], [1, 0], [1, 1], [2, 0]],   // Rotation 2
            [[0, 0], [1, -1], [1, 0], [2, 0]],   // Rotation 3
        ]
    },
    'Z': {
        color: 7, // Red
        shapes: [
            [[0, -1], [0, 0], [1, 0], [1, 1]], // Rotation 0
            [[0, 1], [1, 0], [1, 1], [2, 0]],   // Rotation 1
            [[1, -1], [1, 0], [2, 0], [2, 1]],   // Rotation 2 (Check SRS) - Often same as 0
            [[0, 0], [1, -1], [1, 0], [2, -1]], // Rotation 3 (Check SRS) - Often same as 1
        ]
    }
};

const PIECE_TYPES = Object.keys(TETROMINOES); // Array of types: ['I', 'L', 'J', ...]

// --- Game State ---
let gameState;

// --- Core Game Logic Functions (Data Transformation) ---

/**
 * Returns a random tetromino type key (e.g., 'I', 'L', 'T').
 * Pure function (assuming Math.random is acceptable for this context).
 */
function getRandomPieceType() {
    const randomIndex = Math.floor(Math.random() * PIECE_TYPES.length);
    return PIECE_TYPES[randomIndex];
}

/**
 * Spawns a new piece and returns the updated game state.
 * @param {object} currentState The current game state.
 * @returns {object} A new game state object with the new piece.
 */
function spawnPiece(currentState) {
    const type = getRandomPieceType();
    // Standard Tetris spawn position: Center horizontally, pivot near top.
    // Adjust x based on BOARD_WIDTH, y usually 0 or -1 depending on piece shapes/pivot.
    const initialX = Math.floor(BOARD_WIDTH / 2) - 1; // Adjust if pivot isn't centered in a 3-wide box
    const initialY = 0; // Assuming shapes are defined such that y=0 is appropriate start

    const newPiece = {
        type: type,
        rotation: 0, // Initial rotation state
        x: initialX,
        y: initialY
    };

    // Return a *new* state object, copying existing state and updating currentPiece
    return {
        ...currentState, // Copy all properties from the current state
        currentPiece: newPiece // Replace currentPiece with the new one
    };
    // TODO: Add game over check here later: if newPiece collides immediately, set isGameOver flag
}

/**
 * Creates the initial game state, including the first spawned piece.
 * @returns {object} The complete initial game state.
 */
function getInitialState() {
    const initialBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));

    // Create the base state without a piece first
    const baseState = {
        board: initialBoard,
        currentPiece: null, // Will be set by spawnPiece
        nextPiece: null, // TODO: Implement next piece generation
        score: 0,
        level: 1,
        isGameOver: false,
    };

    // Spawn the first piece into the base state
    const initialState = spawnPiece(baseState);

    // TODO: Implement logic to generate and store the 'nextPiece' as well
    // For example:
    // const nextType = getRandomPieceType();
    // const stateWithNext = { ...initialState, nextPiece: { type: nextType, ... } };
    // return stateWithNext;

    return initialState;
}


// --- P5.js Functions ---
function setup() {
    createCanvas(BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
    console.log("Canvas created:", width, "x", height);
    gameState = getInitialState();
    console.log("Initial game state:", gameState);
    frameRate(60); // Target frame rate
}

function draw() {
    // --- 1. Update Game Logic ---
    // (Gravity, input handling results - coming soon)
    // gameState = updateGame(gameState); // Conceptual: Future refactor

    // --- 2. Render Game State ---
    drawBoard(gameState.board);
    if (gameState.currentPiece) {
        drawPiece(gameState.currentPiece);
    }
    // Draw UI elements (Score, next piece, etc. - coming later)
    // drawUI(gameState); // Conceptual
}

// --- Rendering Functions ---

/**
 * Draws a single block at a given board coordinate (row, col)
 * with a specified color index.
 */
function drawBlock(row, col, colorIndex) {
    if (colorIndex === 0) return;

    const blockColor = COLORS[colorIndex] || [128, 128, 128]; // Gray fallback
    const x = col * BLOCK_SIZE;
    const y = row * BLOCK_SIZE;

    fill(blockColor);
    stroke(BORDER_COLOR);
    strokeWeight(1.5); // Slightly thicker border can look nice
    rect(x, y, BLOCK_SIZE, BLOCK_SIZE, 3); // Added slight rounding
}

/**
 * Draws the entire game board based on the board data.
 */
function drawBoard(board) {
    background(COLORS[0]);

    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            const colorIndex = board[r][c];
            if (colorIndex !== 0) {
                drawBlock(r, c, colorIndex);
            }
            // Optional: Draw grid lines for debugging/styling
            // else {
            //     stroke(220); strokeWeight(0.5); noFill();
            //     rect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            // }
        }
    }
}

/**
 * Draws the currently falling piece.
 */
function drawPiece(piece) {
    if (!piece || !TETROMINOES[piece.type]) {
        // console.error("Invalid or missing piece data in drawPiece:", piece);
        // Reduce console spam, maybe only log once or use a debug flag
        return;
    }

    const pieceDefinition = TETROMINOES[piece.type];
    const rotationIndex = piece.rotation % pieceDefinition.shapes.length;
    const shape = pieceDefinition.shapes[rotationIndex];

    if (!shape) {
         console.error(`Invalid shape for piece type ${piece.type} at rotation ${rotationIndex}`);
         return;
    }

    const colorIndex = pieceDefinition.color;

    shape.forEach(offset => {
        const blockRow = piece.y + offset[0];
        const blockCol = piece.x + offset[1];

        // Draw the block - drawBlock handles positioning and styling
        // We only need to calculate the logical row/col
        drawBlock(blockRow, blockCol, colorIndex);
    });
}


// --- Input Handling (Coming Soon) ---
// function keyPressed() {
//    let newState = gameState; // Start with current state
//    if (keyCode === LEFT_ARROW) {
//        newState = moveLeft(gameState);
//    } else if (keyCode === RIGHT_ARROW) {
//        newState = moveRight(gameState);
//    } else if (keyCode === DOWN_ARROW) {
//        newState = moveDown(gameState);
//    } else if (keyCode === UP_ARROW) { // Example for rotation
//        newState = rotatePiece(gameState);
//    }
//    gameState = newState; // Update the global state
// }


// --- Helper Functions (Logic - To be implemented) ---

// function moveLeft(currentState) { /* return updatedState */ }
// function moveRight(currentState) { /* return updatedState */ }
// function moveDown(currentState) { /* return updatedState */ }
// function rotatePiece(currentState) { /* return updatedState */ }
// function isPositionValid(piece, boardData) { /* return boolean */ }
// function lockPieceAndClearLines(currentState) { /* return updatedState */ }