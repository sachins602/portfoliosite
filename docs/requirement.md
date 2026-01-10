# Portfolio Website Requirements Document

**Project Title**: Sachin Sapkota — Full-Stack Developer Portfolio  
**Version**: 1.0 (Final)  
**Date**: January 2026  
**Developer**: Sachin Sapkota  
**Goal**: Create a standout, professional-yet-creative personal portfolio that showcases your full-stack expertise (Next.js, TypeScript, .NET, Golang, cloud integrations) while demonstrating advanced front-end animation skills through heavy anime.js usage. The site will dynamically pull projects from your GitHub to keep content fresh and highlight your active development work.

## 1. Core Objectives
- **Primary Purpose**: Attract recruiters, hiring managers, and potential clients for full-stack/remote roles in Canada and internationally. Serve all audiences (job applications, freelance, personal branding).
- **Uniqueness Strategy**: Heavy, intentional use of anime.js for fluid, creative animations that feel modern and tech-forward — not generic fades or scrolls. Think morphing shapes, staggered letter reveals, SVG path drawing, elastic hovers, and scroll-triggered timelines. The animations will be bold enough to impress but performant and professional (no overload).
- **Key Differentiators**:
  - Dynamic GitHub project fetching (auto-updates with new repos/stars).
  - Anime.js as the signature animation library — every major interaction uses it.
  - Clean, minimalist design with subtle futuristic touches (gradients, particles, morphs).

## 2. Tech Stack
- **Framework**: Next.js 16+ (App Router) with TypeScript
- **React**: React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Anime.js (primary library — no Framer Motion or GSAP)
- **API Layer**: tRPC (type-safe API layer for end-to-end type safety)
- **Database**: Drizzle ORM with SQLite (libSQL) — for contact form submissions and other data (projects fetched directly from GitHub API, not stored in DB)
- **Package Manager**: Bun
- **Linting/Formatting**: Biome
- **Data Fetching**: GitHub REST API (server-side in Next.js for security, using Personal Access Token stored in environment variables)
- **Other Libraries**:
  - Lucide/React Icons for icons
  - Resend or EmailJS for contact form
  - Vercel Analytics (optional)
- **Deployment**: Vercel (with preview branches and custom domain if you have one)
- **Performance Targets**: Lighthouse >95, lazy-loaded animations, optimized images

## 3. Design & Theme
- **Layout**: Single-page application with smooth scrolling (using lenis or native) and clear sections separated by subtle animated dividers.
- **Color Scheme**:
  - Dark mode default (background #0f172a, accents #818cf8 indigo/purple)
  - Light mode toggle available (background #f8fafc, accents same)
  - Gradients used sparingly for hero and project cards
- **Typography**:
  - Primary: Geist Sans (sans-serif, clean and modern)
  - Headings: Larger weights with tracking for tech feel
- **Vibe**: Minimalist professional with creative animation flair — think "developer who can build beautiful, performant UIs" (inspired by animejs.com demos but toned for portfolio use).
- **Visual Elements**:
  - Subtle animated background (anime.js particle system or wave SVG in hero)
  - No profile photo unless you add one later — optional avatar placeholder
  - SVG icons with path-drawing animations on load/hover

## 4. Site Structure & Sections

1. **Navigation/Header**
   - Fixed top bar with logo (your name, animated draw-in on load)
   - Smooth scroll links to sections
   - Dark/light mode toggle (animated sun/moon morph)
   - Mobile: Hamburger menu with slide-in animation

2. **Hero Section** (Full viewport)
   - Large animated text reveal:
     - "Sachin Sapkota" — letters stagger in with elastic easing
     - Subtitle "Full-Stack Developer | Next.js & .NET Specialist" — typing effect via anime.js
   - Tagline: "Building scalable web apps from Brampton, Ontario"
   - Animated CTA buttons: "View Projects" (scrolls down) and "Contact Me" with hover pulse/morph
   - Background: Subtle animated gradient or particle field (anime.js)

3. **About Section**
   - Short bio from your resume
   - Location, email, phone, social links (GitHub, LinkedIn) with icon hover scale/rotate
   - Skills grid: Tech badges (Next.js, TypeScript, .NET, etc.) that animate in staggered on scroll
   - Optional: Animated progress circles for key skills (e.g., Next.js 95%, .NET 90%)

4. **Experience Section**
   - Vertical timeline format
   - Each job (Prodigitips, E-MultiTech) as a card/node
   - Anime.js animation: Timeline line draws in on scroll, cards stagger fade/translate with bounce
   - Bullet points appear sequentially on hover/scroll

5. **Projects Section** (Main showcase)
   - Title with animated underline draw
   - Dynamic grid of project cards fetched from GitHub
     - Fetch your public repos via GitHub API (filter by topics like "portfolio-featured" or pin specific ones)
     - Prioritize resume projects: WeDrive, AI Urban Planning Dashboard, WPF Employee Management, B2B Marketplace + any others
     - Display: Repo name, description, primary language badge (colored), stargazers/forks count, tech stack tags, links (GitHub, live demo if available)
   - Card design:
     - Hover: Card lifts, background gradient morphs, description slides up, tech tags stagger in
     - Optional screenshot thumbnail (add manually or via repo README images)
   - Fallback: If API fails, use static JSON of 6 featured projects
   - Layout: Masonry or responsive grid, cards animate into place on section enter

6. **Contact Section**
   - Simple form: Name, Email, Message
   - Submit via Resend/EmailJS to your sachinsapkota4@gmail.com
   - Anime.js: Input focus glow, submit button pulse/loading animation
   - Success/error message with fade-in
   - Social icons below with hover effects
   - Resume download button (PDF link, animated)

7. **Footer**
   - Copyright © 2026 Sachin Sapkota
   - Quick links + social icons (smaller)
   - Subtle animation on load

## 5. Animation Details (Anime.js Focus — The Uniqueness Core)
All major interactions use anime.js timelines for fluid, creative feel:
- **Global**:
  - Page load: Staggered section reveals
  - Scroll triggers (Intersection Observer): Elements animate only when in view
- **Hero**:
  - Name letters: translateY + opacity stagger with elastic.out
  - Subtitle: Simulated typing (letter-by-letter reveal)
  - Background particles/waves: Looping random movement
- **Sections**:
  - On enter: Titles scale in, content staggers from sides/bottom
  - Timeline (Experience): SVG line path draws progressively
- **Project Cards**:
  - Grid load: Cards bounce in with random delays
  - Hover: Scale + rotate slight, inner elements slide/morph
  - Tech badges: Burst in on hover
- **Buttons/Icons**:
  - Hover: Elastic scale or color shift with SVG morph if applicable
- **Intensity**: Bold but controlled — animations complete quickly (<1s), with easing for premium feel. Mobile: Reduced motion option (prefers-reduced-motion).

## 6. GitHub Integration Implementation
- **Direct API Fetching**: Server component in Next.js fetches https://api.github.com/users/sachins602/repos directly (not stored in database)
- **Authentication**: Use GitHub Personal Access Token (PAT) stored securely in environment variables (e.g., `GITHUB_TOKEN` or `GITHUB_PAT`)
- **Processing**:
  - Sort by updated/stars, filter out forks or small repos
  - Select top 6-8 or use pinned repos if you set them up
  - Cache response with revalidate (e.g., 1 hour) using Next.js caching
- **Data Fields**: Each card pulls: name, description, language, stargazers_count, forks_count, html_url, homepage (for live demo)
- **Note**: Projects are fetched directly from GitHub API on each request (with caching) — no database storage for project data

## 7. Additional Features
- Dark/light mode (toggle in header, persisted in localStorage, animated transition)
- Resume PDF download button
- Fully responsive (mobile-first)
- SEO: Proper meta tags, Open Graph for social sharing
- Accessibility: ARIA labels, keyboard nav, high contrast
- No blog for now (add later if wanted)

## 8. Non-Functional Requirements
- Performance: <2s load, lazy load images/animations
- Security: No exposed tokens (use environment variable for any PAT if needed)
- Maintainability: Clean component structure, reusable anime.js hooks

## 9. Enhanced Uniqueness Suggestions (Added Jan 2026)

### 9.1 Interactive Code Terminal/Command Line
- Add a mini interactive terminal in the hero or about section
- Visitor can type commands like `whoami`, `skills`, `experience`, `projects`
- Responds with animated output using anime.js for text reveal
- Easter eggs: `sudo hire-me`, `git commit -m "hired"`, etc.
- Makes the portfolio memorable and showcases personality

### 9.2 Real-Time Activity Feed
- **GitHub Activity Stream**: Show recent commits, PRs, or repo updates in a subtle sidebar/ticker
- Fetched from GitHub Events API: `https://api.github.com/users/sachins602/events`
- Displays: "Pushed to [repo] 2 hours ago", "Starred [project]", etc.
- Animated marquee or card flip effect
- Shows you're actively coding (great for recruiters)

### 9.3 Tech Stack Visualization
- Interactive tech stack "constellation" or network graph
- Technologies as nodes (Next.js, .NET, TypeScript, etc.) connected by lines
- Hover shows proficiency level and projects using that tech
- Animated with anime.js: nodes float/pulse, connections glow on hover
- More engaging than static badges

### 9.4 "Build This Site" Section
- Meta section showing how the portfolio itself was built
- Display tech stack, performance metrics, GitHub repo link
- Live Lighthouse scores with animated progress bars
- Code snippet carousel showing interesting implementation details
- Demonstrates transparency and technical depth

### 9.5 Micro-Interactions & Easter Eggs
- **Konami Code**: Trigger special animation or theme (matrix rain, retro mode)
- **Click Counter**: Hidden click counter on logo that reveals surprise at 10 clicks
- **Cursor Trail**: Subtle particle trail following cursor (toggle-able)
- **Time-Based Greetings**: "Good morning/afternoon/evening" based on visitor's timezone
- **Scroll Progress Indicator**: Animated line/circle showing page progress

### 9.6 Testimonials/Recommendations (If Available)
- Carousel of LinkedIn recommendations or client testimonials
- Animated card flip or slide transitions
- Adds social proof and credibility
- If none yet, skip for now and add later

### 9.7 GitHub Contribution Heatmap
- Embed your GitHub contribution graph (fetched via API or screenshot)
- Shows consistency and dedication
- Animate cells filling in on scroll
- Alternative: Custom visualization of commit frequency

### 9.8 Skills Proficiency Radar/Spider Chart
- Animated radar chart for skill categories:
  - Frontend (React, Next.js, TypeScript)
  - Backend (.NET, Golang, Node.js)
  - Database (SQL, MongoDB, Drizzle)
  - DevOps (Docker, CI/CD, Cloud)
- Draws in with anime.js path animation
- More visual than progress bars

### 9.9 Project Filtering & Search
- Filter projects by: Language, Tech Stack, Year, Stars
- Animated filter pills with active state morphing
- Search bar with live filtering and highlight animations
- Enhances UX for visitors exploring your work

### 9.10 Performance Dashboard
- Live metrics section showing:
  - Website load time (self-reported)
  - Lighthouse scores (automated or manual update)
  - Lines of code, commits, projects count
- Animated counters using anime.js
- Shows attention to performance and metrics

### 9.11 3D Elements (Optional - Advanced)
- Subtle 3D card tilts on project cards (vanilla-tilt.js or custom)
- 3D rotating tech stack cube in hero section
- Parallax depth layers in background
- Keep it subtle to maintain performance

### 9.12 Blog/Articles Section (Future-Proof)
- Even if not writing now, add structure for future blog posts
- Could fetch from Dev.to or Medium via API
- Shows thought leadership and communication skills
- Animated article cards with reading time

### 9.13 Availability Status
- Live status indicator: "Available for hire", "Open to opportunities", "Currently employed but open to offers"
- Toggle-able from admin panel (simple)
- Animated badge with pulse effect
- Helps recruiters know your current situation

### 9.14 Multi-Language Support (If Applicable)
- If targeting international roles, add language toggle (EN/French for Canada)
- Animated language switcher
- Shows cultural awareness and adaptability

### 9.15 Analytics Dashboard (Private)
- Simple admin route (`/admin` with password) showing:
  - Page views, visitor count (Vercel Analytics)
  - Contact form submissions
  - Most viewed projects
- Helps track portfolio effectiveness

## 10. Implementation Priority (Suggested Order)

**Phase 1 (MVP - Core Requirements)**:
- Sections 1-7 from original spec
- Basic anime.js animations
- GitHub project fetching
- Contact form

**Phase 2 (Enhanced Uniqueness)**:
- Interactive terminal (9.1)
- Tech stack visualization (9.3)
- Micro-interactions (9.5)
- Project filtering (9.9)

**Phase 3 (Advanced Features)**:
- Real-time activity feed (9.2)
- GitHub contribution heatmap (9.7)
- Performance dashboard (9.10)
- Build this site section (9.4)

**Phase 4 (Future Enhancements)**:
- Blog section (9.12)
- Testimonials (9.6)
- 3D elements (9.11)
- Analytics dashboard (9.15)

## 11. Key Recommendations Summary

**Must-Have Additions**:
1. **Interactive Terminal** - Most unique, memorable feature
2. **Project Filtering** - Essential for good UX with many projects
3. **Availability Status** - Helps recruiters immediately

**Nice-to-Have**:
4. Real-time GitHub activity feed
5. Tech stack visualization/constellation
6. Performance metrics showcase


This spec is ready to build — start with Next.js setup, add anime.js, implement Phase 1, then gradually add Phase 2 features. The interactive terminal + dynamic GitHub integration + heavy anime.js will make it truly unique while staying professional.

If you build it and want feedback or tweaks later, share the repo/link! 