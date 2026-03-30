/**
 * Map Page — wrapped for SPA usage
 */

let map;
let markers = [];
let tileLayer;

const recyclingCenters = [
    // Karnataka
    { name: "City Plastic Recycling", lat: 12.9716, lng: 77.5946, type: "Plastic" },
    { name: "Eco E-Waste Collection", lat: 12.9850, lng: 77.6100, type: "E-Waste" },
    { name: "Green Composting Center", lat: 12.9500, lng: 77.5800, type: "Compost" },
    { name: "Koramangala Recycling Hub", lat: 12.9300, lng: 77.6200, type: "Mixed" },
    { name: "Whitefield Waste Management", lat: 12.9700, lng: 77.7400, type: "Paper" },
    
    // Tamil Nadu (Chennai)
    { name: "TN Green Segregation", lat: 13.0827, lng: 80.2707, type: "Mixed" },
    { name: "Chennai E-Waste Management", lat: 12.9815, lng: 80.2500, type: "E-Waste" },
    { name: "Coimbatore Plastic Recycling", lat: 11.0168, lng: 76.9558, type: "Plastic" },

    // Kerala
    { name: "Kochi Marine Debris Recycler", lat: 9.9816, lng: 76.2999, type: "Plastic" },
    { name: "Trivandrum Organic Compost", lat: 8.5241, lng: 76.9366, type: "Compost" },
    
    // Andhra Pradesh
    { name: "Vizag Metal Salvage", lat: 17.6868, lng: 83.2185, type: "Metal" },
    { name: "Vijayawada Paper Mills", lat: 16.5062, lng: 80.6480, type: "Paper" },
    
    // Delhi
    { name: "Delhi Central Recycling", lat: 28.6139, lng: 77.2090, type: "Mixed" },
    { name: "Noida Sector 62 E-Waste", lat: 28.6100, lng: 77.3600, type: "E-Waste" },
    { name: "Gurugram Scrappers", lat: 28.4595, lng: 77.0266, type: "Metal" },
    
    // Maharashtra
    { name: "Mumbai Eco-Plast", lat: 19.0760, lng: 72.8777, type: "Plastic" },
    { name: "Pune Compost Plant", lat: 18.5204, lng: 73.8567, type: "Compost" },
    
    // West Bengal
    { name: "Kolkata Green Paper Ltd", lat: 22.5726, lng: 88.3639, type: "Paper" },
    { name: "Salt Lake E-Waste Facility", lat: 22.5800, lng: 88.4200, type: "E-Waste" }
];

function initMap() {
    // If map already exists, clean it up first
    if (map) {
        cleanupMap();
    }

    const mapEl = document.getElementById('map');
    if (!mapEl) return;

    // Default center (Bangalore)
    const center = [12.9716, 77.5946];

    // Initialize Leaflet map
    map = L.map('map').setView(center, 13);

    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    updateMapStyle(theme);

    // Custom Icons
    const createIcon = (iconClass, color) => L.divIcon({
        html: `<div class="map-icon" style="background-color: ${color}"><i class="${iconClass}"></i></div>`,
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    const icons = {
        waste: createIcon('fas fa-trash-alt', '#3b82f6'),
        recycle: createIcon('fas fa-recycle', '#10b981'),
        pending: createIcon('fas fa-exclamation-triangle', '#ef4444'),
        resolved: createIcon('fas fa-check-circle', '#10b981')
    };

    // Load recycling centers
    recyclingCenters.forEach(center => {
        L.marker([center.lat, center.lng], { icon: icons.recycle })
            .bindPopup(`<b>${center.name}</b><br>${center.type} Recycling`)
            .addTo(map);
    });

    // Load reports and centers
    loadReports();

    // Fix for map not showing in SPA: force resize after DOM settles
    setTimeout(() => {
        if (map) {
            map.invalidateSize();
        }
    }, 300);
}

function updateMapStyle(theme) {
    if (!map) return;

    if (tileLayer) {
        map.removeLayer(tileLayer);
    }

    const darkUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    const lightUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    tileLayer = L.tileLayer(theme === 'dark' ? darkUrl : lightUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);
}

// Listen for theme changes to swap map tiles
window.addEventListener('themeChanged', (e) => {
    if (map) {
        updateMapStyle(e.detail.theme);
    }
});

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

    // Helper for DivIcons within this scope
    const getReportIcon = (status) => L.divIcon({
        html: `<div class="map-icon" style="background-color: ${status === 'resolved' ? '#10b981' : '#3b82f6'}"><i class="fas fa-trash-alt"></i></div>`,
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    reports.forEach(report => {
        if (report.latitude && report.longitude) {
            const marker = L.marker([parseFloat(report.latitude), parseFloat(report.longitude)], { icon: getReportIcon(report.status) })
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

    reports.forEach(report => {
        if (report.latitude && report.longitude) {
            // Enhanced hotspot visualization: glow effect based on status
            const color = report.status === 'resolved' ? '#10b981' : '#ef4444';
            L.circle([parseFloat(report.latitude), parseFloat(report.longitude)], {
                color: color,
                fillColor: color,
                fillOpacity: 0.15,
                radius: 300,
                stroke: false,
                weight: 1
            }).addTo(map);
        }
    });
}

/**
 * Cleanup: destroy map instance when navigating away
 */
function cleanupMap() {
    if (map) {
        map.remove();
        map = null;
        tileLayer = null;
        markers = [];
    }
}
