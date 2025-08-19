# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` - Runs on host 0.0.0.0:12002
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`

## Project Architecture

This is a Vue 3 + Vite market website using Element Plus UI components. The application follows a standard Vue.js SPA structure:

- **Framework**: Vue 3 with Composition API (`<script setup>` syntax)
- **Build Tool**: Vite with custom configuration for port 12002
- **UI Library**: Element Plus with full icon set integration
- **Styling**: Less preprocessor with global styles
- **Routing**: Vue Router with HTML5 history mode
- **HTTP Client**: Axios with custom instance configuration

### Key Directories

- `/src/views/` - Page-level components (currently only home page)
- `/src/components/` - Reusable Vue components
- `/src/router/` - Vue Router configuration
- `/src/utils/` - Utility functions including axios configuration
- `/src/assets/styles/` - Global Less stylesheets

### API Configuration

The axios instance is configured to connect to `http://84.247.154.10:12001` with a 25-second timeout. The configuration includes request/response interceptors for unified error handling and data formatting.

### Vite Configuration

- Custom alias: `@` maps to `/src`
- Development server runs on all network interfaces (0.0.0.0) on port 12002
- Less preprocessor enabled with JavaScript support