require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_KEY are missing in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin(username, email, password) {
    console.log(`⏳ Creating admin user: ${username} (${email})...`);
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const { data, error } = await supabase
            .from('users')
            .insert([
                { username, email, password: hashedPassword, role: 'admin' }
            ])
            .select()
            .single();

        if (error) {
            console.error('❌ Error creating admin:', error.message);
            if (error.message.includes('relation "public.users" does not exist')) {
                console.log('👉 Tip: You must run the SQL in Supabase Editor first (check walkthrough.md)');
            }
        } else {
            console.log(`✅ Admin user "${data.username}" created successfully!`);
            console.log('You can now log in at http://localhost:3000/index.html');
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
