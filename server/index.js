const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Function to process and optimize uploaded image
async function processImage(imagePath) {
  try {
    const processedPath = imagePath.replace(/\.[^/.]+$/, '_processed.jpg');
    
    await sharp(imagePath)
      .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toFile(processedPath);
    
    return processedPath;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

// Function to convert image to base64
function imageToBase64(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    return `data:image/jpeg;base64,${base64Image}`;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
}

// Function to call Instant Video API
async function generateVideo(prompt, baseModel, motion, inferenceSteps, imageData = null) {
  try {
    // Enhanced prompt with image context if provided
    let enhancedPrompt = prompt;
    if (imageData) {
      enhancedPrompt = `Based on this image: ${prompt}`;
    }

    const response = await axios.post('https://sahaniji-instant-video.hf.space/api/predict', {
      data: [
        enhancedPrompt,
        baseModel,
        motion,
        inferenceSteps
      ]
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 300000 // 5 minutes timeout
    });

    return response.data;
  } catch (error) {
    console.error('Error calling Instant Video API:', error);
    throw error;
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Video Generator API is running' });
});

// Generate video with text prompt only
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, baseModel = 'Realistic', motion = '', inferenceSteps = '4-Step' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Generating video with prompt:', prompt);
    
    const result = await generateVideo(prompt, baseModel, motion, inferenceSteps);
    
    res.json({
      success: true,
      data: result,
      message: 'Video generated successfully'
    });
  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({ 
      error: 'Failed to generate video',
      details: error.message 
    });
  }
});

// Generate video with image upload
app.post('/api/generate-video-with-image', upload.single('image'), async (req, res) => {
  try {
    const { prompt, baseModel = 'Realistic', motion = '', inferenceSteps = '4-Step' } = req.body;
    const imageFile = req.file;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!imageFile) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    console.log('Processing image and generating video...');
    
    // Process the uploaded image
    const processedImagePath = await processImage(imageFile.path);
    const imageBase64 = imageToBase64(processedImagePath);
    
    // Enhanced prompt with image context
    const enhancedPrompt = `Focus: ${prompt} (Image reference provided)`;
    
    const result = await generateVideo(enhancedPrompt, baseModel, motion, inferenceSteps, imageBase64);
    
    // Clean up uploaded files
    fs.unlinkSync(imageFile.path);
    if (fs.existsSync(processedImagePath)) {
      fs.unlinkSync(processedImagePath);
    }
    
    res.json({
      success: true,
      data: result,
      message: 'Video generated successfully with image reference'
    });
  } catch (error) {
    console.error('Error generating video with image:', error);
    
    // Clean up files on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Failed to generate video with image',
      details: error.message 
    });
  }
});

// Get available models and options
app.get('/api/options', (req, res) => {
  res.json({
    baseModels: [
      'Realistic',
      'Cartoon',
      'Anime',
      '3D',
      'Sketch'
    ],
    motionOptions: [
      '',
      'Zoom in',
      'Zoom out',
      'Pan left',
      'Pan right',
      'Tilt up',
      'Tilt down',
      'Rotate clockwise',
      'Rotate counterclockwise'
    ],
    inferenceSteps: [
      '1-Step',
      '2-Step',
      '4-Step',
      '8-Step',
      '12-Step'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    details: error.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Video Generator API running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
});
