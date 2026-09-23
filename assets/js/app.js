/* ==========================================================================
   app.js — সাইটজুড়ে ব্যবহৃত সাধারণ ফাংশন (নেভিগেশন, হ্যামবার্গার মেনু ইত্যাদি)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Hamburger menu toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      hamburger.classList.toggle("open");
    });
    // Close menu when a link is clicked (mobile)
    navLinks.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
      });
    });
  }

  // Highlight active nav link based on current page/hash
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[data-page]").forEach(a => {
    if (a.dataset.page === path) a.classList.add("active");
  });

  // Admin auth-state based nav label (login/logout awareness) if firebase ready
  if (window.__FB && window.__FB.firebaseReady) {
    window.__FB.auth.onAuthStateChanged(user => {
      const adminLink = document.querySelector(".admin-link");
      if (adminLink && user) {
        adminLink.textContent = "ড্যাশবোর্ড";
        adminLink.href = "admin/dashboard.html";
      }
    });
  }
});

/* ---------- Generic helpers reused by page-specific scripts ---------- */

function escapeHtml(str) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showToast(message, type = "success") {
  let toast = document.getElementById("__toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "__toast";
    toast.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
      padding:13px 24px;border-radius:999px;color:#fff;font-weight:700;z-index:9999;
      box-shadow:0 8px 24px rgba(0,0,0,.2);transition:.25s;font-family:'Hind Siliguri',sans-serif;`;
    document.body.appendChild(toast);
  }
  toast.style.background = type === "error" ? "#c0392b" : "#0b5d3b";
  toast.textContent = message;
  toast.style.opacity = "1";
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.opacity = "0"; }, 2800);
}

// Fetch a Firestore collection, falling back to demo data if Firebase isn't configured
async function fetchCollection(collectionName, demoKey, whereFn) {
  if (window.__FB && window.__FB.firebaseReady) {
    try {
      let query = window.__FB.db.collection(collectionName);
      if (whereFn) query = whereFn(query);
      const snap = await query.get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.error(`Error fetching ${collectionName}:`, e);
      return window.DEMO ? window.DEMO[demoKey] || [] : [];
    }
  }
  return window.DEMO ? window.DEMO[demoKey] || [] : [];
}

/* ---------- Shared admin sidebar (avoids repeating markup on every admin page) ---------- */
const ADMIN_NAV = [
  { href: "dashboard.html", label: "ড্যাশবোর্ড", icon: "📊" },
  { href: "students.html", label: "শিক্ষার্থী", icon: "🎓" },
  { href: "teachers.html", label: "শিক্ষক", icon: "👨‍🏫" },
  { href: "routine.html", label: "ক্লাস রুটিন", icon: "🗓️" },
  { href: "exams.html", label: "পরীক্ষা", icon: "📝" },
  { href: "results.html", label: "ফলাফল", icon: "🏆" },
  { href: "notices.html", label: "নোটিশ", icon: "📢" },
  { href: "gallery.html", label: "গ্যালারি", icon: "🖼️" },
  { href: "settings.html", label: "সেটিংস / স্কুল তথ্য", icon: "⚙️" }
];

function renderAdminSidebar() {
  const mount = document.getElementById("admin-sidebar");
  if (!mount) return;
  const current = window.location.pathname.split("/").pop();
  mount.innerHTML = `
    <div class="brand"><span class="bn">মোসলেমগঞ্জ উচ্চ বিদ্যালয়</span><br><small style="opacity:.75">Admin Panel</small></div>
    <nav>
      ${ADMIN_NAV.map(item => `<a href="${item.href}" class="${current === item.href ? "active" : ""}">${item.icon} ${item.label}</a>`).join("")}
      <a href="#" class="logout-btn">🚪 লগআউট</a>
    </nav>
  `;
  const toggle = document.getElementById("admin-sidebar-toggle");
  const sidebar = document.getElementById("admin-sidebar");
  if (toggle) toggle.addEventListener("click", () => sidebar.classList.toggle("open"));
  initLogoutButtons && initLogoutButtons();
}

document.addEventListener("DOMContentLoaded", renderAdminSidebar);

function requireAuth(redirectTo = "index.html") {
  if (!window.__FB || !window.__FB.firebaseReady) {
    showToast("Firebase কনফিগার করা হয়নি — admin/README নির্দেশনা দেখুন", "error");
    return;
  }
  window.__FB.auth.onAuthStateChanged(user => {
    if (!user) window.location.href = redirectTo;
  });
}
