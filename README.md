# Kawaii Tetris 🧸🧱✨

➡️ **[Play Kawaii Tetris Live!](https://pez.github.io/kawaii-tetris-1/)** ⬅️

Welcome to **Kawaii Tetris** - the classic block-stacking puzzle game you know and love, but infused with a *super cute* aesthetic!

## 🧪 Project Context

This project is an experiment in **"Vibe Coding"** with **Google Gemini 1.5 Pro**. It draws heavy inspiration from **"Cute Tetris"**, originally vibe coded by **Megan Ben Dor Ruthven** ([LinkedIn](https://www.linkedin.com/in/maruthven/), [GitHub Repo](https://github.com/mbdr-byte/ai-code)). We're exploring how AI collaboration can facilitate development, particularly using functional and data-oriented approaches inspired by Clojure principles within a p5.js context, aiming for a "Kawaii" aesthetic twist.

## 💻 Technology & Philosophy

Kawaii Tetris is built using the creative coding library **[p5.js](https://p5js.org/)**, leveraging its power for graphics, sound, and interaction in the browser.

However, the development approach taken here is intentionally **data-oriented** and heavily influenced by **functional programming** principles, guided by the question:

> *"What would Rich Hickey do?"*

We believe this leads to more predictable, testable, and maintainable code. The ideas articulated within the Clojure community regarding state management, immutability, and functional composition are key inspirations. Rafael Dittwald's talk, "[Solving Problems the Clojure Way](https://www.youtube.com/watch?v=vK1DazRK_a0)", has been a significant influence.

While p5.js often lends itself to more imperative or object-oriented patterns, this project consciously attempts to manage game state through data transformations and pure(r) functions wherever practical within the JavaScript environment.

## 🛠️ Development Workflow

This project is being developed collaboratively using the following process, generally following a "README Driven Development" approach:

1.  **README First:** High-level goals, context, and philosophy are defined here in `README.md`.
2.  **Feed the TODO:** The goals are broken down into specific milestones and actionable tasks in the `TODO.md` file.
3.  **Code from TODO:** The implementation work follows the plan outlined in the `TODO.md`.
4.  **AI + Human Collaboration:**
    *   **AI Assistant (I, Gemini 1.5 Pro):** Hosted via Google AI Studio, I generate code based on the current `TODO.md` task, update documentation, and assist with debugging as directed by Human PEZ.
    *   **Human Developer (Human PEZ):** Provides high-level direction, interacts with me via AI Studio, reviews generated code, provides feedback (especially console logs for debugging), manages local files (downloading/replacing code, Git commits), and oversees the overall project structure and deployment.
5.  **Debugging:** This is a natural part of the process. When issues arise, Human PEZ provides console logs or describes the faulty behavior. I then suggest debugging steps, code modifications, or add logging to help isolate the problem for the next iteration.
6.  **Friction Point:** A specific friction point in this AI-assisted workflow is that **I sometimes generate truncated or incomplete code files**, which requires correction by Human PEZ and adds an extra step to our iteration cycle.

## ✨ Features

*   Classic Tetris gameplay mechanics (Movement, Rotation, Locking, Line Clearing).
*   Basic Scoring system.
*   Next Piece Preview.
*   Game Over detection and Restart (`R` key).
*   Adorable, kawaii-themed colors and font.
*   Cute Sound Effects! ✨ (Requires user interaction to enable; sound files needed locally).
*   Runs in desktop browsers.
*   _Mobile controls (Planned)_
*   _Difficulty scaling (Planned)_
*   _Pause / Hold / Advanced Scoring (Future Ideas)_

## 🧭 Roadmap

The detailed plan, milestones, and remaining tasks are tracked in the **[TODO Roadmap](TODO.md)**.

## 🚀 Deployment

Deployed automatically via GitHub Actions ([`peaceiris/actions-gh-pages`](https://github.com/peaceiris/actions-gh-pages)) on push to `master`. Live at: **[https://pez.github.io/kawaii-tetris-1/](https://pez.github.io/kawaii-tetris-1/)**

---