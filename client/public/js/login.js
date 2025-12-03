//console.log("✅ login.js loaded");


const loginForm = document.getElementById("login-form");
const loginBtn = document.getElementById("login-btn");
const loginErrorEl = document.getElementById("login-error");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";
  loginErrorEl.classList.add("d-none");
  loginErrorEl.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Save token for quiz API
    localStorage.setItem("token", data.token);
    // Optional: store email
    localStorage.setItem("userEmail", data.user.email);

    window.location.href = "/"; // Go to quiz home
  } catch (err) {
    loginErrorEl.textContent = err.message;
    loginErrorEl.classList.remove("d-none");
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Login";
  }
});
