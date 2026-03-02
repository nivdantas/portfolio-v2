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

## ✨ Features

- **Server-Side Rendering (SSR)**
- **Static Site Generation (SSG)**
- **Responsive Design** - Mobile-first approach with Tailwind's responsive utilities
- **Modern UI/UX** - Clean, professional design with smooth interactions
- **Dark/Light Mode** - Theme switching capability
- **SEO Optimized** - Meta tags, structured data, and performance optimization

## 📂 Project Structure

```bash
├── messages/                     # Internationalization message files
├── public/                       # Static assets served by Next.js
├── src/
│   ├── app/
│   │   ├── [locale]/            # Dynamic route for internationalization
│   │   ├── api/                 # API routes and server-side endpoints
│   │   ├── components/          # Reusable React components
│   │   │   ├── CardExpandable.tsx    # Expandable card component for interactive content
│   │   │   ├── CardStatic.tsx        # Static card component for displaying information
│   │   │   ├── Footer.tsx            # Footer component with site links and info
│   │   │   ├── GitRepos.tsx          # Component for displaying GitHub repositories
│   │   │   ├── Header.tsx            # Header component with navigation
│   │   │   ├── LanguageButton.tsx    # Language switcher component for i18n
│   │   │   ├── MainContent.tsx       # Main content area component
│   │   │   └── ThemeButton.tsx       # Theme toggle component (light/dark mode)
│   │   ├── context/             # React context providers for state management
│   │   ├── i18n/               # Internationalization configuration and utilities
│   │   ├── favicon.ico         # Website favicon
│   │   ├── globals.css         # Global CSS styles
│   │   └── layout.tsx          # Root layout component for the application
├── next.config.ts              # Next.js configuration file
├── package.json                # Project dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```
