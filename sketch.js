// --- Constants ---
const BOARD_WIDTH = 10; // Width of the board in blocks
const BOARD_HEIGHT = 20; // Height of the board in blocks
const BLOCK_SIZE = 30; // Size of each block in pixels

// --- Game State ---
// Using 'let' because the entire gameState object will be replaced
// on updates, following functional principles (immutability).
let gameState;

// Function to create the initial state of the game
function getInitialState() {
    // Create an empty board (2D array filled with 0s)
    // 0 represents an empty cell
    const initialBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));

    return {
        board: initialBoard,      // The main grid
        currentPiece: null,       // The piece currently falling (will be set later)
        nextPiece: null,          // The upcoming piece (for preview)
        score: 0,                 // Player's score
        level: 1,                 // Game level (affects speed)
        isGameOver: false,        // Flag to check if the game has ended
        // We can add more state properties here as needed (e.g., piece position, rotation)
    };
}


// --- P5.js Functions ---

// setup() runs once when the sketch starts
function setup() {
    // Create the canvas where the game will be drawn
    createCanvas(BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
    console.log("Canvas created:", width, "x", height);

    // Initialize the game state
    gameState = getInitialState();
    console.log("Initial game state:", gameState);

    // Configure p5.js settings
    frameRate(60); // Set desired frame rate
    // noLoop(); // Uncomment this if you want to pause execution after setup for debugging
}

// draw() runs continuously in a loop
function draw() {
    // --- 1. Clear the background ---
    background(245, 245, 245); // A light, neutral background

    // --- 2. Update Game Logic ---
    // (This is where gravity, input handling consequences, etc., will go later)
    // For now, we'll just have the rendering part.

    // --- 3. Render Game State ---
    // Draw the game board based on the current gameState.board
    // (We'll implement drawBoard next)
    // drawBoard(gameState.board);

    // Draw the currently falling piece based on gameState.currentPiece
    // (We'll implement drawPiece next)
    // drawPiece(gameState.currentPiece);

    // Draw UI elements (score, next piece, etc.)
    // (To be implemented later)

    // --- Temp: Placeholder text ---
    fill(50);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Kawaii Tetris - Setup Complete!", width / 2, height / 2);
    // --- End Temp ---
}

// --- Helper Functions (To be implemented) ---

// function drawBoard(board) {
//   // Implementation coming soon...
// }

// function drawPiece(piece) {
//   // Implementation coming soon...
// }

// function moveLeft(currentState) {
//   // Implementation coming soon...
//   // Should return a NEW state object
// }

// function moveRight(currentState) {
//   // Implementation coming soon...
//   // Should return a NEW state object
// }

// function moveDown(currentState) {
//    // Implementation coming soon...
//    // Should return a NEW state object
// }

// function rotatePiece(currentState) {
//    // Implementation coming soon...
//    // Should return a NEW state object
// }

// ... and so on for other logic functions