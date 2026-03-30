require('dotenv').config();
const db = require('./db');

async function checkLeaderboard() {
    console.log("Checking leaderboard query...");
    const { data, error } = await db
        .from('users')
        .select('id, username, impact_score')
        .order('impact_score', { ascending: false })
        .limit(10);

    if (error) {
        console.error("Query failed:", error.message);
        console.error("Code:", error.code);
        console.error("Hint:", error.hint);
        if (error.message.includes('column "impact_score" does not exist')) {
            console.log("\n>>> FIX: You need to add 'impact_score' column to 'users' table in Supabase.");
        }
    } else {
        console.log("Query successful!");
        console.table(data);
    }
}

checkLeaderboard();
