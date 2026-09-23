/* ==========================================================================
   students.js — পাবলিক শিক্ষার্থী ডিরেক্টরি + অ্যাডমিন CRUD
   ========================================================================== */

let __allStudents = [];

/* ---------------- PUBLIC DIRECTORY (students/index.html) ---------------- */

async function initPublicStudentDirectory() {
  const grid = document.getElementById("students-grid");
  if (!grid) return;
  grid.innerHTML = `<div class="loader">লোড হচ্ছে...</div>`;

  __allStudents = await fetchCollection(window.__FB.COLLECTIONS.STUDENTS, "students");
  renderPublicStudents(__allStudents);

  const classFilter = document.getElementById("filter-class");
  const searchInput = document.getElementById("search-student");
  const runSearch = () => {
    const q = (searchInput.value || "").trim().toLowerCase();
    const cls = classFilter.value;
    const filtered = __allStudents.filter(s => {
      const matchQ = !q || [s.name, s.roll, s.studentId].some(v => String(v || "").toLowerCase().includes(q));
      const matchC = !cls || s.class === cls;
      return matchQ && matchC;
    });
    renderPublicStudents(filtered);
  };
  searchInput.addEventListener("input", runSearch);
  classFilter.addEventListener("change", runSearch);
}

function renderPublicStudents(list) {
  const grid = document.getElementById("students-grid");
  if (!list.length) {
    grid.innerHTML = `<div class="empty-state">কোনো শিক্ষার্থী পাওয়া যায়নি</div>`;
    return;
  }
  // Public view exposes ONLY: photo, name, class, roll, student ID — never guardian/DOB/address
  grid.innerHTML = list.map(s => `
    <div class="card person-card">
      <img class="photo" src="${escapeHtml(s.photo || 'https://placehold.co/300x300/e6f4ec/0b5d3b?text=Student')}" alt="${escapeHtml(s.name)}" loading="lazy">
      <h3>${escapeHtml(s.name)}</h3>
      <div class="role">শ্রেণি: ${escapeHtml(s.class)} ${s.section ? "| শাখা: " + escapeHtml(s.section) : ""}</div>
      <div class="meta">রোল: ${escapeHtml(s.roll)}<br>আইডি: ${escapeHtml(s.studentId)}</div>
    </div>
  `).join("");
}

/* ---------------- ADMIN CRUD (admin/students.html) ---------------- */

async function initAdminStudents() {
  const tbody = document.getElementById("students-tbody");
  if (!tbody) return;

  async function reload() {
    tbody.innerHTML = `<tr><td colspan="6">লোড হচ্ছে...</td></tr>`;
    __allStudents = await fetchCollection(window.__FB.COLLECTIONS.STUDENTS, "students");
    renderAdminStudentsTable(__allStudents);
  }
  await reload();

  document.getElementById("add-student-btn").addEventListener("click", () => openStudentModal());

  document.getElementById("admin-search-student").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    renderAdminStudentsTable(__allStudents.filter(s =>
      [s.name, s.roll, s.studentId, s.class].some(v => String(v || "").toLowerCase().includes(q))
    ));
  });

  document.getElementById("student-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    await saveStudentFromForm();
    await reload();
  });

  window.__reloadStudents = reload;
}

function renderAdminStudentsTable(list) {
  const tbody = document.getElementById("students-tbody");
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">কোনো শিক্ষার্থী নেই</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(s => `
    <tr>
      <td><img src="${escapeHtml(s.photo || 'https://placehold.co/60x60')}" style="width:44px;height:44px;border-radius:50%;object-fit:cover" alt=""></td>
      <td>${escapeHtml(s.name)}</td>
      <td>${escapeHtml(s.class)} ${s.section || ""}</td>
      <td>${escapeHtml(s.roll)}</td>
      <td>${escapeHtml(s.studentId)}</td>
      <td class="flex gap-8">
        <button class="btn btn-sm btn-outline" onclick="openStudentModal('${s.id}')">এডিট</button>
        <button class="btn btn-sm btn-danger" onclick="deleteStudent('${s.id}')">ডিলিট</button>
      </td>
    </tr>
  `).join("");
}

function openStudentModal(id) {
  const modal = document.getElementById("student-modal");
  const form = document.getElementById("student-form");
  form.reset();
  document.getElementById("student-doc-id").value = "";

  if (id) {
    const s = __allStudents.find(x => x.id === id);
    if (s) {
      document.getElementById("student-doc-id").value = s.id;
      document.getElementById("f-name").value = s.name || "";
      document.getElementById("f-studentId").value = s.studentId || "";
      document.getElementById("f-roll").value = s.roll || "";
      document.getElementById("f-class").value = s.class || "";
      document.getElementById("f-section").value = s.section || "";
      document.getElementById("f-father").value = s.fatherName || "";
      document.getElementById("f-mother").value = s.motherName || "";
      document.getElementById("f-dob").value = s.dob || "";
      document.getElementById("f-gender").value = s.gender || "";
      document.getElementById("f-address").value = s.address || "";
      document.getElementById("f-guardianMobile").value = s.guardianMobile || "";
      document.getElementById("f-admissionYear").value = s.admissionYear || "";
    }
  }
  document.getElementById("student-modal-title").textContent = id ? "শিক্ষার্থী এডিট করুন" : "নতুন শিক্ষার্থী যোগ করুন";
  modal.classList.add("open");
}

function closeStudentModal() {
  document.getElementById("student-modal").classList.remove("open");
}

async function saveStudentFromForm() {
  const id = document.getElementById("student-doc-id").value;
  const photoFile = document.getElementById("f-photo").files[0];

  const data = {
    name: document.getElementById("f-name").value.trim(),
    studentId: document.getElementById("f-studentId").value.trim(),
    roll: document.getElementById("f-roll").value.trim(),
    class: document.getElementById("f-class").value,
    section: document.getElementById("f-section").value.trim(),
    fatherName: document.getElementById("f-father").value.trim(),
    motherName: document.getElementById("f-mother").value.trim(),
    dob: document.getElementById("f-dob").value,
    gender: document.getElementById("f-gender").value,
    address: document.getElementById("f-address").value.trim(),
    guardianMobile: document.getElementById("f-guardianMobile").value.trim(),
    admissionYear: document.getElementById("f-admissionYear").value.trim()
  };

  if (!window.__FB || !window.__FB.firebaseReady) {
    showToast("Firebase কনফিগার করা না থাকায় সংরক্ষণ করা যায়নি (ডেমো মোড)", "error");
    closeStudentModal();
    return;
  }

  try {
    if (photoFile) {
      const path = `student-photos/${Date.now()}_${photoFile.name}`;
      data.photo = await window.__FB.uploadFile(path, photoFile);
    }
    const col = window.__FB.db.collection(window.__FB.COLLECTIONS.STUDENTS);
    if (id) {
      await col.doc(id).update(data);
      showToast("শিক্ষার্থীর তথ্য আপডেট হয়েছে");
    } else {
      data.createdAt = window.__FB.fsTimestamp();
      await col.add(data);
      showToast("নতুন শিক্ষার্থী যোগ করা হয়েছে");
    }
    closeStudentModal();
  } catch (err) {
    console.error(err);
    showToast("সংরক্ষণে সমস্যা হয়েছে: " + err.message, "error");
  }
}

async function deleteStudent(id) {
  if (!confirm("আপনি কি নিশ্চিতভাবে এই শিক্ষার্থীর তথ্য মুছে ফেলতে চান?")) return;
  if (!window.__FB || !window.__FB.firebaseReady) {
    showToast("Firebase কনফিগার করা নেই (ডেমো মোড)", "error");
    return;
  }
  try {
    await window.__FB.db.collection(window.__FB.COLLECTIONS.STUDENTS).doc(id).delete();
    showToast("শিক্ষার্থী মুছে ফেলা হয়েছে");
    if (window.__reloadStudents) await window.__reloadStudents();
  } catch (err) {
    showToast("মুছে ফেলা যায়নি: " + err.message, "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initPublicStudentDirectory();
  initAdminStudents();
});
