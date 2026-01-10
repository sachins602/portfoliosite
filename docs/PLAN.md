# Portfolio Website Implementation Plan

**Project**: Sachin Sapkota — Full-Stack Developer Portfolio  
**Created**: January 2026  
**Status**: Phase 1 Complete

---

## Current State Summary

**Already Set Up:**
- Next.js 16.1.1 with App Router
- React 19
- Tailwind CSS 4
- tRPC (type-safe API layer)
- Drizzle ORM with SQLite (libSQL)
- Bun package manager
- Biome linting/formatting
- Anime.js 4.2.2 installed
- Geist Sans font configured
- Basic T3 app boilerplate in place

**Needs To Be Done:**
- Complete portfolio UI/UX implementation
- All anime.js animations
- GitHub API integration
- Contact form with email
- Dark/light mode
- All 4 phases of features

---

## Phase 1: MVP — Core Requirements

### 1.1 Project Foundation & Configuration

- [x] **1.1.1 Update global CSS with theme variables**
  - **File**: `src/styles/globals.css`
  - **Context**: Define CSS custom properties for the color scheme
  - **Details**:
    - Dark mode default: background `#0f172a`, accent `#818cf8` (indigo/purple)
    - Light mode: background `#f8fafc`, same accents
    - Define gradient variables for hero and cards
    - Add smooth scrolling to html element
    - Add font-weight variables for typography hierarchy
    - Include `prefers-reduced-motion` media query styles

- [x] **1.1.2 Configure environment variables**
  - **File**: `src/env.ts`
  - **Context**: Add GitHub PAT and email service configuration
  - **Details**:
    - Add `GITHUB_TOKEN` or `GITHUB_PAT` for GitHub API authentication
    - Add `RESEND_API_KEY` for contact form email (Resend service)
    - Add `CONTACT_EMAIL` for form submissions target (sachinsapkota4@gmail.com)
    - Validate all env vars using @t3-oss/env-nextjs

- [x] **1.1.3 Install additional dependencies**
  - **Command**: Run in terminal
  - **Context**: Add missing packages required for the portfolio
  - **Packages to install**:
    - `lucide-react` — icon library
    - `resend` — email service for contact form
    - `@types/animejs` — TypeScript types for anime.js (if needed)
  - **Command**: `bun add lucide-react resend`

- [x] **1.1.4 Update root layout with dark mode support**
  - **File**: `src/app/layout.tsx`
  - **Context**: Add dark mode class handling and proper meta tags
  - **Details**:
    - Add `suppressHydrationWarning` to html tag
    - Add theme initialization script to prevent flash
    - Add dark class to html element by default
    - Update metadata with comprehensive SEO (title, description, Open Graph, Twitter cards)
    - Add keywords: "Full-Stack Developer", "Next.js", ".NET", "TypeScript", "Brampton Ontario"

- [x] **1.1.5 Create reusable anime.js hooks**
  - **File**: `src/hooks/use-anime.ts`
  - **Context**: Create custom React hooks for anime.js animations to ensure consistency
  - **Details**:
    - `useStaggerReveal` — staggered fade/translate animation for lists
    - `useScrollTrigger` — Intersection Observer + anime.js trigger
    - `useTypewriter` — letter-by-letter typing effect
    - `useElasticHover` — elastic scale on hover
    - `usePathDraw` — SVG path drawing animation
    - All hooks should respect `prefers-reduced-motion`

- [x] **1.1.6 Create anime.js utility functions**
  - **File**: `src/lib/animations.ts`
  - **Context**: Centralized animation configurations and presets
  - **Details**:
    - Export common easing functions (elastic.out, spring, etc.)
    - Export timing presets (fast: 300ms, normal: 500ms, slow: 800ms)
    - Export stagger configurations
    - Export animation factory functions for consistent usage

---

### 1.2 Navigation/Header Component

- [x] **1.2.1 Create Header component structure**
  - **File**: `src/app/_components/header.tsx`
  - **Context**: Fixed navigation bar at the top of the page
  - **Details**:
    - Fixed position at top with backdrop blur
    - Container with max-width and centered
    - Z-index high enough to stay above content
    - Transparent/semi-transparent background

- [x] **1.2.2 Implement animated logo**
  - **File**: `src/app/_components/header.tsx`
  - **Context**: "Sachin Sapkota" or "SS" logo with draw-in animation on load
  - **Details**:
    - SVG-based logo or styled text
    - Anime.js path draw animation on initial load
    - Link to top of page (smooth scroll)
    - Animation duration ~800ms with elastic easing

- [x] **1.2.3 Add navigation links with smooth scroll**
  - **File**: `src/app/_components/header.tsx`
  - **Context**: Links to each section of the single-page app
  - **Details**:
    - Links: About, Experience, Projects, Contact
    - Use native smooth scroll behavior or implement custom
    - Active state indicator based on scroll position
    - Hover animation (underline draw or color shift)

- [x] **1.2.4 Implement dark/light mode toggle**
  - **File**: `src/app/_components/theme-toggle.tsx`
  - **Context**: Animated sun/moon icon toggle
  - **Details**:
    - SVG morph animation between sun and moon icons using anime.js
    - Toggle between dark/light classes on html element
    - Persist preference in localStorage
    - System preference detection as default

- [x] **1.2.5 Create mobile hamburger menu**
  - **File**: `src/app/_components/mobile-menu.tsx`
  - **Context**: Responsive menu for mobile devices
  - **Details**:
    - Hamburger icon that morphs to X on open (anime.js)
    - Slide-in menu from right side
    - Full-screen overlay with backdrop
    - Staggered link animations on open
    - Close on link click or outside click

---

### 1.3 Hero Section

- [x] **1.3.1 Create Hero section container**
  - **File**: `src/app/_components/sections/hero.tsx`
  - **Context**: Full viewport height opening section
  - **Details**:
    - Min-height: 100vh
    - Flexbox centered content
    - Animated gradient or particle background
    - Responsive padding

- [x] **1.3.2 Implement animated name reveal**
  - **File**: `src/app/_components/sections/hero.tsx`
  - **Context**: "Sachin Sapkota" with staggered letter animation
  - **Details**:
    - Split text into individual spans for each letter
    - Anime.js stagger animation with `translateY` + `opacity`
    - Elastic easing (`easeOutElastic`)
    - Delay after page load (~200ms)
    - Total animation duration ~1200ms

- [x] **1.3.3 Implement typing effect subtitle**
  - **File**: `src/app/_components/sections/hero.tsx`
  - **Context**: "Full-Stack Developer | Next.js & .NET Specialist" with typing animation
  - **Details**:
    - Letter-by-letter reveal using anime.js timeline
    - Blinking cursor effect (CSS or anime.js)
    - Start after name animation completes
    - ~50ms per character

- [x] **1.3.4 Add tagline text**
  - **File**: `src/app/_components/sections/hero.tsx`
  - **Context**: "Building scalable web apps from Brampton, Ontario"
  - **Details**:
    - Fade in after subtitle completes
    - Subtle translateY animation
    - Muted/secondary text color

- [x] **1.3.5 Create animated CTA buttons**
  - **File**: `src/app/_components/sections/hero.tsx`
  - **Context**: "View Projects" and "Contact Me" buttons
  - **Details**:
    - "View Projects" — scrolls to projects section
    - "Contact Me" — scrolls to contact section
    - Hover: elastic scale + background gradient morph
    - Pulse animation on load completion
    - Primary and secondary button styles

- [x] **1.3.6 Implement animated background**
  - **File**: `src/app/_components/hero-background.tsx`
  - **Context**: Subtle particle field or wave SVG animation
  - **Details**:
    - Option A: Particle system with anime.js (floating dots with random movement)
    - Option B: SVG wave paths with looping animation
    - Low opacity, doesn't distract from content
    - Performance optimized (few particles, simple calculations)
    - Respects reduced motion preference

---

### 1.4 About Section

- [x] **1.4.1 Create About section container**
  - **File**: `src/app/_components/sections/about.tsx`
  - **Context**: Personal information and skills showcase
  - **Details**:
    - Section with ID for navigation
    - Animated section title with underline draw
    - Two-column layout on desktop (bio left, skills right)
    - Scroll-triggered animations

- [x] **1.4.2 Add bio content**
  - **File**: `src/app/_components/sections/about.tsx`
  - **Context**: Short professional biography
  - **Details**:
    - 2-3 paragraphs about background, expertise, goals
    - Highlight: Full-stack development, Next.js, .NET, TypeScript
    - Mention remote work readiness and Canadian location
    - Fade in on scroll

- [x] **1.4.3 Add contact information display**
  - **File**: `src/app/_components/sections/about.tsx`
  - **Context**: Location, email, phone, social links
  - **Details**:
    - Location: Brampton, Ontario, Canada
    - Email: sachinsapkota4@gmail.com
    - GitHub: github.com/sachins602
    - LinkedIn: (add if available)
    - Icon hover animations (scale + rotate using anime.js)

- [x] **1.4.4 Create skills grid with animated badges**
  - **File**: `src/app/_components/skills-grid.tsx`
  - **Context**: Tech stack badges that animate on scroll
  - **Details**:
    - Categories: Frontend, Backend, Database, DevOps, Tools
    - Skills: Next.js, React, TypeScript, .NET, Golang, Node.js, SQL, MongoDB, Docker, etc.
    - Badge design with icon + text
    - Staggered fade-in + translateY on scroll trigger
    - Hover: subtle scale + glow effect

- [ ] **1.4.5 Optional: Animated skill progress indicators**
  - **File**: `src/app/_components/skill-progress.tsx`
  - **Context**: Visual proficiency indicators for key skills
  - **Details**:
    - Circular progress or horizontal bars
    - Anime.js animation drawing the progress on scroll
    - Skills: Next.js 95%, .NET 90%, TypeScript 92%, etc.
    - Numbers count up as bar fills

---

### 1.5 Experience Section

- [x] **1.5.1 Create Experience section container**
  - **File**: `src/app/_components/sections/experience.tsx`
  - **Context**: Work history in timeline format
  - **Details**:
    - Section with ID for navigation
    - Animated section title
    - Vertical timeline layout
    - Responsive: timeline switches sides on mobile

- [x] **1.5.2 Create timeline component**
  - **File**: `src/app/_components/timeline.tsx`
  - **Context**: Vertical line with job nodes
  - **Details**:
    - SVG line that draws progressively on scroll using anime.js path animation
    - Node points at each job position
    - Alternating left/right cards on desktop
    - All cards on one side for mobile

- [x] **1.5.3 Create experience card component**
  - **File**: `src/app/_components/experience-card.tsx`
  - **Context**: Individual job entry card
  - **Details**:
    - Job title, company name, date range, location
    - Bullet points for responsibilities/achievements
    - Card fade/translate animation with bounce easing
    - Bullet points stagger in on card hover or scroll
    - Include experience data:
      - **Prodigitips Media Agency** — Full Stack Developer (include dates, location, key achievements)
      - **E-MultiTech Pvt. Ltd.** — (include dates, location, key achievements)

- [x] **1.5.4 Add experience data**
  - **File**: `src/lib/data/experience.ts`
  - **Context**: Static data for work experience
  - **Details**:
    - Export array of experience objects
    - Fields: id, title, company, location, startDate, endDate, bullets[], technologies[]
    - Populate from resume data

---

### 1.6 Projects Section

- [x] **1.6.1 Create Projects section container**
  - **File**: `src/app/_components/sections/projects.tsx`
  - **Context**: Main portfolio showcase with GitHub integration
  - **Details**:
    - Section with ID for navigation
    - Animated title with underline draw effect
    - Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)

- [x] **1.6.2 Create GitHub API fetching function**
  - **File**: `src/server/api/github.ts`
  - **Context**: Server-side GitHub API integration
  - **Details**:
    - Fetch from `https://api.github.com/users/sachins602/repos`
    - Use `GITHUB_TOKEN` from env for authentication (higher rate limits)
    - Sort by stars or updated date
    - Filter out forks and small repos (< 100 lines or no description)
    - Return top 6-8 repos
    - Include error handling for API failures

- [x] **1.6.3 Create tRPC router for projects**
  - **File**: `src/server/api/routers/projects.ts`
  - **Context**: Type-safe API endpoint for fetching projects
  - **Details**:
    - `getProjects` procedure that calls GitHub API
    - Cache response with Next.js revalidation (1 hour: `revalidate: 3600`)
    - Return typed project data
    - Add to `src/server/api/root.ts` router

- [x] **1.6.4 Create project card component**
  - **File**: `src/app/_components/project-card.tsx`
  - **Context**: Individual project display card
  - **Details**:
    - Display: repo name, description, primary language (colored badge), stars, forks
    - Tech stack tags from repo topics
    - Links: GitHub repo, live demo (from `homepage` field)
    - Hover animations:
      - Card lifts (translateY + shadow)
      - Background gradient morph
      - Tech tags stagger in
    - Optional: thumbnail image placeholder

- [x] **1.6.5 Implement project grid with animations**
  - **File**: `src/app/_components/sections/projects.tsx`
  - **Context**: Animated grid of project cards
  - **Details**:
    - Cards bounce in with staggered random delays on scroll
    - Masonry or CSS grid layout
    - Loading skeleton while fetching
    - Error state with static fallback projects

- [x] **1.6.6 Create static fallback projects data**
  - **File**: `src/lib/data/fallback-projects.ts`
  - **Context**: Backup data if GitHub API fails
  - **Details**:
    - 6 featured projects from resume:
      - WeDrive (ride-sharing app)
      - AI Urban Planning Dashboard
      - WPF Employee Management System
      - B2B Marketplace
      - Other notable projects
    - Same structure as GitHub API response

---

### 1.7 Contact Section

- [x] **1.7.1 Create Contact section container**
  - **File**: `src/app/_components/sections/contact.tsx`
  - **Context**: Contact form and social links
  - **Details**:
    - Section with ID for navigation
    - Animated section title
    - Two-column: form left, info/social right
    - Scroll-triggered animations

- [x] **1.7.2 Create database schema for contact submissions**
  - **File**: `src/server/db/schema.ts`
  - **Context**: Store contact form submissions in SQLite
  - **Details**:
    - Table: `portfoliosite_contact_submissions`
    - Fields: id, name, email, message, createdAt, isRead (boolean)
    - Remove or keep existing posts table as needed

- [x] **1.7.3 Create contact form tRPC router**
  - **File**: `src/server/api/routers/contact.ts`
  - **Context**: Handle form submission and email sending
  - **Details**:
    - `submitContact` mutation
    - Validate input with Zod (name required, email valid, message min 10 chars)
    - Save to database
    - Send email via Resend to sachinsapkota4@gmail.com
    - Return success/error response
    - Add to root router

- [x] **1.7.4 Create contact form component**
  - **File**: `src/app/_components/contact-form.tsx`
  - **Context**: Name, Email, Message form fields
  - **Details**:
    - Controlled inputs with React state
    - Client-side validation before submit
    - Anime.js animations:
      - Input focus: border glow effect
      - Submit button: pulse/loading animation
      - Success: checkmark draw + message fade in
      - Error: shake animation + error message
    - Loading state during submission

- [x] **1.7.5 Add social links and resume download**
  - **File**: `src/app/_components/sections/contact.tsx`
  - **Context**: Additional contact options
  - **Details**:
    - Social icons: GitHub, LinkedIn, Email
    - Hover effects with anime.js (scale + rotate)
    - Resume download button (link to PDF in public folder)
    - Button animation: pulse on hover
    - Add resume PDF to `public/resume.pdf`

---

### 1.8 Footer Component

- [x] **1.8.1 Create Footer component**
  - **File**: `src/app/_components/footer.tsx`
  - **Context**: Page footer with copyright and links
  - **Details**:
    - Copyright © 2026 Sachin Sapkota
    - Quick navigation links (smaller)
    - Social icons (compact)
    - Subtle fade-in animation on scroll
    - Back to top button (optional, animated)

---

### 1.9 Main Page Assembly

- [x] **1.9.1 Update main page with all sections**
  - **File**: `src/app/page.tsx`
  - **Context**: Assemble all sections into single-page layout
  - **Details**:
    - Remove T3 boilerplate content
    - Import and render in order: Header, Hero, About, Experience, Projects, Contact, Footer
    - Add smooth scrolling wrapper if using library (like lenis)
    - Ensure proper section spacing

- [x] **1.9.2 Implement scroll-triggered animations coordinator**
  - **File**: `src/app/page.tsx` or `src/hooks/use-scroll-animations.ts`
  - **Context**: Global Intersection Observer for all section animations
  - **Details**:
    - Create observer for all animated sections
    - Trigger anime.js animations when sections enter viewport
    - Only animate once (not on re-enter)
    - Cleanup observers on unmount

- [x] **1.9.3 Add page load animation sequence**
  - **File**: `src/app/_components/page-loader.tsx`
  - **Context**: Coordinated animations on initial page load
  - **Details**:
    - Optional loading screen with logo animation
    - Staggered reveal of header → hero elements
    - Anime.js timeline for sequenced animations
    - Keep total load animation under 2 seconds

---

### 1.10 SEO & Metadata

- [x] **1.10.1 Complete metadata configuration**
  - **File**: `src/app/layout.tsx`
  - **Context**: Comprehensive SEO metadata
  - **Details**:
    - Title: "Sachin Sapkota | Full-Stack Developer"
    - Description: Compelling portfolio description
    - Keywords: relevant tech and location terms
    - Open Graph: title, description, image, url
    - Twitter Card: summary_large_image
    - Canonical URL
    - Robots: index, follow

- [x] **1.10.2 Add Open Graph image**
  - **File**: `public/og-image.png` or generate via `src/app/opengraph-image.tsx`
  - **Context**: Social sharing preview image
  - **Details**:
    - 1200x630px image
    - Portfolio branding, name, title
    - Option: Use Next.js dynamic OG image generation

- [x] **1.10.3 Create robots.txt and sitemap**
  - **Files**: `public/robots.txt`, `src/app/sitemap.ts`
  - **Context**: Search engine optimization files
  - **Details**:
    - robots.txt allowing all crawlers
    - sitemap.ts generating XML sitemap
    - Single page so sitemap is simple

---

## Phase 2: Enhanced Uniqueness

### 2.1 Interactive Terminal Component

- [x] **2.1.1 Create terminal UI component**
  - **File**: `src/app/_components/terminal/terminal.tsx`
  - **Context**: Mini interactive command-line interface in hero or about section
  - **Details**:
    - Terminal window styling (dark background, colored prompt, monospace font)
    - Input field for typing commands
    - Output display area with scroll
    - Blinking cursor animation
    - Window chrome (minimize, maximize, close buttons - decorative)

- [x] **2.1.2 Implement terminal command parser**
  - **File**: `src/app/_components/terminal/commands.ts`
  - **Context**: Handle user commands and return responses
  - **Details**:
    - Available commands:
      - `help` — list available commands
      - `whoami` — display name and title
      - `skills` — list technical skills
      - `experience` — show work history summary
      - `projects` — list featured projects
      - `contact` — show contact info
      - `clear` — clear terminal output
    - Easter egg commands:
      - `sudo hire-me` — fun response about being hireable
      - `git commit -m "hired"` — playful commit message response
      - `ls` — list "files" (sections)
      - `cat readme` — display mini bio

- [x] **2.1.3 Add terminal output animations**
  - **File**: `src/app/_components/terminal/terminal.tsx`
  - **Context**: Animated text output like real terminal
  - **Details**:
    - Character-by-character output reveal using anime.js
    - Slight delay between lines for multi-line output
    - Command echo before output
    - Scroll to bottom on new output

- [x] **2.1.4 Integrate terminal into page**
  - **File**: `src/app/_components/sections/hero.tsx` or `about.tsx`
  - **Context**: Position terminal in layout
  - **Details**:
    - Option A: Side element in hero section
    - Option B: Featured component in about section
    - Responsive: full width on mobile, fixed width on desktop
    - Initial demo animation showing sample commands

---

### 2.2 Tech Stack Visualization

- [x] **2.2.1 Create constellation/network graph component**
  - **File**: `src/app/_components/tech-constellation.tsx`
  - **Context**: Interactive visualization of tech skills as connected nodes
  - **Details**:
    - Canvas or SVG-based visualization
    - Technologies as circular nodes with icons/text
    - Connection lines between related techs
    - Nodes positioned in meaningful clusters (Frontend, Backend, etc.)

- [x] **2.2.2 Implement node interactions**
  - **File**: `src/app/_components/tech-constellation.tsx`
  - **Context**: Hover and click interactions on tech nodes
  - **Details**:
    - Hover: node pulses, connections glow, tooltip shows proficiency + related projects
    - Click: expands node with more details
    - Anime.js animations for all state changes
    - Nodes have subtle floating/pulsing idle animation

- [x] **2.2.3 Add constellation data structure**
  - **File**: `src/lib/data/tech-stack.ts`
  - **Context**: Define technologies and their relationships
  - **Details**:
    - Each tech: id, name, icon, category, proficiency (1-100), relatedProjects[]
    - Define connections between related techs
    - Categories: Frontend, Backend, Database, DevOps, Languages

- [x] **2.2.4 Integrate into about section**
  - **File**: `src/app/_components/sections/about.tsx`
  - **Context**: Replace or complement skills grid with constellation
  - **Details**:
    - Full-width visualization
    - Responsive: simplified view on mobile
    - Toggle between constellation and grid view (optional)

---

### 2.3 Micro-Interactions & Easter Eggs

- [x] **2.3.1 Implement Konami code easter egg**
  - **File**: `src/hooks/use-konami.ts`
  - **Context**: Secret code triggers special animation
  - **Details**:
    - Listen for: ↑ ↑ ↓ ↓ ← → ← → B A
    - Trigger: Matrix rain effect, retro theme, or special animation
    - Use anime.js for the triggered effect
    - Show subtle notification that easter egg was found

- [x] **2.3.2 Add logo click counter easter egg**
  - **File**: `src/app/_components/header.tsx`
  - **Context**: Hidden interaction on logo
  - **Details**:
    - Track clicks on logo (stored in state)
    - At 10 clicks: trigger surprise (confetti, color explosion, fun message)
    - Reset counter after reveal
    - Anime.js for the surprise animation

- [x] **2.3.3 Implement cursor trail effect**
  - **File**: `src/app/_components/cursor-trail.tsx`
  - **Context**: Optional particle trail following cursor
  - **Details**:
    - Small particles following mouse movement
    - Particles fade out over time
    - Toggle-able via hidden setting or konami variant
    - Performance optimized (limited particle count)
    - Disabled on touch devices

- [x] **2.3.4 Add time-based greetings**
  - **File**: `src/app/_components/sections/hero.tsx`
  - **Context**: Dynamic greeting based on visitor's time
  - **Details**:
    - Detect local time from browser
    - Display: "Good morning", "Good afternoon", or "Good evening"
    - Subtle addition to hero or greeting text
    - Animate the greeting on load

- [x] **2.3.5 Create scroll progress indicator**
  - **File**: `src/app/_components/scroll-progress.tsx`
  - **Context**: Visual indicator of page scroll progress
  - **Details**:
    - Fixed position (top bar or side circle)
    - Anime.js animated fill based on scroll percentage
    - Subtle design, doesn't distract
    - Shows current section name (optional)

---

### 2.4 Project Filtering & Search

- [x] **2.4.1 Create filter bar component**
  - **File**: `src/app/_components/project-filter.tsx`
  - **Context**: Filter projects by various criteria
  - **Details**:
    - Filter options: Language (TypeScript, JavaScript, C#, Go), Tech Stack tags, Year
    - Filter pills with active state morphing animation
    - Clear all filters button
    - Count indicator per filter option

- [x] **2.4.2 Implement search functionality**
  - **File**: `src/app/_components/project-search.tsx`
  - **Context**: Live search through projects
  - **Details**:
    - Search input with icon
    - Live filtering as user types (debounced)
    - Highlight matching text in results
    - Anime.js animation for result transitions

- [x] **2.4.3 Add filter/search animations**
  - **File**: `src/app/_components/sections/projects.tsx`
  - **Context**: Smooth transitions when filtering
  - **Details**:
    - Projects that don't match: fade out + scale down
    - Remaining projects: reposition smoothly
    - No results state with animation
    - Filter pill selection: elastic pop

- [x] **2.4.4 Integrate filtering into projects section**
  - **File**: `src/app/_components/sections/projects.tsx`
  - **Context**: Add filter UI above project grid
  - **Details**:
    - State management for active filters
    - Filter logic for GitHub API data
    - URL query params for shareable filtered views (optional)
    - Mobile-friendly filter toggle

---

## Phase 3: Advanced Features

### 3.1 Real-Time GitHub Activity Feed

- [ ] **3.1.1 Create GitHub Events API integration**
  - **File**: `src/server/api/routers/github-activity.ts`
  - **Context**: Fetch recent GitHub activity
  - **Details**:
    - Fetch from `https://api.github.com/users/sachins602/events`
    - Parse event types: PushEvent, CreateEvent, WatchEvent, etc.
    - Format into readable messages
    - Cache with short revalidation (15-30 min)

- [ ] **3.1.2 Create activity feed component**
  - **File**: `src/app/_components/activity-feed.tsx`
  - **Context**: Display recent GitHub activity
  - **Details**:
    - Compact list or ticker format
    - Show: event type icon, repo name, time ago
    - Examples: "Pushed to [repo] 2 hours ago", "Starred [project]"
    - Limit to last 5-10 events

- [ ] **3.1.3 Add feed animations**
  - **File**: `src/app/_components/activity-feed.tsx`
  - **Context**: Animated entry for activity items
  - **Details**:
    - Option A: Animated marquee (continuous scroll)
    - Option B: Card flip effect for item changes
    - New items slide in from top
    - Auto-refresh with subtle animation

- [ ] **3.1.4 Integrate into layout**
  - **File**: `src/app/_components/sections/about.tsx` or sidebar
  - **Context**: Position activity feed in UI
  - **Details**:
    - Subtle sidebar ticker on desktop
    - Collapsible section on mobile
    - "View more on GitHub" link

---

### 3.2 GitHub Contribution Heatmap

- [ ] **3.2.1 Fetch contribution data**
  - **File**: `src/server/api/routers/github-contributions.ts`
  - **Context**: Get contribution graph data
  - **Details**:
    - Option A: Use GitHub GraphQL API with PAT for contribution data
    - Option B: Scrape contribution calendar from profile page
    - Option C: Use third-party API/service
    - Return daily contribution counts for past year

- [ ] **3.2.2 Create heatmap visualization component**
  - **File**: `src/app/_components/contribution-heatmap.tsx`
  - **Context**: Visual contribution calendar like GitHub profile
  - **Details**:
    - Grid of cells (52 weeks × 7 days)
    - Color intensity based on contribution count
    - Tooltip showing date and count on hover
    - Responsive width handling

- [ ] **3.2.3 Add heatmap animations**
  - **File**: `src/app/_components/contribution-heatmap.tsx`
  - **Context**: Animated reveal of contribution cells
  - **Details**:
    - Cells fill in with staggered animation on scroll
    - Start from past, animate towards present
    - Anime.js stagger with diagonal pattern
    - Hover: cell scale and tooltip appear

- [ ] **3.2.4 Integrate into about section**
  - **File**: `src/app/_components/sections/about.tsx`
  - **Context**: Add heatmap to showcase consistency
  - **Details**:
    - Position below skills or as separate subsection
    - Caption: "My GitHub contribution graph"
    - Link to full GitHub profile

---

### 3.3 Performance Dashboard Section

- [ ] **3.3.1 Create metrics display component**
  - **File**: `src/app/_components/performance-metrics.tsx`
  - **Context**: Show impressive numbers/stats
  - **Details**:
    - Metrics to show:
      - Total GitHub repos
      - Total stars across repos
      - Years of experience
      - Lines of code (estimated)
      - Projects completed
    - Animated counter using anime.js (numbers count up)

- [ ] **3.3.2 Add Lighthouse scores display**
  - **File**: `src/app/_components/lighthouse-scores.tsx`
  - **Context**: Show portfolio performance scores
  - **Details**:
    - Circular progress indicators for: Performance, Accessibility, Best Practices, SEO
    - Target scores: >95 each
    - Anime.js draws the circular progress on scroll
    - Update manually after deployment or automate

- [ ] **3.3.3 Integrate into page**
  - **File**: `src/app/_components/sections/about.tsx` or new section
  - **Context**: Position metrics showcase
  - **Details**:
    - Could be part of "Build This Site" section
    - Grid layout for metric cards
    - Scroll-triggered animations

---

### 3.4 "Build This Site" Section

- [ ] **3.4.1 Create Build This Site section**
  - **File**: `src/app/_components/sections/build-info.tsx`
  - **Context**: Meta section about the portfolio itself
  - **Details**:
    - Title: "How This Site Was Built" or "Under the Hood"
    - Tech stack used (Next.js, React 19, Tailwind, anime.js, etc.)
    - GitHub repo link for the portfolio
    - Design philosophy notes

- [ ] **3.4.2 Add code snippet carousel**
  - **File**: `src/app/_components/code-carousel.tsx`
  - **Context**: Show interesting implementation details
  - **Details**:
    - Syntax-highlighted code snippets
    - Carousel navigation (prev/next)
    - Snippets: anime.js hooks, GitHub integration, interesting components
    - Anime.js slide transitions between snippets

- [ ] **3.4.3 Display live stats**
  - **File**: `src/app/_components/sections/build-info.tsx`
  - **Context**: Real data about the portfolio
  - **Details**:
    - Bundle size
    - Load time
    - Lines of code in project
    - Number of anime.js animations used
    - Animated counters

---

## Phase 4: Future Enhancements

### 4.1 Blog/Articles Section

- [ ] **4.1.1 Create blog section structure**
  - **File**: `src/app/_components/sections/blog.tsx`
  - **Context**: Placeholder for future blog posts
  - **Details**:
    - Section container with title
    - "Coming Soon" state initially
    - Grid layout ready for article cards

- [ ] **4.1.2 Create article card component**
  - **File**: `src/app/_components/article-card.tsx`
  - **Context**: Display blog post preview
  - **Details**:
    - Title, excerpt, date, reading time
    - Thumbnail image (optional)
    - Tags/categories
    - Hover animations with anime.js

- [ ] **4.1.3 Set up Dev.to/Medium API integration**
  - **File**: `src/server/api/routers/articles.ts`
  - **Context**: Fetch articles from external platforms
  - **Details**:
    - Dev.to API: `https://dev.to/api/articles?username=YOUR_USERNAME`
    - Or Medium RSS feed parsing
    - Cache with longer revalidation (1 day)
    - Fallback to static/empty state

---

### 4.2 Testimonials Section

- [ ] **4.2.1 Create testimonials carousel**
  - **File**: `src/app/_components/sections/testimonials.tsx`
  - **Context**: Display recommendations/testimonials
  - **Details**:
    - Carousel of testimonial cards
    - Auto-play with pause on hover
    - Navigation dots/arrows
    - Card flip or slide transitions

- [ ] **4.2.2 Create testimonial card component**
  - **File**: `src/app/_components/testimonial-card.tsx`
  - **Context**: Individual testimonial display
  - **Details**:
    - Quote text
    - Author name, title, company
    - Optional photo/avatar
    - Link to LinkedIn recommendation (if applicable)

- [ ] **4.2.3 Add testimonial data**
  - **File**: `src/lib/data/testimonials.ts`
  - **Context**: Store testimonial content
  - **Details**:
    - Pull from LinkedIn recommendations
    - Or client/colleague testimonials
    - Skip if none available, add later

---

### 4.3 3D Elements

- [ ] **4.3.1 Add 3D card tilt effect**
  - **File**: Install `vanilla-tilt` or implement custom
  - **Context**: Subtle 3D tilt on project cards
  - **Details**:
    - Mouse position tracking
    - Transform with perspective
    - Subtle effect (max 10-15 degree tilt)
    - Disable on mobile/touch

- [ ] **4.3.2 Create 3D rotating tech cube**
  - **File**: `src/app/_components/tech-cube.tsx`
  - **Context**: Hero section eye-catching element
  - **Details**:
    - CSS 3D cube with tech logos on faces
    - Slow continuous rotation
    - Anime.js controlled rotation
    - Alternative to particles background

- [ ] **4.3.3 Add parallax depth layers**
  - **File**: `src/app/_components/parallax-background.tsx`
  - **Context**: Background depth effect
  - **Details**:
    - Multiple layers moving at different scroll speeds
    - Subtle depth perception
    - Performance optimized (CSS transforms only)

---

### 4.4 Availability Status System

- [ ] **4.4.1 Create availability badge component**
  - **File**: `src/app/_components/availability-badge.tsx`
  - **Context**: Show current employment/availability status
  - **Details**:
    - Status options: "Available for hire", "Open to opportunities", "Currently employed"
    - Colored badge with pulse animation
    - Position: header or hero section

- [ ] **4.4.2 Create admin toggle for status**
  - **File**: `src/app/admin/page.tsx`
  - **Context**: Simple admin page to update status
  - **Details**:
    - Password protected route
    - Toggle/dropdown for status
    - Store in database
    - tRPC mutation for updating

- [ ] **4.4.3 Add status to database schema**
  - **File**: `src/server/db/schema.ts`
  - **Context**: Store availability status
  - **Details**:
    - Table: `portfoliosite_settings`
    - Fields: key, value, updatedAt
    - Or simple single-row config table

---

### 4.5 Analytics Dashboard (Private Admin)

- [ ] **4.5.1 Create admin layout and auth**
  - **File**: `src/app/admin/layout.tsx`
  - **Context**: Protected admin area
  - **Details**:
    - Simple password authentication (env var)
    - Middleware to protect `/admin` routes
    - Basic admin navigation

- [ ] **4.5.2 Create analytics dashboard page**
  - **File**: `src/app/admin/page.tsx`
  - **Context**: View portfolio metrics
  - **Details**:
    - Contact form submissions list
    - Mark submissions as read
    - Basic stats (total submissions, unread count)
    - Integration with Vercel Analytics (if set up)

- [ ] **4.5.3 Add submission management**
  - **File**: `src/app/admin/submissions/page.tsx`
  - **Context**: Manage contact form submissions
  - **Details**:
    - List all submissions
    - View full message
    - Mark as read/unread
    - Delete submissions
    - tRPC queries/mutations for CRUD

---

## Implementation Notes

### File Structure Convention
```
src/
├── app/
│   ├── _components/
│   │   ├── sections/          # Page sections (hero, about, etc.)
│   │   ├── terminal/          # Terminal feature components
│   │   └── [component].tsx    # Shared components
│   ├── admin/                 # Admin pages (Phase 4)
│   ├── layout.tsx
│   └── page.tsx
├── hooks/                     # Custom React hooks (anime.js, etc.)
├── lib/
│   ├── animations.ts          # Anime.js utilities
│   └── data/                  # Static data files
├── server/
│   ├── api/
│   │   ├── routers/           # tRPC routers
│   │   ├── github.ts          # GitHub API functions
│   │   ├── root.ts
│   │   └── trpc.ts
│   └── db/
│       ├── index.ts
│       └── schema.ts
├── styles/
│   └── globals.css
└── trpc/
```

### Animation Guidelines
- All major animations use anime.js
- Duration: fast (300ms), normal (500ms), slow (800ms)
- Respect `prefers-reduced-motion`
- Use elastic/spring easing for playful feel
- Scroll-triggered via Intersection Observer
- Keep total page load animation under 2 seconds

### Performance Targets
- Lighthouse scores > 95 in all categories
- First Contentful Paint < 1.5s
- Lazy load animations below the fold
- Optimize images (WebP, proper sizing)
- Use Next.js Image component

### GitHub API Notes
- Username: `sachins602`
- Use PAT stored in `GITHUB_TOKEN` env var
- Repos endpoint: `https://api.github.com/users/sachins602/repos`
- Events endpoint: `https://api.github.com/users/sachins602/events`
- Cache responses with Next.js revalidation
- Handle rate limits gracefully

### Contact Form Email
- Service: Resend
- Recipient: sachinsapkota4@gmail.com
- Store submissions in SQLite for backup/admin

---

## Quick Reference Commands

```bash
# Development
bun run dev              # Start dev server with Turbo
bun run build            # Production build
bun run check            # Biome lint check
bun run check:write      # Biome fix issues

# Database
bun run db:generate      # Generate migrations
bun run db:push          # Push schema to database
bun run db:studio        # Open Drizzle Studio

# Type checking
bun run typecheck        # TypeScript type check
```

---

*Last Updated: January 2026*
