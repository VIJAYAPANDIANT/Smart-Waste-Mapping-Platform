/**
 * Admin Page — wrapped for SPA usage
 */

let hotspotChart;
let lastReports = [];

function initAdmin() {
    loadDashboard();
}

async function loadDashboard() {
    try {
        const response = await fetch('http://localhost:3000/reports');
        const reports = await response.json();

        updateStats(reports);
        populateTable(reports);
        renderChart(reports);
    } catch (error) {
        console.error("Error loading dashboard data:", error);
    }
}

function updateStats(reports) {
    const totalEl = document.getElementById('totalReports');
    const pendingEl = document.getElementById('pendingReports');
    const resolvedEl = document.getElementById('resolvedReports');
    if (!totalEl) return;

    totalEl.textContent = reports.length;
    pendingEl.textContent = reports.filter(r => r.status === 'pending').length;
    resolvedEl.textContent = reports.filter(r => r.status === 'resolved').length;
}

function populateTable(reports) {
    const tbody = document.querySelector('#reportsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    reports.forEach(report => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${report.location}</td>
            <td>${report.category || 'N/A'}</td>
            <td>${new Date(report.timestamp).toLocaleDateString()}</td>
            <td><span class="status-badge ${report.status}">${report.status}</span></td>
            <td class="action-btns">
                <button class="btn-sm btn-approve" onclick="approveReport('${report.id}')">Approve</button>
                <button class="btn-sm btn-delete" onclick="deleteReport('${report.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function deleteReport(id) {
    if (confirm('Are you sure you want to delete this report?')) {
        try {
            const response = await fetch(`http://localhost:3000/report/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('Report deleted');
                loadDashboard();
            }
        } catch (error) {
            console.error("Error deleting report:", error);
        }
    }
}

function approveReport(id) {
    alert('Report approved and marked for action.');
}

function renderChart(reports) {
    lastReports = reports;
    const canvas = document.getElementById('hotspotChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const locationCounts = {};
    reports.forEach(r => {
        locationCounts[r.location] = (locationCounts[r.location] || 0) + 1;
    });

    const labels = Object.keys(locationCounts);
    const data = Object.values(locationCounts);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#ffffff' : '#0f172a';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    if (hotspotChart) {
        hotspotChart.destroy();
        hotspotChart = null;
    }

    hotspotChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Reports per Area',
                data: data,
                backgroundColor: [
                    '#2563eb', '#1e40af', '#0f172a', '#3b82f6', '#1d4ed8', '#020617'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: textColor }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                },
                x: {
                    ticks: { color: textColor },
                    grid: { color: gridColor }
                }
            }
        }
    });
}

// Listen for theme changes to refresh chart colors
window.addEventListener('themeChanged', () => {
    if (lastReports.length > 0) {
        renderChart(lastReports);
    }
});

/**
 * Cleanup: destroy chart instance when navigating away
 */
function cleanupAdmin() {
    if (hotspotChart) {
        hotspotChart.destroy();
        hotspotChart = null;
    }
    lastReports = [];
}
