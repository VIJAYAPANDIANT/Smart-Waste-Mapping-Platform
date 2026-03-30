/**
 * SmartWaste UI Utilities
 * Custom replacements for alert() and confirm()
 */

const UI = (() => {
    // Create toast container if it doesn't exist
    function getToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    /**
     * Show a toast notification
     * @param {string} message 
     * @param {string} type - 'success', 'error', 'info'
     */
    function showToast(message, type = 'success') {
        const container = getToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Show a custom confirmation modal
     * @param {string} title 
     * @param {string} message 
     * @returns {Promise<boolean>}
     */
    function confirm(title, message) {
        return new Promise((resolve) => {
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-overlay';
            
            modalOverlay.innerHTML = `
                <div class="modal-card">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-sm btn-secondary" id="modal-cancel">Cancel</button>
                        <button class="btn-sm btn-primary" id="modal-confirm">Confirm</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modalOverlay);
            
            // Animate in
            setTimeout(() => modalOverlay.classList.add('show'), 10);
            
            const close = () => {
                modalOverlay.classList.remove('show');
                setTimeout(() => modalOverlay.remove(), 300);
            };
            
            modalOverlay.querySelector('.modal-close').onclick = () => { close(); resolve(false); };
            modalOverlay.querySelector('#modal-cancel').onclick = () => { close(); resolve(false); };
            modalOverlay.querySelector('#modal-confirm').onclick = () => { close(); resolve(true); };
            
            // Close on overlay click
            modalOverlay.onclick = (e) => {
                if (e.target === modalOverlay) { close(); resolve(false); }
            };
        });
    }

    return { showToast, confirm };
})();

// Re-expose globally
window.showToast = UI.showToast;
window.showConfirm = UI.confirm;
