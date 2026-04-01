require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkSchema() {
    console.log("--- Detailed Schema Check ---");
    try {
        // We can check data types by looking at the first row's value types
        const { data, error } = await supabase.from('users').select('*').limit(1);
        
        if (error) {
            console.error("❌ Error:", error.message);
        } else if (data && data.length > 0) {
            const row = data[0];
            console.log("Column Types (from first row):");
            Object.keys(row).forEach(key => {
                console.log(`- ${key}: ${typeof row[key]} (Value: ${row[key]})`);
            });
            
            // Check if ID looks like a UUID or a number
            const id = row.id;
            if (typeof id === 'string' && id.includes('-')) {
                console.log("✅ ID column appears to be a UUID (string).");
            } else if (typeof id === 'number') {
                console.log("⚠️ ID column is a NUMBER. This will conflict with Supabase Auth UUIDs!");
            }
        } else {
            console.log("Table is empty. Cannot determine types easily via JS.");
        }
    } catch (e) {
        console.error("Failure:", e.message);
    }
    console.log("--- Schema Check Finished ---");
    process.exit(0);
}

checkSchema();
