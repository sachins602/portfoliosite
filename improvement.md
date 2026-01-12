# Portfolio Improvement Plan

This document serves as a master checklist for optimizing the portfolio. It is designed to be executed by AI agents or developers.
**Tech Stack Context**: Next.js 16 (Canary/Latest), React 19, Tailwind v4, Anime.js v4, Biome, TypeScript 5.

- [ ] **Priority**: High - Critical Performance & Architecture
- [ ] **Priority**: Medium - UI/UX & Refactoring
- [ ] **Priority**: Low - Visual Polish & "Cool Stuff"

---

## 1. Next.js 16 & React 19 Performance Optimizations

### cacheComponents Readiness
Next.js 16 introduces cacheComponents, which mixes static and dynamic content in the same route.
- [x] **Task**: Enable and configure cacheComponents.
- [x] **Subtask**: Identify dynamic holes (e.g., `performance-metrics.tsx`, `github-stats.tsx`) and wrap them in `<Suspense>`.
- [x] **Subtask**: Ensure static parts (Header, Footer, Hero text) render instantly.

> **Context for AI**: 
> Update `next.config.ts`:
> ```ts
> const nextConfig: NextConfig = {
>   experimental: {
>     ppr: true, // Enable Partial Prerendering
>     reactCompiler: true,
>   }
> };
> ```
> Wrap dynamic components in `page.tsx`:
> ```tsx
> import { Suspense } from 'react';
> import { Skeleton } from './ui/skeleton';
> 
> export default function Page() {
>   return (
>     <main>
>       <StaticComponent />
>       <Suspense fallback={<Skeleton />}>
>         <DynamicComponent />
>       </Suspense>
>     </main>
>   );
> }
> ```

### React Compiler Optimization
Since `reactCompiler: true` is enabled, we should remove manual memoization that clutters the code.
- [x] **Task**: Scan codebase for `useMemo` and `useCallback`.
- [x] **Subtask**: Remove `useMemo` for simple derivations (React Compiler handles this).
- [x] **Subtask**: Remove `useCallback` for simple event handlers passed to children.
- [x] **Exception**: Keep them only if you are interfacing with external libraries that rely on reference equality (like some Anime.js hooks might, but usually Compiler is smart enough).

### Image & Asset Optimization
- [x] **Task**: Implement AVIF/WebP strictness.
- [x] **Task**: Use `next/image`'s `sizes` prop correctly on the Project Card images to prevent loading 4k images on mobile.
- [x] **Task**: Verify `fetchPriority="high"` is used on the Hero LCP (Largest Contentful Paint) element.

> **Context for AI**:
> When using `<Image />`, ensure the `sizes` attribute matches the CSS layout.
> ```tsx
> // For a grid of 3 cards:
> <Image 
>   src={project.image} 
>   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
>   alt="Project"
> />
> ```

---

## 2. Code Architecture & Refactoring

### Strict Type Safety for Anime.js
The current `src/lib/anime.ts` wrapper might use `any` or loose types.
- [x] **Task**: Improve `AnimeParams` type definition.
- [x] **Subtask**: Create strong types for `targets` (limited to HTML Elements, NodeList, or plain objects).

### Folder Structure Reorganization
Separate business logic from presentation.
- [ ] **Task**: Move complex feature components to `src/app/_components/features/` (e.g., `github-stats`, `terminal`).
- [ ] **Task**: Move foundational UI to `src/app/_components/ui/` (e.g., `animated-number`, `button`).
- [ ] **Task**: Create `src/app/_components/sections/` for page sections (Hero, About).

### Component Composition Pattern
- [ ] **Task**: Refactor Sections to use a `Section` wrapper.
- [ ] **Context**:
  ```tsx
  // src/app/_components/ui/section.tsx
  interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    container?: boolean; // If true, wraps children in container
  }
  export function Section({ children, container = true, className, ...props }: SectionProps) {
    const content = container ? (
        <div className="container mx-auto px-4">{children}</div>
    ) : children;
    
    return (
      <section className={cn("py-20", className)} {...props}>
        {content}
      </section>
    );
  }
  ```

### Strict Mode & Hydration Audit
- [ ] **Task**: Review `layout.tsx` for `suppressHydrationWarning`.
- [ ] **Subtask**: Move the theme initialization script to a dedicated helper/constants file (`theme-script.tsx`) to keep layout clean and testable.

---

## 3. Advanced Animation Library (Ideas & Tasks)

This section contains multiple "Gold Plating" ideas. **Choose one or mix them.**

### Option A: Interactive "Constellation" Background
A highly intricate, mouse-reactive background.
- [ ] **Task**: Build `ConstellationBackground` component.
- [ ] **Subtask**: Canvas setup with High DPI support (for Retina displays).
- [ ] **Subtask**: Particle Class/Object structure (x, y, vx, vy, radius).
- [ ] **Subtask**: Mouse interaction logic (particles flee or attract to cursor).
- [ ] **Subtask**: Line drawing logic (draw line if distance < threshold).
- [ ] **Optimization**: Use `requestAnimationFrame` for the loop, do NOT use React state for particle positions.

> **Context for AI**:
> Use a ref for the canvas and specific non-react state for particles.
> ```tsx
> const particles = useRef<Particle[]>([]);
> const mouse = useRef({ x: 0, y: 0 });
> 
> // In animation loop:
> context.clearRect(0, 0, width, height);
> particles.current.forEach(p => {
>   // Physics math here
>   // Draw arc
> });
> // Nested loop for lines (optimize by checking only nearby particles)
> ```

### Option B: Interactive "Fluid Distortion" Image Hover
**Concept**: A WebGL-like liquid distortion effect using **pure SVG Filters** and Anime.js.
- [ ] **Task**: Create `DistortionImage` component.
- [ ] **Subtask**: Embed a hidden SVG with a `<filter>` containing `<feDisplacementMap>` and `<feTurbulence>`.
- [ ] **Subtask**: On hover, use Anime.js to animate the `baseFrequency` or `scale` attribute of the turbulence.
- [ ] **Subtask**: Apply this filter via CSS `filter: url(#distortion-id)` to project cards or the hero image.

> **Context for AI**:
> ```tsx
> // Function to animate filter attributes
> function onEnter() {
>    anime({
>      targets: 'filter feDisplacementMap',
>      scale: [0, 30], // Ramp up distortion
>      baseFrequency: [0.01, 0.4], 
>      duration: 500,
>      easing: 'easeOutQuad'
>    });
> }
> ```

### Option C: Magnetic Buttons
**Concept**: Buttons that physically move towards the cursor when hovered.
- [ ] **Task**: Create a `MagneticButton` wrapper.
- [ ] **Description**: When mouse hovers near the button, the button moves *towards* the cursor slightly using `translateX/Y`.
- [ ] **Context**:
  ```tsx
  <MagneticButton>
    <button>Hover Me</button>
  </MagneticButton>
  ```

### Option D: "Ghost Text" Stagger Effect
**Concept**: Text that splits into RGB channels or blurs directionally.
- [ ] **Task**: Create `GhostText` component.
- [ ] **Subtask**: Render 3 copies of the text (Red, Green, Blue) absolutely positioned on top of each other.
- [ ] **Subtask**: Use Anime.js `stagger` to move them slightly apart on hover.

---

## 4. UI/UX Improvements

### Accessibility (a11y) Audit
- [ ] **Task**: Run a manual audit of tab ordering.
- [ ] **Task**: Ensure `prefers-reduced-motion` completely disables the complex effects (return `null` or static image).

### Scroll Progress Integration
- [ ] **Task**: Enhance `ScrollProgress` bar.
- [ ] **Subtask**: Add a "glow" effect to the tip of the progress bar using a pseudo-element and box-shadow, matching the theme accent.

### Loading States
- [ ] **Task**: Create generalized `Skeleton` components.
- [ ] **Subtask**: Replace jarring layout shifts in `GithubStats` and `PerformanceMetrics` with smooth skeleton loaders that match the final dimensions.

---

## 5. Deployment & CI/CD Speed
- [ ] **Task**: Verify `next.config.ts` has `swcMinify: true` (default in newer versions, but good to check).
- [ ] **Task**: Check if `logging` is enabled in `next.config.ts` for fetcching (Next.js 15+ feature `logging: { fetches: { fullUrl: true } }`) to debug data fetching waterfalls during dev.

## 6. Advanced Refactoring (AI Agent Specific)

### Hero Animation Refactor
- [ ] **Task**: Refactor `Hero.tsx` to use `anime.timeline()` master timeline.
- [ ] **Reasoning**: Currently uses nested `setTimeout` which is hard to debug and race-condition prone.
- [ ] **Context**:
  ```ts
  const tl = anime.timeline({ easing: 'easeOutExpo' });
  tl.add({ targets: refs.greeting, ... })
    .add({ targets: refs.name, ... }, '-=200'); // Overlap
  ```

### Dependency Injection for Data
- [ ] **Task**: Refactor direct API calls in components to use a Custom Hook layer that explicitly calls TRPC.
- [ ] **Reasoning**: Decouples UI from data fetching implementation, making testing easier.

### Error Boundary Strategy
- [ ] **Task**: Add `error.tsx` in `src/app/` to catch runtime errors gracefully.
- [ ] **Task**: Create specific error boundaries for heavy components (e.g., `<GithubStats />`) so one API failure doesn't crash the page.
- [ ] **Context**:
  ```tsx
  // src/app/_components/features/github-stats-error.tsx
  'use client'; 
  export default function GithubVisualError({ reset }: { reset: () => void }) {
    return <div onClick={reset}>Failed to load GitHub stats. Retry?</div>
  }
  ```
