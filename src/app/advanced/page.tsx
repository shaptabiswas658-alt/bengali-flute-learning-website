import { Music } from "lucide-react";
import {
  ensureSeedData,
  getAdvancedLessons,
  getAdvancedRagaPractices,
  getAdvancedSongs,
} from "@/db/seed";
import { AmbientSoundPlayer } from "@/components/nature-sound-player";
import { AdvancedSongList } from "@/components/advanced-song-list";
import { SiteTopbar } from "@/components/site-topbar";
import { EssentialItemsSection } from "@/components/essential-items";

export const dynamic = "force-dynamic";

const advancedEssentials = [
  {
    heading: "Raga Identity Mastery",
    details: "আরোহ-অবরোহ, পাকড়, বাদী-সমবাদী, phrase-ending discipline ঠিক রেখে রাগচরিত্র স্থির করুন।",
  },
  {
    heading: "Advanced Ornamentation",
    details: "মীড়, গমক, আন্দোলন, মুরকি context অনুযায়ী ব্যবহার; over-ornamentation এড়িয়ে melodic clarity রাখুন।",
  },
  {
    heading: "Performance Architecture",
    details: "Alaap → Theme → Variation → Fast Run → Resolve; প্রতিটি section তালে balanced রাখুন।",
  },
  {
    heading: "YouTube Notation Intelligence",
    details: "চ্যানেল ফিল্টার ব্যবহার করে একই গানের একাধিক tutorial compare করুন এবং best phrasing বেছে নিন।",
  },
  {
    heading: "Recording & Critique",
    details: "সাপ্তাহিক full take রেকর্ড করে pitch, timing, breath noise, tone color আলাদা করে মূল্যায়ন করুন।",
  },
  {
    heading: "Stage Readiness",
    details: "১০-১৫ মিনিটের curated set বানিয়ে continuous performance drill করুন।",
  },
];

export default async function AdvancedPage() {
  await ensureSeedData();

  const [advancedLessons, advancedRagas, advancedSongs] = await Promise.all([
    getAdvancedLessons(),
    getAdvancedRagaPractices(),
    getAdvancedSongs(),
  ]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,_#fff7ed_0%,_#fed7aa_35%,_#fffbeb_75%)] text-stone-900">
      <AmbientSoundPlayer
        storageKey="sound-advanced-raag-tanpura"
        primaryAudioUrl="https://archive.org/download/dni.ncaa.ICCR-1839-AC/ICCR-1839-AC_SIDE_A.mp3"
        secondaryAudioUrl="https://archive.org/download/dni.ncaa.SF-SFS000108-SP/SF-SFS000108-SP_SIDE_A-LEFT.mp3"
        primaryVolume={0.1}
        secondaryVolume={0.08}
        labelOnBn="রাগ + তানপুরা চালু"
        labelOffBn="রাগ + তানপুরা বন্ধ"
        descriptionBn="Advanced ব্যাকগ্রাউন্ড: রাগধর্মী ফ্লুট + তানপুরা ড্রোন (মিশ্র সাউন্ড)।"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <SiteTopbar />

        <header className="rounded-3xl border border-orange-200 bg-white/85 p-6 shadow-xl backdrop-blur md:p-8">
          <h1 className="text-2xl font-bold text-orange-900 md:text-4xl">Advanced Homepage: রাগ, কৌশল ও গান</h1>
          <p className="mt-2 text-stone-700">এই স্তরটি performance-ready mastery এর জন্য—রাগভিত্তিক expression, stage polish, এবং notation intelligence।</p>
        </header>

        <section className="mt-8 rounded-3xl border border-orange-200 bg-white/90 p-6 shadow-lg md:p-8">
          <div className="mb-4 flex items-center gap-3">
            <Music className="h-6 w-6 text-orange-700" />
            <h2 className="text-xl font-semibold text-orange-900 md:text-2xl">Advanced Information</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {advancedLessons.map((lesson) => (
              <article key={lesson.id} className="rounded-2xl border border-orange-200 bg-gradient-to-br from-white to-orange-50 p-4">
                <h3 className="text-lg font-semibold text-orange-900">{lesson.titleBn}</h3>
                <p className="mt-2 text-sm text-stone-700">{lesson.descriptionBn}</p>
                <p className="mt-2 text-sm text-stone-700">
                  <span className="font-semibold text-orange-800">ফোকাস:</span> {lesson.focusNotes}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-orange-200 bg-white/90 p-6 shadow-lg md:p-8">
          <h2 className="text-xl font-semibold text-orange-900 md:text-2xl">Advanced Raga Practice</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {advancedRagas.map((raga) => (
              <article key={raga.id} className="rounded-2xl border border-orange-200 bg-white p-4">
                <h3 className="text-lg font-semibold text-orange-900">{raga.ragaNameBn}</h3>
                <p className="mt-1 text-xs text-orange-700">{raga.thaatBn} • সময়: {raga.timeBn}</p>
                <p className="mt-2 text-sm text-stone-700"><span className="font-semibold text-orange-800">আরোহ:</span> {raga.arohBn}</p>
                <p className="text-sm text-stone-700"><span className="font-semibold text-orange-800">অবরোহ:</span> {raga.avrohBn}</p>
                <p className="text-sm text-stone-700"><span className="font-semibold text-orange-800">পাকড়:</span> {raga.pakadBn}</p>
              </article>
            ))}
          </div>
        </section>

        <EssentialItemsSection
          title="Advanced Essential Items"
          subtitle="Professional flute performer হিসেবে প্রস্তুত হতে এই checklist সম্পূর্ণ করতে হবে।"
          items={advancedEssentials}
          themeClass="border-orange-200 text-orange-900"
        />

        <section className="mt-8 rounded-3xl border border-orange-200 bg-white/90 p-6 shadow-lg md:p-8">
          <h2 className="text-xl font-semibold text-orange-900 md:text-2xl">YouTube Songs & Full Notation</h2>
          <AdvancedSongList songs={advancedSongs} />
        </section>
      </div>
    </main>
  );
}
