/**
 * Map Page — wrapped for SPA usage
 */

let map;
let markers = [];
let tileLayer;

const recyclingCenters = [
    { name: "City Plastic Recycling", lat: 12.9716, lng: 77.5946, type: "Plastic" },
    { name: "Eco E-Waste Collection", lat: 12.9850, lng: 77.6100, type: "E-Waste" },
    { name: "Green Composting Center", lat: 12.9500, lng: 77.5800, type: "Compost" },
    { name: "Koramangala Recycling Hub", lat: 12.9300, lng: 77.6200, type: "Mixed" },
    { name: "Whitefield Waste Management", lat: 12.9700, lng: 77.7400, type: "Paper" }
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
