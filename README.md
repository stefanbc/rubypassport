# Ruby Passport – Passport Photo Generator

[![Version](https://img.shields.io/badge/version-0.12.5-blue.svg)](package.json) [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Ruby Passport is a modern, privacy-focused web app for capturing and generating compliant passport/ID photos directly in your browser. It's built with privacy as a core principle—all image processing happens on your device, ensuring your photos are never uploaded to a server.

<img width="1920" height="1080" alt="rubypassport vercel app_" src="https://github.com/user-attachments/assets/9efe35ff-af28-4cc9-9406-5f26d1d1baa9" />

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Installation & Development](#installation--development)
- [Usage](#usage)
- [Notes](#notes)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Key Features

### Core Functionality

- **Live Camera Capture**: Use your device's camera with real-time, format-adaptive alignment guides.
- **Front & Back Camera Support**: Easily switch between your device's front and back cameras.
- **High-Resolution Photos**: Utilizes the `ImageCapture` API (where available) for higher quality photos than a standard video frame snapshot.
- **Import & Reposition**: Process any image file from your device with intuitive pan and zoom controls to get the perfect crop.
- **Client-Side Processing**: All photo processing happens locally in your browser, ensuring your photos are never uploaded to a server.

### User Experience

- **Responsive Design & Mobile Wizard**: A clean, responsive interface that transforms into a step-by-step wizard on mobile devices.
- **PWA Support**: Installable as a Progressive Web App for a native-like experience, including fullscreen mode on Android.
- **Modern UI**: A sleek, ruby-accented dark theme that adapts to your system settings.
- **Fullscreen Mode**: Toggleable for an immersive, distraction-free experience.

### Advanced Controls & Customization

- **Keyboard Shortcuts**: Comprehensive shortcuts for nearly every action. Press `?` in the app to see them all.
- **Personalization**: Optionally add a person's name to be used in filenames and print preview titles.
- **Optional Watermark**: Add or remove an official-style "RUBY PASSPORT" watermark with a single click.

### Format & Print Management

- **Standard Formats**: Comes with a wide range of built-in formats (US, EU/UK, Canada, China, and more).
- **Custom Formats**: Add, edit, and delete your own photo formats with precise pixel and physical print dimensions.
- **Instant Previews**: The live camera view and result panel adapt instantly to the selected format.
- **Precise Print Preview**: Generate a print-ready page with multiple photos tiled to exact physical dimensions.
- **Download Image**: Save the final photo with a dynamic, descriptive filename.

## Getting Started
## Tech Stack

Ruby Passport is built with a modern, robust tech stack:

- **Framework**: [Vite](https://vitejs.dev/) + [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) for accessible primitives.
- **Icons**: [Lucide React](https://lucide.dev/)
- **Drag & Drop**: [dnd-kit](https://dndkit.com/) for reordering custom formats.
- **Internationalization**: [i18next](https://www.i18next.com/)

## Installation & Development

Prerequisites:

- Node.js 18+ and npm

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ruby-passport.git
    cd ruby-passport
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Available Scripts

| Script             | Description                                      |
| ------------------ | ------------------------------------------------ |
| `npm run dev`      | Runs the app in development mode at `localhost`. |
| `npm run build`    | Builds the app for production.                   |
| `npm run preview`  | Serves the production build locally for preview. |
| `npm run lint`     | Checks the code for linting errors using Biome.  |
| `npm run lint:fix` | Automatically fixes linting errors.              |
| `npm run typescript:check` | Runs the TypeScript compiler to check for type errors. |

## Usage

1. Start the camera and allow permissions.
2. Choose a photo format (e.g., Romania 35×45 mm).
3. Align your face using the overlay guides and capture.
4. Optionally set the person name for filenames and print titles.
5. Toggle the official watermark if desired.
6. Download the image or open Print Preview.

## Notes

- The app uses browser camera APIs; ensure you grant permission.
- Printing accuracy depends on OS/Browser print scaling settings. Use 100% scale and disable “fit to page”.
- Watermark uses EB Garamond for an official-like style; UI uses Inter.

## Security

No photo data is uploaded; processing happens locally in the browser.

## Contributing

Contributions are welcome! If you have a feature request, bug report, or want to contribute code, please feel free to open an issue or submit a pull request.

Before submitting a PR, please ensure your code adheres to the project's style and that all checks pass:

```bash
npm run lint
npm run typescript:check
```

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
