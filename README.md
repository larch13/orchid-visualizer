# Orchid Visualizer

**Orchid Visualizer** is an open-source community project designed to enhance your experience with the [Telepathic Instruments Orchid](https://telepathicinstruments.com/). This tool helps you explore and visualize the capabilities of this amazing device, making it easier to interact with and understand its features.  

![Orchid Virtual Keyboard](assets/virtual-keyboard.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Features

### Virtual Keyboard Display
Highlights the notes and chords pressed on your keyboard, providing a clear, real-time visual representation.

### Chord Quality Identification:

Detects and highlights the specific chord quality being played (e.g., minor, major, diminished).
### Detailed Chord Information

Displays comprehensive text details including:
* Chord Name: e.g., C minor
* Inversion: e.g., Root, First, or Second
* Bass Note and Octave: e.g., D1

### Voicing Numbers Page:

Offers a separate view where users can explore all voicing numbers used by the synth. This page includes:
* Tabs for different chord qualities (Dim, Min, Maj, and Sus)
* A breakdown of each voicing with the corresponding notes


## 🚀 Tech Stack
- [T3 Stack](https://create.t3.gg/)
    - [Next.js](https://nextjs.org) - React framework for production
    - [TypeScript](https://www.typescriptlang.org/) - Type safety
    - [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework

## 📋 Prerequisites

- Node.js 18.x or later
- npm 10.x or later

## 🛠️ Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/orchid.git
cd orchid
```

2. Install dependencies
```bash
npm install
```

3. Copy the example environment file
```bash
cp .env.example .env
```

4. Update the environment variables in `.env` with your values

5. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🧪 Running Tests

```bash
npm run typecheck    # Run TypeScript checks
npm run lint        # Run ESLint
npm run format:check # Check code formatting
```

## 🚀 Deployment
This project is automatically deployed using [Vercel](https://vercel.com) when changes are merged into the `main` branch.


## 👥 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and contribute to the project.


## ![Telepathic Instruments Community Discord](public/favicon.ico) Telepathic Instruments Community Discord
Join us here: [![Discord](https://img.shields.io/discord/1344898163898585138?logo=discord&color=5865F2)](https://discord.gg/m23GeqeS8D)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [T3 Stack](https://create.t3.gg/) for the amazing application stack
- All our contributors and supporters
