# Portfolio

A sophisticated, performance-optimized portfolio website built with NextJS, React and Tailwind CSS

## About

This is my advanced portfolio built with industry-standard tools and best practices. I share a little of my projects, experiences, skills and more.

<div align="center">
<img src="./public/Phos.gif" alt="Phos">
</div>

## 🛠️ Tech Stack
- **Next.JS 15** - React framework with App Router, SSG/SSR capabilities.
- **React 19** - Modern component-based architecture with hooks.
- **TypeScript** - Type-safe development for better code quality and maintainability.
- **Tailwind CSS** - Utility-first CSS framework for rapid, responsive design.
- **Next-INTL (I18n)** - Internationalization toolkit.
- **ElysiaJS** - REST API for blogspot.
  
## ✨ Features

- **Server-Side Rendering (SSR)**
- **Static Site Generation (SSG)**
- **Responsive Design** - Mobile-first approach with Tailwind's responsive utilities
- **Modern UI/UX** - Clean, professional design with smooth interactions
- **Dark/Light Mode** - Theme switching capability
- **SEO Optimized** - Meta tags, structured data, and performance optimization

## 📂 Project Structure

```bash
├── messages/                    # Internationalization (i18n) translation dictionaries
│   ├── en.json                  # English translations
│   └── pt.json                  # Portuguese translations
├── public/                      # Static assets served at the root URL                 
├── src/                         # Application source code
│   ├── app/                     # Next.js App Router directory
│   │   ├── [locale]/            # Dynamic route segment for localized pages
│   │   │   ├── blog/            # Blog section routes
│   │   │   ├── layout.tsx       # Localized root layout
│   │   │   └── page.tsx         # Localized home page
│   │   ├── api/                 # Next.js Route Handlers (backend endpoints)
│   │   │   ├── posts/           # API endpoints for blog data
│   │   │   └── repos/           # API endpoints for repository data
│   │   ├── components/          # Reusable React components
│   │   │   ├── layout/          # Structural components (e.g., Header, Footer)
│   │   │   ├── portfolio/       # Portfolio-specific feature components
│   │   │   └── ui/              # Generic UI elements (e.g., buttons, inputs)
│   │   ├── context/             # React Context providers for global state
│   │   │   ├── BlogContext.tsx  # State management for blog data
│   │   │   └── RepoContext.tsx  # State management for repository data
│   │   ├── favicon.ico          # Website favicon
│   │   ├── globals.css          # Global stylesheet
│   │   └── i18n/                # i18n configuration and utilities
│   │       ├── navigation.ts    # Localized navigation helpers
│   │       ├── request.ts       # Next-intl request configuration
│   │       └── routing.ts       # Next-intl routing setup
```
