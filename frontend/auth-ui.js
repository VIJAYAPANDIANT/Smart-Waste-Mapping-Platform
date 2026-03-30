/**
 * Auth UI — handles user profile display and logout
 * Exposes initAuthUI() for the SPA router to re-initialize after page swap.
 */

function initAuthUI() {
    const authNav = document.getElementById('auth-nav');
    if (!authNav) return;

    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        authNav.innerHTML = `
            <div class="user-profile-container">
                <button class="profile-toggle" id="profileToggle">
                    <i class="fas fa-user-circle"></i>
                </button>
                <div class="profile-dropdown" id="profileDropdown">
                    <div class="dropdown-header">
                        <span class="username">${user.username}</span>
                        <span class="email">${user.email || 'No email provided'}</span>
                    </div>
                    <div class="dropdown-body">
                        <div class="info-item">
                            <label>PASSWORD</label>
                            <div class="password-box">
                                <span>${user.password ? '•'.repeat(user.password.length) : '••••••••'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="dropdown-footer">
                        <button class="logout-btn" id="logoutBtn">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            </div>
        `;

        const profileToggle = document.getElementById('profileToggle');
        const profileDropdown = document.getElementById('profileDropdown');

        profileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!profileDropdown.contains(e.target) && e.target !== profileToggle) {
                profileDropdown.classList.remove('active');
            }
        });

        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('user');
            // Full redirect to login page (separate page, not in SPA)
            window.location.href = 'index.html';
        });
    } else {
        authNav.innerHTML = `
            <a href="index.html" class="btn btn-primary btn-auth">Login</a>
        `;
    }
}

// Initialize on first load
document.addEventListener('DOMContentLoaded', () => {
    initAuthUI();
});
