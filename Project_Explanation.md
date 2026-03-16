# Radix Sort Visualizer - Technical Documentation

## 1. Project Overview
The Radix Sort Visualizer is a full-stack web application designed to demonstrate the step-by-step mechanics of the Radix Sort algorithm. It provides an interactive interface where users can input custom numbers, control sorting speed, and observe how numbers are distributed into buckets based on their digits.

## 2. Programming Languages & Technologies
*   **TypeScript**: Used for the core logic and algorithm. It ensures type safety and reduces runtime errors.
*   **React**: The UI framework used for component-based architecture and state management.
*   **Tailwind CSS**: A utility-first CSS framework used for responsive design and styling.
*   **Framer Motion (motion/react)**: Used for high-performance layout animations.
*   **Vite**: The build tool and development server.

## 3. Algorithm Implementation (Radix Sort)
The algorithm is implemented in `src/utils/radixSort.ts`. Unlike comparison-based sorts (like QuickSort), Radix Sort is a **non-comparative integer sorting algorithm**.

### Key Logic:
*   **Digit Isolation**: The app uses the formula `Math.floor((number / digitPlace) % 10)` to extract specific digits for sorting.
*   **State Snapshots**: Instead of returning only the final sorted array, the function `getRadixSortSteps` returns an array of "Step" objects. Each object captures a "snapshot" of the data at a specific moment (e.g., during distribution into buckets or collection back into the main array).
*   **Passes**: The number of passes is determined by the maximum value in the input set (`Math.max(...array)`).

## 4. Frontend Architecture
The application follows a reactive programming model:
*   **State-Driven UI**: The UI is a direct reflection of the `currentStepIdx`. When the index changes, React automatically updates the view to match that specific snapshot of the algorithm.
*   **Playback Engine**: A `setInterval` inside a `useEffect` hook handles the automatic progression through the steps, creating the "animation" effect.
*   **Layout Transitions**: Framer Motion handles the "tweening" between states. When a number moves from the main list to a bucket, the library calculates the physical path and animates the translation.

## 5. PWA & Offline Capabilities
The project is configured as a **Progressive Web App (PWA)**:
*   **Service Worker**: A background script caches all necessary assets (HTML, JS, CSS).
*   **Offline Functionality**: Since the sorting logic is executed client-side (in the browser), the app requires no server communication once loaded.
*   **Installation**: Using the `beforeinstallprompt` API, a custom installation flow was implemented to allow users to install the app on their devices.

## 6. Complexity Analysis
*   **Time Complexity**: O(nk), where *n* is the number of elements and *k* is the number of digits in the largest number.
*   **Space Complexity**: O(n + d), where *d* is the base (10 for decimal numbers).

---
*Prepared for: First Year Computer Science Presentation*
