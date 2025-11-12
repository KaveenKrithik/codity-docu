# Codity Documentation

A modern, beautiful documentation site for Codity, built with Next.js 14, TailwindCSS, and MDX.

## Features

- 🎨 Modern, minimalist design matching Codity branding
- 🌓 Dark/Light theme toggle
- 🔍 Full-text search with Fuse.js
- 📱 Fully responsive design
- ✨ Smooth animations with Framer Motion
- 📝 MDX support for rich documentation
- 🎯 Sticky sidebar navigation
- 💻 Syntax highlighting for code blocks
- 📋 Copy-to-clipboard for code snippets

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

\`\`\`bash
npm install
\`\`\`

2. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
.
├── app/
│   ├── documentation/     # Documentation pages
│   ├── api/              # API documentation
│   ├── guides/           # Guide pages
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── components/
│   ├── navbar.tsx        # Top navigation bar
│   ├── sidebar.tsx       # Sidebar navigation
│   ├── search-modal.tsx  # Search functionality
│   ├── theme-toggle.tsx  # Theme switcher
│   └── mdx-components.tsx # MDX custom components
└── lib/
    └── utils.ts          # Utility functions
\`\`\`

## Customization

### Colors

Edit `tailwind.config.ts` to customize the color scheme:

\`\`\`typescript
colors: {
  primary: 'hsl(var(--primary))',
  // ...
}
\`\`\`

### Navigation

Update the navigation structure in `components/sidebar.tsx`:

\`\`\`typescript
const navigation = [
  {
    name: 'Section Name',
    href: '/section',
    icon: IconComponent,
    children: [...]
  }
]
\`\`\`

## Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **MDX** - Markdown with JSX
- **next-themes** - Theme management
- **Fuse.js** - Fuzzy search
- **Lucide React** - Icon library

## License

MIT

