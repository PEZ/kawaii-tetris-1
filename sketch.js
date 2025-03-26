// --- Constants ---
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30; // pixels

// Simple color definitions for now
const COLORS = {
    0: [240, 240, 240], // Background (empty cell) - Light gray
    1: [255, 105, 180], // Hot Pink (I piece?) - Placeholder for Kawaii colors
    2: [255, 182, 193], // Light Pink (L piece?)
    3: [255, 218, 185], // Peach Puff (O piece?)
    4: [173, 216, 230], // Light Blue (J piece?)
    5: [144, 238, 144], // Light Green (S piece?)
    6: [221, 160, 221], // Plum (T piece?)
    7: [255, 250, 205]  // Lemon Chiffon (Z piece?)
};
const BORDER_COLOR = [100, 100, 100]; // Dark gray for borders

// --- Tetromino Definitions ---
// Shapes are defined as arrays of [row, col] offsets from a pivot point.
// Each shape has multiple rotation states.
// We'll use numbers 1-7 to represent the different types (colors).
const TETROMINOES = {
    'I': {
        color: 1,
        shapes: [
            [[0, -1], [0, 0], [0, 1], [0, 2]], // Rotation 0
            [[-1, 0], [0, 0], [1, 0], [2, 0]], // Rotation 1
            // Define other rotations if needed, or calculate them
        ]
    },
    'L': {
        color: 2,
        shapes: [
            [[0, -1], [0, 0], [0, 1], [1, 1]], // Rotation 0
            // ... other rotations
        ]
    },
    'J': {
        color: 4, // Using Light Blue
        shapes: [
            [[0, -1], [0, 0], [0, 1], [1, -1]], // Rotation 0 - Check convention
             // Corrected J shape: top row -1, 0, 1; bottom row -1 on the left
            [[0, -1], [0, 0], [0, 1], [-1, 1]], // Rotation 0 (Common convention: pivot on the 'bend')
            [[ -1, 0], [0, 0], [1, 0], [1, 1]], // Rotation 1
            [[1, -1], [0,-1], [0, 0], [0, 1]], // Rotation 2
            [[-1, -1], [-1, 0], [0, 0], [1, 0]], // Rotation 3
        ]
    },
    'O': {
        color: 3,
        shapes: [
            [[0, 0], [0, 1], [1, 0], [1, 1]] // Only one rotation needed
        ]
    },
    'S': {
        color: 5,
        shapes: [
            [[0, 0], [0, 1], [1, -1], [1, 0]], // Rotation 0
            // ... other rotations
        ]
    },
    'T': {
        color: 6,
        shapes: [
            [[0, -1], [0, 0], [0, 1], [1, 0]], // Rotation 0
            // ... other rotations
        ]
    },
    'Z': {
        color: 7,
        shapes: [
            [[0, -1], [0, 0], [1, 0], [1, 1]], // Rotation 0
            // ... other rotations
        ]
    }
    // Add definitions for L, S, T, Z, and complete rotations for I, L, J, S, T, Z
};

// --- Game State ---
let gameState;

function getInitialState() {
    const initialBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));

    // TEMPORARY: Define a placeholder piece for drawing tests
    const testPiece = {
        type: 'J', // Or 'I', 'L', 'O', 'S', 'T', 'Z'
        rotation: 0, // Index for the shape array
        x: Math.floor(BOARD_WIDTH / 2) -1, // Board column index (center-ish)
        y: 1 // Board row index (near top)
    };

    return {
        board: initialBoard,
        currentPiece: testPiece, // Use the test piece initially
        nextPiece: null,
        score: 0,
        level: 1,
        isGameOver: false,
    };
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
    // --- 1. Clear background (done within drawBoard now) ---
    // background(245, 245, 245); // Moved to drawBoard

    // --- 2. Update Game Logic ---
    // (Coming soon)

    // --- 3. Render Game State ---
    drawBoard(gameState.board);
    if (gameState.currentPiece) {
        drawPiece(gameState.currentPiece);
    }

    // Draw UI elements (Coming later)
}

// --- Rendering Functions ---

/**
 * Draws a single block at a given board coordinate (row, col)
 * with a specified color index.
 */
function drawBlock(row, col, colorIndex) {
    const blockColor = COLORS[colorIndex] || COLORS[0]; // Default to background if invalid index
    const x = col * BLOCK_SIZE;
    const y = row * BLOCK_SIZE;

    fill(blockColor);
    stroke(BORDER_COLOR); // Draw border
    strokeWeight(1);
    rect(x, y, BLOCK_SIZE, BLOCK_SIZE);
}

/**
 * Draws the entire game board based on the board data.
 * Iterates through the 2D array and calls drawBlock for each cell.
 */
function drawBoard(board) {
    // Draw background / empty cells first
    background(COLORS[0]); // Use color 0 for the main background

    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            const colorIndex = board[r][c];
            // Draw only non-empty blocks from the board state
            if (colorIndex !== 0) {
                drawBlock(r, c, colorIndex);
            } else {
                 // Optional: Draw grid lines for empty cells if desired
                 // fill(COLORS[0]);
                 // stroke(220); // Lighter grid lines
                 // strokeWeight(0.5);
                 // rect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

/**
 * Draws the currently falling piece.
 * Gets the shape definition based on type and rotation,
 * then draws each block of the shape relative to the piece's x, y position.
 */
function drawPiece(piece) {
    if (!piece || !TETROMINOES[piece.type]) {
        console.error("Invalid piece data:", piece);
        return; // Don't draw if piece is null or type is invalid
    }

    const pieceDefinition = TETROMINOES[piece.type];
    const shape = pieceDefinition.shapes[piece.rotation % pieceDefinition.shapes.length]; // Use modulo for safety
    const colorIndex = pieceDefinition.color;

    shape.forEach(offset => {
        const row = piece.y + offset[0];
        const col = piece.x + offset[1];
        drawBlock(row, col, colorIndex);
    });
}


// --- Helper Functions (Logic - To be implemented) ---

// function getRandomPiece() { ... }
// function spawnPiece(currentState) { ... }
// function moveLeft(currentState) { ... }
// function moveRight(currentState) { ... }
// function moveDown(currentState) { ... }
// function rotatePiece(currentState) { ... }
// function isPositionValid(piece, boardData) { ... }