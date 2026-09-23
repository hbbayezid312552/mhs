/* ==========================================================================
   routine.js — ক্লাস রুটিন (পাবলিক ভিউ + প্রিন্ট) + অ্যাডমিন CRUD
   ========================================================================== */

let __allRoutines = [];
const DAY_ORDER = ["শনিবার","রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার"];

/* ---------------- PUBLIC (homepage #routine section) ---------------- */

async function initPublicRoutine() {
  const wrap = document.getElementById("routine-section");
  if (!wrap) return;
  __allRoutines = await fetchCollection(window.__FB.COLLECTIONS.ROUTINES, "routines");

  const tabs = document.getElementById("routine-class-tabs");
  const classes = window.DEMO.classes;
  tabs.innerHTML = classes.map((c, i) =>
    `<button class="tab-btn ${i === 0 ? "active" : ""}" data-class="${c}">${c} শ্রেণি</button>`
  ).join("");

  tabs.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderRoutineTable(btn.dataset.class);
    });
  });

  renderRoutineTable(classes[0]);

  const printBtn = document.getElementById("print-routine-btn");
  if (printBtn) printBtn.addEventListener("click", () => window.print());
}

function renderRoutineTable(className) {
  const container = document.getElementById("routine-table-container");
  const rows = __allRoutines.filter(r => r.class === className);
  if (!rows.length) {
    container.innerHTML = `<div class="empty-state">এই শ্রেণির জন্য কোনো রুটিন যুক্ত করা হয়নি</div>`;
    return;
  }
  const days = [...new Set(rows.map(r => r.day))].sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));
  const periods = [...new Set(rows.map(r => r.period))];

  let html = `<div class="table-wrap"><table><thead><tr><th>দিন / পিরিয়ড</th>`;
  periods.forEach(p => html += `<th>${escapeHtml(p)}</th>`);
  html += `</tr></thead><tbody>`;
  days.forEach(day => {
    html += `<tr><td><strong>${escapeHtml(day)}</strong></td>`;
    periods.forEach(p => {
      const cell = rows.find(r => r.day === day && r.period === p);
      html += `<td>${cell ? `${escapeHtml(cell.subject)}<br><small>${escapeHtml(cell.teacher)}</small><br><small>${escapeHtml(cell.time)}</small>` : "-"}</td>`;
    });
    html += `</tr>`;
  });
  html += `</tbody></table></div>`;
  container.innerHTML = html;
}

/* ---------------- ADMIN CRUD (admin/routine.html) ---------------- */

async function initAdminRoutine() {
  const tbody = document.getElementById("routine-tbody");
  if (!tbody) return;

  const classSelect = document.getElementById("f-r-class");
  classSelect.innerHTML = window.DEMO.classes.map(c => `<option value="${c}">${c}</option>`).join("");
  document.getElementById("f-r-day").innerHTML = DAY_ORDER.map(d => `<option value="${d}">${d}</option>`).join("");

  async function reload() {
    tbody.innerHTML = `<tr><td colspan="6">লোড হচ্ছে...</td></tr>`;
    __allRoutines = await fetchCollection(window.__FB.COLLECTIONS.ROUTINES, "routines");
    renderAdminRoutineTable(__allRoutines);
  }
  await reload();

  document.getElementById("add-routine-btn").addEventListener("click", () => openRoutineModal());
  document.getElementById("routine-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    await saveRoutineFromForm();
    await reload();
  });
  window.__reloadRoutines = reload;
}

function renderAdminRoutineTable(list) {
  const tbody = document.getElementById("routine-tbody");
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">কোনো রুটিন নেই</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(r => `
    <tr>
      <td>${escapeHtml(r.class)}</td>
      <td>${escapeHtml(r.day)}</td>
      <td>${escapeHtml(r.period)}</td>
      <td>${escapeHtml(r.time)}</td>
      <td>${escapeHtml(r.subject)} / ${escapeHtml(r.teacher)}</td>
      <td class="flex gap-8">
        <button class="btn btn-sm btn-outline" onclick="openRoutineModal('${r.id}')">এডিট</button>
        <button class="btn btn-sm btn-danger" onclick="deleteRoutine('${r.id}')">ডিলিট</button>
      </td>
    </tr>
  `).join("");
}

function openRoutineModal(id) {
  const modal = document.getElementById("routine-modal");
  const form = document.getElementById("routine-form");
  form.reset();
  document.getElementById("routine-doc-id").value = "";
  if (id) {
    const r = __allRoutines.find(x => x.id === id);
    if (r) {
      document.getElementById("routine-doc-id").value = r.id;
      document.getElementById("f-r-class").value = r.class;
      document.getElementById("f-r-day").value = r.day;
      document.getElementById("f-r-period").value = r.period;
      document.getElementById("f-r-time").value = r.time;
      document.getElementById("f-r-subject").value = r.subject;
      document.getElementById("f-r-teacher").value = r.teacher;
    }
  }
  modal.classList.add("open");
}
function closeRoutineModal() { document.getElementById("routine-modal").classList.remove("open"); }

async function saveRoutineFromForm() {
  const id = document.getElementById("routine-doc-id").value;
  const data = {
    class: document.getElementById("f-r-class").value,
    day: document.getElementById("f-r-day").value,
    period: document.getElementById("f-r-period").value.trim(),
    time: document.getElementById("f-r-time").value.trim(),
    subject: document.getElementById("f-r-subject").value.trim(),
    teacher: document.getElementById("f-r-teacher").value.trim()
  };
  if (!window.__FB || !window.__FB.firebaseReady) {
    showToast("Firebase কনফিগার করা নেই (ডেমো মোড)", "error");
    closeRoutineModal();
    return;
  }
  try {
    const col = window.__FB.db.collection(window.__FB.COLLECTIONS.ROUTINES);
    if (id) { await col.doc(id).update(data); showToast("রুটিন আপডেট হয়েছে"); }
    else { await col.add(data); showToast("নতুন রুটিন যোগ করা হয়েছে"); }
    closeRoutineModal();
  } catch (err) {
    showToast("সংরক্ষণে সমস্যা: " + err.message, "error");
  }
}

async function deleteRoutine(id) {
  if (!confirm("এই রুটিন এন্ট্রি মুছে ফেলতে চান?")) return;
  if (!window.__FB || !window.__FB.firebaseReady) return;
  await window.__FB.db.collection(window.__FB.COLLECTIONS.ROUTINES).doc(id).delete();
  showToast("রুটিন মুছে ফেলা হয়েছে");
  if (window.__reloadRoutines) await window.__reloadRoutines();
}

document.addEventListener("DOMContentLoaded", () => {
  initPublicRoutine();
  initAdminRoutine();
});
