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
const COLORS = { /* ... remains the same ... */ };
const BORDER_COLOR = [120, 100, 110];

// --- Tetromino Definitions ---
const TETROMINOES = { /* ... remains the same ... */ };
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
function isPositionValid(piece, board) { /* ... remains the same ... */ }
/** Attempts to move the current piece left */
function moveLeft(currentState) { /* ... remains the same ... */ }
/** Attempts to move the current piece right */
function moveRight(currentState) { /* ... remains the same ... */ }
/** Attempts to move the current piece down (player input) */
function moveDown(currentState) { /* ... remains the same ... */ }
/** Handles the automatic downward movement due to gravity */
function applyGravity(currentState) { /* ... remains the same ... */ }
/** Attempts to rotate the current piece clockwise */
function rotatePiece(currentState) { /* ... remains the same ... */ }
/** Checks a board for completed lines */
function checkForLineClears(board) { /* ... remains the same ... */ }


/**
 * Spawns the *next* piece (which was stored in gameState.nextPieceType)
 * and generates a new random type for the *following* piece.
 * Assumes it's being called when gameState.currentPiece is null.
 * @param {object} currentState - State *before* spawning.
 * @returns {object} State with the new currentPiece and new nextPieceType.
 */
function spawnNextPieceAndUpdateQueue(currentState) {
    const typeToSpawn = currentState.nextPieceType; // Get the type that was waiting
    if (!typeToSpawn) {
        console.error("Spawn error: nextPieceType is missing!");
        return currentState; // Avoid error if queue wasn't initialized
    }

    const initialX = Math.floor(BOARD_WIDTH / 2) - 1;
    const initialY = 0;
    const newCurrentPiece = { type: typeToSpawn, rotation: 0, x: initialX, y: initialY };

    // Generate the *following* piece type for the preview
    const newNextPieceType = getRandomPieceType();

    // Check for Game Over: If the newly spawned piece is immediately invalid
    if (!isPositionValid(newCurrentPiece, currentState.board)) {
        console.log("GAME OVER detected during spawn!");
        return {
            ...currentState,
            currentPiece: newCurrentPiece, // Keep piece to render its final position
            nextPieceType: newNextPieceType, // Still update queue
            isGameOver: true // Set game over flag
        };
    }

    // Return new state with the spawned piece and the next piece type updated
    return {
        ...currentState,
        currentPiece: newCurrentPiece,
        nextPieceType: newNextPieceType
    };
}

/**
 * Creates the initial game state, including the first piece and the next piece type.
 */
function getInitialState() {
    const initialBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
    const firstNextType = getRandomPieceType(); // Generate the type for the *first* piece

    const baseState = {
        board: initialBoard,
        currentPiece: null, // Will be set by spawnNextPieceAndUpdateQueue
        nextPieceType: firstNextType, // Store the type for the first piece
        score: 0,
        level: 1,
        isGameOver: false,
    };

    // Call spawn function to place the first piece and generate the *second* piece type
    const initialState = spawnNextPieceAndUpdateQueue(baseState);
    console.log("Initial State - First piece:", initialState.currentPiece?.type, "Next piece:", initialState.nextPieceType);
    return initialState;
}

/**
 * Locks the current piece, checks/clears lines, updates score,
 * and spawns the next piece using the queue.
 */
function lockPieceAndSpawnNext(currentState) {
    const { currentPiece, board } = currentState;
    if (!currentPiece) return currentState; // Safety check

    // 1. Merge Piece onto Board
    const newBoardBeforeClear = board.map(row => [...row]);
    // ... (merging logic remains the same) ...
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
        currentPiece: null, // CRITICAL: Clear the current piece before spawning
        score: currentState.score + scoreUpdate,
        // nextPieceType remains from previous state - it's what we will spawn now
        // TODO: Update level based on lines cleared/score?
    };

    // 5. Spawn the next piece using the queue logic
    const nextState = spawnNextPieceAndUpdateQueue(stateBeforeSpawn); // Use the updated spawn function

    if (linesClearedCount > 0) {
         console.log(`${linesClearedCount} lines cleared! Score +${scoreUpdate}`);
    }
    console.log("Piece Locked. New piece spawned. Current Score:", nextState.score);
    return nextState;
}


// --- P5.js Functions ---

function setup() {
    // Use new canvas dimensions
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    console.log("Canvas created:", width, "x", height);

    gameState = getInitialState(); // Initialize state (now includes nextPieceType)
    if (!gameState || !gameState.currentPiece || !gameState.nextPieceType) { console.error("Initial state creation failed!"); }
    else { console.log("Initial state created."); }

    lastDropTime = millis();
    frameRate(30);
    textFont('Nunito'); // Set default font
}

function draw() {
    // --- 1. Handle Timing and Game Logic Update ---
    const currentTime = millis();
    if (!gameState.isGameOver && gameState.currentPiece && currentTime - lastDropTime > currentDropInterval) {
        const stateBeforeGravity = gameState;
        gameState = applyGravity(gameState);
        lastDropTime = currentTime;
        if (gameState === stateBeforeGravity && gameState.currentPiece) {
             console.log("DRAW LOOP: Locking piece...");
             gameState = lockPieceAndSpawnNext(gameState); // Update state with result of locking
        }
    } else if (!gameState.currentPiece && !gameState.isGameOver) {
        console.error("Error: No current piece in game state during draw loop!");
        // If this happens, maybe the game should end or attempt a recovery spawn?
        // gameState = spawnNextPieceAndUpdateQueue(gameState); // Be cautious
    }

    // --- 2. Render Game State ---
    background(COLORS[0]); // Clear entire canvas with background color

    // Draw the board in its designated area
    push(); // Isolate board drawing transformations
    translate(BOARD_X_OFFSET, BOARD_Y_OFFSET); // Position the board
    drawBoard(gameState.board); // Draw background and settled pieces
    if (gameState.currentPiece) { // Draw falling piece relative to board
        drawPiece(gameState.currentPiece);
    }
    pop(); // Restore drawing context

    // Draw UI elements in their area
    push();
    translate(UI_X_OFFSET, BOARD_Y_OFFSET); // Position the UI area
    drawUI(gameState.score, gameState.nextPieceType);
    pop();


    // --- 3. Render Game Over Overlay ---
    if (gameState.isGameOver) {
        fill(0, 0, 0, 170); // Darker overlay
        rect(0, 0, width, height);
        fill(255, 80, 80); textSize(40); textAlign(CENTER, CENTER);
        textFont('Nunito'); // Ensure font
        text("GAME OVER 😭", width / 2, height / 2 - 20);
        textSize(20);
        fill(250, 240, 245); // Light text color for score
        text(`Final Score: ${gameState.score}`, width / 2, height / 2 + 30);
        // TODO: Add "Press R to Restart" later
    }
}

// --- Rendering Functions ---

/** Draws a single block with kawaii styling */
function drawBlock(row, col, colorIndex) {
    // No change needed here, coordinates are relative to current translation
    if (colorIndex === 0) return;
    const blockColor = COLORS[colorIndex] || [128, 128, 128];
    const x = col * BLOCK_SIZE;
    const y = row * BLOCK_SIZE;
    fill(blockColor); stroke(BORDER_COLOR); strokeWeight(1.5);
    rect(x, y, BLOCK_SIZE, BLOCK_SIZE, 3);
}

/** Draws the game board (background grid lines optional) */
function drawBoard(board) {
    // No background call here - done globally in draw()
    // Draw settled blocks
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            if (board[r][c] !== 0) {
                drawBlock(r, c, board[r][c]);
            } else {
                // Optional: Draw faint grid background for empty cells
                // stroke(235, 220, 230); strokeWeight(1); noFill();
                // rect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
    // Draw border around the board area
    stroke(BORDER_COLOR); strokeWeight(2); noFill();
    rect(0, 0, BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
}

/** Draws the currently falling piece */
function drawPiece(piece) {
    // No change needed here, coordinates are relative to current translation
    if (!piece || !TETROMINOES[piece.type]) return;
    // ... (rest of drawPiece remains the same) ...
    const pieceDefinition = TETROMINOES[piece.type];
    const rotationIndex = piece.rotation % pieceDefinition.shapes.length;
    const shape = pieceDefinition.shapes[rotationIndex];
    if (!shape) return;
    const colorIndex = pieceDefinition.color;
    shape.forEach(offset => {
        drawBlock(piece.y + offset[0], piece.x + offset[1], colorIndex);
    });
}

/** Draws the UI elements (Score, Next Piece) */
function drawUI(score, nextPieceType) {
    // --- Draw Score ---
    fill(50, 40, 50); // Dark text color
    textSize(24);
    textAlign(LEFT, TOP);
    text("Score", 10, 10);
    textSize(32);
    text(score, 10, 40); // Display the score value

    // --- Draw Next Piece Preview ---
    const previewBoxX = 10;
    const previewBoxY = 100;
    const previewBoxW = 4 * BLOCK_SIZE; // Box size (4x4 blocks)
    const previewBoxH = 4 * BLOCK_SIZE;

    // Draw preview area label and box
    textSize(24);
    textAlign(LEFT, TOP);
    text("Next", previewBoxX, previewBoxY);
    fill(240, 230, 235); // Slightly different background for preview box
    stroke(BORDER_COLOR); strokeWeight(1.5);
    rect(previewBoxX, previewBoxY + 30, previewBoxW, previewBoxH);

    // Draw the next piece inside the box
    if (nextPieceType && TETROMINOES[nextPieceType]) {
        const pieceDefinition = TETROMINOES[nextPieceType];
        const shape = pieceDefinition.shapes[0]; // Usually show rotation 0
        const colorIndex = pieceDefinition.color;

        // Calculate offsets to center the piece in the preview box
        // This is approximate and might need tweaking based on piece pivots/shapes
        const pieceWidth = shape.reduce((max, offset) => Math.max(max, offset[1]), -Infinity) - shape.reduce((min, offset) => Math.min(min, offset[1]), Infinity) + 1;
        const pieceHeight = shape.reduce((max, offset) => Math.max(max, offset[0]), -Infinity) - shape.reduce((min, offset) => Math.min(min, offset[0]), Infinity) + 1;
        const offsetX = (previewBoxW - pieceWidth * BLOCK_SIZE) / 2;
        const offsetY = (previewBoxH - pieceHeight * BLOCK_SIZE) / 2;

        // Use push/pop and translate to draw relative to preview box corner
        push();
        translate(previewBoxX + offsetX, previewBoxY + 30 + offsetY);

        shape.forEach(offset => {
            // Need to adjust offsets slightly depending on piece definition
            // Assume offsets are relative to a pivot near the center
            // For drawing, we might need to adjust based on min row/col
            const drawX = (offset[1]) * BLOCK_SIZE; // Adjust based on pivot/minCol if needed
            const drawY = (offset[0]) * BLOCK_SIZE; // Adjust based on pivot/minRow if needed

            // Use a modified drawBlock or draw directly
            fill(COLORS[colorIndex] || [128,128,128]);
            stroke(BORDER_COLOR); strokeWeight(1.5);
            rect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE, 3);
        });
        pop();
    }
}

// --- Input Handling ---
function keyPressed() { /* ... remains the same ... */ }

// --- Helper Functions (Logic - To be implemented) ---
// function hardDrop(currentState) { /* ... return updatedState */ }