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
- [x] **Task**: Move complex feature components to `src/app/_components/features/` (e.g., `github-stats`, `terminal`).
- [x] **Task**: Move foundational UI to `src/app/_components/ui/` (e.g., `animated-number`, `button`).
- [x] **Task**: Create `src/app/_components/sections/` for page sections (Hero, About).

### Component Composition Pattern
- [x] **Task**: Refactor Sections to use a `Section` wrapper.
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
- [x] **Task**: Review `layout.tsx` for `suppressHydrationWarning`.
- [x] **Subtask**: Move the theme initialization script to a dedicated helper/constants file (`theme-script.tsx`) to keep layout clean and testable.

---

## 3. Advanced Animation Library (Ideas & Tasks)

This section contains comprehensive "Gold Plating" ideas for animation enhancements. These leverage your existing `anime.js` wrapper, `use-anime.ts` hooks, and animation presets in `animations.ts`.

> [!TIP]
> You already have a solid animation foundation with `prefersReducedMotion()`, timing/easing presets, and hooks like `useScrollTrigger` and `useStaggerReveal`. All new animations should integrate with this system.

---

### Animation Infrastructure Improvements

Before implementing fancy animations, enhance the core infrastructure:

- [x] **Task**: Create `useAnimationTimeline` hook for coordinated multi-step animations
- [x] **Subtask**: Wrap `anime.timeline()` with React lifecycle management
- [x] **Subtask**: Add cleanup on unmount to prevent memory leaks
- [ ] **Code Reference**:
  ```tsx
  // src/hooks/use-animation-timeline.ts
  import { useEffect, useRef } from "react";
  import { createTimeline, type Timeline } from "animejs";
  import { prefersReducedMotion } from "~/lib/animations";

  export function useAnimationTimeline(
    buildTimeline: (tl: Timeline) => void,
    deps: unknown[] = []
  ) {
    const timelineRef = useRef<Timeline | null>(null);

    useEffect(() => {
      if (prefersReducedMotion()) return;

      const tl = createTimeline({
        autoplay: false,
        defaults: { easing: "easeOutQuad" },
      });

      buildTimeline(tl);
      timelineRef.current = tl;
      tl.play();

      return () => {
        tl.pause();
        timelineRef.current = null;
      };
    }, deps);

    return timelineRef;
  }
  ```

- [x] **Task**: Create `useMouse` hook for mouse position tracking (reusable across components)
  ```tsx
  // src/hooks/use-mouse.ts
  import { useEffect, useRef } from "react";

  interface MousePosition {
    x: number;
    y: number;
    clientX: number;
    clientY: number;
  }

  export function useMouse<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const mouse = useRef<MousePosition>({ x: 0, y: 0, clientX: 0, clientY: 0 });

    useEffect(() => {
      const element = ref.current;
      if (!element) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        mouse.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          clientX: e.clientX,
          clientY: e.clientY,
        };
      };

      element.addEventListener("mousemove", handleMouseMove);
      return () => element.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return { ref, mouse };
  }
  ```

- [x] **Task**: Add animation performance utilities to `lib/animations.ts`
  ```tsx
  // Add to src/lib/animations.ts
  
  /** Check if device is low-powered (for throttling animations) */
  export function isLowPowerDevice(): boolean {
    if (typeof navigator === "undefined") return false;
    return navigator.hardwareConcurrency <= 4 || 
           /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  /** Get animation frame budget based on device capability */
  export function getParticleCount(desired: number): number {
    if (prefersReducedMotion()) return 0;
    if (isLowPowerDevice()) return Math.floor(desired * 0.5);
    return desired;
  }
  ```

---

### Option A: Interactive "Constellation" Background

A highly intricate, mouse-reactive particle background that can replace or enhance your current `HeroBackground`.

**Why this over current implementation**: Your `hero-background.tsx` creates 30 simple particles with anime.js. A Canvas-based constellation can handle 100+ particles with better performance and real-time mouse interaction.

- [x] **Task**: Build `ConstellationBackground` component in `src/app/_components/ui/`
- [x] **Subtask**: Create Particle class with physics properties
  ```tsx
  // Particle interface for type safety
  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    baseRadius: number;
    color: string;
    alpha: number;
  }
  ```
- [x] **Subtask**: Canvas setup with High DPI support (for Retina displays)
  ```tsx
  // Scale canvas for retina displays
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(dpr, dpr);
  ```
- [x] **Subtask**: Initialize particles with random positions and velocities
  ```tsx
  const initParticles = (count: number): Particle[] => {
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      baseRadius: Math.random() * 2 + 1,
      color: "var(--accent)",
      alpha: Math.random() * 0.5 + 0.3,
    }));
  };
  ```
- [x] **Subtask**: Mouse interaction logic (particles flee from cursor with force falloff)
  ```tsx
  const applyMouseForce = (particle: Particle, mouse: { x: number; y: number }) => {
    const dx = particle.x - mouse.x;
    const dy = particle.y - mouse.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 150;

    if (distance < maxDistance) {
      const force = (1 - distance / maxDistance) * 0.03;
      particle.vx += (dx / distance) * force;
      particle.vy += (dy / distance) * force;
      // Grow particles near mouse
      particle.radius = particle.baseRadius * (1 + (1 - distance / maxDistance) * 0.5);
    } else {
      particle.radius = particle.baseRadius;
    }
  };
  ```
- [x] **Subtask**: Line drawing logic with distance threshold
  ```tsx
  const drawConnections = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    const maxDistance = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const alpha = (1 - distance / maxDistance) * 0.3;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`; // accent color
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };
  ```
- [x] **Subtask**: Boundary wrapping (particles wrap around screen edges)
- [x] **Subtask**: Apply velocity damping to prevent infinite acceleration
- [x] **Optimization**: Use `requestAnimationFrame` with proper cleanup
  ```tsx
  useEffect(() => {
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.current.forEach(p => {
        applyMouseForce(p, mouse.current);
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99; // damping
        p.vy *= 0.99;
        // Boundary wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${p.alpha})`;
        ctx.fill();
      });
      drawConnections(ctx, particles.current);
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);
  ```
- [ ] **Optimization**: Use spatial partitioning (grid) for line detection when particle count > 100
- [ ] **Integration**: Add toggle to switch between current `HeroBackground` and `ConstellationBackground`

---

### Option B: Interactive "Fluid Distortion" Image Hover

**Concept**: A WebGL-like liquid distortion effect using **pure SVG Filters** and Anime.js. Perfect for your `ProjectCard` images.

- [ ] **Task**: Create `DistortionImage` wrapper component
- [ ] **Subtask**: Create reusable SVG filter definition
  ```tsx
  // src/app/_components/ui/distortion-filter.tsx
  export function DistortionFilter({ id }: { id: string }) {
    return (
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01"
              numOctaves="2"
              result="noise"
              data-turbulence
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
              data-displacement
            />
          </filter>
        </defs>
      </svg>
    );
  }
  ```
- [ ] **Subtask**: Create `DistortionImage` component with hover animation
  ```tsx
  // src/app/_components/ui/distortion-image.tsx
  "use client";

  import { useRef, type ReactNode } from "react";
  import { prefersReducedMotion, timing, easing } from "~/lib/animations";
  import anime from "~/lib/anime";
  import { DistortionFilter } from "./distortion-filter";

  interface DistortionImageProps {
    children: ReactNode;
    intensity?: number; // Max distortion scale (default: 30)
    className?: string;
  }

  export function DistortionImage({ 
    children, 
    intensity = 30, 
    className 
  }: DistortionImageProps) {
    const filterId = useRef(`distortion-${Math.random().toString(36).slice(2)}`);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
      if (prefersReducedMotion()) return;
      
      const filter = document.querySelector(
        `#${filterId.current} [data-displacement]`
      );
      const turbulence = document.querySelector(
        `#${filterId.current} [data-turbulence]`
      );

      if (filter && turbulence) {
        anime({
          targets: filter,
          scale: [0, intensity],
          duration: timing.normal,
          easing: easing.easeOut,
        });
        anime({
          targets: turbulence,
          baseFrequency: [0.01, 0.03],
          duration: timing.normal,
          easing: easing.easeOut,
        });
      }
    };

    const handleMouseLeave = () => {
      if (prefersReducedMotion()) return;

      const filter = document.querySelector(
        `#${filterId.current} [data-displacement]`
      );
      const turbulence = document.querySelector(
        `#${filterId.current} [data-turbulence]`
      );

      if (filter && turbulence) {
        anime({
          targets: filter,
          scale: 0,
          duration: timing.fast,
          easing: easing.easeOut,
        });
        anime({
          targets: turbulence,
          baseFrequency: 0.01,
          duration: timing.fast,
          easing: easing.easeOut,
        });
      }
    };

    return (
      <div
        ref={containerRef}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ filter: `url(#${filterId.current})` }}
      >
        <DistortionFilter id={filterId.current} />
        {children}
      </div>
    );
  }
  ```
- [ ] **Subtask**: Integrate with `ProjectCard` image section
  ```tsx
  // In project-card.tsx, wrap the Image:
  <DistortionImage intensity={20}>
    <Image src={project.image} alt={project.name} fill />
  </DistortionImage>
  ```
- [ ] **Subtask**: Add `data-reduce-motion` fallback (show simple zoom instead)
- [ ] **Subtask**: Performance test on mobile (disable if laggy)

---

### Option C: Magnetic Buttons

**Concept**: Buttons that physically move towards the cursor when hovered, creating a "magnetic" pull effect. Perfect for CTA buttons in Hero section.

- [ ] **Task**: Create `MagneticButton` wrapper component
- [ ] **Subtask**: Implement mouse position tracking relative to button center
  ```tsx
  // src/app/_components/ui/magnetic-button.tsx
  "use client";

  import { useRef, type ReactNode } from "react";
  import { prefersReducedMotion, timing, easing } from "~/lib/animations";
  import anime from "~/lib/anime";

  interface MagneticButtonProps {
    children: ReactNode;
    strength?: number; // Magnetic pull strength (default: 0.3)
    className?: string;
  }

  export function MagneticButton({ 
    children, 
    strength = 0.3, 
    className 
  }: MagneticButtonProps) {
    const buttonRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion() || !buttonRef.current) return;

      const button = buttonRef.current;
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };

    const handleMouseLeave = () => {
      if (prefersReducedMotion() || !buttonRef.current) return;

      anime({
        targets: buttonRef.current,
        translateX: 0,
        translateY: 0,
        duration: timing.normal,
        easing: easing.elasticOut,
      });
    };

    return (
      <div
        ref={buttonRef}
        className={className}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ display: "inline-block", willChange: "transform" }}
      >
        {children}
      </div>
    );
  }
  ```
- [ ] **Subtask**: Add optional magnetic area expansion (activates before cursor is directly over button)
  ```tsx
  // Enhanced version with expanded hit area
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    // Add event listener to parent or window for wider range
    window.addEventListener("mousemove", trackMouse);
  };
  ```
- [ ] **Subtask**: Integrate with Hero CTA buttons
  ```tsx
  // In hero.tsx
  <MagneticButton strength={0.4}>
    <button className="..." onClick={() => scrollToSection("projects")}>
      View Projects
    </button>
  </MagneticButton>
  ```
- [ ] **Subtask**: Add inner content counter-movement for depth effect
  ```tsx
  // Move inner content slightly opposite to outer wrapper
  const innerRef = useRef<HTMLElement>(null);
  // On mouse move:
  if (innerRef.current) {
    innerRef.current.style.transform = `translate(${-deltaX * 0.2}px, ${-deltaY * 0.2}px)`;
  }
  ```
- [ ] **Subtask**: Handle touch devices (disable magnetic effect, use standard hover)

---

### Option D: "Ghost Text" Stagger Effect

**Concept**: Text that splits into RGB channels or blurs directionally on hover, creating a glitchy/chromatic aberration effect.

- [ ] **Task**: Create `GhostText` component
- [ ] **Subtask**: Render 3 offset copies of the text (Red, Green, Blue channels)
  ```tsx
  // src/app/_components/ui/ghost-text.tsx
  "use client";

  import { useRef, type ReactNode } from "react";
  import { prefersReducedMotion, timing, easing } from "~/lib/animations";
  import anime from "~/lib/anime";

  interface GhostTextProps {
    children: ReactNode;
    className?: string;
    offsetDistance?: number; // Max offset in pixels (default: 4)
  }

  export function GhostText({ 
    children, 
    className, 
    offsetDistance = 4 
  }: GhostTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const redRef = useRef<HTMLSpanElement>(null);
    const greenRef = useRef<HTMLSpanElement>(null);
    const blueRef = useRef<HTMLSpanElement>(null);

    const handleMouseEnter = () => {
      if (prefersReducedMotion()) return;

      anime({
        targets: redRef.current,
        translateX: -offsetDistance,
        translateY: -offsetDistance / 2,
        duration: timing.fast,
        easing: easing.easeOut,
      });

      anime({
        targets: greenRef.current,
        translateX: offsetDistance,
        translateY: 0,
        duration: timing.fast,
        easing: easing.easeOut,
      });

      anime({
        targets: blueRef.current,
        translateX: 0,
        translateY: offsetDistance / 2,
        duration: timing.fast,
        easing: easing.easeOut,
      });
    };

    const handleMouseLeave = () => {
      if (prefersReducedMotion()) return;

      const targets = [redRef.current, greenRef.current, blueRef.current];
      anime({
        targets,
        translateX: 0,
        translateY: 0,
        duration: timing.fast,
        easing: easing.easeOut,
      });
    };

    return (
      <div
        ref={containerRef}
        className={`relative inline-block ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Red channel */}
        <span
          ref={redRef}
          className="absolute inset-0 text-red-500 mix-blend-screen"
          style={{ opacity: 0.8 }}
          aria-hidden="true"
        >
          {children}
        </span>
        {/* Green channel */}
        <span
          ref={greenRef}
          className="absolute inset-0 text-green-500 mix-blend-screen"
          style={{ opacity: 0.8 }}
          aria-hidden="true"
        >
          {children}
        </span>
        {/* Blue channel */}
        <span
          ref={blueRef}
          className="absolute inset-0 text-blue-500 mix-blend-screen"
          style={{ opacity: 0.8 }}
          aria-hidden="true"
        >
          {children}
        </span>
        {/* Original text (screen reader accessible) */}
        <span className="relative">{children}</span>
      </div>
    );
  }
  ```
- [ ] **Subtask**: Add direction-aware offset (offset follows mouse direction)
  ```tsx
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angleX = (e.clientX - centerX) / rect.width;
    const angleY = (e.clientY - centerY) / rect.height;
    
    // Offset based on mouse position relative to center
    redRef.current!.style.transform = 
      `translate(${-angleX * offsetDistance}px, ${-angleY * offsetDistance}px)`;
    // ... similar for green and blue
  };
  ```
- [ ] **Subtask**: Create variant with blur instead of color split
  ```tsx
  // GhostTextBlur variant - uses directional blur
  <span 
    className="absolute inset-0" 
    style={{ filter: "blur(2px) brightness(1.2)" }} 
  />
  ```
- [ ] **Subtask**: Integrate with Hero name or section headings
- [ ] **Subtask**: Ensure accessibility (original text remains readable)

---

### Option E: Parallax Scroll Reveal (NEW)

**Concept**: Elements reveal with a parallax depth effect as they scroll into view. Layered elements move at different speeds.

**Integration Note**: Enhances your existing `useScrollTrigger` hook usage in sections like About and Projects.

- [ ] **Task**: Create `ParallaxReveal` wrapper component
- [ ] **Subtask**: Track scroll position relative to viewport
  ```tsx
  // src/app/_components/ui/parallax-reveal.tsx
  "use client";

  import { useRef, useEffect, type ReactNode } from "react";
  import { prefersReducedMotion } from "~/lib/animations";

  interface ParallaxRevealProps {
    children: ReactNode;
    speed?: number; // Parallax speed multiplier (default: 0.3)
    direction?: "up" | "down" | "left" | "right";
    className?: string;
  }

  export function ParallaxReveal({
    children,
    speed = 0.3,
    direction = "up",
    className,
  }: ParallaxRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (prefersReducedMotion() || !ref.current) return;

      const element = ref.current;
      let rafId: number;

      const handleScroll = () => {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate progress (0 = just entering, 1 = fully visible)
        const progress = 1 - (rect.top / viewportHeight);
        const offset = progress * 100 * speed;

        let transform = "";
        switch (direction) {
          case "up":
            transform = `translateY(${-offset}px)`;
            break;
          case "down":
            transform = `translateY(${offset}px)`;
            break;
          case "left":
            transform = `translateX(${-offset}px)`;
            break;
          case "right":
            transform = `translateX(${offset}px)`;
            break;
        }

        element.style.transform = transform;
      };

      const throttledScroll = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          handleScroll();
          rafId = 0;
        });
      };

      window.addEventListener("scroll", throttledScroll, { passive: true });
      handleScroll();

      return () => {
        window.removeEventListener("scroll", throttledScroll);
        if (rafId) cancelAnimationFrame(rafId);
      };
    }, [speed, direction]);

    return (
      <div ref={ref} className={className} style={{ willChange: "transform" }}>
        {children}
      </div>
    );
  }
  ```
- [ ] **Subtask**: Create `ParallaxGroup` for layered parallax effect
  ```tsx
  // Multiple children at different speeds
  <ParallaxGroup>
    <ParallaxLayer speed={0.2}><Background /></ParallaxLayer>
    <ParallaxLayer speed={0.5}><Midground /></ParallaxLayer>
    <ParallaxLayer speed={0.8}><Foreground /></ParallaxLayer>
  </ParallaxGroup>
  ```
- [ ] **Subtask**: Add opacity fade tied to scroll progress
- [ ] **Subtask**: Integrate with About section background decorations
- [ ] **Subtask**: Add `rootMargin` option to start animation before element enters viewport

---

### Option F: Text Scramble Effect (NEW)

**Concept**: Text characters scramble through random characters before settling on the final value. Great for headings and emphasis text.

**Similar to**: Terminal boot sequences, hacker movie aesthetics

- [ ] **Task**: Create `TextScramble` component
- [ ] **Subtask**: Implement character-by-character reveal with random substitution
  ```tsx
  // src/app/_components/ui/text-scramble.tsx
  "use client";

  import { useEffect, useState, useRef } from "react";
  import { prefersReducedMotion } from "~/lib/animations";

  interface TextScrambleProps {
    text: string;
    className?: string;
    speed?: number; // ms per character (default: 50)
    triggerOnView?: boolean;
  }

  const CHARS = "!<>-_\\/[]{}—=+*^?#________";

  export function TextScramble({
    text,
    className,
    speed = 50,
    triggerOnView = true,
  }: TextScrambleProps) {
    const [displayText, setDisplayText] = useState(text);
    const [isAnimating, setIsAnimating] = useState(false);
    const containerRef = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
      if (prefersReducedMotion()) {
        setDisplayText(text);
        return;
      }

      if (!triggerOnView) {
        runScramble();
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            runScramble();
          }
        },
        { threshold: 0.5 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }, [text, triggerOnView]);

    const runScramble = () => {
      if (isAnimating) return;
      setIsAnimating(true);

      const finalChars = text.split("");
      const currentChars = Array(text.length).fill("");
      let revealed = 0;

      const interval = setInterval(() => {
        // Scramble unrevealed characters
        const scrambled = currentChars.map((char, i) => {
          if (i < revealed) return finalChars[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        });

        setDisplayText(scrambled.join(""));
        revealed++;

        if (revealed > text.length) {
          clearInterval(interval);
          setDisplayText(text);
          setIsAnimating(false);
        }
      }, speed);

      return () => clearInterval(interval);
    };

    return (
      <span ref={containerRef} className={className}>
        {displayText}
      </span>
    );
  }
  ```
- [ ] **Subtask**: Add `delay` prop for staggered reveals across multiple elements
- [ ] **Subtask**: Add `loop` mode for continuous scrambling (for loading states)
  ```tsx
  // Continuous scramble mode
  const loopInterval = setInterval(() => {
    setDisplayText(text.split("").map((char, i) => 
      Math.random() > 0.7 ? CHARS[Math.floor(Math.random() * CHARS.length)] : char
    ).join(""));
  }, 100);
  ```
- [ ] **Subtask**: Create `ScrambleLink` variant (scrambles on hover)
  ```tsx
  export function ScrambleLink({ children, href }: { children: string; href: string }) {
    const [displayText, setDisplayText] = useState(children);

    const handleMouseEnter = () => runScramble(children, setDisplayText);
    const handleMouseLeave = () => setDisplayText(children);

    return (
      <a href={href} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {displayText}
      </a>
    );
  }
  ```
- [ ] **Subtask**: Integrate with Hero greeting or section titles
- [ ] **Subtask**: Ensure font is monospace or has consistent character widths to prevent layout shift

---

### Option G: Morphing Shapes Background (NEW)

**Concept**: Smooth, organic blob shapes in the background that continuously morph and float.

**Why**: Adds visual interest without being distracting. Modern, glassmorphism-friendly.

- [ ] **Task**: Create `MorphingBlobs` component using SVG
- [ ] **Subtask**: Define smooth blob paths using cubic beziers
  ```tsx
  // src/app/_components/ui/morphing-blobs.tsx
  "use client";

  import { useEffect, useRef } from "react";
  import { prefersReducedMotion } from "~/lib/animations";
  import anime from "~/lib/anime";

  const BLOB_PATHS = [
    "M440,320 C440,400 360,480 260,480 C160,480 80,400 80,320 C80,240 160,160 260,160 C360,160 440,240 440,320",
    "M420,300 C420,420 340,480 240,480 C140,480 60,380 60,300 C60,220 140,160 240,160 C340,160 420,180 420,300",
    "M400,340 C400,440 300,500 220,500 C140,500 60,420 60,340 C60,260 120,140 220,140 C320,140 400,240 400,340",
  ];

  export function MorphingBlobs() {
    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
      if (prefersReducedMotion() || !pathRef.current) return;

      let currentIndex = 0;
      const animate = () => {
        currentIndex = (currentIndex + 1) % BLOB_PATHS.length;
        
        anime({
          targets: pathRef.current,
          d: BLOB_PATHS[currentIndex],
          duration: 4000,
          easing: "easeInOutQuad",
          complete: animate,
        });
      };

      animate();
    }, []);

    return (
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 500 500"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="blob-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.05" />
          </linearGradient>
          <filter id="blob-blur">
            <feGaussianBlur stdDeviation="20" />
          </filter>
        </defs>
        <path
          ref={pathRef}
          d={BLOB_PATHS[0]}
          fill="url(#blob-gradient)"
          filter="url(#blob-blur)"
        />
      </svg>
    );
  }
  ```
- [ ] **Subtask**: Add multiple blobs with different colors and timings
  ```tsx
  // Create 3 blobs with staggered animation
  const blobs = [
    { color: "accent", delay: 0 },
    { color: "accent-secondary", delay: 2000 },
    { color: "accent-tertiary", delay: 4000 },
  ];
  ```
- [ ] **Subtask**: Add subtle floating motion to each blob
  ```tsx
  anime({
    targets: blobRef.current,
    translateX: [
      { value: 20, duration: 3000 },
      { value: -20, duration: 3000 },
    ],
    translateY: [
      { value: -15, duration: 2500 },
      { value: 15, duration: 2500 },
    ],
    loop: true,
    direction: "alternate",
    easing: "easeInOutSine",
  });
  ```
- [ ] **Subtask**: Consider performance - use will-change: transform, filter
- [ ] **Subtask**: Integrate as background layer in Hero or Contact sections

---

### Integration Priority Recommendations

Based on your website structure:

| Priority | Animation | Best Location | Complexity |
|----------|-----------|---------------|------------|
| 1 | Magnetic Buttons | Hero CTAs | Low |
| 2 | Text Scramble | Hero greeting/name | Medium |
| 3 | Fluid Distortion | Project Cards | Medium |
| 4 | Constellation | Hero Background (replace current) | High |
| 5 | Ghost Text | Section headings | Medium |
| 6 | Parallax Reveal | About/Projects sections | Low |
| 7 | Morphing Blobs | Contact section | Medium |

> [!IMPORTANT]
> Always test with `prefers-reduced-motion` enabled. Every animation component should gracefully degrade to static content for accessibility compliance.

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
