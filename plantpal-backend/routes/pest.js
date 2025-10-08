const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-2.5-flash-lite" });



// Set up Multer
const upload = multer({ dest: 'uploads/' });

function fileToGenerativePart(path, mimeType) {
    if (!fs.existsSync(path)) throw new Error(`File not found: ${path}`);
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType,
        },
    };
}

router.post('/scan', protect, upload.single('plantImage'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No image file uploaded." });

    try {
        const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);
        const prompt = `
            Analyze this plant image. Focus specifically on pests, disease, or nutrient deficiency signs. 
            Provide a concise diagnosis (e.g., 'Spider Mites') and a 3-step organic treatment plan.
            Respond in plain text only.
        `;

        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text();

        fs.unlinkSync(req.file.path);
        res.json({ analysis: responseText });
   } catch (error) {
    console.error("🧩 Gemini API Error Details:");
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Full object:", JSON.stringify(error, null, 2));

    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Analysis failed. Server encountered a critical error during AI processing." });
}

});

module.exports = router;
