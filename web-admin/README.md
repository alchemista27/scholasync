# Vite + React + TypeScript + shadcn/ui

A modern React application built with Vite, TypeScript, Tailwind CSS, and shadcn/ui components for rapid UI development.

## ✨ Features

- ⚡️ **Vite** - Lightning fast build tool and dev server
- ⚛️ **React 18** - Modern React with hooks and concurrent features
- 🏷️ **TypeScript** - Type safety and better developer experience
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧩 **shadcn/ui** - Beautiful and accessible UI components
- 📁 **Absolute Imports** - Clean imports with `@/` prefix
- 🔧 **ESLint** - Code quality and consistency

## 🚀 Quick Start

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Development**: ESLint for code quality

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🧩 Adding Components

This project comes with shadcn/ui pre-configured. Add new components easily:

```bash
# Add a specific component
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog

# Add multiple components
npx shadcn@latest add button card dialog
```

## 📁 Project Structure

```
src/
├── components/
│   └── ui/           # shadcn/ui components
├── lib/
│   └── utils.ts      # Utility functions
├── App.tsx           # Main app component
├── main.tsx          # App entry point
└── index.css         # Global styles (Tailwind)
```

## 🎨 Customization

### Tailwind Configuration
The project uses Tailwind CSS v4 with the `@tailwindcss/vite` plugin. Customize your design system by modifying the CSS variables in `src/index.css`.

### shadcn/ui Configuration
Components are configured in `components.json`. You can customize:
- Color scheme (currently using neutral)
- Component style (currently using new-york)
- CSS variables and theming

### TypeScript Paths
Import components using clean paths:
```typescript
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

## 🚀 Deployment

### Vercel
```bash
npm run build
# Deploy the dist/ folder to Vercel
```

### Netlify
```bash
npm run build
# Deploy the dist/ folder to Netlify
```

### Other platforms
Build the project with `npm run build` and deploy the `dist/` folder to your preferred hosting platform.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) for the amazing build tool
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [React](https://react.dev/) for the awesome framework
