# Image ENHANCER 9000

Deep Fry Editor Pro is a powerful photo editor with 0 value to the user.

![powerful logo](<logo/0118 (3).gif>)

## Features

- **Pixelation Controls**: Adjust the level of pixelation from slightly blurry to extreme blocky pixels.
- **Aspect Ratio Warping**: Stretch and squash images to create unnatural distortions.
- **Over-Saturation & Brightness**: Boost colors to absurd levels and adjust brightness/contrast for added chaos.
- **Noise & Artifacts**: Add noise, simulate JPEG compression, and sharpen edges for a gritty texture.
- **Lens Flares & Overlays**: Add lens flares, emojis, and meme-specific overlays.
- **Preset Filters**: Quickly apply preset effects like "Deep Fry Classic" and "Nuclear Fry."
- **Export Options**: Save your creations as low-resolution, heavily compressed images.

## Technologies Used

- **React**: For building the user interface.
- **WebGL**: For high-performance image processing.
- **Tailwind CSS**: For styling the application.
- **Framer Motion**: For animations.
- **Vite**: For fast development and build tooling.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/image-enhancer-9000.git
   cd image-enhancer-9000
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

### Building for Production

To build the application for production, run:

```bash
npm run build
```

The production-ready files will be in the `dist` directory. You can preview the production build using:

```bash
npm run preview
```

## Usage

1. Click the "Upload Image" button to select an image from your device
2. Use the sliders to adjust various effects:
   - Pixelation: Control the blockiness of the image
   - Saturation: Adjust color intensity
   - Brightness/Contrast: Fine-tune the lighting
   - Noise: Add grain and artifacts
   - Color Channels: Manipulate RGB values
   - Bulge: Create distortion effects
   - Glow: Add bloom and glow effects

3. Try out the preset buttons for quick effects:
   - Classic: Traditional deep-fried look
   - Nuclear: Extreme enhancement
   - Eyes: Glowing eyes effect

4. Click the "Export" button to save your masterpiece

## Development

### Project Structure

```
image-enhancer-9000/
├── src/
│   ├── DeepFryEditor.jsx    # Main component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── tailwind.config.cjs    # Tailwind CSS configuration
└── postcss.config.cjs     # PostCSS configuration
```

### WebGL Implementation

The application uses WebGL2 for real-time image processing, implementing:
- Custom vertex and fragment shaders
- Texture handling
- Real-time effect parameters
- Efficient GPU-accelerated processing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- WebGL for providing powerful graphics processing capabilities
- React and Vite communities for excellent development tools
- Tailwind CSS for streamlined styling
- Framer Motion for smooth animations

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.