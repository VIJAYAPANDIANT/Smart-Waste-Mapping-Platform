require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_KEY are missing in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin(username, email, password) {
    console.log(`⏳ Creating admin user in Supabase Auth: ${username} (${email})...`);
    
    try {
        // 1. Create Auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: { username }
        });

        if (authError) {
            console.error('❌ Error creating auth user:', authError.message);
            if (authError.message.includes('User already registered')) {
                console.log('👉 Tip: If user exists in Auth but not in users table, check your database.');
            }
            return;
        }

        console.log(`✅ Auth user created. Now creating profile in "users" table...`);

        // 2. Create profile in users table
        const { data, error } = await supabase
            .from('users')
            .insert([
                { id: authData.user.id, username, email, role: 'admin' }
            ])
            .select()
            .single();

        if (error) {
            console.error('❌ Error creating profile:', error.message);
        } else {
            console.log(`✅ Admin profile "${data.username}" created successfully with ID: ${data.id}`);
            console.log('You can now log in at your deployed Vercel URL or http://localhost:3000');
        }
    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
    }
}

// Usage: node create-admin.js <username> <email> <password>
const args = process.argv.slice(2);
if (args.length < 3) {
    console.log('Usage: node create-admin.js <username> <email> <password>');
    console.log('Example: node create-admin.js myadmin admin@test.com secret123');
} else {
    createAdmin(args[0], args[1], args[2]);
}
