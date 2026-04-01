const express = require('express');
const db = require('../db');
const router = express.Router();

// POST /signup - Register a new user using Supabase Auth
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email and password are required" });
    }

    try {
        // 1. Create user in Supabase Auth
        const { data: authData, error: authError } = await db.auth.signUp({
            email,
            password,
            options: {
                data: { username } // Optional: store username in auth metadata too
            }
        });

        if (authError) {
            console.error("Supabase Auth signup error:", authError);
            return res.status(400).json({ error: authError.message });
        }

        const authUser = authData.user;
        if (!authUser) {
            return res.status(500).json({ error: "Failed to create authentication user." });
        }

        // 2. Create profile in 'users' table using the same UUID
        const { data: profileData, error: profileError } = await db
            .from('users')
            .insert([
                { 
                    id: authUser.id, 
                    username, 
                    email,
                    role: 'user' // Default role
                }
            ])
            .select()
            .single();

        if (profileError) {
            console.error("Profile creation error:", profileError);
            // Consider if you want to delete the Auth user here if profile fails
            return res.status(500).json({ error: `User created but profile failed: ${profileError.message}` });
        }

        res.status(201).json({ 
            message: "User registered successfully", 
            user: { 
                id: profileData.id, 
                username: profileData.username, 
                email: profileData.email, 
                role: profileData.role 
            } 
        });
    } catch (error) {
        console.error("Signup exception:", error);
        res.status(500).json({ error: "Server error during signup" });
    }
});

// POST /signin - Authenticate a user using Supabase Auth
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    // Hardcoded Master Admin bypass (optional: migrate this to Auth too)
    if (email === 'vijay@gmail.com' && password === '1234567890') {
        return res.json({ 
            message: "Logged in as Master Admin", 
            user: { id: 'admin-1', username: 'Vijay', email: 'vijay@gmail.com', role: 'admin' }
        });
    }

    try {
        // 1. Sign in with Supabase Auth
        const { data: authData, error: authError } = await db.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            console.error("Supabase Auth signin error:", authError);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 2. Fetch profile from 'users' table
        const { data: user, error: profileError } = await db
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profileError) {
            console.error("Profile fetch error:", profileError);
            return res.status(500).json({ error: "Login successful but profile not found." });
        }

        res.json({ 
            message: "Logged in successfully", 
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email, 
                role: user.role 
            } 
        });
    } catch (error) {
        console.error("Signin exception:", error);
        res.status(500).json({ error: "Server error during signin" });
    }
});

module.exports = router;
