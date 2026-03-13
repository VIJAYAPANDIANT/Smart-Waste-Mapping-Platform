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
    document.getElementById('totalReports').textContent = reports.length;
    document.getElementById('pendingReports').textContent = reports.filter(r => r.status === 'pending').length;
    document.getElementById('resolvedReports').textContent = reports.filter(r => r.status === 'resolved').length;
}

function populateTable(reports) {
    const tbody = document.querySelector('#reportsTable tbody');
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
    // In a real app, this would call a PATCH /report/:id endpoint
}

function renderChart(reports) {
    const ctx = document.getElementById('hotspotChart').getContext('2d');
    
    // Group reports by location for a simple chart
    const locationCounts = {};
    reports.forEach(r => {
        locationCounts[r.location] = (locationCounts[r.location] || 0) + 1;
    });

    const labels = Object.keys(locationCounts);
    const data = Object.values(locationCounts);

    new Chart(ctx, {
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
                    labels: { color: '#ffffff' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', loadDashboard);
