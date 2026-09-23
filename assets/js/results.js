/* ==========================================================================
   results.js — ফলাফল ব্যবস্থাপনা: গ্রেড হিসাব, পাবলিক সার্চ, অ্যাডমিন এন্ট্রি,
   প্রিন্ট ও PDF মার্কশিট (ব্রাউজার প্রিন্ট-টু-পিডিএফ ব্যবহার করে — অতিরিক্ত
   লাইব্রেরির প্রয়োজন নেই, দ্রুত লোড হয়)
   ========================================================================== */

const SUBJECTS = ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান", "আইসিটি", "ধর্ম"];

function gradeFromMarks(marks, full = 100) {
  const pct = (marks / full) * 100;
  if (pct >= 80) return { letter: "A+", gpa: 5.0 };
  if (pct >= 70) return { letter: "A", gpa: 4.0 };
  if (pct >= 60) return { letter: "A-", gpa: 3.5 };
  if (pct >= 50) return { letter: "B", gpa: 3.0 };
  if (pct >= 40) return { letter: "C", gpa: 2.0 };
  if (pct >= 33) return { letter: "D", gpa: 1.0 };
  return { letter: "F", gpa: 0.0 };
}

function computeResultSummary(marksObj, fullPerSubject = 100) {
  const subjects = Object.keys(marksObj);
  const total = subjects.reduce((sum, s) => sum + Number(marksObj[s] || 0), 0);
  const fullTotal = subjects.length * fullPerSubject;
  const percentage = fullTotal ? (total / fullTotal) * 100 : 0;
  const failedSubjects = subjects.filter(s => (Number(marksObj[s]) / fullPerSubject) * 100 < 33);
  let overallGrade, gpa, status;
  if (failedSubjects.length > 0) {
    overallGrade = "F"; gpa = 0.0; status = "অকৃতকার্য (Fail)";
  } else {
    const g = gradeFromMarks(percentage, 100);
    overallGrade = g.letter; gpa = g.gpa; status = "কৃতকার্য (Pass)";
  }
  return { total, fullTotal, percentage: percentage.toFixed(2), overallGrade, gpa: gpa.toFixed(2), status, failedSubjects };
}

/* ---------------- PUBLIC RESULT SEARCH (result/index.html) ---------------- */

async function initResultSearch() {
  const form = document.getElementById("result-search-form");
  if (!form) return;

  const exams = await fetchCollection(window.__FB.COLLECTIONS.EXAMS, "exams");
  document.getElementById("rs-exam").innerHTML =
    `<option value="">পরীক্ষা নির্বাচন করুন</option>` +
    exams.map(e => `<option value="${e.id}" data-name="${escapeHtml(e.name)}">${escapeHtml(e.name)} (${escapeHtml(e.year)})</option>`).join("");
  document.getElementById("rs-class").innerHTML =
    `<option value="">শ্রেণি নির্বাচন করুন</option>` +
    window.DEMO.classes.map(c => `<option value="${c}">${c}</option>`).join("");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const examSelect = document.getElementById("rs-exam");
    const examId = examSelect.value;
    const examName = examSelect.selectedOptions[0] ? examSelect.selectedOptions[0].dataset.name : "";
    const cls = document.getElementById("rs-class").value;
    const roll = document.getElementById("rs-roll").value.trim();
    const studentId = document.getElementById("rs-studentId").value.trim();
    const resultBox = document.getElementById("result-output");

    if (!examId || !cls || !roll) {
      showToast("পরীক্ষা, শ্রেণি ও রোল নম্বর দিন", "error");
      return;
    }

    resultBox.innerHTML = `<div class="loader">খোঁজা হচ্ছে...</div>`;
    const allResults = await fetchCollection(window.__FB.COLLECTIONS.RESULTS, "results");
    const found = allResults.find(r =>
      r.examId === examId && r.class === cls && String(r.roll) === roll &&
      (!studentId || r.studentId === studentId) && r.published
    );

    if (!found) {
      resultBox.innerHTML = `<div class="empty-state">কোনো প্রকাশিত ফলাফল পাওয়া যায়নি। তথ্য যাচাই করে আবার চেষ্টা করুন।</div>`;
      return;
    }
    renderResultCard(found, examName);
  });
}

function renderResultCard(r, examName) {
  const summary = computeResultSummary(r.marks);
  const subjectRows = Object.entries(r.marks).map(([subj, mark]) => {
    const g = gradeFromMarks(mark);
    return `<tr><td>${escapeHtml(subj)}</td><td>${mark}</td><td>${g.letter}</td></tr>`;
  }).join("");

  document.getElementById("result-output").innerHTML = `
    <div class="card" id="marksheet" style="padding:30px;max-width:640px;margin:0 auto">
      <div class="text-center mb-16">
        <img src="../assets/images/logo.png" onerror="this.style.display='none'" alt="Logo" style="width:70px;margin:0 auto 8px">
        <h2 style="color:var(--deep-green)">মোসলেমগঞ্জ উচ্চ বিদ্যালয়</h2>
        <p style="color:var(--text-muted)">${escapeHtml(examName || r.examName || "")} — ${escapeHtml(r.year || "")}</p>
      </div>
      <div class="flex items-center gap-12 mb-16" style="border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:14px 0">
        <img src="${escapeHtml(r.photo || 'https://placehold.co/100x100')}" style="width:80px;height:80px;border-radius:8px;object-fit:cover" alt="">
        <div>
          <strong>${escapeHtml(r.studentName)}</strong><br>
          <small>শ্রেণি: ${escapeHtml(r.class)} | শাখা: ${escapeHtml(r.section || "-")} | রোল: ${escapeHtml(r.roll)}</small><br>
          <small>শিক্ষার্থী আইডি: ${escapeHtml(r.studentId)}</small>
        </div>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>বিষয়</th><th>প্রাপ্ত নম্বর</th><th>গ্রেড</th></tr></thead>
        <tbody>${subjectRows}</tbody>
      </table></div>
      <div class="mt-16" style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px">
        <div><strong>মোট নম্বর:</strong> ${summary.total} / ${summary.fullTotal}</div>
        <div><strong>শতকরা হার:</strong> ${summary.percentage}%</div>
        <div><strong>জিপিএ:</strong> ${summary.gpa}</div>
        <div><strong>গ্রেড:</strong> ${summary.overallGrade}</div>
      </div>
      <div class="mt-16 text-center">
        <span class="badge ${summary.status.includes('Pass') ? 'badge-success' : 'badge-danger'}">${summary.status}</span>
      </div>
      <div class="mt-24 flex gap-12 no-print">
        <button class="btn btn-outline btn-block" onclick="window.print()">🖨️ ফলাফল প্রিন্ট করুন</button>
        <button class="btn btn-primary btn-block" onclick="window.print()">⬇️ মার্কশিট PDF ডাউনলোড</button>
      </div>
      <p class="no-print" style="font-size:.78rem;color:var(--text-muted);margin-top:8px;text-align:center">
        নোট: "PDF ডাউনলোড" বাটনে ব্রাউজারের প্রিন্ট ডায়ালগ খুলবে — সেখানে Destination হিসেবে "Save as PDF" নির্বাচন করুন।
      </p>
    </div>
  `;
}

/* ---------------- ADMIN RESULTS (admin/results.html) ---------------- */

async function initAdminResults() {
  const tbody = document.getElementById("results-tbody");
  if (!tbody) return;

  const exams = await fetchCollection(window.__FB.COLLECTIONS.EXAMS, "exams");
  const examSelect = document.getElementById("f-res-exam");
  examSelect.innerHTML = exams.map(e => `<option value="${e.id}" data-name="${escapeHtml(e.name)}" data-year="${escapeHtml(e.year)}">${escapeHtml(e.name)} (${escapeHtml(e.year)})</option>`).join("");
  document.getElementById("f-res-class").innerHTML = window.DEMO.classes.map(c => `<option value="${c}">${c}</option>`).join("");

  const marksFieldsWrap = document.getElementById("marks-fields");
  marksFieldsWrap.innerHTML = SUBJECTS.map(s => `
    <div class="form-group">
      <label>${s}</label>
      <input type="number" min="0" max="100" class="form-control mark-input" data-subject="${s}" required>
    </div>
  `).join("");

  let __allResults = [];
  async function reload() {
    tbody.innerHTML = `<tr><td colspan="6">লোড হচ্ছে...</td></tr>`;
    __allResults = await fetchCollection(window.__FB.COLLECTIONS.RESULTS, "results");
    renderAdminResultsTable(__allResults);
  }
  await reload();

  function renderAdminResultsTable(list) {
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state">কোনো ফলাফল নেই</td></tr>`;
      return;
    }
    tbody.innerHTML = list.map(r => {
      const s = computeResultSummary(r.marks);
      return `<tr>
        <td>${escapeHtml(r.studentName)}</td>
        <td>${escapeHtml(r.class)} / ${escapeHtml(r.roll)}</td>
        <td>${escapeHtml(r.examName || "")}</td>
        <td>${s.overallGrade} (${s.gpa})</td>
        <td><span class="badge ${r.published ? 'badge-success' : 'badge-warning'}">${r.published ? 'প্রকাশিত' : 'অপ্রকাশিত'}</span></td>
        <td class="flex gap-8">
          <button class="btn btn-sm btn-outline" onclick="togglePublishResult('${r.id}', ${!r.published})">${r.published ? 'আনপাবলিশ' : 'পাবলিশ'}</button>
          <button class="btn btn-sm btn-danger" onclick="deleteResult('${r.id}')">ডিলিট</button>
        </td>
      </tr>`;
    }).join("");
  }

  document.getElementById("add-result-btn").addEventListener("click", () => {
    document.getElementById("result-form").reset();
    document.getElementById("result-modal").classList.add("open");
  });

  document.getElementById("result-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const opt = examSelect.selectedOptions[0];
    const marks = {};
    document.querySelectorAll(".mark-input").forEach(inp => { marks[inp.dataset.subject] = Number(inp.value); });

    const data = {
      examId: examSelect.value,
      examName: opt ? opt.dataset.name : "",
      year: opt ? opt.dataset.year : "",
      class: document.getElementById("f-res-class").value,
      section: document.getElementById("f-res-section").value.trim(),
      roll: document.getElementById("f-res-roll").value.trim(),
      studentId: document.getElementById("f-res-studentId").value.trim(),
      studentName: document.getElementById("f-res-name").value.trim(),
      photo: document.getElementById("f-res-photo").value.trim(),
      marks,
      published: false
    };

    if (!window.__FB || !window.__FB.firebaseReady) {
      showToast("Firebase কনফিগার করা নেই (ডেমো মোড)", "error");
      document.getElementById("result-modal").classList.remove("open");
      return;
    }
    try {
      await window.__FB.db.collection(window.__FB.COLLECTIONS.RESULTS).add(data);
      showToast("ফলাফল সংরক্ষণ করা হয়েছে (এখনো অপ্রকাশিত)");
      document.getElementById("result-modal").classList.remove("open");
      await reload();
    } catch (err) {
      showToast("সংরক্ষণে সমস্যা: " + err.message, "error");
    }
  });

  window.togglePublishResult = async (id, publish) => {
    if (!window.__FB || !window.__FB.firebaseReady) return;
    await window.__FB.db.collection(window.__FB.COLLECTIONS.RESULTS).doc(id).update({ published: publish });
    showToast(publish ? "ফলাফল প্রকাশ করা হয়েছে" : "ফলাফল আনপাবলিশ করা হয়েছে");
    await reload();
  };
  window.deleteResult = async (id) => {
    if (!confirm("এই ফলাফল মুছে ফেলতে চান?")) return;
    if (!window.__FB || !window.__FB.firebaseReady) return;
    await window.__FB.db.collection(window.__FB.COLLECTIONS.RESULTS).doc(id).delete();
    showToast("ফলাফল মুছে ফেলা হয়েছে");
    await reload();
  };
}

document.addEventListener("DOMContentLoaded", () => {
  initResultSearch();
  initAdminResults();
});
