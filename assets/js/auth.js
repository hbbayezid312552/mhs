/* ==========================================================================
   auth.js — অ্যাডমিন লগইন / লগআউট / পাসওয়ার্ড রিসেট
   ========================================================================== */

function initLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  // If already logged in, go straight to dashboard
  if (window.__FB && window.__FB.firebaseReady) {
    window.__FB.auth.onAuthStateChanged(user => {
      if (user) window.location.href = "dashboard.html";
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const alertBox = document.getElementById("login-alert");
    alertBox.style.display = "none";

    if (!window.__FB || !window.__FB.firebaseReady) {
      alertBox.textContent = "Firebase কনফিগার করা হয়নি। assets/js/firebase.js এ আপনার Firebase প্রজেক্ট তথ্য যোগ করুন। (README.md দেখুন)";
      alertBox.className = "alert alert-error";
      alertBox.style.display = "block";
      return;
    }

    try {
      await window.__FB.auth.signInWithEmailAndPassword(email, password);
      window.location.href = "dashboard.html";
    } catch (err) {
      alertBox.textContent = "লগইন ব্যর্থ হয়েছে: ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।";
      alertBox.className = "alert alert-error";
      alertBox.style.display = "block";
    }
  });

  const forgotLink = document.getElementById("forgot-password");
  if (forgotLink) {
    forgotLink.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const alertBox = document.getElementById("login-alert");
      if (!email) {
        alertBox.textContent = "পাসওয়ার্ড রিসেট করতে প্রথমে ইমেইল দিন।";
        alertBox.className = "alert alert-error";
        alertBox.style.display = "block";
        return;
      }
      if (!window.__FB || !window.__FB.firebaseReady) return;
      try {
        await window.__FB.auth.sendPasswordResetEmail(email);
        alertBox.textContent = "পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।";
        alertBox.className = "alert alert-success";
        alertBox.style.display = "block";
      } catch (err) {
        alertBox.textContent = "রিসেট ইমেইল পাঠানো যায়নি: " + err.message;
        alertBox.className = "alert alert-error";
        alertBox.style.display = "block";
      }
    });
  }
}

function initLogoutButtons() {
  document.querySelectorAll(".logout-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (window.__FB && window.__FB.firebaseReady) {
        await window.__FB.auth.signOut();
      }
      window.location.href = "index.html";
    });
  });
}

function guardAdminPage() {
  if (!window.__FB || !window.__FB.firebaseReady) {
    // Allow preview of admin UI without Firebase, but warn.
    showToast && showToast("ডেমো মোড: Firebase কানেক্ট করা হয়নি", "error");
    return;
  }
  window.__FB.auth.onAuthStateChanged(user => {
    if (!user) window.location.href = "index.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initLoginForm();
  initLogoutButtons();
});
