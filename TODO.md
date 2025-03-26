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
    *   `[X]` Basic HTML file (`index.html`) to host the p5.js sketch.
    *   `[X]` Basic p5.js sketch file (`sketch.js`).
    *   `[X]` Include p5.js library.
    *   `[X]` Link `sketch.js` in `index.html`.
*   **[X] Game State Definition:**
    *   `[X]` Define the core `gameState` data structure.
    *   `[X]` Include `board`.
    *   `[X]` Include `currentPiece` structure.
    *   `[X]` Define initial state function/value.
*   **[X] Board Representation & Rendering:**
    *   `[X]` Define board dimensions.
    *   `[X]` Implement `drawBoard(boardData)`.
    *   `[X]` Use `drawBlock` for rendering cells.
*   **[ ] Tetromino Definitions:**
    *   `[ ]` **Verify/Correct the shapes of all 7 tetrominoes and all rotations.** Store this as data in `TETROMINOES`. <- **Still Important!**
    *   `[X]` Implement a function `getRandomPieceType()` that returns a random key ('I', 'L', etc.) from `TETROMINOES`.
*   **[X] Spawning Pieces:**
    *   `[X]` Implement a function `spawnPiece(gameState)`:
        *   `[X]` Uses `getRandomPieceType()` to get the next piece type.
        *   `[X]` Creates a new piece object (type, initial rotation, starting x/y).
        *   `[X]` Returns a *new* game state with the `currentPiece` updated.
    *   `[X]` Update `getInitialState()` to call `spawnPiece` to set the first `currentPiece`.
*   **[ ] Basic Piece Movement (User Input):**
    *   `[ ]` Handle keyboard input (`LEFT_ARROW`, `RIGHT_ARROW`, `DOWN_ARROW`) in p5.js `keyPressed()`. <- **Next**
    *   `[ ]` Implement pure functions `moveLeft(gameState)`, `moveRight(gameState)`, `moveDown(gameState)` that return a *new* game state if the move is valid. <- **Next**
    *   `[ ]` Update `gameState` in `keyPressed()` based on the results of these movement functions. <- **Next**
*   **[ ] Basic Collision Detection (Floor & Walls):**
    *   `[ ]` Implement a helper function `isPositionValid(piece, boardData)` that checks if a piece's position is within bounds and not overlapping settled blocks on the board. <- **Needed for Movement**
    *   `[ ]` Enhance movement functions (`moveLeft`, `moveRight`, `moveDown`) to use `isPositionValid` before returning the new state. <- **Needed for Movement**
*   **[ ] Gravity (Automatic Downward Movement):**
    *   `[ ]` Use p5.js `draw()` loop timing (e.g., frame count or `millis()`) to trigger automatic downward movement.
    *   `[ ]` Apply the `moveDown(gameState)` logic periodically.
*   **[X] Rendering the Current Piece:**
    *   `[X]` Implement `drawPiece(pieceData)`.
    *   `[X]` Call `drawPiece` in the main `draw()` loop.
*   **[X] Basic Game Loop Integration:**
    *   `[X]` `setup()` initializes the game state.
    *   `[X]` `draw()` clears background, draws board, draws piece.
*   **[X] Deployment Setup (GitHub Actions & Pages):**
    *   `[X]` Workflow file created and configured.
    *   `[X]` Repository settings configured.
    *   `[X]` Verified deployment working.

---

##  milestone 2: Gameplay Polish & Basic Kawaii 🌸
... (rest remains the same) ...

---

## 🎀 Milestone 3: Full Kawaii Experience & Refinements
... (rest remains the same) ...

---

## 🚀 Future Ideas (Post-MVP)
... (rest remains the same) ...