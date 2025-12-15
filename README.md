# Arbiter

A cross-platform desktop application for coordinating multiple LLM agents, built with Electron, React, and TypeScript.

## Features

- Cross-platform support (macOS, Windows, Linux)
- Modern UI built with React and Tailwind CSS
- Type-safe development with TypeScript
- Secure IPC communication between main and renderer processes
- State management with Zustand
- Fast development with Vite and hot module replacement

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm

### Installation

```bash
npm install
```

### Development

Start the application in development mode with hot reload:

```bash
npm run dev
```

### Building

Compile the TypeScript source code:

```bash
npm run build
```

### Packaging

Create distributable packages for different platforms:

```bash
# Package for all platforms (requires macOS)
npm run package

# Package for specific platforms
npm run package:mac     # macOS (DMG, ZIP)
npm run package:win     # Windows (NSIS installer, Portable)
npm run package:linux   # Linux (AppImage, DEB, RPM)
```

The packaged applications will be available in the `dist/` directory.

## Project Structure

```
arbiter/
├── src/
│   ├── main/           # Main process (Electron)
│   │   └── index.ts    # Application entry point
│   ├── preload/        # Preload scripts (IPC bridge)
│   │   └── index.ts    # Secure API exposure
│   └── renderer/       # Renderer process (React UI)
│       ├── src/
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── styles/
│       └── index.html
├── out/                # Build output
├── dist/               # Packaged applications
└── electron.vite.config.ts
```

## Tech Stack

- **Electron** - Cross-platform desktop framework
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **electron-builder** - Application packaging

## Security

The application follows Electron security best practices:

- Context isolation enabled
- Node integration disabled in renderer
- Sandboxed renderer processes
- Type-safe IPC communication via preload scripts

## License

MIT
