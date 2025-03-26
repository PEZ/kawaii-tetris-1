# Kawaii Tetris - TODO Roadmap 🗺️💖

This document outlines the development plan for Kawaii Tetris. Tasks are grouped into milestones, with the current milestone being the most detailed. We aim to follow functional and data-oriented principles throughout.

---

## 🎯 Milestone 1: Core Mechanics MVP (Completed) 🎉

**Goal:** Get the absolute basic Tetris mechanics working. Focus on data structures and pure(r) functions for game logic, rendered simply using p5.js. Ugly is okay at this stage!

**Guiding Principles:**
*   Represent game state as immutable data structures where practical.
*   Separate game logic (state transformations) from rendering (drawing the state).
*   Keep functions small and focused.

**Tasks:** All tasks completed [X]

---

##  milestone 2: Gameplay Polish & Basic Kawaii 🌸 (Current Focus)

**Goal:** Implement core gameplay features like rotation, locking, line clearing, and scoring. Start introducing the "kawaii" look and feel.

**Tasks:**

*   **[X] Piece Locking Mechanism:**
    *   `[X]` Detect when a piece cannot move down further (gravity fails).
    *   `[X]` Implement `lockPieceAndSpawnNext(gameState)`.
    *   `[X]` Integrate `lockPieceAndSpawnNext` into the `draw()` loop.
*   **[X] Piece Rotation Logic (Clockwise):**
    *   `[X]` Implement `rotatePiece` function.
    *   `[X]` Handle input for rotation (`UP_ARROW`).
    *   `[X]` Add basic collision detection including simple wall kicks.
    *   `[ ]` _Optional: Implement more complex SRS wall/floor kicks._
*   **[X] Line Clearing Logic:**
    *   `[X]` Implement `checkForLineClears`.
    *   `[X]` Integrate call within `lockPieceAndSpawnNext`.
*   **[X] Basic Scoring System:**
    *   `[X]` Add `score` to `gameState`.
    *   `[X]` Update score based on lines cleared.
    *   `[X]` Display score on screen (via `drawUI`).
*   **[X] "Next Piece" Preview:**
    *   `[X]` Add `nextPieceType` property to `gameState`.
    *   `[X]` Update `spawnNextPieceAndUpdateQueue` and `lockPieceAndSpawnNext` to manage queue.
    *   `[X]` Adjust canvas layout (`CANVAS_WIDTH`, offsets).
    *   `[X]` Render the next piece in `drawUI`.
*   **[ ] Game Over Condition:** <- **Next**
    *   `[X]` Add `isGameOver` flag.
    *   `[X]` Stop game loop / input handling partially.
    *   `[X]` Display basic "Game Over" message with score.
    *   `[X]` Detect Game Over during `spawnNextPieceAndUpdateQueue`.
    *   `[ ]` Implement formal game state stop/restart (e.g., 'Press R to Restart').
*   **[ ] **Basic Kawaii Assets:**
    *   `[X]` Initial Kawaii color palette implemented.
    *   `[ ]` Design or find simple, cute block sprites/graphics (optional).
    *   `[ ]` Update `drawBlock` if using sprites.

---

## 🎀 Milestone 3: Full Kawaii Experience & Refinements

**Goal:** Fully realize the "kawaii" theme with polished visuals, sound, and UI. Improve mobile experience and add quality-of-life features.

**Tasks:**

*   `[ ]` **Full Asset Integration:** ...
*   `[ ]` Sound Effects & Music: ...
*   `[ ]` Mobile Controls: ...
*   `[ ]` Enhanced UI: ...
*   `[ ]` Visual Polish: ...
*   `[ ]` Difficulty Scaling (Optional): ...

---

## 🚀 Future Ideas (Post-MVP)

*   `[ ]` Leaderboards ...
*   `[ ]` Different Kawaii Themes ...
*   `[ ]` Special block types ...
*   `[ ]` Hold piece functionality ...
*   `[ ]` Ghost piece ...
*   `[ ]` More complex scoring (T-spins, combos) ...
*   `[ ]` Accessibility improvements ...
*   `[ ]` Code Refactoring & Optimization pass ...

---