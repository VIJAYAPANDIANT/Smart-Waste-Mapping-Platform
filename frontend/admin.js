/**
 * Admin Page — wrapped for SPA usage
 */

let hotspotChart;
let statusChart;
let trendChart;
let lastReports = [];

function initAdmin() {
    loadDashboard();
    document.getElementById('exportCsvBtn').addEventListener('click', exportToCSV);
    const seedBtn = document.getElementById('seedDataBtn');
    if (seedBtn) {
        seedBtn.addEventListener('click', async () => {
            const confirmed = await showConfirm('Seed Data', 'Add 50 sample reports to the database?');
            if (confirmed) {
                seedBtn.disabled = true;
                seedBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Seeding...';
                try {
                    const response = await fetch('/seed', { method: 'POST' });
                    if (response.ok) {
                        showToast('Sample data added successfully!');
                        loadDashboard();
                    }
                } catch (error) {
                    console.error("Seeding failed:", error);
                    showToast('Failed to seed data', 'error');
                } finally {
                    seedBtn.disabled = false;
                    seedBtn.innerHTML = '<i class="fas fa-magic"></i> Seed Sample Data';
                }
            }
        });
    }
}

async function loadDashboard() {
    try {
        const response = await fetch('/reports');
        const reports = await response.json();
        lastReports = reports;

        updateStats(reports);
        populateTable(reports.slice(0, 10)); // Show only top 10 in table
        renderAllCharts(reports);
    } catch (error) {
        console.error("Error loading dashboard data:", error);
    }
}

function exportToCSV() {
    if (lastReports.length === 0) return;
    
    const headers = ['id', 'location', 'description', 'status', 'timestamp', 'latitude', 'longitude'];
    const csvContent = [
        headers.join(','),
        ...lastReports.map(r => headers.map(h => `"${r[h] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `waste_reports_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function renderAllCharts(reports) {
    if (typeof Chart === 'undefined') {
        console.warn("Chart.js not loaded yet, retrying in 500ms...");
        setTimeout(() => renderAllCharts(reports), 500);
        return;
    }
    renderHotspotChart(reports);
    renderStatusChart(reports);
    renderTrendChart(reports);
    // Force a resize event to ensure charts fit their containers
    window.dispatchEvent(new Event('resize'));
}

function renderHotspotChart(reports) {
    const canvas = document.getElementById('hotspotChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const locationCounts = {};
    reports.forEach(r => {
        locationCounts[r.location] = (locationCounts[r.location] || 0) + 1;
    });

    const labels = Object.keys(locationCounts);
    const data = Object.values(locationCounts);

    if (hotspotChart) hotspotChart.destroy();

    hotspotChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#2563eb', '#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#6366f1']
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'start',
                    labels: {
                        color: '#94a3b8',
                        font: { family: 'Inter', size: 11 },
                        padding: 15,
                        boxWidth: 12
                    }
                }
            }
        }
    });
}

function renderStatusChart(reports) {
    const canvas = document.getElementById('statusChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const statusCounts = { pending: 0, resolved: 0, 'in-progress': 0 };
    reports.forEach(r => {
        if (statusCounts[r.status] !== undefined) statusCounts[r.status]++;
    });

    if (statusChart) statusChart.destroy();

    statusChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: ['#ef4444', '#10b981', '#f59e0b']
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'start',
                    labels: {
                        color: '#94a3b8',
                        font: { family: 'Inter', size: 11 },
                        padding: 15,
                        boxWidth: 12
                    }
                }
            }
        }
    });
}

function renderTrendChart(reports) {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Group by date
    const dailyCounts = {};
    reports.forEach(r => {
        const date = r.timestamp.split('T')[0];
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    const sortedDates = Object.keys(dailyCounts).sort();
    const data = sortedDates.map(d => dailyCounts[d]);

    if (trendChart) trendChart.destroy();

    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedDates,
            datasets: [{
                label: 'Reports per Day',
                data: data,
                borderColor: '#3b82f6',
                tension: 0.1,
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.1)'
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                y: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'start',
                    labels: {
                        color: '#94a3b8',
                        font: { family: 'Inter', size: 11 },
                        padding: 15,
                        boxWidth: 12
                    }
                }
            }
        }
    });
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
            <td>${report.user_id ? 'User #' + report.user_id : '<i>System</i>'}</td>
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
    const confirmed = await showConfirm('Delete Report', 'Are you sure you want to delete this report?');
    if (confirmed) {
        try {
            const response = await fetch(`/report/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                showToast('Report deleted successfully');
                loadDashboard();
            }
        } catch (error) {
            console.error("Error deleting report:", error);
            showToast('Failed to delete report', 'error');
        }
    }
}

async function approveReport(id) {
    const confirmed = await showConfirm('Resolve Report', 'Mark this report as resolved?');
    if (confirmed) {
        const user = JSON.parse(localStorage.getItem('user'));
        try {
            const response = await fetch(`/report/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    status: 'resolved',
                    role: user ? user.role : 'user'
                })
            });
            if (response.ok) {
                showToast('Report status updated. 50 points awarded!');
                loadDashboard();
            }
        } catch (error) {
            console.error("Error updating report status:", error);
            showToast('Failed to update status', 'error');
        }
    }
}

// Listen for theme changes to refresh chart colors
window.addEventListener('themeChanged', () => {
    if (lastReports.length > 0) renderAllCharts(lastReports);
});

/**
 * Cleanup: destroy chart instances when navigating away
 */
function cleanupAdmin() {
    if (hotspotChart) hotspotChart.destroy();
    if (statusChart) statusChart.destroy();
    if (trendChart) trendChart.destroy();
    lastReports = [];
}
