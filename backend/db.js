const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL and Key are required in .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase client initialized.');

module.exports = supabase;
