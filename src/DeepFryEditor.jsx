import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Zap, Eye, Sun } from 'lucide-react';

const Slider = ({ value, onChange, min, max, step, className }) => {
  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  return (
    <input
      type="range"
      value={value}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer ${className}`}
    />
  );
};

const DeepFryEditor = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [effects, setEffects] = useState({
    pixelation: 1,
    saturation: 1,
    brightness: 1,
    contrast: 1,
    noise: 0,
    compression: 100,
    redChannel: 1,
    blueChannel: 1,
    greenChannel: 1,
    sharpness: 0,
    bulge: 0,
    glowIntensity: 0,
    posterize: 1,
  });
  
  const canvasRef = useRef(null);
  const originalImageRef = useRef(null);
  const webglRef = useRef(null);

  useEffect(() => {
    if (image) {
      initWebGL();
      applyEffects();
    }
  }, [image, effects]);

  const initWebGL = () => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.error('WebGL2 not supported');
      return;
    }

    webglRef.current = gl;
    
    // Create vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      void main() {
        gl_Position = vec4(a_position, 0, 1);
        v_texCoord = a_texCoord;
      }
    `);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('Vertex shader compilation failed:', gl.getShaderInfoLog(vertexShader));
      return;
    }

    // Create fragment shader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, `
      precision mediump float;
      uniform sampler2D u_image;
      uniform vec2 u_resolution;
      uniform float u_pixelation;
      uniform float u_saturation;
      uniform float u_brightness;
      uniform float u_contrast;
      uniform float u_noise;
      uniform float u_redChannel;
      uniform float u_greenChannel;
      uniform float u_blueChannel;
      uniform float u_bulge;
      uniform float u_glowIntensity;
      varying vec2 v_texCoord;

      float rand(vec2 co) {
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
      }

      vec3 adjustSaturation(vec3 color, float saturation) {
        float gray = dot(color, vec3(0.2126, 0.7152, 0.0722));
        return mix(vec3(gray), color, saturation);
      }

      void main() {
        vec2 coord = v_texCoord;
        
        // Bulge effect
        if (u_bulge > 0.0) {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(coord, center);
          coord = coord + normalize(coord - center) * dist * u_bulge;
        }

        // Pixelation
        if (u_pixelation > 1.0) {
          vec2 pixelSize = vec2(u_pixelation) / u_resolution;
          coord = floor(coord / pixelSize) * pixelSize;
        }

        vec4 color = texture2D(u_image, coord);
        
        // Color channel manipulation
        color.r *= u_redChannel;
        color.g *= u_greenChannel;
        color.b *= u_blueChannel;

        // Saturation
        color.rgb = adjustSaturation(color.rgb, u_saturation);
        
        // Brightness and contrast
        color.rgb = (color.rgb - 0.5) * u_contrast + 0.5;
        color.rgb *= u_brightness;

        // Noise
        if (u_noise > 0.0) {
          float noise = rand(coord) * u_noise;
          color.rgb += noise;
        }

        // Glow effect
        if (u_glowIntensity > 0.0) {
          float glow = length(color.rgb);
          color.rgb += color.rgb * glow * u_glowIntensity;
        }

        gl_FragColor = color;
      }
    `);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader compilation failed:', gl.getShaderInfoLog(fragmentShader));
      return;
    }

    // Create and link program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link failed:', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Set up position buffer
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Set up texture coordinates
    const texCoords = new Float32Array([
      0, 0,
      1, 0,
      0, 1,
      0, 1,
      1, 0,
      1, 1,
    ]);
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    // Set up attributes
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Create and set up texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, originalImageRef.current);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Store program and texture info
    webglRef.current = {
      gl,
      program,
      texture,
      positionBuffer,
      texCoordBuffer,
    };
  };

  const applyEffects = () => {
    if (!image || !webglRef.current) return;

    const { gl, program } = webglRef.current;

    // Update texture with current image
    gl.bindTexture(gl.TEXTURE_2D, webglRef.current.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, originalImageRef.current);

    // Set uniforms
    const uniforms = {
      u_image: 0,
      u_resolution: [canvasRef.current.width, canvasRef.current.height],
      u_pixelation: effects.pixelation,
      u_saturation: effects.saturation,
      u_brightness: effects.brightness,
      u_contrast: effects.contrast,
      u_noise: effects.noise,
      u_redChannel: effects.redChannel,
      u_greenChannel: effects.greenChannel,
      u_blueChannel: effects.blueChannel,
      u_bulge: effects.bulge,
      u_glowIntensity: effects.glowIntensity,
    };

    Object.entries(uniforms).forEach(([name, value]) => {
      const location = gl.getUniformLocation(program, name);
      if (Array.isArray(value)) {
        gl.uniform2fv(location, value);
      } else {
        gl.uniform1f(location, value);
      }
    });

    // Draw
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        originalImageRef.current = img;
        setImage(img);
        
        // Set canvas dimensions
        const maxSize = 1024;
        let width = img.width;
        let height = img.height;
        
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }
        
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        
        setLoading(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const applyPreset = (preset) => {
    const presets = {
      classic: {
        pixelation: 4,
        saturation: 2,
        contrast: 1.5,
        noise: 0.3,
        compression: 50,
        redChannel: 1.2,
        blueChannel: 0.8,
      },
      nuclear: {
        pixelation: 8,
        saturation: 3,
        brightness: 1.3,
        contrast: 2,
        noise: 0.6,
        compression: 20,
        glowIntensity: 0.5,
      },
      glowingEyes: {
        saturation: 1.5,
        brightness: 1.2,
        contrast: 1.8,
        glowIntensity: 0.8,
        redChannel: 2,
      }
    };

    setEffects(prev => ({
      ...prev,
      ...presets[preset]
    }));
  };

  const exportImage = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', effects.compression / 100);
    const link = document.createElement('a');
    link.download = 'deep-fried-image.jpg';
    link.href = dataUrl;
    link.click();
  };

  // Cleanup WebGL context when component unmounts
  useEffect(() => {
    return () => {
      if (webglRef.current) {
        const { gl, program, texture, positionBuffer, texCoordBuffer } = webglRef.current;
        gl.deleteProgram(program);
        gl.deleteTexture(texture);
        gl.deleteBuffer(positionBuffer);
        gl.deleteBuffer(texCoordBuffer);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Deep Fry Editor Pro</h1>
          <label className="inline-block">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
            >
              <Upload size={20} />
              Upload Image
            </motion.button>
          </label>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            {/* Controls Panel */}
            <div className="bg-gray-800 rounded-xl p-6 space-y-6">
              <div className="space-y-4">
                {Object.entries(effects).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <Slider
                      value={value}
                      onChange={(v) => setEffects(prev => ({ ...prev, [key]: v }))}
                      min={0}
                      max={key === 'compression' ? 100 : 10}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>
                ))}
              </div>

              {/* Presets */}
              <div className="space-y-2">
                <h3 className="font-medium">Presets</h3>
                <div className="grid grid-cols-3 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => applyPreset('classic')}
                    className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Zap size={16} />
                    Classic
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => applyPreset('nuclear')}
                    className="bg-green-600 hover:bg-green-700 p-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Sun size={16} />
                    Nuclear
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => applyPreset('glowingEyes')}
                    className="bg-red-600 hover:bg-red-700 p-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    Eyes
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            {/* Canvas Container */}
            <div className="bg-gray-800 rounded-xl p-4 relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
              )}
              <canvas
                ref={canvasRef}
                className="w-full h-auto rounded-lg"
              />
              {image && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportImage}
                  className="absolute bottom-6 right-6 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Download size={20} />
                  Export
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeepFryEditor; 