var express = require('express');
var router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
var response = require('../config/respon/index');
const genAI = new GoogleGenerativeAI('AIzaSyCepntRTz226oTX7_QXMtx1G-CTcQzL24I');

router.post('/', async function(req, res, next) {
    const { idea } = req.body;
    console.log(idea);
    
    if(idea ){
    try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

      const prompt = ` Generate a list ideas for Topic:${idea}.
                    Return ONLY JSON like this about 2-3 object data:
                    {
                        "social": "short caption or tagline",
                        "content": "1-2 paragraphs",
                        "tone": "call-to-action text"
                    }`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    let cleanedText = text.trim();

    if (cleanedText.startsWith('```json')) {
    cleanedText = cleanedText.slice(7).trim();
    if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.slice(0, -3).trim();
    }
    }
    let json;
    try {
      json = JSON.parse(cleanedText);
    } catch (err) {
      return res.status(500).json({ error: 'Invalid JSON from AI', raw: text });
    }

    res.status(200).json({...response, message: "success", data: json});
  } catch (err) {
    console.error('Error generating content:', err);
    res.status(500).json({ ...response,message: err.statusText });
  } 
  } else {
    res.status(500).json({ ...response,message: "idea Undefined" });
  }
});

module.exports = router;
