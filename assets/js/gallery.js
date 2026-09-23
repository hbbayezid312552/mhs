/* ==========================================================================
   gallery.js — ফটো গ্যালারি: পাবলিক গ্রিড + লাইটবক্স + অ্যাডমিন আপলোড/ডিলিট
   ========================================================================== */

let __allGallery = [];

async function initPublicGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  grid.innerHTML = `<div class="loader">লোড হচ্ছে...</div>`;
  __allGallery = await fetchCollection(window.__FB.COLLECTIONS.GALLERY, "gallery");
  renderGalleryGrid(grid, __allGallery);
  ensureLightbox();
}

function renderGalleryGrid(grid, list) {
  if (!list.length) {
    grid.innerHTML = `<div class="empty-state">কোনো ছবি নেই</div>`;
    return;
  }
  grid.innerHTML = list.map((g, i) => `
    <figure onclick="openLightbox(${i})">
      <img src="${escapeHtml(g.url)}" alt="${escapeHtml(g.caption || '')}" loading="lazy">
    </figure>
  `).join("");
}

function ensureLightbox() {
  if (document.getElementById("lightbox")) return;
  const lb = document.createElement("div");
  lb.id = "lightbox";
  lb.className = "lightbox";
  lb.innerHTML = `<span class="close-lb" onclick="closeLightbox()">&times;</span><img id="lightbox-img" src="" alt="">`;
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  document.body.appendChild(lb);
}

function openLightbox(index) {
  ensureLightbox();
  const item = __allGallery[index];
  if (!item) return;
  document.getElementById("lightbox-img").src = item.url;
  document.getElementById("lightbox").classList.add("open");
}
function closeLightbox() {
  const lb = document.getElementById("lightbox");
  if (lb) lb.classList.remove("open");
}

/* ---------------- ADMIN ---------------- */

async function initAdminGallery() {
  const grid = document.getElementById("admin-gallery-grid");
  if (!grid) return;

  async function reload() {
    grid.innerHTML = `<div class="loader">লোড হচ্ছে...</div>`;
    __allGallery = await fetchCollection(window.__FB.COLLECTIONS.GALLERY, "gallery");
    renderAdminGalleryGrid();
  }
  await reload();

  function renderAdminGalleryGrid() {
    if (!__allGallery.length) { grid.innerHTML = `<div class="empty-state">কোনো ছবি নেই</div>`; return; }
    grid.innerHTML = `<div class="gallery-grid">` + __allGallery.map(g => `
      <figure style="position:relative">
        <img src="${escapeHtml(g.url)}" alt="">
        <button class="btn btn-sm btn-danger" style="position:absolute;top:6px;right:6px" onclick="deleteGalleryImage('${g.id}')">✕</button>
      </figure>
    `).join("") + `</div>`;
  }

  document.getElementById("gallery-upload-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const file = document.getElementById("g-file").files[0];
    const caption = document.getElementById("g-caption").value.trim();
    const album = document.getElementById("g-album").value.trim();
    if (!file) { showToast("ছবি নির্বাচন করুন", "error"); return; }
    if (!window.__FB || !window.__FB.firebaseReady) {
      showToast("Firebase কনফিগার করা নেই (ডেমো মোড)", "error");
      return;
    }
    try {
      const url = await window.__FB.uploadFile(`gallery/${Date.now()}_${file.name}`, file);
      await window.__FB.db.collection(window.__FB.COLLECTIONS.GALLERY).add({ url, caption, album, createdAt: window.__FB.fsTimestamp() });
      showToast("ছবি আপলোড করা হয়েছে");
      document.getElementById("gallery-upload-form").reset();
      await reload();
    } catch (err) {
      showToast("আপলোডে সমস্যা: " + err.message, "error");
    }
  });

  window.deleteGalleryImage = async (id) => {
    if (!confirm("এই ছবিটি মুছে ফেলতে চান?")) return;
    if (!window.__FB || !window.__FB.firebaseReady) return;
    await window.__FB.db.collection(window.__FB.COLLECTIONS.GALLERY).doc(id).delete();
    showToast("ছবি মুছে ফেলা হয়েছে");
    await reload();
  };
}

document.addEventListener("DOMContentLoaded", () => {
  initPublicGallery();
  initAdminGallery();
});
