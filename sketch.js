// ==========================================
//          Kawaii Tetris - sketch.js (DEBUG: Reintroduce Init)
// ==========================================
console.log("----- sketch.js script executing! v3 -----"); // Version marker

// --- Constants ---
const BOARD_WIDTH = 10; const BOARD_HEIGHT = 20; const BLOCK_SIZE = 30;
const UI_WIDTH = 5 * BLOCK_SIZE; const CANVAS_WIDTH = BOARD_WIDTH * BLOCK_SIZE + UI_WIDTH;
const CANVAS_HEIGHT = BOARD_HEIGHT * BLOCK_SIZE;
const BOARD_X_OFFSET = 0; const BOARD_Y_OFFSET = 0; const UI_X_OFFSET = BOARD_WIDTH * BLOCK_SIZE;
const INITIAL_DROP_INTERVAL = 1000;
const SCORE_PER_LINE = [0, 100, 300, 500, 800];

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

// --- Sound Variables (Keep commented out for now) ---
// let moveSound = null; /* ... etc ... */

// --- Game State ---
let gameState = null; // Initialize to null
let setupComplete = false; // Use flag
let lastDropTime = 0;
let currentDropInterval = INITIAL_DROP_INTERVAL;
let audioStarted = false; // Keep audio flag logic


// --- p5.js Preload (Keep commented out) ---
/* function preload() { ... } */

// --- Audio Context Handling (Keep commented out) ---
/* function touchStarted() { ... } */
/* function playSound(sound) { ... } */

// --- Core Game Logic Functions ---

function getRandomPieceType() { const i = Math.floor(Math.random() * PIECE_TYPES.length); return PIECE_TYPES[i]; }

function isPositionValid(piece, board) {
    // Added detailed logging for debugging spawn/init
    if (!piece) { console.error("[isPositionValid] ERROR: piece is null/undefined!"); return false; }
    if (!board) { console.error("[isPositionValid] ERROR: board is null/undefined!"); return false; }
    if (!TETROMINOES[piece.type]) { console.error(`[isPositionValid] ERROR: Invalid piece type: ${piece.type}`); return false; }

    // console.log(`[isPositionValid] Checking piece: ${piece.type} at (${piece.x}, ${piece.y}) rot ${piece.rotation}`); // Verbose log

    const pieceDefinition = TETROMINOES[piece.type];
    const rotationIndex = piece.rotation % pieceDefinition.shapes.length;
    const shape = pieceDefinition.shapes[rotationIndex];
    if (!shape) { console.error(`[isPositionValid] ERROR: Missing shape definition for ${piece.type} rot ${rotationIndex}`); return false; }

    for (const offset of shape) {
        const blockRow = piece.y + offset[0]; const blockCol = piece.x + offset[1];
        // console.log(`  Checking block at [${blockRow}, ${blockCol}]`); // Verbose log

        if (blockCol < 0 || blockCol >= BOARD_WIDTH || blockRow >= BOARD_HEIGHT) {
            // console.log(`    -> INVALID: Out of bounds`); // Verbose log
            return false;
        }
        if (blockRow >= 0) {
             // Ensure row exists before checking cell
             if (!board[blockRow]) {
                  console.error(`[isPositionValid] ERROR: Board row ${blockRow} is undefined! Board height: ${board.length}`);
                  return false;
             }
             if (board[blockRow][blockCol] !== 0) {
                // console.log(`    -> INVALID: Collision with existing block ${board[blockRow][blockCol]}`); // Verbose log
                return false;
            }
        }
    }
    // console.log(`[isPositionValid] Position VALID for ${piece.type}`); // Verbose log
    return true;
}

function moveLeft(currentState) { /* Keep function definition */
    const { currentPiece, board, isGameOver } = currentState; if (!currentPiece || isGameOver) return currentState;
    const nextPiece = { ...currentPiece, x: currentPiece.x - 1 };
    if (isPositionValid(nextPiece, board)) { /* playSound(moveSound); */ return { ...currentState, currentPiece: nextPiece }; } return currentState;
}
function moveRight(currentState) { /* Keep function definition */
    const { currentPiece, board, isGameOver } = currentState; if (!currentPiece || isGameOver) return currentState;
    const nextPiece = { ...currentPiece, x: currentPiece.x + 1 };
    if (isPositionValid(nextPiece, board)) { /* playSound(moveSound); */ return { ...currentState, currentPiece: nextPiece }; } return currentState;
}
function moveDown(currentState) { /* Keep function definition */
    const { currentPiece, board, isGameOver } = currentState; if (!currentPiece || isGameOver) return currentState;
    const nextPiece = { ...currentPiece, y: currentPiece.y + 1 };
    if (isPositionValid(nextPiece, board)) { lastDropTime = millis(); /* playSound(moveSound); */ return { ...currentState, currentPiece: nextPiece }; } else { return currentState; }
}
function applyGravity(currentState) { /* Keep function definition */
    const { currentPiece, board, isGameOver } = currentState; if (!currentPiece || isGameOver) return currentState;
    const nextPiece = { ...currentPiece, y: currentPiece.y + 1 };
    if (isPositionValid(nextPiece, board)) { return { ...currentState, currentPiece: nextPiece }; } else { return currentState; }
}
function rotatePiece(currentState) { /* Keep function definition */
    const { currentPiece, board, isGameOver } = currentState; if (!currentPiece || isGameOver) return currentState;
    const pieceDefinition = TETROMINOES[currentPiece.type]; const currentRotation = currentPiece.rotation; const nextRotation = (currentRotation + 1) % pieceDefinition.shapes.length;
    const nextPiece = { ...currentPiece, rotation: nextRotation }; let successState = null;
    if (isPositionValid(nextPiece, board)) { successState = { ...currentState, currentPiece: nextPiece }; }
    else { const nextPieceLeft = { ...nextPiece, x: nextPiece.x - 1 }; if (isPositionValid(nextPieceLeft, board)) { successState = { ...currentState, currentPiece: nextPieceLeft }; }
    else { const nextPieceRight = { ...nextPiece, x: nextPiece.x + 1 }; if (isPositionValid(nextPieceRight, board)) { successState = { ...currentState, currentPiece: nextPieceRight }; } } }
    if (successState) { /* playSound(rotateSound); */ return successState; } else { return currentState; }
}
function checkForLineClears(board) { /* Keep function definition */
    let linesCleared = 0; const newBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
    let newBoardRow = BOARD_HEIGHT - 1;
    for (let r = BOARD_HEIGHT - 1; r >= 0; r--) { const isRowFull = board[r].every(cell => cell !== 0);
    if (!isRowFull) { if (newBoardRow >= 0) newBoard[newBoardRow--] = board[r]; } else { linesCleared++; } }
    return { board: newBoard, linesCleared: linesCleared };
}

// REINTRODUCE REAL spawnNextPieceAndUpdateQueue with logging
function spawnNextPieceAndUpdateQueue(currentState) {
    console.log("[spawn..] Attempting to spawn piece...");
    if (!currentState) { console.error("[spawn..] ERROR: currentState is missing!"); return null; } // Added guard
    let typeToSpawn = currentState.nextPieceType || getRandomPieceType();
    const initialX = Math.floor(BOARD_WIDTH / 2) - 1; const initialY = 0;
    const newCurrentPiece = { type: typeToSpawn, rotation: 0, x: initialX, y: initialY };
    const newNextPieceType = getRandomPieceType();

    console.log(`[spawn..] Generated new piece: ${typeToSpawn}, next type: ${newNextPieceType}`);

    // Explicitly check validity BEFORE returning
    const isValidSpawn = isPositionValid(newCurrentPiece, currentState.board);
    console.log(`[spawn..] Spawn validity check for ${typeToSpawn}: ${isValidSpawn}`);

    if (!isValidSpawn) {
        console.log("[spawn..] GAME OVER detected during spawn!");
        // playSound(gameOverSound); // Keep sound commented out
        // Return state indicating game over, include the piece that failed
        return { ...currentState, currentPiece: newCurrentPiece, nextPieceType: newNextPieceType, isGameOver: true };
    }

    console.log(`[spawn..] Spawning ${typeToSpawn} successfully.`);
    return { ...currentState, currentPiece: newCurrentPiece, nextPieceType: newNextPieceType };
}

// REINTRODUCE REAL getInitialState with logging
function getInitialState() {
    console.log("[getInitialState] Started...");
    const initialBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
    const firstNextType = getRandomPieceType();
    console.log("[getInitialState] Generated first next type:", firstNextType);
    const baseState = {
        board: initialBoard, currentPiece: null, nextPieceType: firstNextType,
        score: 0, level: 1, isGameOver: false,
    };
    console.log("[getInitialState] Base state created:", baseState);
    try {
        // Call the real spawn function
        const initialState = spawnNextPieceAndUpdateQueue(baseState);
        console.log("[getInitialState] Finished successfully. Result:", initialState);
        // Check the result structure
        if (!initialState || typeof initialState.board === 'undefined' || typeof initialState.currentPiece === 'undefined') {
             throw new Error("spawnNextPieceAndUpdateQueue returned invalid state");
        }
        return initialState;
    } catch (e) {
         console.error("[getInitialState] ERROR during initial spawn:", e);
         return { ...baseState, isGameOver: true, message: "Init Spawn Failed!" }; // Failsafe
    }
}

// Keep lockPieceAndSpawnNext (it calls the real spawn)
function lockPieceAndSpawnNext(currentState) { /* Keep function definition */
    const { currentPiece, board } = currentState; if (!currentPiece) return currentState;
    /* playSound(lockSound); */ const newBoardBeforeClear = board.map(row => [...row]);
    const pieceDefinition = TETROMINOES[currentPiece.type]; const rotationIndex = currentPiece.rotation % pieceDefinition.shapes.length; const shape = pieceDefinition.shapes[rotationIndex];
    const colorIndex = pieceDefinition.color; if (!shape) { console.error("Locking error: Invalid shape."); return currentState; }
    shape.forEach(offset => { const blockRow = currentPiece.y + offset[0]; const blockCol = currentPiece.x + offset[1]; if (blockRow >= 0 && blockRow < BOARD_HEIGHT && blockCol >= 0 && blockCol < BOARD_WIDTH) { newBoardBeforeClear[blockRow][blockCol] = colorIndex; } });
    const clearResult = checkForLineClears(newBoardBeforeClear); const boardAfterClearing = clearResult.board; const linesClearedCount = clearResult.linesCleared;
    if (linesClearedCount > 0) { /* playSound(lineClearSound); */ console.log(`${linesClearedCount} lines cleared!`); }
    const scoreUpdate = SCORE_PER_LINE[Math.min(linesClearedCount, SCORE_PER_LINE.length - 1)] || 0;
    const stateBeforeSpawn = { ...currentState, board: boardAfterClearing, currentPiece: null, score: currentState.score + scoreUpdate, };
    const nextState = spawnNextPieceAndUpdateQueue(stateBeforeSpawn); return nextState;
}

// --- P5.js Functions ---

function setup() {
    console.log("----- setup() started -----");
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    console.log("Canvas created");

    try {
        console.log("Calling REAL getInitialState...");
        let initialState = getInitialState(); // Use the REAL initializer
        console.log("REAL getInitialState returned:", initialState);

        if (typeof initialState === 'undefined' || initialState === null || typeof initialState.isGameOver === 'undefined') { // Check essential property
            throw new Error("getInitialState returned invalid state!");
        }
        gameState = initialState; // Assign to global variable
        console.log("Assigned REAL state to global gameState:", gameState);

        lastDropTime = millis();
        setupComplete = true; // Set flag on success
        console.log("----- setup() finished successfully, setupComplete = true -----");

    } catch (e) {
        console.error("!!!!! CRITICAL ERROR DURING setup() !!!!!", e);
        gameState = { board: [], currentPiece: null, nextPieceType: null, score: 0, level: 1, isGameOver: true, message: "Setup Failed!" };
        setupComplete = false;
        console.log("Set failsafe gameState due to setup error.");
    }

    frameRate(30); // Keep higher framerate
    // textFont('Nunito'); // Keep font commented out for now
    textAlign(CENTER, CENTER);
    console.log("----- setup() function execution finished -----");
}

function draw() {
    if (!setupComplete || !gameState) {
        background(100); fill(255); textSize(20); textAlign(CENTER, CENTER);
        text(`Waiting for setup... (setupComplete: ${setupComplete}, gameState: ${gameState ? 'Exists' : 'null/undefined'})`, width / 2, height / 2);
        return;
    }

    const now = millis();

    // --- 1. Handle Timing and Game Logic Update ---
    // Use REAL logic only if setup succeeded
    if (!gameState.isGameOver && gameState.currentPiece && now - lastDropTime > currentDropInterval) {
        const stateBeforeGravity = gameState;
        gameState = applyGravity(gameState); // Use REAL applyGravity
        lastDropTime = now;
        if (gameState === stateBeforeGravity && gameState.currentPiece) {
             gameState = lockPieceAndSpawnNext(gameState); // Use REAL lock function
        }
    }

    // --- 2. Render Game State ---
    background(COLORS[0]); // Use real background color

    // Reintroduce REAL drawing functions
    push(); translate(BOARD_X_OFFSET, BOARD_Y_OFFSET);
    drawBoard(gameState.board);
    if (gameState.currentPiece) drawPiece(gameState.currentPiece);
    pop();
    push(); translate(UI_X_OFFSET, BOARD_Y_OFFSET);
    drawUI(gameState.score, gameState.nextPieceType);
    pop();

    // --- 3. Render Game Over Overlay ---
    if (gameState.isGameOver) {
        fill(0, 0, 0, 170); rect(0, 0, width, height);
        fill(255, 80, 80); textSize(40); textAlign(CENTER, CENTER);
        text(gameState.message || "GAME OVER 😭", width / 2, height / 2 - 40); // Show setup fail message if present
        textSize(24); fill(250, 240, 245);
        text(`Final Score: ${gameState.score}`, width / 2, height / 2 + 10);
        textSize(18); fill(220, 220, 255);
        text("Press 'R' to Restart", width / 2, height / 2 + 50);
    }
}

// --- Rendering Functions (Keep real versions) ---

function drawBlock(row, col, colorIndex) {
    if (colorIndex === 0) return;
    const blockColor = COLORS[colorIndex] || [128, 128, 128];
    const x = col * BLOCK_SIZE; const y = row * BLOCK_SIZE;
    fill(blockColor); stroke(BORDER_COLOR); strokeWeight(1.5);
    rect(x, y, BLOCK_SIZE, BLOCK_SIZE, 3);
}
function drawBoard(board) {
    if (!board) { console.error("drawBoard: board is invalid!"); return } // Add guard
    for (let r = 0; r < board.length; r++) {
        if (!board[r]) { console.error(`drawBoard: board row ${r} is invalid!`); continue; } // Add guard
        for (let c = 0; c < board[r].length; c++) {
            if (board[r][c] !== 0) drawBlock(r, c, board[r][c]);
        }
    }
    stroke(BORDER_COLOR); strokeWeight(2); noFill();
    rect(0, 0, BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
}
function drawPiece(piece) {
    if (!piece || !TETROMINOES[piece.type]) return;
    const pieceDefinition = TETROMINOES[piece.type];
    const rotationIndex = piece.rotation % pieceDefinition.shapes.length;
    const shape = pieceDefinition.shapes[rotationIndex];
    if (!shape) return;
    const colorIndex = pieceDefinition.color;
    shape.forEach(offset => { drawBlock(piece.y + offset[0], piece.x + offset[1], colorIndex); });
}
function drawUI(score, nextPieceType) {
    const PADDING = 15;
    fill(50, 40, 50); textSize(24); textAlign(LEFT, TOP); text("Score", PADDING, PADDING);
    textSize(32); text(score, PADDING, PADDING + 30);
    const previewLabelY = PADDING + 80; const previewBoxX = PADDING; const previewBoxY = previewLabelY + 30;
    const previewBlockSize = BLOCK_SIZE * 0.8; const previewBoxW = 4 * previewBlockSize + PADDING; const previewBoxH = 4 * previewBlockSize + PADDING;
    textSize(24); textAlign(LEFT, TOP); fill(50, 40, 50); text("Next", PADDING, previewLabelY);
    fill(240, 230, 235); stroke(BORDER_COLOR); strokeWeight(1.5); rect(previewBoxX, previewBoxY, previewBoxW, previewBoxH, 5);
    if (nextPieceType && TETROMINOES[nextPieceType]) {
        const pieceDefinition = TETROMINOES[nextPieceType]; const shape = pieceDefinition.shapes[0]; const colorIndex = pieceDefinition.color;
        let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
        shape.forEach(offset => { minR = Math.min(minR, offset[0]); maxR = Math.max(maxR, offset[0]); minC = Math.min(minC, offset[1]); maxC = Math.max(maxC, offset[1]); });
        const pieceHeight = (maxR - minR + 1); const pieceWidth = (maxC - minC + 1);
        const totalPiecePixelW = pieceWidth * previewBlockSize; const totalPiecePixelH = pieceHeight * previewBlockSize;
        const offsetX = (previewBoxW - totalPiecePixelW) / 2; const offsetY = (previewBoxH - totalPiecePixelH) / 2;
        push(); translate(previewBoxX + offsetX, previewBoxY + offsetY);
        shape.forEach(offset => { const blockX = (offset[1] - minC) * previewBlockSize; const blockY = (offset[0] - minR) * previewBlockSize;
        fill(COLORS[colorIndex] || [128,128,128]); stroke(BORDER_COLOR); strokeWeight(1); rect(blockX, blockY, previewBlockSize, previewBlockSize, 2); });
        pop();
    }
}

// --- Input Handling (Keep Guarded) ---
function keyPressed() {
    if (typeof gameState === 'undefined' || gameState === null || !setupComplete) {
        console.error("keyPressed: IGNORING input - setup incomplete or gameState missing."); return;
    }
    // Keep audio start logic (commented out)
    // if (!audioStarted) { ... userStartAudio(); audioStarted = true; ... }

    if (gameState.isGameOver) {
        if (key === 'r' || key === 'R') {
            // playSound(restartSound); // Keep sound commented out
            gameState = getInitialState();
            lastDropTime = millis();
            setupComplete = (gameState && !gameState.isGameOver); // Re-check flag on restart attempt
            console.log(`Restart attempt. setupComplete: ${setupComplete}`);
        }
        return;
    }

    let newState = gameState; let stateChanged = false;
    if (keyCode === LEFT_ARROW) { newState = moveLeft(gameState); stateChanged = newState !== gameState; }
    else if (keyCode === RIGHT_ARROW) { newState = moveRight(gameState); stateChanged = newState !== gameState; }
    else if (keyCode === DOWN_ARROW) { newState = moveDown(gameState); stateChanged = newState !== gameState; }
    else if (keyCode === UP_ARROW) { newState = rotatePiece(gameState); stateChanged = newState !== gameState; }

    if (stateChanged) { gameState = newState; }
}

// --- Other Logic Functions (Keep definitions, even if unused currently) ---
// function hardDrop(currentState) { /* ... */ }
// function calculateLevel(score) { /* ... */ }
// function updateDropInterval(level) { /* ... */ }