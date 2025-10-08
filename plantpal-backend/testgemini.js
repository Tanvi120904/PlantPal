const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

async function testGemini() {
  try {
    // Confirm the API key is loaded
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in .env');
    }
    console.log('Gemini API Key loaded ✅');

    // Initialize Gemini client
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    // Test call
    console.log('Testing Gemini API key...');
    const result = await model.generateContent('Hello Gemini! Can you respond with a simple message?');
    
    // Print the AI response
    console.log('✅ Success! Gemini responded:\n', result.response.text());

  } catch (error) {
    console.error('❌ Gemini test failed:');
    console.error('Name:', error.name);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testGemini();
