window.AuthApp = {
    getToken() {
        return sessionStorage.getItem('auth_token');
    },
    setToken(token) {
        sessionStorage.setItem('auth_token', token);
    },
    removeToken() {
        sessionStorage.removeItem('auth_token');
    },
    isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch (e) {
            return false;
        }
    },
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
    showLoading() {
        document.querySelector('.loading-overlay').style.display = 'flex';
    },
    hideLoading() {
        document.querySelector('.loading-overlay').style.display = 'none';
    },
    showToast(message, classes = 'green') {
        M.toast({html: message, classes: classes});
    },
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
            throw new Error('Token expirado o inválido');
        }
        return response;
    },
    checkAuthOnLoad() {
    }
};
function logout() {
    AuthApp.removeToken();
    AuthApp.showToast('Sesión cerrada exitosamente');
    window.location.href = '/signin';
}
document.addEventListener('DOMContentLoaded', function() {
    AuthApp.checkAuthOnLoad();
    var selects = document.querySelectorAll('select');
    M.FormSelect.init(selects);
    var datepickers = document.querySelectorAll('.datepicker');
    M.Datepicker.init(datepickers, {
        format: 'yyyy-mm-dd',
        yearRange: [1950, 2010],
        defaultDate: new Date(1995, 0, 1),
        setDefaultDate: true
    });
    var tooltips = document.querySelectorAll('.tooltipped');
    M.Tooltip.init(tooltips);
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
});
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