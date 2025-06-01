var express = require('express');
var router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
var response = require('../config/respon/index');
const genAI = new GoogleGenerativeAI('AIzaSyCepntRTz226oTX7_QXMtx1G-CTcQzL24I');

router.post('/', async function(req, res, next) {
    const { topic } = req.body;
    if(topic){
    try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

  
    const prompt = ` Generate a list ideas for topic:${topic}.
                    Return ONLY JSON like this about 10 object data:
                    {
                        "title_topic": "short caption or tagline",
                        "tag": "1-2 tag",
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
    res.status(500).json({ ...response,message: "Topic Undefined" });
  }
});

module.exports = router;
