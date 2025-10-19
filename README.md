# Instant⚡ Video Generator

A powerful AI video generation app that creates stunning videos from text prompts and images using the Instant Video API.

## Features

- 🎬 **Text to Video**: Generate videos from detailed text prompts
- 🖼️ **Image + Text to Video**: Upload images and animate them with text descriptions
- ⚡ **Instant Generation**: Fast video creation with multiple quality options
- 🎨 **Multiple Models**: Choose from Realistic, Cartoon, Anime, 3D, and Sketch styles
- 🎭 **Motion Controls**: Add zoom, pan, tilt, and rotation effects
- 📱 **Modern UI**: Beautiful, responsive interface with drag-and-drop support
- 💾 **Download Support**: Save generated videos locally

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone and setup the project:**
```bash
cd /Users/rohan/zxc.ai
npm install
```

2. **Install server dependencies:**
```bash
cd server
npm install
```

3. **Install client dependencies:**
```bash
cd ../client
npm install
```

### Running the Application

1. **Start the backend server:**
```bash
cd server
npm run dev
```

2. **Start the frontend (in a new terminal):**
```bash
cd client
npm start
```

3. **Or run both simultaneously:**
```bash
# From the root directory
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

### Text to Video
1. Select "Text to Video" tab
2. Enter a detailed prompt (e.g., "Focus: Eiffel Tower (Animate: Clouds moving)")
3. Choose your preferred model, motion, and inference steps
4. Click "Generate Video"

### Image + Text to Video
1. Select "Image + Text to Video" tab
2. Upload an image (drag & drop or click to browse)
3. Describe what you want to animate
4. Configure your settings and generate

## Example Prompts

- `Focus: Eiffel Tower (Animate: Clouds moving)`
- `Focus: Trees In forest (Animate: Lion running)`
- `Focus: Astronaut in Space`
- `Focus: Group of Birds in sky (Animate: Birds Moving) (Shot From distance)`
- `Focus: Statue of liberty (Shot from Drone) (Animate: Drone coming toward statue)`
- `Focus: Panda in Forest (Animate: Drinking Tea)`

## API Endpoints

- `POST /api/generate-video` - Generate video from text
- `POST /api/generate-video-with-image` - Generate video from image + text
- `GET /api/options` - Get available models and options
- `GET /api/health` - Health check

## Configuration

The app uses the Instant Video API from Hugging Face. The backend handles:
- Image processing and optimization
- API communication with Instant Video
- File upload and management
- Error handling and validation

## Technologies Used

**Backend:**
- Node.js + Express
- Multer for file uploads
- Sharp for image processing
- Axios for API calls

**Frontend:**
- React + TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Modern drag-and-drop interface

## Troubleshooting

1. **CORS Issues**: Make sure the backend is running on port 5000
2. **File Upload Issues**: Check file size limits (10MB max)
3. **Generation Fails**: Try different prompts or reduce inference steps
4. **Slow Generation**: Higher inference steps = better quality but slower

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own video generation needs!
