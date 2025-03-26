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

## ✅ milestone 2: Gameplay Polish & Basic Kawaii 🌸 (Completed) 🎉

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
    *   `[X]` Update spawn/lock logic to manage queue.
    *   `[X]` Adjust canvas layout (`CANVAS_WIDTH`, offsets).
    *   `[X]` Render the next piece in `drawUI`.
*   **[X] Game Over Condition:**
    *   `[X]` Detect Game Over during `spawnNextPieceAndUpdateQueue`.
    *   `[X]` Add `isGameOver` flag.
    *   `[X]` Stop game loop / input handling partially when `isGameOver` is true.
    *   `[X]` Display "Game Over" message with score and restart instruction.
    *   `[X]` Implement 'R' key to restart game via `getInitialState()`.
*   **[X] Basic Kawaii Assets:**
    *   `[X]` Initial Kawaii color palette implemented.
    *   `[X]` Kawaii font integrated into UI text.
    *   `[ ]` _Optional: Design/find cute block sprites/graphics & update `drawBlock`._

---

## 🎀 Milestone 3: Full Kawaii Experience & Refinements (Next Focus)

**Goal:** Fully realize the "kawaii" theme with polished visuals, sound, and UI. Improve mobile experience and add quality-of-life features.

**Tasks:**

*   `[ ]` **Full Asset Integration:**
    *   `[ ]` Final cute block designs / sprites?
    *   `[ ]` Kawaii background(s)?
    *   `[ ]` Themed UI elements (score display, next piece box, borders)?
*   `[ ]` Sound Effects & Music:
    *   `[ ]` Add cute sounds for movement, rotation, locking, line clearing, game over, restart.
    *   `[ ]` Add cheerful background music (optional).
*   `[ ]` Mobile Controls:
    *   `[ ]` Implement touch controls (swipe gestures, on-screen buttons).
    *   `[ ]` Ensure responsive layout (may require rethinking fixed pixel sizes).
*   `[ ]` Enhanced UI:
    *   `[ ]` Nicer "Game Over" screen design.
    *   `[ ]` Pause functionality ('P' key?).
    *   `[ ]` Start screen/menu (optional).
*   `[ ]` Visual Polish:
    *   `[ ]` Animations/effects for line clearing? (e.g., flashing lines)
    *   `[ ]` Piece landing/locking feedback? (e.g., small shake, particle effect)
*   `[ ]` Difficulty Scaling (Optional):
    *   `[ ]` Add `level` tracking (based on lines cleared?).
    *   `[ ]` Decrease `currentDropInterval` based on `level`.

---

## 🚀 Future Ideas (Post-MVP)

*   `[ ]` Leaderboards (Local storage or backend).
*   `[ ]` Different Kawaii Themes.
*   `[ ]` Special block types or power-ups.
*   `[ ]` Hold piece functionality ('C' key?).
*   `[ ]` Ghost piece (preview of where the piece will land).
*   `[ ]` More complex scoring (T-spins, combos).
*   `[ ]` Accessibility improvements (colorblind modes, configurable controls).
*   `[ ]` Code Refactoring & Optimization pass.

---