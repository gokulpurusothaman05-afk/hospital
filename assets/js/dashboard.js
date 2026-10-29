/**
 * STACKLY HOSPITAL & HEALTHCARE - DASHBOARD ENGINE
 * Supports Client & Admin Dashboards,
 * Reads and Displays User Information extracted from Gmail,
 * Handles logout, sidebar mobile drawer, and interactive actions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardUser();
  initDashboardMobileNav();
  initLogout();
  initQuickActions();
});

/**
 * Retrieve User Profile from localStorage
 */
function initDashboardUser() {
  const storedUser = localStorage.getItem('stackly_user');
  let user = null;

  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch (e) {
      console.error('Failed to parse user session', e);
    }
  }

  // Fallback defaults if accessed directly without logging in
  if (!user) {
    const isDocAdmin = window.location.pathname.includes('admin');
    user = {
      email: isDocAdmin ? 'admin@gmail.com' : 'patient@gmail.com',
      name: isDocAdmin ? 'Hospital Administrator' : 'Valued Patient',
      role: isDocAdmin ? 'admin' : 'client',
      avatar: isDocAdmin ? 'assets/images/user-admin.webp' : 'assets/images/user-client.webp'
    };
  }

  // Inject user name extracted from Gmail into greeting elements
  const greetElements = document.querySelectorAll('.dashboard-user-name');
  greetElements.forEach(el => {
    el.textContent = user.name;
  });

  // Inject user Gmail address into email elements
  const emailElements = document.querySelectorAll('.dashboard-user-email');
  emailElements.forEach(el => {
    el.textContent = user.email;
  });

  // Inject role label
  const roleElements = document.querySelectorAll('.dashboard-user-role');
  roleElements.forEach(el => {
    el.textContent = user.role === 'admin' ? 'Hospital Administrator' : 'Patient / Client';
  });

  // Set avatar if present
  const avatarElements = document.querySelectorAll('.dashboard-user-avatar');
  avatarElements.forEach(img => {
    img.src = user.avatar || (user.role === 'admin' ? 'assets/images/user-admin.webp' : 'assets/images/user-client.webp');
    img.alt = user.name;
  });
}

/**
 * Handle Mobile Sidebar Toggle for Dashboard
 */
function initDashboardMobileNav() {
  const toggleBtn = document.querySelector('.dashboard-mobile-toggle');
  const sidebar = document.querySelector('.dashboard-sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target) && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
    });
  }
}

/**
 * Logout and clear session
 */
function initLogout() {
  const logoutBtns = document.querySelectorAll('.logout-trigger');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to sign out of Stackly Portal?')) {
        localStorage.removeItem('stackly_user');
        window.location.href = 'login.html';
      }
    });
  });
}

/**
 * Interactive actions in dashboard
 * Redirects any secondary actions or sidebar menu items without dedicated pages to 404.html
 */
function initQuickActions() {
  document.querySelectorAll('.btn-dashboard-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.tagName === 'A') {
        const href = btn.getAttribute('href');
        if (href && href !== '#' && href !== '') {
          return; // Allow native navigation to 404.html
        }
      }
      e.preventDefault();
      window.location.href = '404.html';
    });
  });
}
