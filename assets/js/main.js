/**
 * STACKLY HOSPITAL & HEALTHCARE - MAIN JAVASCRIPT
 * Handles Navigation, Mobile Drawer, Modals, Marquee,
 * and Enforces Global Form & Dead Link Redirects to 404 Page.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHeaderScroll();
  initAppointmentModal();
  initAuthNavbarState();
  initGlobal404Redirects();
});

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navDrawer = document.querySelector('.mobile-nav-drawer');

  if (toggleBtn && navDrawer) {
    toggleBtn.addEventListener('click', () => {
      navDrawer.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', navDrawer.classList.contains('open'));
    });

    // Close on link click
    navDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navDrawer.classList.remove('open');
      });
    });
  }
}

/**
 * Sticky Header elevation on scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.style.boxShadow = '0 4px 20px rgba(0, 89, 99, 0.08)';
      } else {
        header.style.boxShadow = 'none';
      }
    });
  }
}

/**
 * Appointment Modal Controls
 */
function initAppointmentModal() {
  const openBtns = document.querySelectorAll('.open-appointment-modal, [href="#book-appointment"]');
  const modal = document.getElementById('appointment-modal');
  const closeBtn = document.querySelector('.modal-close');

  if (modal) {
    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}

/**
 * Update Header auth link if user is logged in
 */
function initAuthNavbarState() {
  const currentUser = JSON.parse(localStorage.getItem('stackly_user') || 'null');
  const authLinks = document.querySelectorAll('.auth-nav-link');

  if (currentUser && authLinks.length > 0) {
    const targetDashboard = currentUser.role === 'admin' ? 'admin-dashboard.html' : 'client-dashboard.html';
    authLinks.forEach(link => {
      link.innerHTML = `
        <span class="badge-dot" style="background:#00a884;"></span>
        ${currentUser.name || 'Dashboard'}
      `;
      link.href = targetDashboard;
    });
  }
}

/**
 * REQUIREMENT ENFORCEMENT:
 * "redirect all unwanted links and buttons tp 404 page and also all forms except login form"
 */
function initGlobal404Redirects() {
  // 1. Redirect all forms EXCEPT login & signup forms to 404.html
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    const id = form.getAttribute('id') || '';
    if (id !== 'login-form' && id !== 'signup-form') {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.href = '404.html';
      });
    }
  });

  // 2. Redirect all unwanted / placeholder links and buttons to 404.html
  const deadLinks = document.querySelectorAll('a[href="#"], a[href=""], .btn-unwanted, a[data-unwanted]');
  deadLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });
}
