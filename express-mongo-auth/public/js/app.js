// Utility functions for client-side auth management
window.AuthApp = {
    // Get token from sessionStorage
    getToken() {
        return sessionStorage.getItem('auth_token');
    },

    // Set token in sessionStorage
    setToken(token) {
        sessionStorage.setItem('auth_token', token);
    },

    // Remove token from sessionStorage
    removeToken() {
        sessionStorage.removeItem('auth_token');
    },

    // Check if user is authenticated
    isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;
        
        try {
            // Basic JWT validation (check if not expired)
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch (e) {
            return false;
        }
    },

    // Get user data from token
    getUserData() {
        const token = this.getToken();
        if (!token) return null;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                id: payload.sub,
                roles: payload.roles || []
            };
        } catch (e) {
            return null;
        }
    },

    // Show loading spinner
    showLoading() {
        document.querySelector('.loading-overlay').style.display = 'flex';
    },

    // Hide loading spinner
    hideLoading() {
        document.querySelector('.loading-overlay').style.display = 'none';
    },

    // Show toast message
    showToast(message, classes = 'green') {
        M.toast({html: message, classes: classes});
    },

    // Make authenticated API request
    async apiRequest(url, options = {}) {
        const token = this.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (response.status === 401) {
            this.removeToken();
            // No redirigir automáticamente, dejar que la página maneje el error
            throw new Error('Token expirado o inválido');
        }

        return response;
    },

    // Check authentication status on page load
    checkAuthOnLoad() {
        // Comentar temporalmente para evitar loops de redirección
        /*
        if (this.isAuthenticated()) {
            const userData = this.getUserData();
            if (userData) {
                // Si estamos en signin o signup y ya estamos autenticados, redirigir
                const currentPath = window.location.pathname;
                if (currentPath === '/signin' || currentPath === '/signup') {
                    const isAdmin = userData.roles.includes('admin');
                    window.location.href = isAdmin ? '/dashboard/admin' : '/dashboard/user';
                }
            }
        }
        */
    }
};

// Global logout function
function logout() {
    AuthApp.removeToken();
    AuthApp.showToast('Sesión cerrada exitosamente');
    window.location.href = '/signin';
}

// Initialize Materialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    AuthApp.checkAuthOnLoad();
    
    // Initialize select elements
    var selects = document.querySelectorAll('select');
    M.FormSelect.init(selects);

    // Initialize datepicker
    var datepickers = document.querySelectorAll('.datepicker');
    M.Datepicker.init(datepickers, {
        format: 'yyyy-mm-dd',
        yearRange: [1950, 2010],
        defaultDate: new Date(1995, 0, 1),
        setDefaultDate: true
    });

    // Initialize tooltips
    var tooltips = document.querySelectorAll('.tooltipped');
    M.Tooltip.init(tooltips);

    // Initialize modals
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
});

// Add loading overlay to body if it doesn't exist
document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.loading-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="preloader-wrapper big active loading-spinner">
                <div class="spinner-layer spinner-blue">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div><div class="gap-patch">
                        <div class="circle"></div>
                    </div><div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
});