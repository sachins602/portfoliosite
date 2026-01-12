# Portfolio Improvement Plan

This document tracks identified areas for improvement in the project, ranging from code quality and architecture to UI/UX and advanced animations.

- [ ] **Priority**: High - Critical fixes and improvements
- [ ] **Priority**: Medium - UI/UX and Refactoring
- [ ] **Priority**: Low - Polish and "Cool Stuff"

## 1. Code Architecture & Refactoring

### Folder Structure Organization
Currently, the `src/app/_components` directory is a mix of UI components, sections, and feature-specific components.
- [ ] Create `src/app/_components/ui` for primitives (Button, Card, AnimatedNumber).
- [ ] Create `src/app/_components/features` for complex widgets (GithubStats, Terminal).
- [ ] Move `src/app/_components/sections` contents higher if preferred, or keep as is but strictly for page sections.

### Component Standardization
Many sections in `page.tsx` likely repeat container logic (padding, margins, constraints).
- [ ] Create a `SectionWrapper` component to standardize basic section layout.
  ```tsx
  // src/app/_components/ui/section-wrapper.tsx
  export function SectionWrapper({ children, id, className }: WrapperProps) {
    return (
      <section id={id} className={cn("py-16 md:py-24", className)}>
        <div className="container mx-auto px-4 md:px-6">
          {children}
        </div>
      </section>
    );
  }
  ```

### Strict Mode & Hydration
- [ ] Review `layout.tsx`: `suppressHydrationWarning` on `html` is a blunt instrument.
  - While needed for next-themes, ensure it's not hiding real errors.
  - Move the `dangerouslySetInnerHTML` script to a dedicated utils helper or custom Hook for cleaner code.
- [ ] Consider using `next-themes` library instead of manual theme handling to avoid edge cases and simplify the `layout.tsx`.

### Hook Cleanup
- [ ] `useTypewriter` in `use-anime.ts` uses `setTimeout` loops inside `useEffect`.
  - **Improvement**: Re-implement using `anime.js` timeline or ensure strictly typed cleanup to prevent memory leaks if component unmounts rapidly.

## 2. UI/UX Improvements

### Accessibility (a11y)
- [ ] **Focus Management**: Ensure the mobile menu traps focus when open.
- [ ] **Keyboard Nav**: Check that "Skip to content" link exists (or add one).
- [ ] **Labels**: Ensure all icon-only buttons (like Theme Toggle, Github Icon) have `aria-label`.

### Visual Consistency
- [ ] **Mixed Animations**: We use `anime.js` for some things, `animate-spin` (Tailwind) for others, and `setTimeout` for others.
  - **Task**: Standardize on `anime.js` for complex sequences and Tailwind `transition` for simple hover states. Avoid mixing `animate-bounce` with physics-based `anime.js` to keep the "feel" consistent.

### Loading States
- [ ] Add Skeleton loaders for async components (Github Stats, Performance Metrics) instead of jumping content when data loads.

## 3. "Cool Thing" - Advanced Animation

**Goal**: Create a "complicated" looking highly interactive background using `anime.js`.

### Proposal: Interactive Constellation Field
Replace the current random particles with a magnetically interactive grid.

- [ ] **Task**: Create `src/app/_components/ui/constellation-background.tsx`
- **Concept**:
  - A field of points that softly drift.
  - When Mouse moves near, points "gravitate" slightly away or toward the cursor.
  - Lines connect points if they are within a certain distance, creating a dynamic mesh.
  - Use `anime.js` to "stagger" the entrance of the points on load.

#### Architecture Example:
```tsx
// Abstract concept code
"use client";
import { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

export function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // ... setup resize observer ...

    // Particle System
    const particles = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    }));

    // Anime.js Entrance
    anime({
      targets: particles,
      x: (p) => p.x, // Just to register them if needed or animate radius
      radius: [0, 2],
      delay: anime.stagger(10),
      easing: 'easeOutElastic(1, .8)'
    });

    function loop() {
      // Update positions
      // Draw lines between close particles
      // Apply mouse force (optional)
      requestAnimationFrame(loop);
    }
    loop();
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10" />;
}
```

## 4. Specific Code Improvements

### `src/app/_components/sections/hero.tsx` Refactor
- [ ] **Issue**: `typingTimeoutRef` mixed with `anime.js` callbacks creates a complex, hard-to-debug flow.
- [ ] **Fix**: Create a `MasterTimeline` using `anime.timeline()`.
  
  **Pattern:**
  ```typescript
  useEffect(() => {
    const tl = anime.timeline({
      easing: 'easeOutExpo',
      duration: 750
    });

    tl
    .add({
      targets: refs.greeting,
      opacity: [0, 1],
      translateY: [20, 0]
    })
    .add({
      targets: refs.nameChars,
      opacity: [0, 1],
      translateY: [30, 0],
      delay: anime.stagger(50)
    })
    .add({
      // Replaces the setTimeout typewriter with opacity/width reveal
      targets: refs.subtitle, 
      opacity: [0, 1], 
      change: () => { /* Logic to swap text if needed */ }
    });
  }, []);
  ```

### `src/hooks/use-anime.ts` Type Safety
- [ ] `useStaggerReveal` currently takes `_items: unknown[]`.
- [ ] Change to generic: `export function useStaggerReveal<T, E extends HTMLElement>(items: T[], ...)` to ensure better usage safety.

## 5. Future Polish
- [ ] **Sound Design**: Add subtle sound effects (using `use-sound` or similar) on hover/click for that "premium" feel.
- [ ] **Page Transitions**: Implement a "curtain" reveal or shared layout transition between pages (if more pages are added).
