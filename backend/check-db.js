require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_KEY are missing in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
    console.log('🔍 Checking Supabase connection and tables...');

    // Check Users Table
    const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true });

    if (usersError) {
        console.error('❌ Error accessing "users" table:', usersError.message);
        if (usersError.message.includes('relation "public.users" does not exist')) {
            console.log('👉 Tip: You need to create the "users" table using the SQL in walkthrough.md');
        }
    } else {
        console.log('✅ "users" table is accessible.');
    }

    // Check Waste Reports Table
    const { data: reportsData, error: reportsError } = await supabase
        .from('waste_reports')
        .select('count', { count: 'exact', head: true });

    if (reportsError) {
        console.error('❌ Error accessing "waste_reports" table:', reportsError.message);
        if (reportsError.message.includes('relation "public.waste_reports" does not exist')) {
            console.log('👉 Tip: You need to create the "waste_reports" table using the SQL in walkthrough.md');
        }
    } else {
        console.log('✅ "waste_reports" table is accessible.');
    }

    if (!usersError && !reportsError) {
        console.log('\n🚀 Database setup looks good!');
    } else {
        console.log('\n⚠️ Please fix the errors above before running the app.');
    }
}

checkDatabase();
