# RubyPassport – Passport Photo Generator

RubyPassport is a modern web app for capturing and generating compliant passport/ID photos directly in the browser.

<img width="1920" height="1080" alt="rubypassport vercel app_" src="https://github.com/user-attachments/assets/9efe35ff-af28-4cc9-9406-5f26d1d1baa9" />

## Features

### Photo Creation & Handling
- **Live Camera Capture**: Use your device's camera with real-time, format-adaptive alignment guides.
- **Front & Back Camera Support**: Easily switch between your device's front and back cameras.
- **High-Resolution Photos**: Utilizes the `ImageCapture` API (where available) for higher quality photos than a standard video frame snapshot.
- **Import & Reposition**: Process any image file from your device with intuitive pan and zoom controls to get the perfect crop.
- **Client-Side Processing**: All photo processing happens locally in your browser, ensuring your photos are never uploaded to a server.

### Format Management
- **Standard Formats**: Comes with a wide range of built-in formats (US, EU/UK, Canada, China, and more).
- **Custom Formats**: Add, edit, and delete your own photo formats with precise pixel and physical print dimensions.
- **Instant Previews**: The live camera view and result panel adapt instantly to the selected format.

### Printing & Export
- **Precise Print Preview**: Generate a print-ready page with multiple photos tiled to exact physical dimensions.
- **Auto-Fit to 10x15cm**: Automatically arrange the maximum number of photos to fit on a standard 10x15 cm (4x6 inch) photo paper sheet.
- **Download Image**: Save the final photo with a dynamic, descriptive filename.
- **Personalization**: Optionally add a person's name to be used in filenames and print preview titles.

### User Experience
- **Responsive Design & Mobile Wizard**: A clean, responsive interface that transforms into a step-by-step wizard on mobile devices.
- **PWA Support**: Installable as a Progressive Web App for a native-like experience, including fullscreen mode on Android.
- **Modern UI**: A sleek, ruby-accented dark theme that adapts to your system settings.
- **Keyboard Shortcuts**: Comprehensive shortcuts for nearly every action. Press `?` in the app to see them all.
- **Fullscreen Mode**: Toggleable for an immersive, distraction-free experience.
- **Optional Watermark**: Add or remove an official-style "RUBY PASSPORT" watermark with a single click.

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
