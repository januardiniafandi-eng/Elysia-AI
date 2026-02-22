const express = require('express');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

dotenv.config();
app.use(express.json());
app.use(express.static(__dirname));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ENDPOINT 1: AUDIT & RECOMMENDATION
app.post('/api/audit', async (req, res) => {
    try {
        const { clientName, platform, url } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Lakukan audit mendalam untuk Brand: ${clientName} pada Platform: ${platform} dengan URL: ${url}.
        Berikan report dalam format JSON (hanya JSON):
        {
          "score": 0-100,
          "vulnerabilities": ["poin 1", "poin 2"],
          "analysis": "Penjelasan gamblang kekurangan saat ini",
          "recommended_package": "Starter/Business/Sultan",
          "reason": "Alasan kuat kenapa harus paket tersebut"
        }`;

        const result = await model.generateContent(prompt);
        res.json({ success: true, audit: JSON.parse(result.response.text()) });
    } catch (error) {
        res.status(500).json({ success: false, message: "Audit Failed" });
    }
});

// ENDPOINT 2: EXECUTION REPORT
app.post('/api/execute', async (req, res) => {
    try {
        const { clientName, platform, package } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Berikan Laporan Hasil Eksekusi untuk ${clientName} paket ${package} di ${platform}.
        Jika YouTube, sertakan parameter: Retention Rate, CTR, Impression Increase, dan Audience Sentiment.
        Gunakan gaya bahasa profesional.`;

        const result = await model.generateContent(prompt);
        res.json({ success: true, execution_report: result.response.text() });
    } catch (error) {
        res.status(500).json({ success: false, message: "Execution Failed" });
    }
});

app.listen(80, () => console.log(`ELYSIΛ PRO Engine V5 Active`));
