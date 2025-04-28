# CryptDrift

CryptDrift is a secure, anonymous file sharing web application built with React, TypeScript, and Vite. It provides end-to-end encryption for file sharing with self-destructing links.

## Features

- 🔒 End-to-end encryption
- 👤 Anonymous file sharing
- ⏳ Self-destructing links
- 🚫 No registration required
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide Icons

## Getting Started

### Prerequisites

- Node.js (>= 18.18.0)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cryptdrift.git
cd cryptdrift
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Project Structure

```
cryptdrift/
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/         # Page components
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── public/            # Static assets
└── index.html         # HTML entry point
```

## Security Features

- Client-side encryption/decryption
- Zero-knowledge architecture
- Automatic file deletion
- Configurable expiration times
- Download limits

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)