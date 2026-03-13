let map;
let markers = [];
const recyclingCenters = [
    { name: "City Plastic Recycling", lat: 12.9716, lng: 77.5946, type: "Plastic" },
    { name: "Eco E-Waste Collection", lat: 12.9850, lng: 77.6100, type: "E-Waste" },
    { name: "Green Composting Center", lat: 12.9500, lng: 77.5800, type: "Compost" }
];

function initMap() {
    // Default center (Bangalore as example)
    const center = [12.9716, 77.5946];
    
    // Initialize Leaflet map
    map = L.map('map').setView(center, 13);

    // Add CartoDB Dark Matter tile layer for a premium dark look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Custom Blue Icon for Recycling Centers
    const blueIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div style='background-color:#2563eb; width:12px; height:12px; border-radius:50%; border:2px solid white;'></div>",
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });

    // Load recycling centers
    recyclingCenters.forEach(center => {
        L.marker([center.lat, center.lng], { icon: blueIcon })
            .bindPopup(`<b>${center.name}</b><br>${center.type} Recycling`)
            .addTo(map);
    });

    // Load waste reports from backend
    loadReports();
}

async function loadReports() {
    try {
        const response = await fetch('http://localhost:3000/reports');
        const reports = await response.json();
        
        displayReports(reports);
        detectHotspots(reports);
    } catch (error) {
        console.error("Error loading reports:", error);
    }
}

function displayReports(reports) {
    if (!Array.isArray(reports)) return;
    
    // Custom Light Blue Icon for Waste Reports
    const ltBlueIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div style='background-color:#60a5fa; width:12px; height:12px; border-radius:50%; border:1px solid white;'></div>",
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });

    reports.forEach(report => {
        if (report.latitude && report.longitude) {
            const marker = L.marker([parseFloat(report.latitude), parseFloat(report.longitude)], { icon: ltBlueIcon })
                .bindPopup(`
                    <div class="info-window">
                        <h3>${report.location}</h3>
                        <p>${report.description}</p>
                        <p><small>${new Date(report.timestamp).toLocaleDateString()}</small></p>
                        ${report.photo_url ? `<img src="${report.photo_url}" alt="Waste Photo" style="width:100%; border-radius:4px; margin-top:8px;">` : ''}
                    </div>
                `)
                .addTo(map);
            markers.push(marker);
        }
    });
}

function detectHotspots(reports) {
    if (!Array.isArray(reports)) return;
    
    // Simplified Hotspot visualization using circle markers with glow
    reports.forEach(report => {
        if (report.latitude && report.longitude) {
            L.circle([parseFloat(report.latitude), parseFloat(report.longitude)], {
                color: '#3b82f6',
                fillColor: '#ffffff',
                fillOpacity: 0.2,
                radius: 200,
                stroke: false
            }).addTo(map);
        }
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initMap);
