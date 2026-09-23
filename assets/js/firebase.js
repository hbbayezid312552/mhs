/* ==========================================================================
   Firebase Configuration & Initialization
   মোসলেমগঞ্জ উচ্চ বিদ্যালয়

   >>> এই ফাইলটি অবশ্যই কনফিগার করতে হবে <<<
   README.md-এ ধাপে ধাপে নির্দেশনা দেওয়া আছে।

   ১. https://console.firebase.google.com এ গিয়ে একটি নতুন প্রজেক্ট তৈরি করুন।
   ২. Project Settings > General > Your apps > Web app যোগ করুন।
   ৩. নিচের firebaseConfig অবজেক্টে আপনার নিজের মান বসান।
   ৪. Authentication > Email/Password পদ্ধতি চালু করুন।
   ৫. Firestore Database তৈরি করুন (production mode)।
   ৬. Storage চালু করুন।
   ৭. firebase/firestore.rules ও firebase/storage.rules ডিপ্লয় করুন।

   নোট: Firebase Web API config গোপনীয় secret নয় (এটি ক্লায়েন্ট-সাইড কনফিগ),
   তবে প্রকৃত সুরক্ষা আসে Firestore/Storage Security Rules থেকে — যা অবশ্যই
   সঠিকভাবে কনফিগার করতে হবে (দেখুন firebase/firestore.rules)।
   ========================================================================== */

// ⬇️ আপনার Firebase কনফিগারেশন এখানে বসান (Firebase Console থেকে কপি করুন)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebase SDK লোড হয়েছে কিনা যাচাই করুন (index.html-এ CDN স্ক্রিপ্ট যুক্ত থাকতে হবে)
let app, auth, db, storage;
let firebaseReady = false;

try {
  if (window.firebase && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    storage = firebase.storage();
    firebaseReady = true;
  } else {
    console.warn(
      "⚠️ Firebase কনফিগার করা হয়নি। assets/js/firebase.js ফাইলে আপনার Firebase প্রজেক্টের তথ্য বসান। " +
      "এই মুহূর্তে ওয়েবসাইটটি ডেমো (sample) ডেটা দেখাচ্ছে।"
    );
  }
} catch (e) {
  console.error("Firebase init error:", e);
}

/* ---------- Firestore collection names (constants) ---------- */
const COLLECTIONS = {
  STUDENTS: "students",
  TEACHERS: "teachers",
  CLASSES: "classes",
  ROUTINES: "routines",
  EXAMS: "exams",
  RESULTS: "results",
  NOTICES: "notices",
  GALLERY: "gallery",
  SCHOOL_INFO: "schoolInfo",
  ADMINS: "admins"
};

/* ---------- Small helpers used across pages ---------- */
function fsTimestamp() {
  return firebaseReady ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString();
}

async function uploadFile(path, file) {
  if (!firebaseReady) throw new Error("Firebase not configured");
  const ref = storage.ref().child(path);
  const snap = await ref.put(file);
  return await snap.ref.getDownloadURL();
}

/* Exposed globally for other scripts (no ES modules, so GitHub Pages works with plain <script> tags) */
window.__FB = { firebaseReady, COLLECTIONS, fsTimestamp, uploadFile, get auth(){return auth}, get db(){return db}, get storage(){return storage} };
