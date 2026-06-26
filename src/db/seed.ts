import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { lessons, practicePatterns, ragaPractices, songNotations } from "@/db/schema";

const beginnerLessons = [
  {
    level: "beginner" as const,
    titleBn: "বাঁশি নির্বাচন ও টিউনিং পরিচিতি",
    descriptionBn:
      "শুরুর জন্য C বা E-key বাঁশি বেছে নিন। ফাটল, ছিদ্রের অসমতা বা কর্ক ঢিলা আছে কিনা দেখুন। একই নোট বারবার বাজিয়ে টোন স্থির কিনা যাচাই করুন।",
    focusNotes: "সা (মধ্য)",
    animationHintBn: "প্রথম ৩ দিন পরিষ্কার সা তুলতে সময় দিন।",
    orderIndex: 1,
  },
  {
    level: "beginner" as const,
    titleBn: "Posture ও হাতের ধরন",
    descriptionBn:
      "মেরুদণ্ড সোজা, কাঁধ ঢিলে, গলা আরামদায়ক রাখুন। বাম হাত উপরে ও ডান হাত নিচে রেখে প্রতিটি ছিদ্রের সিল নিশ্চিত করুন।",
    focusNotes: "সা-রে",
    animationHintBn: "প্রতি ১০ মিনিটে posture reset করুন।",
    orderIndex: 2,
  },
  {
    level: "beginner" as const,
    titleBn: "এমবুশার ও শ্বাস নিয়ন্ত্রণ",
    descriptionBn:
      "ঠোঁটের মাঝখানে সরু এয়ার স্ট্রিম রেখে কাটিং এজে দিন। ডায়াফ্রাম-ভিত্তিক শ্বাসে লং টোন নিয়ন্ত্রণ সহজ হয়।",
    focusNotes: "লং সা | সা-রে-গা",
    animationHintBn: "৪ গণনা শ্বাস, ৬-৮ গণনা ফুঁ অনুশীলন করুন।",
    orderIndex: 3,
  },
  {
    level: "beginner" as const,
    titleBn: "পূর্ণ সর্গম ভিত্তি",
    descriptionBn:
      "সা-রে-গা-মা-পা-ধা-নি-সা' আরোহ-অবরোহ ধীরে ও সমান টোনে বাজান। নোট বদলের সময় ফুঁর চাপ হঠাৎ পরিবর্তন করবেন না।",
    focusNotes: "সা-রে-গা-মা-পা-ধা-নি-সা'",
    animationHintBn: "মেট্রোনোম ৬০ BPM থেকে শুরু করুন।",
    orderIndex: 4,
  },
  {
    level: "beginner" as const,
    titleBn: "তাল, ইন্টোনেশন ও দৈনিক রুটিন",
    descriptionBn:
      "৪ ও ৮ মাত্রার তালে অনুশীলন করুন, রেকর্ড করে পিচ drift শুনুন। নিয়মিত ২৫-৩০ মিনিট অনুশীলন শুরু থেকেই ফল দেয়।",
    focusNotes: "সা | পা | সা'",
    animationHintBn: "প্রতি সপ্তাহে ১ দিন সম্পূর্ণ রিভিশন দিন।",
    orderIndex: 5,
  },
];

const advancedLessons = [
  {
    level: "advanced" as const,
    titleBn: "উন্নত টোন আর্কিটেকচার ও ডায়নামিক্স",
    descriptionBn:
      "লো-মিড-হাই রেজিস্টারে সমান টোন রক্ষা, এয়ার অ্যাঙ্গেল কন্ট্রোল এবং pp→ff ডায়নামিক গ্রেডেশন অনুশীলন করুন।",
    focusNotes: "সা-পা-সা' (dynamic ladder)",
    animationHintBn: "প্রতি নোটে ৮-১২ সেকেন্ড ধরে crescendo-decrescendo দিন।",
    orderIndex: 101,
  },
  {
    level: "advanced" as const,
    titleBn: "মীড়, গমক, আন্দোলন, মুরকি",
    descriptionBn:
      "বাংলা রাগাশ্রয়ী গানে অলংকার-নির্ভর phrase shaping অত্যন্ত গুরুত্বপূর্ণ। প্রতিটি অলংকারে নোটের শুরু-শেষ নির্ভুল রাখুন।",
    focusNotes: "রে~গা | মা~পা | ধা~নি~সা'",
    animationHintBn: "একই ফ্রেজে চার ধরনের অলংকার আলাদা করে অনুশীলন করুন।",
    orderIndex: 102,
  },
  {
    level: "advanced" as const,
    titleBn: "তান নির্মাণ ও Layakari",
    descriptionBn:
      "সরল ও বক্র তান ৪/৮/১৬ মাত্রায় সাজান। একই ফ্রেজকে একগুণ, দোগুণ, তিগুণে সমে resolve করার অনুশীলন করুন।",
    focusNotes: "সা রে গা মা | গা মা পা ধা | বক্র চলন",
    animationHintBn: "তিনতাল ও দাদরা তালে আলাদা তান-ব্লক তৈরি করুন।",
    orderIndex: 103,
  },
  {
    level: "advanced" as const,
    titleBn: "রাগভিত্তিক বাক্যগঠন (Pakad-centric)",
    descriptionBn:
      "রাগ অনুশীলনে শুধু স্কেল নয়, পাকড়, বিশ্রাম স্বর, এবং phrase ending discipline জরুরি। বাংলা গানে রাগ-চরিত্র ধরে রাখতে এটি বাধ্যতামূলক দক্ষতা।",
    focusNotes: "পাকড়-ভিত্তিক অনুশীলন",
    animationHintBn: "প্রতি রাগে অন্তত ৫টি signature phrase রপ্ত করুন।",
    orderIndex: 104,
  },
  {
    level: "advanced" as const,
    titleBn: "স্টেজ রেডিনেস ও রেকর্ডিং স্ব-মূল্যায়ন",
    descriptionBn:
      "মাইক অফ-অ্যাক্সিস টেকনিক, take-review পদ্ধতি এবং ভুল শনাক্তকরণ (tone noise, timing slip, pitch drift) দিয়ে পারফরম্যান্স উন্নত করুন।",
    focusNotes: "Main melody | variation | closure",
    animationHintBn: "সপ্তাহে ২টি full take রেকর্ড করে self-audit করুন।",
    orderIndex: 105,
  },
];

const standardPatterns = [
  {
    titleBn: "সরল আরোহ-অবরোহ",
    historyBn: "প্রাচীন বাঁশি শিক্ষায় স্বর নিয়ন্ত্রণের মূল ভিত্তি।",
    sargamPattern: "সা রে গা মা পা ধা নি সা' || সা' নি ধা পা মা গা রে সা",
    tempoGuideBn: "৫০-৬০ BPM থেকে শুরু করুন।",
    orderIndex: 1,
  },
  {
    titleBn: "দ্বিস্বর পালটা",
    historyBn: "স্বর সংযোগ ও গতি উন্নত করে।",
    sargamPattern: "সা রে | রে গা | গা মা | মা পা | পা ধা | ধা নি | নি সা'",
    tempoGuideBn: "সমান ফুঁ ও সমান মাত্রা রাখুন।",
    orderIndex: 2,
  },
  {
    titleBn: "ত্রিস্বর চলন",
    historyBn: "তান প্রস্তুতির প্রাথমিক ধাপ।",
    sargamPattern: "সা রে গা | রে গা মা | গা মা পা | মা পা ধা | পা ধা নি | ধা নি সা'",
    tempoGuideBn: "৬০ BPM থেকে ৮০ BPM এ যান।",
    orderIndex: 3,
  },
  {
    titleBn: "চতুর্স্বর পালটা",
    historyBn: "স্বরগুচ্ছে গতি ও articulation উন্নত করে।",
    sargamPattern: "সা রে গা মা | রে গা মা পা | গা মা পা ধা | মা পা ধা নি",
    tempoGuideBn: "লেগাটো ও স্টাক্কাটো দুটোই অনুশীলন করুন।",
    orderIndex: 4,
  },
  {
    titleBn: "জন্তা স্বর",
    historyBn: "দুই ধারার সংগীতে স্বর দৃঢ়তার জন্য ব্যবহৃত।",
    sargamPattern: "সা সা রে রে | গা গা মা মা | পা পা ধা ধা | নি নি সা' সা'",
    tempoGuideBn: "দুই নোটে সমান জোর দিন।",
    orderIndex: 5,
  },
];

const advancedRagaPractices = [
  {
    ragaNameBn: "রাগ ভূপালী",
    thaatBn: "কল্যাণ ঠাট",
    arohBn: "সা রে গা পা ধা সা'",
    avrohBn: "সা' ধা পা গা রে সা",
    pakadBn: "গা রে সা | ধা পা গা | রে গা পা",
    vadiSamvadiBn: "বাদী: গা, সমবাদী: ধা",
    practiceMethodBn:
      "সহজ পদ্ধতিতে বাঁশি শিক্ষার ধাঁচে ধীর আলাপ → স্থায়ী বাক্য → ছোট তান। প্রথমে লং-নোটে স্বর স্থির করে পরে পাকড়-ভিত্তিক phrase repetition করুন।",
    timeBn: "সন্ধ্যা",
    sourceBookBn: "‘সহজ পদ্ধতিতে বাঁশি শিক্ষা’ (শ্রী হিমাংশু বিশ্বাস) অনুসৃত অনুশীলন কাঠামো",
    orderIndex: 1,
  },
  {
    ragaNameBn: "রাগ ইয়ামন",
    thaatBn: "কল্যাণ ঠাট",
    arohBn: "নি রে গা মা(তীব্র) ধা নি সা'",
    avrohBn: "সা' নি ধা পা মা(তীব্র) গা রে সা",
    pakadBn: "নি রে গা | রে গা মা(তী) | ধা নি ধা পা",
    vadiSamvadiBn: "বাদী: গা, সমবাদী: নি",
    practiceMethodBn:
      "মা(তীব্র) স্পষ্ট রেখে ধীর লয়ে আলাপ করুন। প্রতিটি ফ্রেজ সমে শেষ করার অভ্যাস গড়ুন এবং দোগুণে একই বাক্য পুনরাবৃত্তি করুন।",
    timeBn: "রাত্রি প্রথম প্রহর",
    sourceBookBn: "‘সহজ পদ্ধতিতে বাঁশি শিক্ষা’ (শ্রী হিমাংশু বিশ্বাস) অনুসৃত অনুশীলন কাঠামো",
    orderIndex: 2,
  },
  {
    ragaNameBn: "রাগ কাফি",
    thaatBn: "কাফি ঠাট",
    arohBn: "সা রে গা(কোমল) মা পা ধা নি(কোমল) সা'",
    avrohBn: "সা' নি(ক) ধা পা মা গা(ক) রে সা",
    pakadBn: "মা পা ধা | নি(ক) ধা পা | মা গা(ক) রে সা",
    vadiSamvadiBn: "বাদী: পা, সমবাদী: সা",
    practiceMethodBn:
      "কোমল গা ও কোমল নি-তে intonation স্থির করতে টিউনার/তানপুরা ড্রোনে ধীর অনুশীলন করুন। পরে বাংলা সুরে প্রয়োগ করুন।",
    timeBn: "রাত্রি",
    sourceBookBn: "‘সহজ পদ্ধতিতে বাঁশি শিক্ষা’ (শ্রী হিমাংশু বিশ্বাস) অনুসৃত অনুশীলন কাঠামো",
    orderIndex: 3,
  },
  {
    ragaNameBn: "রাগ ভৈরবী",
    thaatBn: "ভৈরবী ঠাট",
    arohBn: "সা রে(ক) গা(ক) মা পা ধা(ক) নি(ক) সা'",
    avrohBn: "সা' নি(ক) ধা(ক) পা মা গা(ক) রে(ক) সা",
    pakadBn: "মা পা ধা(ক) পা | গা(ক) মা রে(ক) সা",
    vadiSamvadiBn: "বাদী: মা, সমবাদী: সা",
    practiceMethodBn:
      "ভোরের ধীর আলাপে শুরু করে মীড়-ভিত্তিক গমন অনুশীলন করুন। কোমল স্বরগুলোতে অতিরিক্ত চাপ এড়িয়ে নরম টোন রাখুন।",
    timeBn: "প্রভাত",
    sourceBookBn: "‘সহজ পদ্ধতিতে বাঁশি শিক্ষা’ (শ্রী হিমাংশু বিশ্বাস) অনুসৃত অনুশীলন কাঠামো",
    orderIndex: 4,
  },
  {
    ragaNameBn: "রাগ দেশ",
    thaatBn: "খাম্বাজ ঠাট",
    arohBn: "সা রে মা পা নি সা'",
    avrohBn: "সা' নি ধা পা মা গা রে গা সা",
    pakadBn: "নি সা' নি ধা পা | মা গা রে গা সা",
    vadiSamvadiBn: "বাদী: রে, সমবাদী: পা",
    practiceMethodBn:
      "মধ্যলয়ে phrase balance রেখে বাজান। দেশ রাগের অবরোহী বৈশিষ্ট্য আলাদা করে বারবার রিয়াজ করুন।",
    timeBn: "রাত্রি দ্বিতীয় প্রহর",
    sourceBookBn: "‘সহজ পদ্ধতিতে বাঁশি শিক্ষা’ (শ্রী হিমাংশু বিশ্বাস) অনুসৃত অনুশীলন কাঠামো",
    orderIndex: 5,
  },
];

const advancedSongs = [
  {
    titleBn: "আমার পরাণ যাহা চায়",
    artistBn: "রবীন্দ্রসংগীত",
    difficultyBn: "উন্নত",
    notationSargam: "সা রে গা মা | গা রে সা - | মা পা ধা পা | গা রে সা -",
    detailedNotationBn:
      "স্থায়ী:\nসা রে গা মা | গা রে সা -\nমা পা ধা পা | গা রে সা -\n\nঅন্তরা:\nরে গা মা পা | ধা নি সা' নি\nধা পা মা গা | রে সা - -",
    fullSongBn:
      "আমার পরাণ যাহা চায়, তুমি তাই তুমি তাই গো।\nতোমা ছাড়া আর এ জগতে মোর কেহ নাই, কিছু নাই গো।",
    rhythmGuideBn: "দাদরা ভাব, মৃদু মীড় সহ।",
    sourceType: "youtube" as const,
    sourceName: "Bongshi dhoni",
    sourceUrl: "https://www.youtube.com/results?search_query=Bongshi+dhoni+Amar+Porano+Jaha+Chay+flute",
  },
  {
    titleBn: "এই পথ যদি না শেষ হয়",
    artistBn: "হেমন্ত মুখোপাধ্যায়",
    difficultyBn: "উন্নত",
    notationSargam: "সা - রে গা | মা গা রে সা | রে গা মা পা | ধা পা মা গা",
    detailedNotationBn:
      "স্থায়ী:\nসা - রে গা | মা গা রে সা\nরে গা মা পা | ধা পা মা গা\n\nঅন্তরা:\nগা মা পা ধা | নি ধা পা মা\nগা রে সা রে | গা মা রে সা",
    fullSongBn:
      "এই পথ যদি না শেষ হয়, তবে কেমন হতো তুমি বল তো।\nআমি স্বপ্ন দেখি, তুমি পাশে থেকো।",
    rhythmGuideBn: "মধ্য লয়ে phrase separation রাখুন।",
    sourceType: "youtube" as const,
    sourceName: "Selim Flute Academy",
    sourceUrl: "https://www.youtube.com/results?search_query=Selim+Flute+Academy+Ei+Poth+Jodi+Na+Shesh+Hoy",
  },
  {
    titleBn: "কফি হাউসের সেই আড্ডাটা",
    artistBn: "মান্না দে",
    difficultyBn: "উন্নত",
    notationSargam: "সা রে গা - | মা পা ধা - | নি ধা পা মা | গা রে সা -",
    detailedNotationBn:
      "স্থায়ী:\nসা রে গা - | মা পা ধা -\nনি ধা পা মা | গা রে সা -\n\nঅন্তরা:\nরে গা মা পা | মা গা রে সা\nসা রে গা মা | পা মা গা রে",
    fullSongBn:
      "কফি হাউসের সেই আড্ডাটা আজ আর নেই।\nআজ আর নেই, কোথায় হারিয়ে গেল সোনালি বিকেলগুলো সেই।",
    rhythmGuideBn: "ধীর লয়ে ভাগ করে শুরু করুন।",
    sourceType: "youtube" as const,
    sourceName: "Flutist Sabbir",
    sourceUrl: "https://www.youtube.com/results?search_query=Flutist+Sabbir+Coffee+House+flute+notation",
  },
  {
    titleBn: "পুরানো সেই দিনের কথা",
    artistBn: "রবীন্দ্রসংগীত",
    difficultyBn: "উন্নত",
    notationSargam: "সা রে গা মা | পা মা গা রে | সা রে মা পা | ধা পা মা গা",
    detailedNotationBn:
      "স্থায়ী:\nসা রে গা মা | পা মা গা রে\nসা রে মা পা | ধা পা মা গা\n\nঅন্তরা:\nরে গা মা পা | ধা নি সা' নি\nধা পা মা গা | রে সা - -",
    fullSongBn:
      "পুরানো সেই দিনের কথা, ভুলবি কি রে হায়।\nও সেই চোখের দেখা, প্রাণের কথা, সে কি ভোলা যায়।",
    rhythmGuideBn: "ওয়াল্টজ ফ্লোতে phrase বাঁধুন।",
    sourceType: "youtube" as const,
    sourceName: "Newaz Flute And Dotara",
    sourceUrl: "https://www.youtube.com/results?search_query=Newaz+Flute+And+Dotara+Purano+Shei+Diner+Kotha",
  },
  {
    titleBn: "আমায় ডেকো না",
    artistBn: "নজরুলগীতি",
    difficultyBn: "উন্নত",
    notationSargam: "সা রে মা পা | ধা পা মা গা | রে গা রে সা | - - -",
    detailedNotationBn:
      "স্থায়ী:\nসা রে মা পা | ধা পা মা গা\nরে গা রে সা | - - -\n\nঅন্তরা:\nমা পা ধা নি | ধা পা মা গা\nরে সা রে গা | মা রে সা -",
    fullSongBn:
      "আমায় ডেকো না, ফেরানো যাবে না।\nযে পথ পাড়ি দিয়েছি, সে পথ ফিরে পাওয়া যায় না।",
    rhythmGuideBn: "নরম articulation, lyric flow অনুযায়ী।",
    sourceType: "youtube" as const,
    sourceName: "SM Flute",
    sourceUrl: "https://www.youtube.com/results?search_query=SM+Flute+Amay+Deko+Na+flute",
  },
  {
    titleBn: "আমার এই পথ",
    artistBn: "আধুনিক বাংলা",
    difficultyBn: "উন্নত",
    notationSargam: "সা গা মা পা | মা গা রে সা | রে গা মা ধা | পা মা গা রে",
    detailedNotationBn:
      "স্থায়ী:\nসা গা মা পা | মা গা রে সা\nরে গা মা ধা | পা মা গা রে\n\nঅন্তরা:\nগা মা পা ধা | নি ধা পা মা\nগা রে সা রে | গা মা রে সা",
    fullSongBn:
      "আমার এই পথ তোমারই কাছে, বারবার ফিরে আসে।\nসুরের ভিতর দিয়ে হৃদয় কথা বলে।",
    rhythmGuideBn: "তালে সমান শ্বাস বিভাজন রাখুন।",
    sourceType: "youtube" as const,
    sourceName: "Anindya Joy",
    sourceUrl: "https://www.youtube.com/results?search_query=Anindya+Joy+Bangla+flute+sargam",
  },
  {
    titleBn: "বাংলা মেলোডি মিক্স",
    artistBn: "ইন্সট্রুমেন্টাল",
    difficultyBn: "উন্নত",
    notationSargam: "সা রে গা | মা পা ধা | নি সা' নি | ধা পা মা",
    detailedNotationBn:
      "Part A:\nসা রে গা মা | পা ধা নি সা'\n\nPart B:\nসা' নি ধা পা | মা গা রে সা\n\nPart C (variation):\nসা গা মা ধা | পা মা গা রে",
    fullSongBn:
      "এই ইন্সট্রুমেন্টাল অংশে বাংলা গানের বিভিন্ন ফ্রেজ জুড়ে মেডলি অনুশীলন করা হয়।\nপ্রত্যেক অংশ শেষে সমে আসার অনুশীলন করুন।",
    rhythmGuideBn: "কেহারবা/দাদরা দুই তালে অনুশীলনযোগ্য।",
    sourceType: "youtube" as const,
    sourceName: "Saaz Band",
    sourceUrl: "https://www.youtube.com/results?search_query=Saaz+Band+Bengali+flute+instrumental",
  },
  {
    titleBn: "শিবরঞ্জনী ধাঁচে বাংলা সুর",
    artistBn: "রাগাশ্রয়ী প্র্যাকটিস",
    difficultyBn: "উন্নত",
    notationSargam: "সা রে গা পা ধা | ধা পা গা রে সা",
    detailedNotationBn:
      "আলাপ ফ্রেজ:\nসা রে গা পা | ধা - পা গা\n\nগৎ ধাঁচ:\nরে গা পা ধা | ধা পা গা রে\n\nক্লোজিং:\nগা রে সা - | সা - - -",
    fullSongBn:
      "শিবরঞ্জনী ভাবের বাংলা সুরে ধীর আলাপ, মধ্য লয় গৎ এবং শেষের মুক্তায় সমাপ্তি—এই তিন ভাগে অনুশীলন করুন।",
    rhythmGuideBn: "ধীর→মধ্য লয় progression রাখুন।",
    sourceType: "youtube" as const,
    sourceName: "Chayan Flute",
    sourceUrl: "https://www.youtube.com/results?search_query=Chayan+Flute+Shivranjani+Bengali+flute",
  },
];

const allLessons = [...beginnerLessons, ...advancedLessons];

export async function ensureSeedData() {
  await db
    .insert(lessons)
    .values(allLessons)
    .onConflictDoUpdate({
      target: [lessons.level, lessons.orderIndex],
      set: {
        titleBn: sql`excluded.title_bn`,
        descriptionBn: sql`excluded.description_bn`,
        focusNotes: sql`excluded.focus_notes`,
        animationHintBn: sql`excluded.animation_hint_bn`,
        gifUrl: null,
      },
    });

  await db
    .insert(practicePatterns)
    .values(standardPatterns)
    .onConflictDoUpdate({
      target: practicePatterns.orderIndex,
      set: {
        titleBn: sql`excluded.title_bn`,
        historyBn: sql`excluded.history_bn`,
        sargamPattern: sql`excluded.sargam_pattern`,
        tempoGuideBn: sql`excluded.tempo_guide_bn`,
      },
    });

  await db
    .insert(ragaPractices)
    .values(advancedRagaPractices)
    .onConflictDoUpdate({
      target: ragaPractices.orderIndex,
      set: {
        ragaNameBn: sql`excluded.raga_name_bn`,
        thaatBn: sql`excluded.thaat_bn`,
        arohBn: sql`excluded.aroh_bn`,
        avrohBn: sql`excluded.avroh_bn`,
        pakadBn: sql`excluded.pakad_bn`,
        vadiSamvadiBn: sql`excluded.vadi_samvadi_bn`,
        practiceMethodBn: sql`excluded.practice_method_bn`,
        timeBn: sql`excluded.time_bn`,
        sourceBookBn: sql`excluded.source_book_bn`,
      },
    });

  await db
    .insert(songNotations)
    .values(advancedSongs)
    .onConflictDoUpdate({
      target: [songNotations.titleBn, songNotations.artistBn],
      set: {
        difficultyBn: sql`excluded.difficulty_bn`,
        notationSargam: sql`excluded.notation_sargam`,
        detailedNotationBn: sql`excluded.detailed_notation_bn`,
        fullSongBn: sql`excluded.full_song_bn`,
        rhythmGuideBn: sql`excluded.rhythm_guide_bn`,
        sourceType: sql`excluded.source_type`,
        sourceName: sql`excluded.source_name`,
        sourceUrl: sql`excluded.source_url`,
        youtubeVideoId: sql`excluded.youtube_video_id`,
        youtubeViews: sql`excluded.youtube_views`,
        collectedFromChannel: sql`excluded.collected_from_channel`,
        autoCollected: 0,
      },
    });
}

export async function getBeginnerLessons() {
  return db.select().from(lessons).where(eq(lessons.level, "beginner")).orderBy(asc(lessons.orderIndex));
}

export async function getAdvancedLessons() {
  return db.select().from(lessons).where(eq(lessons.level, "advanced")).orderBy(asc(lessons.orderIndex));
}

export async function getStandardPatterns() {
  return db.select().from(practicePatterns).orderBy(asc(practicePatterns.orderIndex));
}

export async function getAdvancedRagaPractices() {
  return db.select().from(ragaPractices).orderBy(asc(ragaPractices.orderIndex));
}

export async function getAdvancedSongs() {
  return db.select().from(songNotations).orderBy(desc(songNotations.youtubeViews), desc(songNotations.id));
}
