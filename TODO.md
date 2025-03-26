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
    *   `[X]` Implement `getRandomPieceType()`.
*   **[X] Spawning Pieces:**
    *   `[X]` Implement `spawnPiece(gameState)`.
    *   `[X]` Update `getInitialState()` to call `spawnPiece`.
*   **[X] Basic Piece Movement (User Input):**
    *   `[X]` Handle keyboard input (`LEFT_ARROW`, `RIGHT_ARROW`, `DOWN_ARROW`) in p5.js `keyPressed()`.
    *   `[X]` Implement pure functions `moveLeft(gameState)`, `moveRight(gameState)`, `moveDown(gameState)`.
    *   `[X]` Update `gameState` in `keyPressed()`.
*   **[X] Basic Collision Detection (Floor & Walls):**
    *   `[X]` Implement `isPositionValid(piece, boardData)`.
    *   `[X]` Enhance movement functions to use `isPositionValid`.
*   **[ ] Gravity (Automatic Downward Movement):**
    *   `[ ]` Use p5.js `draw()` loop timing (e.g., frame count or `millis()`) to trigger automatic downward movement. <- **Next**
    *   `[ ]` Apply the `moveDown(gameState)` logic periodically. <- **Next**
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

**Goal:** Implement core gameplay features like rotation, locking, line clearing, and scoring. Start introducing the "kawaii" look and feel.

**Tasks:**

*   `[ ]` Piece Rotation Logic (Clockwise/Counter-Clockwise).
    *   `[ ]` Implement rotation transformation logic (pure function on piece data).
    *   `[ ]` Handle input for rotation.
    *   `[ ]` Add collision detection for rotation (walls, floor, other pieces).
*   `[ ]` Piece Locking Mechanism.
    *   `[ ]` Detect when a piece cannot move down further (collides with floor or settled pieces).
    *   `[ ]` Merge the `currentPiece` blocks into the main `board` data structure.
    *   `[ ]` Trigger spawning of a new piece.
*   `[ ]` Line Clearing Logic.
    *   `[ ]` Check for completed lines after a piece locks.
    *   `[ ]` Implement function to remove completed lines and shift rows above down. (Focus on data transformation!).
*   `[ ]` Basic Scoring System.
    *   `[ ]` Add `score` to `gameState`.
    *   `[ ]` Update score based on lines cleared.
    *   `[ ]` Display score on screen.
*   `[ ]` "Next Piece" Preview.
    *   `[ ]` Add `nextPiece` to `gameState`.
    *   `[ ]` Implement logic to generate and store the next piece.
    *   `[ ]` Render the next piece in a designated area.
*   `[ ]` Game Over Condition.
    *   `[ ]` Detect when a new piece spawns overlapping existing blocks (game over).
    *   `[ ]` Add `isGameOver` flag to `gameState`.
    *   `[ ]` Stop game loop / display game over message.
*   `[ ]` **Basic Kawaii Assets:**
    *   `[ ]` Design or find simple, cute block sprites/colors.
    *   `[ ]` Update rendering functions to use these basic assets instead of plain rectangles.

---

## 🎀 Milestone 3: Full Kawaii Experience & Refinements

**Goal:** Fully realize the "kawaii" theme with polished visuals, sound, and UI. Improve mobile experience and add quality-of-life features.

**Tasks:**

*   `[ ]` **Full Asset Integration:**
    *   `[ ]` Final cute block designs.
    *   `[ ]` Kawaii background(s).
    *   `[ ]` Themed UI elements (score display, next piece box, borders).
*   `[ ]` Sound Effects & Music:
    *   `[ ]` Add cute sounds for movement, rotation, locking, line clearing, game over.
    *   `[ ]` Add cheerful background music (optional).
*   `[ ]` Mobile Controls:
    *   `[ ]` Implement touch controls (swipe gestures, on-screen buttons).
    *   `[ ]` Ensure responsive layout.
*   `[ ]` Enhanced UI:
    *   `[ ]` "Game Over" screen with score and restart option.
    *   `[ ]` Pause functionality.
    *   `[ ]` Start screen/menu (optional).
*   `[ ]` Visual Polish:
    *   `[ ]` Animations/effects for line clearing.
    *   `[ ]` Piece landing/locking feedback.
*   `[ ]` Difficulty Scaling (Optional):
    *   `[ ]` Increase speed based on score or level.

---

## 🚀 Future Ideas (Post-MVP)

*   `[ ]` Leaderboards (Local storage or backend).
*   `[ ]` Different Kawaii Themes.
*   `[ ]` Special block types or power-ups.
*   `[ ]` Hold piece functionality.
*   `[ ]` Ghost piece (preview of where the piece will land).
*   `[ ]` More complex scoring (T-spins, combos).
*   `[ ]` Accessibility improvements (colorblind modes, configurable controls).
*   `[ ]` Code Refactoring & Optimization pass.

---