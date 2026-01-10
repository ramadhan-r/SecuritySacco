document.addEventListener("DOMContentLoaded", () => {

    /* ================= SUPABASE ================= */
    const SUPABASE_URL = "https://sydynixecbokrttohcvr.supabase.co";
    const SUPABASE_ANON_KEY = "sb_publishable_Re78GtQWMIxAvz8z0kX3mA_hhL0TC60";

    const supabaseClient = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

    /* ================= ELEMENTS ================= */
    const signupBtn = document.getElementById("signup-btn");
    const loginBtn = document.getElementById("login-btn");

    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    /* ================= TOGGLE ================= */
    function showSignup() {
        signupBtn.classList.add("active");
        loginBtn.classList.remove("active");

        signupForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
    }

    function showLogin() {
        loginBtn.classList.add("active");
        signupBtn.classList.remove("active");

        loginForm.classList.remove("hidden");
        signupForm.classList.add("hidden");
    }

    signupBtn.addEventListener("click", showSignup);
    loginBtn.addEventListener("click", showLogin);

    // FORCE START ON SIGNUP
    showSignup();

    /* ================= SIGNUP ================= */
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const full_name = document.getElementById("full-name").value.toUpperCase();
        const id_number = document.getElementById("id-number").value;
        const role = document.getElementById("signup-role").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        const confirm = document.getElementById("confirm-password").value;
        const msg = document.getElementById("signup-msg");

        msg.textContent = "";
        msg.style.color = "#ff7070";

        if (password !== confirm) {
            msg.textContent = "Passwords do not match";
            return;
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
            msg.textContent = "Password must be 8+ chars with upper, lower & number";
            return;
        }

        const { error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name,
                    id_number,
                    role
                }
            }
        });

        if (error) {
            msg.textContent = error.message;
        } else {
            msg.style.color = "#1f8f8e";
            msg.textContent = "Signup successful. Check email to verify.";

            signupForm.reset();
            setTimeout(showLogin, 1200);
        }
    });

    /* ================= LOGIN ================= */
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        const role = document.getElementById("login-role").value;
        const msg = document.getElementById("login-msg");

        msg.textContent = "";
        msg.style.color = "#ff7070";

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            msg.textContent = error.message;
            return;
        }

        if (data.user.user_metadata.role !== role) {
            msg.textContent = "Wrong role selected";
            return;
        }

        window.location.href = role === "admin"
            ? "admin.html"
            : "members.html";
    });

});
