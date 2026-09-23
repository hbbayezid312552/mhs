# মোসলেমগঞ্জ উচ্চ বিদ্যালয় — School Management Website

একটি সম্পূর্ণ, আধুনিক, বাংলা-প্রথম (Bengali-first) স্কুল ম্যানেজমেন্ট ওয়েবসাইট — HTML5, CSS3, Vanilla JavaScript এবং Firebase (Authentication, Firestore, Storage) দিয়ে তৈরি। GitHub Pages-এ ফ্রি হোস্ট করা যায়।

> ⚠️ **গুরুত্বপূর্ণ:** এই প্রজেক্টে এখন *ডেমো ডেটা* (`assets/js/demo-data.js`) দেখানো হচ্ছে কারণ Firebase এখনো কনফিগার করা হয়নি। নিচের ধাপগুলো অনুসরণ করে আপনার নিজের Firebase প্রজেক্ট যুক্ত করলেই ওয়েবসাইটটি রিয়েল ডেটাবেজ দিয়ে কাজ করবে।

---

## ১. প্রজেক্ট স্ট্রাকচার

```
moslemganj-high-school/
├── index.html                 # হোমপেজ (হিরো, সম্পর্কে, প্রধান শিক্ষক, রুটিন, নোটিশ, গ্যালারি, যোগাযোগ)
├── README.md
├── assets/
│   ├── css/style.css           # সম্পূর্ণ রেসপনসিভ স্টাইলশিট
│   ├── js/
│   │   ├── firebase.js         # Firebase কনফিগারেশন (এখানে আপনার config বসাতে হবে)
│   │   ├── demo-data.js        # ফলব্যাক ডেমো ডেটা
│   │   ├── app.js              # নেভিগেশন, হ্যামবার্গার মেনু, সাধারণ helper
│   │   ├── auth.js              # লগইন/লগআউট/পাসওয়ার্ড রিসেট
│   │   ├── students.js          # শিক্ষার্থী ডিরেক্টরি + CRUD
│   │   ├── teachers.js          # শিক্ষক ডিরেক্টরি + CRUD
│   │   ├── routine.js           # ক্লাস রুটিন + CRUD
│   │   ├── results.js           # ফলাফল সার্চ, গ্রেড হিসাব, CRUD, প্রিন্ট
│   │   ├── notices.js           # নোটিশ বোর্ড + CRUD
│   │   └── gallery.js           # গ্যালারি + লাইটবক্স + CRUD
│   └── images/                  # logo.png, favicon.png, school-building.jpg ইত্যাদি বসান
├── admin/                       # অ্যাডমিন প্যানেল (index=login, dashboard, students, teachers, routine, exams, results, notices, gallery, settings)
├── result/index.html            # পাবলিক ফলাফল অনুসন্ধান পেজ
├── students/index.html          # পাবলিক শিক্ষার্থী ডিরেক্টরি
├── teachers/index.html          # পাবলিক শিক্ষক ডিরেক্টরি
└── firebase/
    ├── firestore.rules          # Firestore Security Rules
    └── storage.rules            # Storage Security Rules
```

---

## ২. ধাপে ধাপে সেটআপ

### ধাপ ১ — GitHub রিপোজিটরি তৈরি করুন
1. [github.com](https://github.com) এ লগইন করুন (অ্যাকাউন্ট না থাকলে ফ্রি তৈরি করুন)।
2. **New repository** ক্লিক করুন। নাম দিন যেমন `moslemganj-high-school`। Public সিলেক্ট করুন।
3. এই সম্পূর্ণ প্রজেক্ট ফোল্ডারের সব ফাইল আপলোড করুন (Add file → Upload files, অথবা `git push` দিয়ে)।

### ধাপ ২ — Firebase প্রজেক্ট তৈরি করুন
1. [console.firebase.google.com](https://console.firebase.google.com) এ যান এবং **Add project** ক্লিক করুন।
2. প্রজেক্টের নাম দিন (যেমন `moslemganj-hs`)। Google Analytics ঐচ্ছিক — বন্ধ রাখতে পারেন।
3. প্রজেক্ট তৈরি হয়ে গেলে **Project settings (⚙️) → General** এ যান।
4. "Your apps" সেকশনে **Web (</>)** আইকনে ক্লিক করে একটি Web App যুক্ত করুন (nickname দিন, Firebase Hosting এর দরকার নেই)।
5. যে `firebaseConfig` অবজেক্ট দেখাবে, সেটি কপি করুন।

### ধাপ ৩ — Firebase কনফিগারেশন যুক্ত করুন
`assets/js/firebase.js` ফাইল খুলুন এবং এই অংশ আপনার নিজের মান দিয়ে প্রতিস্থাপন করুন:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "moslemganj-hs.firebaseapp.com",
  projectId: "moslemganj-hs",
  storageBucket: "moslemganj-hs.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```

### ধাপ ৪ — Authentication চালু করুন
1. Firebase Console → **Build → Authentication → Get started**।
2. **Sign-in method** ট্যাবে গিয়ে **Email/Password** enable করুন।
3. **Users** ট্যাবে গিয়ে **Add user** ক্লিক করে আপনার প্রথম অ্যাডমিন ইমেইল ও পাসওয়ার্ড দিয়ে অ্যাকাউন্ট তৈরি করুন। ইউজার তৈরি হওয়ার পর তার **UID** কপি করে রাখুন — পরের ধাপে দরকার হবে।

### ধাপ ৫ — Firestore Database তৈরি করুন
1. Firebase Console → **Build → Firestore Database → Create database**।
2. **Production mode** নির্বাচন করুন এবং কাছাকাছি একটি location (যেমন `asia-south1`) বেছে নিন।
3. ডেটাবেজ তৈরি হয়ে গেলে, **admins** নামে একটি কালেকশন তৈরি করুন। এতে একটি ডকুমেন্ট যোগ করুন — Document ID হিসেবে ধাপ ৪-এ কপি করা **UID** ব্যবহার করুন, এবং ফিল্ড হিসেবে `role: "admin"` যোগ করুন। এভাবেই আপনি প্রথম অ্যাডমিনকে অনুমোদন দিচ্ছেন (firestore.rules-এর `isAdmin()` ফাংশন এই কালেকশন চেক করে)।
4. এরপর নিচের কালেকশনগুলো (খালি রাখতে পারেন, অ্যাডমিন প্যানেল থেকে ডেটা যোগ হবে):
   `students`, `teachers`, `classes`, `routines`, `exams`, `results`, `notices`, `gallery`, `schoolInfo`।

### ধাপ ৬ — Firestore Security Rules ডিপ্লয় করুন
1. Firestore Database → **Rules** ট্যাবে যান।
2. এই প্রজেক্টের `firebase/firestore.rules` ফাইলের সম্পূর্ণ কন্টেন্ট কপি করে পেস্ট করুন এবং **Publish** ক্লিক করুন।

### ধাপ ৭ — Storage চালু করুন
1. Firebase Console → **Build → Storage → Get started**। Production mode নির্বাচন করুন।
2. **Rules** ট্যাবে গিয়ে `firebase/storage.rules` ফাইলের কন্টেন্ট পেস্ট করে **Publish** করুন।

### ধাপ ৮ — GitHub Pages চালু করুন
1. আপনার GitHub রিপোজিটরিতে যান → **Settings → Pages**।
2. Source হিসেবে **Deploy from a branch** নির্বাচন করুন, branch: `main`, folder: `/ (root)`।
3. **Save** ক্লিক করুন। কিছুক্ষণ পর আপনার সাইট এই ঠিকানায় লাইভ হবে:
   `https://<your-username>.github.io/moslemganj-high-school/`

### ধাপ ৯ — লগইন করে ডেটা যোগ করুন
1. লাইভ সাইটে যান → **Admin Login** এ ক্লিক করুন → ধাপ ৪-এ তৈরি করা ইমেইল/পাসওয়ার্ড দিয়ে লগইন করুন।
2. ড্যাশবোর্ড থেকে শিক্ষক, শিক্ষার্থী, রুটিন, পরীক্ষা, ফলাফল, নোটিশ ও গ্যালারি যোগ করুন — ডেমো ডেটা স্বয়ংক্রিয়ভাবে প্রতিস্থাপিত হবে।

---

## ৩. লোগো ও ছবি যুক্ত করা
`assets/images/` ফোল্ডারে নিচের ফাইলগুলো যুক্ত করুন (না থাকলে সাইট স্বয়ংক্রিয়ভাবে placeholder ছবি দেখাবে):
- `logo.png` — স্কুল লোগো (বর্গাকার, স্বচ্ছ ব্যাকগ্রাউন্ড প্রস্তাবিত)
- `favicon.png` — ব্রাউজার ট্যাব আইকন
- `school-building.jpg` — বিদ্যালয়ের ছবি (হোমপেজ "About" সেকশনে ব্যবহৃত)

## ৪. ফলাফল PDF মার্কশিট
"Download Marksheet PDF" বাটনটি ব্রাউজারের built-in প্রিন্ট ডায়ালগ খোলে — Destination হিসেবে **Save as PDF** নির্বাচন করলেই মার্কশিট PDF হিসেবে সংরক্ষিত হবে। এতে অতিরিক্ত কোনো ভারী লাইব্রেরির প্রয়োজন নেই, ফলে সাইট দ্রুত লোড হয়।

## ৫. নিরাপত্তা সংক্রান্ত গুরুত্বপূর্ণ নোট
- `assets/js/firebase.js`-এর মধ্যে থাকা `firebaseConfig` কোনো গোপন সিক্রেট নয় (এটি ক্লায়েন্ট-সাইড কনফিগারেশন, সব Firebase ওয়েব অ্যাপেই পাবলিক থাকে)। **আসল নিরাপত্তা আসে Firestore ও Storage Security Rules থেকে** — তাই ধাপ ৬ ও ৭ বাদ দেবেন না।
- নতুন অ্যাডমিন যোগ করতে হলে: Firebase Console → Authentication → Add User দিয়ে অ্যাকাউন্ট তৈরি করুন, তারপর Firestore-এ `admins/{সেই UID}` ডকুমেন্ট তৈরি করুন।
- শিক্ষার্থীর ব্যক্তিগত তথ্য (অভিভাবকের মোবাইল, ঠিকানা, জন্ম তারিখ) পাবলিক পেজে কখনো দেখানো হয় না — শুধুমাত্র নাম, ছবি, শ্রেণি, রোল ও আইডি প্রদর্শিত হয়।

## ৬. লোকাল টেস্টিং
Firebase লাইভ থাকায় শুধু `index.html` ব্রাউজারে খুললেই ডেমো ডেটা দিয়ে পুরো সাইট প্রিভিউ করা যাবে। Firebase কানেক্ট করার পর লোকালি টেস্ট করতে একটি সাধারণ লোকাল সার্ভার ব্যবহার করুন (যেমন VS Code Live Server এক্সটেনশন), কারণ কিছু ব্রাউজার `file://` প্রোটোকলে Firebase SDK সঠিকভাবে চালায় না।

## ৭. কাস্টমাইজেশন
- রঙ পরিবর্তন করতে `assets/css/style.css`-এর শুরুতে থাকা `:root { --deep-green: ...; }` ভেরিয়েবলগুলো পরিবর্তন করুন।
- নতুন ক্লাস/শ্রেণি যোগ করতে `assets/js/demo-data.js`-এর `classes` অ্যারে এবং সংশ্লিষ্ট `<select>` অপশনগুলো (students.html, routine.html, results.html, result/index.html) আপডেট করুন।

---

**© ২০২৬ মোসলেমগঞ্জ উচ্চ বিদ্যালয়** — এই প্রজেক্টটি স্বাধীনভাবে পরিবর্তন ও ব্যবহারযোগ্য।
