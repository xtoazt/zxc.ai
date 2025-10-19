import axios from 'axios';
import formidable from 'formidable';
import sharp from 'sharp';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: ({ mimetype }) => mimetype && mimetype.includes('image/')
    });

    const [fields, files] = await form.parse(req);
    
    const prompt = fields.prompt?.[0];
    const baseModel = fields.baseModel?.[0] || 'Realistic';
    const motion = fields.motion?.[0] || '';
    const inferenceSteps = fields.inferenceSteps?.[0] || '4-Step';
    const imageFile = files.image?.[0];

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!imageFile) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    console.log('Processing image and generating video...');
    
    // Process the uploaded image
    const processedImageBuffer = await sharp(imageFile.filepath)
      .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();
    
    const imageBase64 = processedImageBuffer.toString('base64');
    
    // Enhanced prompt with image context
    const enhancedPrompt = `Focus: ${prompt} (Image reference provided)`;
    
    // Call Instant Video API
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
    
    // Clean up uploaded file
    if (fs.existsSync(imageFile.filepath)) {
      fs.unlinkSync(imageFile.filepath);
    }
    
    res.status(200).json({
      success: true,
      data: response.data,
      message: 'Video generated successfully with image reference'
    });
  } catch (error) {
    console.error('Error generating video with image:', error);
    
    // Clean up files on error
    if (req.files?.image?.[0]?.filepath && fs.existsSync(req.files.image[0].filepath)) {
      fs.unlinkSync(req.files.image[0].filepath);
    }
    
    res.status(500).json({ 
      error: 'Failed to generate video with image',
      details: error.message 
    });
  }
}
