//console.log("✅ register.js loaded");


const form = document.getElementById("register-form");
const btn = document.getElementById("register-btn");
const errorBox = document.getElementById("register-error");
const successBox = document.getElementById("register-success");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  errorBox.classList.add("d-none");
  successBox.classList.add("d-none");

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  btn.disabled = true;
  btn.textContent = "Registering...";

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Registration failed");

    successBox.textContent = "Registration successful! You can now login.";
    successBox.classList.remove("d-none");

  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove("d-none");
  } finally {
    btn.disabled = false;
    btn.textContent = "Register";
  }
});
