const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

// POST /signup - Register a new user
router.post('/signup', async (req, res) => {
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
router.post('/signin', async (req, res) => {
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

module.exports = router;
