/* ==========================================================================
   teachers.js — পাবলিক শিক্ষক ডিরেক্টরি + অ্যাডমিন CRUD
   ========================================================================== */

let __allTeachers = [];

/* ---------------- PUBLIC (teachers/index.html + homepage preview) ---------------- */

async function initPublicTeachers() {
  const grid = document.getElementById("teachers-grid");
  if (!grid) return;
  grid.innerHTML = `<div class="loader">লোড হচ্ছে...</div>`;
  __allTeachers = await fetchCollection(window.__FB.COLLECTIONS.TEACHERS, "teachers");
  renderTeacherGrid(grid, __allTeachers);
}

async function initHomeTeacherPreview() {
  const grid = document.getElementById("home-teachers-grid");
  if (!grid) return;
  const list = await fetchCollection(window.__FB.COLLECTIONS.TEACHERS, "teachers");
  renderTeacherGrid(grid, list.slice(0, 4));
}

function renderTeacherGrid(grid, list) {
  if (!list.length) {
    grid.innerHTML = `<div class="empty-state">কোনো শিক্ষক তথ্য নেই</div>`;
    return;
  }
  grid.innerHTML = list.map(t => `
    <div class="card person-card">
      <img class="photo" src="${escapeHtml(t.photo || 'https://placehold.co/300x300/0f8b7f/ffffff?text=Teacher')}" alt="${escapeHtml(t.name)}" loading="lazy">
      <h3>${escapeHtml(t.name)}</h3>
      <div class="role">${escapeHtml(t.designation)}</div>
      <div class="meta">বিষয়: ${escapeHtml(t.subject)}<br>${escapeHtml(t.qualification || "")}<br>${t.mobile ? "📞 " + escapeHtml(t.mobile) : ""}</div>
    </div>
  `).join("");
}

/* ---------------- ADMIN CRUD (admin/teachers.html) ---------------- */

async function initAdminTeachers() {
  const tbody = document.getElementById("teachers-tbody");
  if (!tbody) return;

  async function reload() {
    tbody.innerHTML = `<tr><td colspan="5">লোড হচ্ছে...</td></tr>`;
    __allTeachers = await fetchCollection(window.__FB.COLLECTIONS.TEACHERS, "teachers");
    renderAdminTeachersTable(__allTeachers);
  }
  await reload();

  document.getElementById("add-teacher-btn").addEventListener("click", () => openTeacherModal());
  document.getElementById("teacher-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    await saveTeacherFromForm();
    await reload();
  });

  window.__reloadTeachers = reload;
}

function renderAdminTeachersTable(list) {
  const tbody = document.getElementById("teachers-tbody");
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state">কোনো শিক্ষক নেই</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(t => `
    <tr>
      <td><img src="${escapeHtml(t.photo || 'https://placehold.co/60x60')}" style="width:44px;height:44px;border-radius:50%;object-fit:cover" alt=""></td>
      <td>${escapeHtml(t.name)}</td>
      <td>${escapeHtml(t.designation)}</td>
      <td>${escapeHtml(t.subject)}</td>
      <td class="flex gap-8">
        <button class="btn btn-sm btn-outline" onclick="openTeacherModal('${t.id}')">এডিট</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTeacher('${t.id}')">ডিলিট</button>
      </td>
    </tr>
  `).join("");
}

function openTeacherModal(id) {
  const modal = document.getElementById("teacher-modal");
  const form = document.getElementById("teacher-form");
  form.reset();
  document.getElementById("teacher-doc-id").value = "";
  if (id) {
    const t = __allTeachers.find(x => x.id === id);
    if (t) {
      document.getElementById("teacher-doc-id").value = t.id;
      document.getElementById("t-name").value = t.name || "";
      document.getElementById("t-designation").value = t.designation || "";
      document.getElementById("t-subject").value = t.subject || "";
      document.getElementById("t-qualification").value = t.qualification || "";
      document.getElementById("t-mobile").value = t.mobile || "";
      document.getElementById("t-bio").value = t.bio || "";
    }
  }
  document.getElementById("teacher-modal-title").textContent = id ? "শিক্ষকের তথ্য এডিট করুন" : "নতুন শিক্ষক যোগ করুন";
  modal.classList.add("open");
}

function closeTeacherModal() {
  document.getElementById("teacher-modal").classList.remove("open");
}

async function saveTeacherFromForm() {
  const id = document.getElementById("teacher-doc-id").value;
  const photoFile = document.getElementById("t-photo").files[0];
  const data = {
    name: document.getElementById("t-name").value.trim(),
    designation: document.getElementById("t-designation").value.trim(),
    subject: document.getElementById("t-subject").value.trim(),
    qualification: document.getElementById("t-qualification").value.trim(),
    mobile: document.getElementById("t-mobile").value.trim(),
    bio: document.getElementById("t-bio").value.trim()
  };

  if (!window.__FB || !window.__FB.firebaseReady) {
    showToast("Firebase কনফিগার করা নেই (ডেমো মোড)", "error");
    closeTeacherModal();
    return;
  }

  try {
    if (photoFile) {
      const path = `teacher-photos/${Date.now()}_${photoFile.name}`;
      data.photo = await window.__FB.uploadFile(path, photoFile);
    }
    const col = window.__FB.db.collection(window.__FB.COLLECTIONS.TEACHERS);
    if (id) {
      await col.doc(id).update(data);
      showToast("শিক্ষকের তথ্য আপডেট হয়েছে");
    } else {
      data.createdAt = window.__FB.fsTimestamp();
      await col.add(data);
      showToast("নতুন শিক্ষক যোগ করা হয়েছে");
    }
    closeTeacherModal();
  } catch (err) {
    showToast("সংরক্ষণে সমস্যা: " + err.message, "error");
  }
}

async function deleteTeacher(id) {
  if (!confirm("আপনি কি নিশ্চিতভাবে এই শিক্ষকের তথ্য মুছে ফেলতে চান?")) return;
  if (!window.__FB || !window.__FB.firebaseReady) {
    showToast("Firebase কনফিগার করা নেই (ডেমো মোড)", "error");
    return;
  }
  try {
    await window.__FB.db.collection(window.__FB.COLLECTIONS.TEACHERS).doc(id).delete();
    showToast("শিক্ষক মুছে ফেলা হয়েছে");
    if (window.__reloadTeachers) await window.__reloadTeachers();
  } catch (err) {
    showToast("মুছে ফেলা যায়নি: " + err.message, "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initPublicTeachers();
  initHomeTeacherPreview();
  initAdminTeachers();
});
