require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./db');
// const { db: firestore } = require('./config/firebase');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Handle static files based on environment
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- Authentication Routes ---

// POST /signup - Register a new user
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email and password are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const { data, error } = await db
            .from('users')
            .insert([
                { username, email, password: hashedPassword }
            ])
            .select()
            .single();

        if (error) {
            console.error("Supabase signup error (full):", error);
            if (error.code === '23505') { // Unique constraint violation in PostgreSQL
                if (error.message.includes('email')) {
                    return res.status(400).json({ error: "Email already exists" });
                }
                return res.status(400).json({ error: "Username already exists" });
            }
            return res.status(500).json({ error: `Database error: ${error.message}` });
        }

        res.status(201).json({ 
            message: "User registered successfully", 
            user: { id: data.id, username: data.username, email: data.email, role: data.role, password: password } 
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Server error during signup" });
    }
});

// POST /signin - Authenticate a user
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    // Hardcoded Master Admin
    if (email === 'vijay@gmail.com' && password === '1234567890') {
        return res.json({ 
            message: "Logged in as Master Admin", 
            user: { id: 'admin-1', username: 'Vijay', email: 'vijay@gmail.com', role: 'admin' }
        });
    }

    try {
        const { data: user, error } = await db
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            console.error("Supabase signin error (full):", error);
            if (error.code === 'PGRST116') { // No rows found
                return res.status(401).json({ error: "Invalid email or password" });
            }
            return res.status(500).json({ error: `Database error: ${error.message}` });
        }

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        res.json({ 
            message: "Logged in successfully", 
            user: { id: user.id, username: user.username, email: user.email, role: user.role, password: password } 
        });
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ error: "Server error during signin" });
    }
});

// --- Waste Reporting Routes ---
app.post('/analyzeWaste', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) {
            return res.status(400).json({ error: "Image data is required" });
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
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

app.get('/reports', async (req, res) => {
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

app.post('/reportWaste', async (req, res) => {
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

app.put('/report/:id/status', async (req, res) => {
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

        // Gamification: Award 50 points if marked as 'resolved' and wasn't already resolved
        if (status === 'resolved' && report.status !== 'resolved' && report.user_id) {
            console.log(`Awarding 50 points to user ${report.user_id}`);
            const { error: pointsError } = await db.rpc('increment_impact_score', { 
                target_user_id: report.user_id, 
                points: 50 
            });
            
            // Fallback if RPC doesn't exist (legacy update)
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

app.delete('/report/:id', async (req, res) => {
    // ... existed before ...
});

// GET /leaderboard - Fetch top 10 contributors
app.get('/leaderboard', async (req, res) => {
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
app.post('/seed', async (req, res) => {
    try {
        const locations = [
            { name: "Koramangala", lat: 12.9352, lng: 77.6245 },
            { name: "Indiranagar", lat: 12.9716, lng: 77.6412 },
            { name: "HSR Layout", lat: 12.9105, lng: 77.6450 },
            { name: "Whitefield", lat: 12.9698, lng: 77.7500 },
            { name: "Jayanagar", lat: 12.9250, lng: 77.5897 },
            { name: "MG Road", lat: 12.9755, lng: 77.6067 },
            { name: "Malleshwaram", lat: 12.9961, lng: 77.5712 },
            { name: "BTM Layout", lat: 12.9166, lng: 77.6101 }
        ];
        const statusList = ['pending', 'resolved', 'in-progress'];
        const categories = ['Plastic', 'Organic', 'Metal', 'Paper', 'Electronic'];
        
        const seedData = [];
        const now = new Date();
        
        for (let i = 0; i < 50; i++) {
            const loc = locations[Math.floor(Math.random() * locations.length)];
            const status = statusList[Math.floor(Math.random() * statusList.length)];
            const cat = categories[Math.floor(Math.random() * categories.length)];
            const date = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
            
            seedData.push({
                location: loc.name,
                latitude: loc.lat + (Math.random() - 0.5) * 0.01,
                longitude: loc.lng + (Math.random() - 0.5) * 0.01,
                description: `${cat} waste found near ${loc.name}`,
                status: status,
                report_id: `REP-SEED-${Date.now()}-${i}`,
                timestamp: date.toISOString()
            });
        }

        const { error } = await db.from('waste_reports').insert(seedData);
        if (error) throw error;

        res.status(200).json({ message: "Successfully seeded 50 sample reports" });
    } catch (error) {
        console.error("Seeding error:", error);
        res.status(500).json({ error: "Failed to seed data: " + error.message });
    }
});

// Conditional listener for local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`SmartWaste Server is running on http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;
