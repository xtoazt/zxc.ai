const axios = require('axios');

async function testSetup() {
  console.log('🧪 Testing Instant Video Generator setup...\n');

  try {
    // Test backend health
    console.log('1. Testing backend health...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Backend is running:', healthResponse.data.message);

    // Test options endpoint
    console.log('\n2. Testing options endpoint...');
    const optionsResponse = await axios.get('http://localhost:5000/api/options');
    console.log('✅ Available models:', optionsResponse.data.baseModels);
    console.log('✅ Motion options:', optionsResponse.data.motionOptions.length, 'options');
    console.log('✅ Inference steps:', optionsResponse.data.inferenceSteps);

    console.log('\n🎉 All tests passed! Your video generator is ready to use.');
    console.log('\nNext steps:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Try generating a video with a simple prompt');
    console.log('3. Upload an image and describe what you want to animate');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure the backend is running: cd server && npm run dev');
    console.log('2. Check that port 5000 is not in use');
    console.log('3. Verify all dependencies are installed');
  }
}

testSetup();
