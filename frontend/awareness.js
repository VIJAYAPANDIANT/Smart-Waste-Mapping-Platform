/**
 * Awareness Page — Leaderboard logic
 */

function initAwareness() {
    loadLeaderboard();
}

async function loadLeaderboard() {
    const listEl = document.getElementById('leaderboard-list');
    if (!listEl) return;

    try {
        const response = await fetch('/leaderboard');
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Server error');
        }
        const topUsers = await response.json();

        listEl.innerHTML = '';

        if (topUsers.length === 0) {
            listEl.innerHTML = '<div class="no-data">No impact scores yet. Start reporting to earn points!</div>';
            return;
        }

        topUsers.forEach((user, index) => {
            const row = document.createElement('div');
            row.className = `leaderboard-row ${index < 3 ? 'top-three' : ''}`;
            
            const rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1;

            row.innerHTML = `
                <div class="user-rank">${rankIcon}</div>
                <div class="user-info">
                    <span class="username">${user.username}</span>
                </div>
                <div class="user-score">${user.impact_score || 0} pts</div>
            `;
            listEl.appendChild(row);
        });
    } catch (error) {
        console.error("Leaderboard fetch error:", error);
        showToast(`Leaderboard error: ${error.message}`, 'error');
        listEl.innerHTML = `<div class="error">Failed to load leaderboard data.</div>`;
    }
}

function cleanupAwareness() {
    // No specific cleanup needed
}
