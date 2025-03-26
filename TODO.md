# Kawaii Tetris - TODO Roadmap 🗺️💖

This document outlines the development plan for Kawaii Tetris. Tasks are grouped into milestones, with the current milestone being the most detailed. We aim to follow functional and data-oriented principles throughout.

---

## 🎯 Milestone 1: Core Mechanics MVP (In Progress)

**Goal:** Get the absolute basic Tetris mechanics working. Focus on data structures and pure(r) functions for game logic, rendered simply using p5.js. Ugly is okay at this stage!

**Guiding Principles:**
*   Represent game state as immutable data structures where practical.
*   Separate game logic (state transformations) from rendering (drawing the state).
*   Keep functions small and focused.

**Tasks:**

*   **[X] Project Setup:**
    *   `[ ]` Basic HTML file (`index.html`) to host the p5.js sketch.
    *   `[ ]` Basic p5.js sketch file (`sketch.js`).
    *   `[ ]` Include p5.js library.
    *   `[ ]` Link `sketch.js` in `index.html`.
*   **[X] Game State Definition:**
    *   `[ ]` Define the core `gameState` data structure (e.g., a JavaScript object).
    *   `[ ]` Include `board` (e.g., a 2D array representing the grid, perhaps using numbers or null for empty cells).
    *   `[ ]` Include `currentPiece` (object with `shape`, `x`, `y`, `rotation` properties). <- _Partially done, structure defined_
    *   `[ ]` Define initial state function/value.
*   **[ ] Board Representation & Rendering:**
    *   `[ ]` Define board dimensions (width, height in grid units).
    *   `[ ]` Implement a function `drawBoard(boardData)` that renders the grid based on the `board` in the game state. <- **Next**
    *   `[ ]` Use simple rectangles for filled cells for now. <- **Next**
*   **[ ] Tetromino Definitions:**
    *   `[ ]` Define the shapes of all 7 tetrominoes (e.g., as arrays of coordinates relative to a pivot point). Store this as data. <- **Next**
    *   `[ ]` Implement a function `getRandomPiece()` that returns a new piece definition (shape data).
*   **[ ] Spawning Pieces:**
    *   `[ ]` Implement logic to spawn a new `currentPiece` at the top-center of the board when needed (initially, and after a piece locks). This function should update the `gameState`.
*   **[ ] Basic Piece Movement (User Input):**
    *   `[ ]` Handle keyboard input (left, right, down arrow keys) in p5.js `keyPressed()`.
    *   `[ ]` Implement pure functions `moveLeft(gameState)`, `moveRight(gameState)`, `moveDown(gameState)` that return a *new* game state if the move is valid (initially, just check board boundaries).
    *   `[ ]` Update `gameState` in `keyPressed()` based on the results of these functions.
*   **[ ] Gravity (Automatic Downward Movement):**
    *   `[ ]` Use p5.js `draw()` loop timing (e.g., frame count or `millis()`) to trigger automatic downward movement.
    *   `[ ]` Apply the `moveDown(gameState)` logic periodically.
*   **[ ] Basic Collision Detection (Floor & Walls):**
    *   `[ ]` Enhance movement functions (`moveLeft`, `moveRight`, `moveDown`) to check for collisions with the board boundaries.
        *   A helper function `isPositionValid(piece, boardData)` might be useful.
*   **[ ] Rendering the Current Piece:**
    *   `[ ]` Implement a function `drawPiece(pieceData)` that renders the `currentPiece` based on its shape, position, and rotation. <- **Next**
    *   `[ ]` Call this in the main `draw()` loop. <- **Next**
*   **[ ] Basic Game Loop Integration:**
    *   `[X]` Ensure `setup()` initializes the game state.
    *   `[ ]` Ensure `draw()` clears the background, draws the board, draws the current piece, and handles timed gravity. <- _Partially done, drawing next_

---

##  milestone 2: Gameplay Polish & Basic Kawaii 🌸
... (rest of the TODO remains the same) ...