/**
 * STACKLY HOSPITAL & HEALTHCARE - AUTHENTICATION LOGIC
 * Supports Dual Login (Client & Admin),
 * Extracts User Name from user's Gmail,
 * Manages Session and Dashboard redirection.
 */

document.addEventListener('DOMContentLoaded', () => {
  initRoleTabs();
  initLoginForm();
  initSignupForm();
});

let currentRole = 'client'; // default role

/**
 * Handle toggle between Client and Admin options
 */
function initRoleTabs() {
  const tabs = document.querySelectorAll('.role-tab-btn');
  const roleInput = document.getElementById('selected-role');
  const portalHeading = document.getElementById('portal-heading');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentRole = tab.dataset.role;

      if (roleInput) {
        roleInput.value = currentRole;
      }

      if (portalHeading) {
        portalHeading.textContent = currentRole === 'admin' 
          ? 'Hospital Administrator Portal' 
          : 'Patient & Client Portal';
      }
    });
  });
}

/**
 * Extract clean, human-readable name from Gmail address
 * e.g., 'john.smith@gmail.com' -> 'John Smith'
 *       'alex_morgan.care@gmail.com' -> 'Alex Morgan Care'
 *       'dr.sarah.jenkins@gmail.com' -> 'Dr. Sarah Jenkins'
 */
function extractNameFromGmail(email) {
  if (!email || !email.includes('@')) return 'Valued User';

  const localPart = email.split('@')[0];
  // Replace symbols with spaces
  const words = localPart.replace(/[._\-+]/g, ' ').trim().split(/\s+/);
  
  const formatted = words.map(word => {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');

  return formatted || 'Valued User';
}

/**
 * Handle Login Submission
 */
function initLoginForm() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const errorBox = document.getElementById('auth-error');

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    if (!email || !password) {
      if (errorBox) {
        errorBox.textContent = 'Please provide both email and password.';
        errorBox.style.display = 'block';
      }
      return;
    }

    // Extract user display name from Gmail
    const userName = extractNameFromGmail(email);

    // Save session to localStorage
    const sessionData = {
      email: email,
      name: userName,
      role: currentRole,
      loginTimestamp: new Date().toISOString(),
      avatar: currentRole === 'admin' ? 'assets/images/user-admin.webp' : 'assets/images/user-client.webp'
    };

    localStorage.setItem('stackly_user', JSON.stringify(sessionData));

    // Redirect to respective dashboard
    if (currentRole === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = 'client-dashboard.html';
    }
  });
}

/**
 * Handle Signup Submission
 */
function initSignupForm() {
  const signupForm = document.getElementById('signup-form');
  if (!signupForm) return;

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('signup-email');
    const nameInput = document.getElementById('signup-name');
    const roleInput = document.getElementById('signup-role');

    const email = emailInput ? emailInput.value.trim() : '';
    let name = nameInput ? nameInput.value.trim() : '';
    const role = roleInput ? roleInput.value : 'client';

    if (!name && email) {
      name = extractNameFromGmail(email);
    }

    const sessionData = {
      email: email,
      name: name,
      role: role,
      loginTimestamp: new Date().toISOString(),
      avatar: role === 'admin' ? 'assets/images/user-admin.webp' : 'assets/images/user-client.webp'
    };

    localStorage.setItem('stackly_user', JSON.stringify(sessionData));

    if (role === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = 'client-dashboard.html';
    }
  });
}
