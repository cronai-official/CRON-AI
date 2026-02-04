const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { createServerStructure } = require('./bot.js');

const app = express();
app.use(cors(), express.json(), express.static(__dirname));

// --- COUNTER LOGIC ---
let totalDeployed = 1240; // Starting point for social proof

app.get('/api/stats', (req, res) => {
    res.json({ total: totalDeployed });
});

app.post('/generate', async (req, res) => {
    const { category, chCount, roleCount } = req.body;
    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.3-70b-versatile",
            messages: [
                { 
                    role: "system", 
                    content: `You are CRON AI, developed by Nauman Ali. Return ONLY valid JSON.
                    RULES:
                    1. Create a server structure for: ${category}.
                    2. Categories (8-10) must start with an emoji (e.g. "📁 INFO").
                    3. Channels (${chCount} total) must be strings with emojis (e.g. "💬 lounge").
                    4. Roles (${roleCount} total) must be strings with emojis (e.g. "👑 Admin").
                    5. Roles must have a hex color.
                    6. DO NOT use objects for channel names, use plain strings.
                    Structure: {"categories": [{"name": "string", "channels": ["string"]}], "roles": [{"name": "string", "color": "hex"}]}`
                },
                { role: "user", content: `Generate ${chCount} channels and ${roleCount} roles.` }
            ],
            response_format: { type: "json_object" }
        }, {
            headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY.trim()}` }
        });
        res.json(JSON.parse(response.data.choices[0].message.content));
    } catch (err) { res.status(500).json({ error: "API_ERROR" }); }
});

app.post('/setup-server', async (req, res) => {
    try {
        await createServerStructure(req.body.guildId, req.body.templateData);
        totalDeployed++; // Har successful setup par ek count badhega
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: "DEPLOY_ERROR" }); }
});

app.listen(3000, () => console.log("CRON AI RUNNING | DEV: NAUMAN ALI"));
                                    
