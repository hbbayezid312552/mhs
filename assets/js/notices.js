/* ==========================================================================
   notices.js — নোটিশ বোর্ড: পাবলিক লিস্ট + অ্যাডমিন CRUD
   ========================================================================== */

let __allNotices = [];

async function initPublicNotices() {
  const homeList = document.getElementById("home-notices-list");
  const fullList = document.getElementById("notices-list");
  if (!homeList && !fullList) return;

  __allNotices = await fetchCollection(window.__FB.COLLECTIONS.NOTICES, "notices");
  const published = __allNotices.filter(n => n.published !== false)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  if (homeList) renderNoticeList(homeList, published.slice(0, 5));
  if (fullList) renderNoticeList(fullList, published);
}

function renderNoticeList(container, list) {
  if (!list.length) {
    container.innerHTML = `<div class="empty-state">কোনো নোটিশ নেই</div>`;
    return;
  }
  container.innerHTML = list.map(n => `
    <div class="notice-item">
      <div>
        <div class="date">${escapeHtml(n.date || "")}</div>
        <h4>${escapeHtml(n.title)}</h4>
        <p>${escapeHtml(n.description || "")}</p>
      </div>
      <div class="flex gap-8">
        ${n.pdfUrl && n.pdfUrl !== "#" ? `<a class="btn btn-sm btn-outline" href="${escapeHtml(n.pdfUrl)}" target="_blank" rel="noopener">ডাউনলোড</a>` : ""}
      </div>
    </div>
  `).join("");
}

/* ---------------- ADMIN CRUD ---------------- */

async function initAdminNotices() {
  const tbody = document.getElementById("notices-tbody");
  if (!tbody) return;

  async function reload() {
    tbody.innerHTML = `<tr><td colspan="4">লোড হচ্ছে...</td></tr>`;
    __allNotices = await fetchCollection(window.__FB.COLLECTIONS.NOTICES, "notices");
    renderAdminNoticesTable(__allNotices);
  }
  await reload();

  document.getElementById("add-notice-btn").addEventListener("click", () => {
    document.getElementById("notice-form").reset();
    document.getElementById("notice-doc-id").value = "";
    document.getElementById("notice-modal").classList.add("open");
  });

  document.getElementById("notice-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("notice-doc-id").value;
    const pdfFile = document.getElementById("n-pdf").files[0];
    const data = {
      title: document.getElementById("n-title").value.trim(),
      date: document.getElementById("n-date").value,
      description: document.getElementById("n-desc").value.trim(),
      published: true
    };
    if (!window.__FB || !window.__FB.firebaseReady) {
      showToast("Firebase কনফিগার করা নেই (ডেমো মোড)", "error");
      document.getElementById("notice-modal").classList.remove("open");
      return;
    }
    try {
      if (pdfFile) {
        data.pdfUrl = await window.__FB.uploadFile(`notice-pdfs/${Date.now()}_${pdfFile.name}`, pdfFile);
      }
      const col = window.__FB.db.collection(window.__FB.COLLECTIONS.NOTICES);
      if (id) await col.doc(id).update(data);
      else await col.add(data);
      showToast("নোটিশ সংরক্ষণ করা হয়েছে");
      document.getElementById("notice-modal").classList.remove("open");
      await reload();
    } catch (err) {
      showToast("সংরক্ষণে সমস্যা: " + err.message, "error");
    }
  });

  window.togglePublishNotice = async (id, publish) => {
    if (!window.__FB || !window.__FB.firebaseReady) return;
    await window.__FB.db.collection(window.__FB.COLLECTIONS.NOTICES).doc(id).update({ published: publish });
    await reload();
  };
  window.deleteNotice = async (id) => {
    if (!confirm("এই নোটিশ মুছে ফেলতে চান?")) return;
    if (!window.__FB || !window.__FB.firebaseReady) return;
    await window.__FB.db.collection(window.__FB.COLLECTIONS.NOTICES).doc(id).delete();
    showToast("নোটিশ মুছে ফেলা হয়েছে");
    await reload();
  };

  function renderAdminNoticesTable(list) {
    if (!list.length) { tbody.innerHTML = `<tr><td colspan="4" class="empty-state">কোনো নোটিশ নেই</td></tr>`; return; }
    tbody.innerHTML = list.map(n => `
      <tr>
        <td>${escapeHtml(n.title)}</td>
        <td>${escapeHtml(n.date || "")}</td>
        <td><span class="badge ${n.published !== false ? 'badge-success' : 'badge-warning'}">${n.published !== false ? 'প্রকাশিত' : 'অপ্রকাশিত'}</span></td>
        <td class="flex gap-8">
          <button class="btn btn-sm btn-outline" onclick="togglePublishNotice('${n.id}', ${n.published === false})">${n.published !== false ? 'আনপাবলিশ' : 'পাবলিশ'}</button>
          <button class="btn btn-sm btn-danger" onclick="deleteNotice('${n.id}')">ডিলিট</button>
        </td>
      </tr>
    `).join("");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initPublicNotices();
  initAdminNotices();
});
