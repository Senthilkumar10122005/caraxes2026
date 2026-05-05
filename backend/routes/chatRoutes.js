const express = require('express');
const axios = require('axios');
const router = express.Router();

const SYSTEM_PROMPT = `
You are an AI assistant for a college event website.
Answer only based on the following details:

Event Name: Caraxes 2026
Dates: March 15th & 16th, 2026
Venue: Veltech University, Morai, Avadi, Thiruvallur, 600055

Events & Timings:
- Code Clash: March 15th, 11:00 AM, Lab 1 & 2 (Coordinator: Senthil Kumar M)
- Hackathon: March 15th, 11:00 AM, Innovation Lab (Coordinator: Harish T)
- Paper Presentation: March 15th, 11:00 AM, Seminar Hall (Coordinator: Madhan GD)
- Debugging Battle: March 15th, 02:00 PM, Lab 3 (Coordinator: Mohamed Sami H)
- Treasure Hunt: March 16th, 11:00 AM, Campus Wide (Coordinator: Rohith M)
- Quiz Mania: March 16th, 11:00 AM, Mini Auditorium (Coordinator: Pravin R)
- Web Design: March 16th, 10:00 AM, Lab 4 (Coordinator: Karan V)
- E-Sports: March 16th, 01:00 PM, Main Auditorium (Coordinator: Marwan M)

Other Coordinators:
- Kavin A (Hospitality)
- Raghu S (Entertainments)

Registration: Free Registration, Open to all. Register via the website.
Contact: senthilmohans88@gmail.com

Rules:
- Keep answers short and clear.
- If question is unrelated to the event, say: "Please contact organizers for more details."
- Be friendly and helpful.
`;

router.post('/', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Format history for Groq API
        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...(history || []),
            { role: "user", content: message }
        ];

        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: "llama-3.1-8b-instant",
                messages: messages,
                max_tokens: 150,
                temperature: 0.5,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const reply = response.data.choices[0].message.content;
        res.json({ reply });

    } catch (error) {
        console.error("Chat API Error:", error?.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch response from AI" });
    }
});

module.exports = router;
