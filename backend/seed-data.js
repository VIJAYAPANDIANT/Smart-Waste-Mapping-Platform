require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const locations = [
    { name: "Koramangala", lat: 12.9352, lng: 77.6245 },
    { name: "Indiranagar", lat: 12.9716, lng: 77.6412 },
    { name: "HSR Layout", lat: 12.9105, lng: 77.6450 },
    { name: "Whitefield", lat: 12.9698, lng: 77.7500 },
    { name: "Jayanagar", lat: 12.9250, lng: 77.5897 },
    { name: "MG Road", lat: 12.9755, lng: 77.6067 },
    { name: "Malleshwaram", lat: 12.9961, lng: 77.5712 },
    { name: "BTM Layout", lat: 12.9166, lng: 77.6101 },
    { name: "Electronic City", lat: 12.8440, lng: 77.6630 },
    { name: "Hebbal", lat: 13.0358, lng: 77.5970 }
];

const categories = ['Plastic', 'Organic', 'Metal', 'Paper', 'Electronic', 'Other'];
const mappingStatus = ['pending', 'resolved', 'in-progress'];

const generateRichData = (count) => {
    const data = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
        const loc = locations[Math.floor(Math.random() * locations.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const status = mappingStatus[Math.floor(Math.random() * mappingStatus.length)];
        
        // Random date in last 30 days
        const date = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        
        data.push({
            location: loc.name,
            latitude: loc.lat + (Math.random() - 0.5) * 0.01,
            longitude: loc.lng + (Math.random() - 0.5) * 0.01,
            description: `${category} waste reported at ${loc.name}`,
            status: status,
            report_id: `REP-ANALYTICS-${Date.now()}-${i}`,
            timestamp: date.toISOString()
        });
    }
    return data;
};

async function seedData() {
    const dataSize = 150;
    const richData = generateRichData(dataSize);
    console.log(`🚀 Seeding ${dataSize} rich analytics records to Supabase...`);
    
    // Insert in batches of 50 to avoid any limits
    for (let i = 0; i < richData.length; i += 50) {
        const batch = richData.slice(i, i + 50);
        const { error } = await supabase.from('waste_reports').insert(batch);
        if (error) {
            console.error(`❌ Error seeding batch ${i/50 + 1}:`, error.message);
        } else {
            console.log(`✅ Batch ${i/50 + 1} complete...`);
        }
    }
    
    console.log('\n🌟 Seeding complete! Check your updated Admin Dashboard.');
}

seedData();
