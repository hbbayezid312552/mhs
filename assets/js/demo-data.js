/* ==========================================================================
   ডেমো ডেটা — Firebase কনফিগার করার আগে ওয়েবসাইট প্রিভিউ করতে ব্যবহৃত হয়।
   Firebase কানেক্ট করার পর এই ডেটা অ্যাডমিন প্যানেল থেকে যোগ করা রিয়েল ডেটা
   দ্বারা প্রতিস্থাপিত হবে। এই ফাইলটি শুধু ফলব্যাক হিসেবে কাজ করে।
   ========================================================================== */

const DEMO = {
  schoolInfo: {
    name: "মোসলেমগঞ্জ উচ্চ বিদ্যালয়",
    established: "১৯৭৮",
    intro: "মোসলেমগঞ্জ উচ্চ বিদ্যালয় একটি ঐতিহ্যবাহী মাধ্যমিক বিদ্যালয়, যা সুনামের সাথে দীর্ঘদিন ধরে মানসম্মত শিক্ষা প্রদান করে আসছে। (ডেমো তথ্য)",
    mission: "প্রতিটি শিক্ষার্থীর মধ্যে জ্ঞান, নৈতিকতা ও আত্মবিশ্বাস গড়ে তোলা।",
    vision: "একটি আলোকিত, দক্ষ ও মানবিক প্রজন্ম গঠনে অগ্রণী ভূমিকা পালন করা।",
    environment: "সবুজে ঘেরা মনোরম পরিবেশ, আধুনিক শ্রেণিকক্ষ ও খেলার মাঠসহ একটি নিরাপদ শিক্ষাঙ্গন।",
    principal: {
      name: "মোঃ আব্দুল করিম (ডেমো)",
      designation: "প্রধান শিক্ষক",
      photo: "https://placehold.co/300x300/0b5d3b/ffffff?text=Principal",
      message: "শিক্ষার্থীদের সুন্দর ভবিষ্যৎ গড়ার লক্ষ্যে আমরা প্রতিশ্রুতিবদ্ধ। আমাদের বিদ্যালয় জ্ঞান, শৃঙ্খলা ও মানবিকতার সমন্বয়ে একটি আদর্শ শিক্ষা প্রতিষ্ঠান হিসেবে গড়ে তুলতে সদা সচেষ্ট। (এটি ডেমো বার্তা, অ্যাডমিন প্যানেল থেকে পরিবর্তনযোগ্য)"
    },
    address: "মোসলেমগঞ্জ বাজার রোড, উপজেলা, জেলা, বাংলাদেশ",
    phone: "+৮৮০ ১৭xx-xxxxxx",
    email: "info@moslemganjhs.edu.bd",
    mapEmbed: "https://www.google.com/maps?q=Bangladesh&output=embed"
  },

  teachers: [
    { id:"t1", name:"মোঃ রফিকুল ইসলাম", designation:"প্রধান শিক্ষক", subject:"প্রশাসন", qualification:"এম.এ, বি.এড", mobile:"01700000001", bio:"২০ বছরের অধিক শিক্ষকতার অভিজ্ঞতা।", photo:"https://placehold.co/300x300/0f8b7f/ffffff?text=Teacher+1" },
    { id:"t2", name:"সাহিদা বেগম", designation:"সহকারী প্রধান শিক্ষক", subject:"বাংলা", qualification:"এম.এ (বাংলা)", mobile:"01700000002", bio:"বাংলা সাহিত্যে বিশেষজ্ঞ শিক্ষক।", photo:"https://placehold.co/300x300/0f8b7f/ffffff?text=Teacher+2" },
    { id:"t3", name:"মোঃ জাহাঙ্গীর আলম", designation:"সহকারী শিক্ষক", subject:"গণিত", qualification:"এম.এসসি (গণিত)", mobile:"01700000003", bio:"গণিত অলিম্পিয়াড প্রশিক্ষক।", photo:"https://placehold.co/300x300/0f8b7f/ffffff?text=Teacher+3" },
    { id:"t4", name:"নাসরিন সুলতানা", designation:"সহকারী শিক্ষক", subject:"ইংরেজি", qualification:"এম.এ (ইংরেজি)", mobile:"01700000004", bio:"যোগাযোগমূলক ইংরেজি শিক্ষায় দক্ষ।", photo:"https://placehold.co/300x300/0f8b7f/ffffff?text=Teacher+4" },
    { id:"t5", name:"মোঃ শামসুল হক", designation:"সহকারী শিক্ষক", subject:"বিজ্ঞান", qualification:"এম.এসসি (পদার্থবিজ্ঞান)", mobile:"01700000005", bio:"বিজ্ঞান ক্লাব পরিচালক।", photo:"https://placehold.co/300x300/0f8b7f/ffffff?text=Teacher+5" }
  ],

  students: [
    { id:"s1", studentId:"MHS-2026-101", roll:"01", name:"আরিফুল ইসলাম", class:"৬ষ্ঠ", section:"ক", fatherName:"মোঃ কামাল হোসেন", motherName:"রহিমা বেগম", dob:"2013-03-12", gender:"ছেলে", address:"মোসলেমগঞ্জ", guardianMobile:"01800000001", admissionYear:"2026", photo:"https://placehold.co/300x300/e6f4ec/0b5d3b?text=Student" },
    { id:"s2", studentId:"MHS-2026-102", roll:"02", name:"ফাতেমা আক্তার", class:"৬ষ্ঠ", section:"ক", fatherName:"মোঃ সেলিম মিয়া", motherName:"সালমা বেগম", dob:"2013-05-20", gender:"মেয়ে", address:"মোসলেমগঞ্জ", guardianMobile:"01800000002", admissionYear:"2026", photo:"https://placehold.co/300x300/e6f4ec/0b5d3b?text=Student" },
    { id:"s3", studentId:"MHS-2025-201", roll:"01", name:"তানভীর আহমেদ", class:"৭ম", section:"ক", fatherName:"মোঃ ইকবাল হোসেন", motherName:"শাহনাজ বেগম", dob:"2012-01-15", gender:"ছেলে", address:"মোসলেমগঞ্জ", guardianMobile:"01800000003", admissionYear:"2025", photo:"https://placehold.co/300x300/e6f4ec/0b5d3b?text=Student" },
    { id:"s4", studentId:"MHS-2024-301", roll:"01", name:"সাদিয়া ইসলাম", class:"৮ম", section:"খ", fatherName:"মোঃ নাজমুল হক", motherName:"নাসিমা বেগম", dob:"2011-07-08", gender:"মেয়ে", address:"মোসলেমগঞ্জ", guardianMobile:"01800000004", admissionYear:"2024", photo:"https://placehold.co/300x300/e6f4ec/0b5d3b?text=Student" },
    { id:"s5", studentId:"MHS-2023-401", roll:"01", name:"রাকিব হাসান", class:"৯ম", section:"ক", fatherName:"মোঃ ফরিদ উদ্দিন", motherName:"রোজিনা বেগম", dob:"2010-09-25", gender:"ছেলে", address:"মোসলেমগঞ্জ", guardianMobile:"01800000005", admissionYear:"2023", photo:"https://placehold.co/300x300/e6f4ec/0b5d3b?text=Student" },
    { id:"s6", studentId:"MHS-2022-501", roll:"01", name:"মিম আক্তার", class:"১০ম", section:"ক", fatherName:"মোঃ হাবিবুর রহমান", motherName:"শিরিন আক্তার", dob:"2009-11-02", gender:"মেয়ে", address:"মোসলেমগঞ্জ", guardianMobile:"01800000006", admissionYear:"2022", photo:"https://placehold.co/300x300/e6f4ec/0b5d3b?text=Student" }
  ],

  routines: [
    { id:"r1", class:"৬ষ্ঠ", day:"রবিবার", period:"১ম", time:"১০:০০ - ১০:৪৫", subject:"বাংলা", teacher:"সাহিদা বেগম" },
    { id:"r2", class:"৬ষ্ঠ", day:"রবিবার", period:"২য়", time:"১০:৪৫ - ১১:৩০", subject:"ইংরেজি", teacher:"নাসরিন সুলতানা" },
    { id:"r3", class:"৬ষ্ঠ", day:"রবিবার", period:"৩য়", time:"১১:৩০ - ১২:১৫", subject:"গণিত", teacher:"মোঃ জাহাঙ্গীর আলম" },
    { id:"r4", class:"৬ষ্ঠ", day:"রবিবার", period:"৪র্থ", time:"১২:১৫ - ০১:০০", subject:"বিজ্ঞান", teacher:"মোঃ শামসুল হক" },
    { id:"r5", class:"৬ষ্ঠ", day:"সোমবার", period:"১ম", time:"১০:০০ - ১০:৪৫", subject:"আইসিটি", teacher:"মোঃ রফিকুল ইসলাম" }
  ],

  exams: [
    { id:"e1", name:"১ম ক্লাস টেস্ট", type:"ক্লাস টেস্ট", year:"2026", class:"৬ষ্ঠ", fullMarks:100 },
    { id:"e2", name:"অর্ধবার্ষিক পরীক্ষা", type:"অর্ধবার্ষিক পরীক্ষা", year:"2026", class:"৬ষ্ঠ", fullMarks:100 },
    { id:"e3", name:"বার্ষিক পরীক্ষা", type:"ফাইনাল পরীক্ষা", year:"2026", class:"৬ষ্ঠ", fullMarks:100 }
  ],

  results: [
    {
      id:"res1", examId:"e2", examName:"অর্ধবার্ষিক পরীক্ষা", year:"2026", class:"৬ষ্ঠ", roll:"01", studentId:"MHS-2026-101",
      studentName:"আরিফুল ইসলাম", section:"ক", photo:"https://placehold.co/300x300/e6f4ec/0b5d3b?text=Student",
      marks:{ বাংলা:88, ইংরেজি:79, গণিত:92, বিজ্ঞান:85, আইসিটি:90, ধর্ম:81 },
      published:true
    }
  ],

  notices: [
    { id:"n1", title:"অর্ধবার্ষিক পরীক্ষার রুটিন প্রকাশ", date:"2026-09-10", description:"সকল শ্রেণির অর্ধবার্ষিক পরীক্ষার রুটিন প্রকাশ করা হয়েছে। বিস্তারিত জানতে নোটিশ বোর্ড দেখুন। (ডেমো)", pdfUrl:"#", published:true },
    { id:"n2", title:"জাতীয় শোক দিবস পালন", date:"2026-08-15", description:"যথাযথ মর্যাদায় জাতীয় শোক দিবস পালিত হবে। সকল শিক্ষার্থী উপস্থিত থাকবে। (ডেমো)", pdfUrl:"#", published:true },
    { id:"n3", title:"নতুন শিক্ষাবর্ষে ভর্তি বিজ্ঞপ্তি", date:"2026-07-01", description:"৬ষ্ঠ শ্রেণিতে ভর্তি কার্যক্রম শুরু হয়েছে। আগ্রহীরা অফিসে যোগাযোগ করুন। (ডেমো)", pdfUrl:"#", published:true },
    { id:"n4", title:"বার্ষিক ক্রীড়া প্রতিযোগিতা", date:"2026-06-20", description:"আগামী মাসে বার্ষিক ক্রীড়া প্রতিযোগিতা অনুষ্ঠিত হবে। (ডেমো)", pdfUrl:"#", published:true },
    { id:"n5", title:"অভিভাবক সমাবেশ", date:"2026-06-05", description:"সকল শ্রেণির অভিভাবকদের নিয়ে সমাবেশ অনুষ্ঠিত হবে। (ডেমো)", pdfUrl:"#", published:true }
  ],

  gallery: [
    { id:"g1", url:"https://placehold.co/500x500/0b5d3b/ffffff?text=School+Building", caption:"বিদ্যালয় ভবন", album:"ক্যাম্পাস" },
    { id:"g2", url:"https://placehold.co/500x500/0f8b7f/ffffff?text=Sports+Day", caption:"বার্ষিক ক্রীড়া প্রতিযোগিতা", album:"অনুষ্ঠান" },
    { id:"g3", url:"https://placehold.co/500x500/e8b93c/3a2c00?text=Prize+Giving", caption:"পুরস্কার বিতরণী", album:"অনুষ্ঠান" },
    { id:"g4", url:"https://placehold.co/500x500/0b5d3b/ffffff?text=Classroom", caption:"শ্রেণিকক্ষ", album:"ক্যাম্পাস" }
  ],

  classes: ["৬ষ্ঠ","৭ম","৮ম","৯ম","১০ম"],
  sections: ["ক","খ","গ"],
  subjectsByClass: ["বাংলা","ইংরেজি","গণিত","বিজ্ঞান","আইসিটি","ধর্ম","সমাজবিজ্ঞান"]
};

window.DEMO = DEMO;
