const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../db');
const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// POST /analyzeWaste - Identify waste in an image using AI
router.post('/analyzeWaste', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) {
            return res.status(400).json({ error: "Image data is required" });
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE' || process.env.GEMINI_API_KEY === '') {
            console.warn("Gemini API key is missing. Using mock classification.");
            const categories = ['Plastic', 'Organic', 'Metal'];
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            return res.json({ 
                category: randomCategory, 
                confidence: 0.95,
                mock: true,
                message: "This is a mock classification because no API key was provided." 
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const prompt = "Identify the type of waste in this image. Classify it strictly into one of these categories: 'Plastic', 'Organic', 'Metal', or 'Other'. Respond with only the category name.";

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg"
                }
            }
        ]);

        const response = await result.response;
        const text = response.text().trim();
        res.json({ category: text, confidence: 1.0 });

    } catch (error) {
        console.error("AI Analysis Error:", error);
        res.status(500).json({ error: "Failed to analyze image" });
    }
});

// GET /reports - Fetch all reported waste
router.get('/reports', async (req, res) => {
    try {
        const { data: reports, error } = await db
            .from('waste_reports')
            .select('*')
            .order('timestamp', { ascending: false });

        if (error) {
            console.error("Supabase select error:", error);
            return res.status(500).json({ error: "Failed to fetch reports" });
        }

        res.status(200).json(reports || []);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(200).json([]);
    }
});

// POST /reportWaste - Save a new waste report
router.post('/reportWaste', async (req, res) => {
    try {
        const { location, latitude, longitude, description, photo_url, timestamp, status, user_id, category } = req.body;
        const newReport = {
            location,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            description,
            photo_url,
            category,
            timestamp: timestamp || new Date().toISOString(),
            status: status || 'pending',
            report_id: `REP-${Date.now()}`,
            user_id: user_id || null
        };
        
        const { data, error } = await db
            .from('waste_reports')
            .insert([newReport])
            .select()
            .single();

        if (error) {
            console.error("Supabase insert error:", error);
            return res.status(500).json({ error: "Failed to save report" });
        }

        res.status(201).json({ message: "Report saved successfully", id: data.id });
    } catch (error) {
        console.error("Error saving report:", error);
        res.status(500).json({ error: "Failed to save report" });
    }
});

// PUT /report/:id/status - Update report status and award points
router.put('/report/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, role } = req.body;
        
        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }

        // Basic Authorization Check
        if (role !== 'admin') {
            return res.status(403).json({ error: "Unauthorized: Admin access required" });
        }

        // Fetch the report to get user_id before updating
        const { data: report, error: fetchError } = await db
            .from('waste_reports')
            .select('user_id, status')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        // Update status
        const { error: updateError } = await db
            .from('waste_reports')
            .update({ status })
            .eq('id', id);

        if (updateError) throw updateError;

        // Gamification: Award 50 points if marked as 'resolved'
        if (status === 'resolved' && report.status !== 'resolved' && report.user_id) {
            console.log(`Awarding 50 points to user ${report.user_id}`);
            const { error: pointsError } = await db.rpc('increment_impact_score', { 
                target_user_id: report.user_id, 
                points: 50 
            });
            
            if (pointsError) {
                console.warn("RPC failed, attempting direct update:", pointsError.message);
                const { data: userData } = await db.from('users').select('impact_score').eq('id', report.user_id).single();
                await db.from('users').update({ impact_score: (userData.impact_score || 0) + 50 }).eq('id', report.user_id);
            }
        }

        res.status(200).json({ message: "Report status updated successfully" });
    } catch (error) {
        console.error("Error updating report status:", error);
        res.status(500).json({ error: "Failed to update report status: " + error.message });
    }
});

// GET /leaderboard - Fetch top 10 contributors
router.get('/leaderboard', async (req, res) => {
    try {
        const { data, error } = await db
            .from('users')
            .select('id, username, impact_score')
            .order('impact_score', { ascending: false })
            .limit(10);

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        console.error("Leaderboard fetch error:", error);
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
});

// POST /seed - Bulk seed sample data
router.post('/seed', async (req, res) => {
    try {
        const locations = [
            { name: "Koramangala", lat: 12.9352, lng: 77.6245 },
            { name: "Indiranagar", lat: 12.9716, lng: 77.6412 },
            { name: "HSR Layout", lat: 12.9105, lng: 77.6450 },
            { name: "Whitefield", lat: 12.9698, lng: 77.7500 }
        ];
        const statusList = ['pending', 'resolved', 'in-progress'];
        const categories = ['Plastic', 'Organic', 'Metal', 'Paper', 'Electronic'];
        
        const seedData = [];
        const now = new Date();
        
        for (let i = 0; i < 20; i++) {
            const loc = locations[Math.floor(Math.random() * locations.length)];
            const status = statusList[Math.floor(Math.random() * statusList.length)];
            const cat = categories[Math.floor(Math.random() * categories.length)];
            
            seedData.push({
                location: loc.name,
                latitude: loc.lat + (Math.random() - 0.5) * 0.01,
                longitude: loc.lng + (Math.random() - 0.5) * 0.01,
                description: `${cat} waste found near ${loc.name}`,
                status: status,
                report_id: `REP-SEED-${Date.now()}-${i}`,
                timestamp: now.toISOString(),
                category: cat
            });
        }

        const { error } = await db.from('waste_reports').insert(seedData);
        if (error) throw error;

        res.status(200).json({ message: "Successfully seeded 20 sample reports" });
    } catch (error) {
        console.error("Seeding error:", error);
        res.status(500).json({ error: "Failed to seed data: " + error.message });
    }
});

module.exports = router;
