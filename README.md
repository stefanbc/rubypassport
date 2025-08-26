# RubyPassport – Passport Photo Generator

RubyPassport is a modern web app for capturing and generating compliant passport/ID photos directly in the browser.

## Features

- Camera capture with live alignment guides
- Multiple formats (US 2x2, EU/UK 35×45, Romania 35×45, Canada 50×70, China 33×48, and more)
- Result preview that adapts to the selected format
- Print Preview with exact physical sizing (inches) and multi-photo tiling
- Auto-fit to 10×15 cm photo paper (optional)
- Download with dynamic filenames and optional person name
- Optional official-style watermark (RUBYPASSPORT), toggleable
- Dark, ruby-accented UI with modern typography

## Getting Started

Prerequisites:
- Node.js 18+ and npm

Install dependencies:
```bash
npm install
```

Run in development:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Usage

1. Start the camera and allow permissions.
2. Choose a photo format (e.g., Romania 35×45 mm).
3. Align your face using the overlay guides and capture.
4. Optionally set the person name for filenames and print titles.
5. Toggle the official watermark if desired.
6. Download the image or open Print Preview.
7. In Print Preview, optionally enable Auto-fit 10×15 cm to tile optimally.

## Accessibility & Notes

- The app uses browser camera APIs; ensure you grant permission.
- Printing accuracy depends on OS/Browser print scaling settings. Use 100% scale and disable “fit to page”.
- Watermark uses EB Garamond for an official-like style; UI uses Inter.

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS
- lucide-react icons

## License

This project is licensed under the MIT License. See `LICENSE` for details.

## Security

No photo data is uploaded; processing happens locally in the browser.

## Contributing

Issues and PRs are welcome. Please keep the UI consistent with the ruby-accent theme and ensure lint passes.
