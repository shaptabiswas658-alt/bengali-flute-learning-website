import { Wind } from "lucide-react";
import { ensureSeedData, getBeginnerLessons } from "@/db/seed";
import { AmbientSoundPlayer } from "@/components/nature-sound-player";
import { SiteTopbar } from "@/components/site-topbar";
import { EssentialItemsSection } from "@/components/essential-items";

export const dynamic = "force-dynamic";

const beginnerEssentials = [
  {
    heading: "Instrument Setup",
    details: "C/E-key বাঁশি, hole-seal check, tuning consistency এবং প্রতিদিন প্র্যাকটিসের আগে warming long-note।",
  },
  {
    heading: "Posture + Embouchure",
    details: "মেরুদণ্ড সোজা, কাঁধ ঢিলে, lip aperture ছোট; focused airflow দিয়ে কাঁপাহীন টোন।",
  },
  {
    heading: "Breathing Discipline",
    details: "৪ গণনা শ্বাস, ৬-৮ গণনা ফুঁ; diaphragm-based শ্বাসে দীর্ঘ phrase control তৈরি করুন।",
  },
  {
    heading: "Foundational Sargam",
    details: "সা-রে-গা-মা-পা-ধা-নি-সা' আরোহ-অবরোহ 60 BPM এ পরিষ্কার articulation সহ।",
  },
  {
    heading: "Tone & Intonation",
    details: "দৈনিক record-review করে pitch drift, airy tone ও finger leak ধরুন এবং সংশোধন করুন।",
  },
  {
    heading: "Daily Routine",
    details: "৩০ মিনিট: ৫m শ্বাস, ১০m লং-নোট, ১০m সর্গম, ৫m ভুল সংশোধন + flute cleaning।",
  },
];

export default async function BeginnerPage() {
  await ensureSeedData();
  const beginnerLessons = await getBeginnerLessons();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,_#f7fee7_0%,_#ecfccb_35%,_#fefce8_70%)] text-stone-900">
      <AmbientSoundPlayer
        storageKey="sound-beginner-432hz"
        primaryAudioUrl="https://www.orangefreesounds.com/wp-content/uploads/2021/05/432-hz-music-meditative-ambient-warm-synth-pad.mp3"
        primaryVolume={0.12}
        labelOnBn="৪৩২Hz সাউন্ড চালু"
        labelOffBn="৪৩২Hz সাউন্ড বন্ধ"
        descriptionBn="Beginner ব্যাকগ্রাউন্ড: ৪৩২Hz মেডিটেটিভ মিউজিক (কম ভলিউম)।"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <SiteTopbar />

        <header className="rounded-3xl border border-lime-200 bg-white/85 p-6 shadow-xl backdrop-blur md:p-8">
          <h1 className="text-2xl font-bold text-lime-900 md:text-4xl">Beginner Homepage: ভিত্তি মজবুত করুন</h1>
          <p className="mt-2 text-stone-700">এখানে আপনার শুরু থেকে সঠিক টোন, ফিঙ্গারিং এবং নিয়মিত অভ্যাস গড়ে তোলা হবে।</p>
        </header>

        <section className="mt-8 rounded-3xl border border-lime-200 bg-white/90 p-6 shadow-lg md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <Wind className="h-6 w-6 text-lime-700" />
            <h2 className="text-xl font-semibold text-lime-900 md:text-2xl">শুরুর সম্পূর্ণ পাঠ</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {beginnerLessons.map((lesson) => (
              <article key={lesson.id} className="rounded-2xl border border-lime-200 bg-gradient-to-br from-white to-lime-50 p-4">
                <h3 className="text-lg font-semibold text-lime-900">{lesson.titleBn}</h3>
                <p className="mt-2 text-sm text-stone-700">{lesson.descriptionBn}</p>
                <p className="mt-3 text-sm text-stone-700">
                  <span className="font-semibold text-lime-800">নোট ফোকাস:</span> {lesson.focusNotes}
                </p>
                <p className="mt-1 text-sm text-stone-700">
                  <span className="font-semibold text-lime-800">প্র্যাকটিস:</span> {lesson.animationHintBn}
                </p>
              </article>
            ))}
          </div>
        </section>

        <EssentialItemsSection
          title="Beginner Essential Items"
          subtitle="এই essentials আয়ত্ত না হলে পরের লেভেলে ওঠা উচিত নয়।"
          items={beginnerEssentials}
          themeClass="border-lime-200 text-lime-900"
        />
      </div>
    </main>
  );
}
