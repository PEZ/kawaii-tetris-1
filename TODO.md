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
    *   `[X]` Implement `lockPieceAndSpawnNext(gameState)`:
        *   `[X]` Merge the `currentPiece` blocks into the main `board` data structure.
        *   `[X]` Trigger spawning of a new piece (call `spawnPiece`).
    *   `[X]` Integrate `lockPieceAndSpawnNext` into the `draw()` loop's gravity check.
*   **[X] Piece Rotation Logic (Clockwise):**
    *   `[X]` Implement rotation transformation logic (`rotatePiece` function).
    *   `[X]` Handle input for rotation (`UP_ARROW`).
    *   `[X]` Add basic collision detection for rotation including simple wall kicks.
    *   `[ ]` _Optional: Implement more complex SRS wall/floor kicks if needed._
*   **[X] Line Clearing Logic:**
    *   `[X]` Check for completed lines after a piece locks (within `checkForLineClears`).
    *   `[X]` Implement `checkForLineClears` to remove completed lines and shift rows down.
    *   `[X]` Integrate call to `checkForLineClears` within `lockPieceAndSpawnNext`.
*   **[X] Basic Scoring System:**
    *   `[X]` Add `score` to `gameState`.
    *   `[X]` Update score based on lines cleared in `lockPieceAndSpawnNext` using `SCORE_PER_LINE`.
    *   `[ ]` Display score on screen. <- **Next UI Step**
*   **[ ] "Next Piece" Preview:** <- **Next Major Logic Step**
    *   `[ ]` Add `nextPiece` property to `gameState`.
    *   `[ ]` Update `spawnPiece` and `lockPieceAndSpawnNext` to manage a queue (e.g., use `nextPiece` to set `currentPiece`, then generate a new `nextPiece`).
    *   `[ ]` Render the next piece in a designated area (will require UI layout adjustments).
*   **[ ] Game Over Condition:**
    *   `[ ]` Properly detect when a new piece spawns overlapping existing blocks (within `spawnPiece` or `lockPieceAndSpawnNext`).
    *   `[X]` Add `isGameOver` flag to `gameState`.
    *   `[X]` Stop game loop / input handling partially when `isGameOver` is true.
    *   `[X]` Display basic "Game Over" message.
    *   `[ ]` Implement more formal game state stop/restart.
*   **[ ] **Basic Kawaii Assets:**
    *   `[X]` Initial Kawaii color palette implemented.
    *   `[ ]` Design or find simple, cute block sprites/graphics (optional upgrade).
    *   `[ ]` Update rendering functions (`drawBlock`?) to potentially use images.

---

## 🎀 Milestone 3: Full Kawaii Experience & Refinements

**Goal:** Fully realize the "kawaii" theme with polished visuals, sound, and UI. Improve mobile experience and add quality-of-life features.

**Tasks:**

*   `[ ]` **Full Asset Integration:**
    *   `[ ]` Final cute block designs / sprites.
    *   `[ ]` Kawaii background(s).
    *   `[ ]` Themed UI elements (score display, next piece box, borders).
*   `[ ]` Sound Effects & Music:
    *   `[ ]` Add cute sounds for movement, rotation, locking, line clearing, game over.
    *   `[ ]` Add cheerful background music (optional).
*   `[ ]` Mobile Controls:
    *   `[ ]` Implement touch controls (swipe gestures, on-screen buttons).
    *   `[ ]` Ensure responsive layout.
*   `[ ]` Enhanced UI:
    *   `[ ]` Nicer "Game Over" screen with score and restart option.
    *   `[ ]` Pause functionality.
    *   `[ ]` Start screen/menu (optional).
*   `[ ]` Visual Polish:
    *   `[ ]` Animations/effects for line clearing.
    *   `[ ]` Piece landing/locking feedback.
*   `[ ]` Difficulty Scaling (Optional):
    *   `[ ]` Increase speed (`currentDropInterval`) based on score or level.

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