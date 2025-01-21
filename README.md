# Image "Enhancer"

A demo project showcasing how to build an image manipulation application using AI-assisted development tools like Cursor. This project demonstrates modern web development practices while creating a fun image manipulation tool that lets users apply various distortion effects to their images.

## About

This project serves as a "practical" example of using AI-assisted development tools to build a functional web application. This was built completely using prompting with Cursor's IDE:

- Building a complete React application
- Implementing WebGL for image processing
- Structuring a modern frontend project
- Handling real-time image manipulation

## Features

- Basic image upload and processing
- Distortion controls (pixelation, color saturation, warping)
- Visual effect presets
- Simple export functionality

## Technologies Used

- **React**: Frontend framework
- **WebGL**: Image processing
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **Vite**: Build system
- **Cursor**: AI-assisted development

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

1. Upload an image using the "Upload Image" button
2. Adjust effects using the available sliders:
   - Pixelation
   - Saturation
   - Brightness/Contrast
   - Distortion
   - Color adjustments

3. Try the preset buttons for quick effects
4. Export your processed image

## Project Structure

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

## Development Notes

This project was developed using AI-assisted tools, primarily Cursor, demonstrating how modern AI tools can help streamline the development process. The WebGL implementation handles the image processing operations through custom shaders, while React manages the user interface and application state.

Key learning points from this project include:

- Integrating AI tools into the development workflow
- Implementing real-time image processing with WebGL
- Building a responsive UI with React and Tailwind
- Setting up a modern development environment with Vite

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/enhancement`)
3. Commit your changes (`git commit -m 'Add some enhancement'`)
4. Push to the branch (`git push origin feature/enhancement`)
5. Open a Pull Request
