// Ensure the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    // Supabase Client
    const SUPABASE_URL = 'https://sydynixecbokrttohcvr.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_Re78GtQWMIxAvz8z0kX3mA_hhL0TC60';
    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Toggle Forms
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    loginBtn.addEventListener('click', () => {
        loginBtn.classList.add('active');
        signupBtn.classList.remove('active');
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    });

    signupBtn.addEventListener('click', () => {
        signupBtn.classList.add('active');
        loginBtn.classList.remove('active');
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });

    // Signup
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const full_name = document.getElementById('full-name').value.toUpperCase();
        const id_number = document.getElementById('id-number').value;
        const role = document.getElementById('role').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirm_password = document.getElementById('confirm-password').value;
        const msg = document.getElementById('signup-msg');

        msg.style.color = '#ff7070';
        msg.textContent = '';

        if (password !== confirm_password) {
            msg.textContent = 'Passwords do not match';
            return;
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
            msg.textContent = 'Password must be 8+ chars, include uppercase, lowercase & number';
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        }, {
            data: { full_name, id_number, role }
        });

        if (error) {
            msg.textContent = error.message;
        } else {
            msg.style.color = '#1f8f8e';
            msg.textContent = 'Signup successful! Check your email to verify.';
            signupForm.reset();
            // Switch back to login automatically
            loginBtn.click();
        }
    });

    // Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const role = document.getElementById('login-role').value;
        const msg = document.getElementById('login-msg');

        msg.style.color = '#ff7070';
        msg.textContent = '';

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            msg.textContent = error.message;
            return;
        }

        if (data.user && data.user.user_metadata.role !== role) {
            msg.textContent = 'Role mismatch. Choose the correct role.';
            return;
        }

        // Redirect
        if (role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'members.html';
        }
    });

});
