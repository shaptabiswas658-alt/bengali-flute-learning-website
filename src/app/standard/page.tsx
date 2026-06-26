import { BookOpenText } from "lucide-react";
import { ensureSeedData, getStandardPatterns } from "@/db/seed";
import { AmbientSoundPlayer } from "@/components/nature-sound-player";
import { SiteTopbar } from "@/components/site-topbar";
import { EssentialItemsSection } from "@/components/essential-items";

export const dynamic = "force-dynamic";

const standardEssentials = [
  {
    heading: "Alankar Depth",
    details: "দ্বিস্বর, ত্রিস্বর, চতুর্স্বর, জন্তা ও বক্র চলনে সমান টোন এবং সঠিক আঙুল নিয়ন্ত্রণ।",
  },
  {
    heading: "Tempo Ladder",
    details: "50→60→70→80 BPM স্কেলিং; ভুল হলে তৎক্ষণাৎ ধীর গতিতে ফিরে সঠিকতা নিশ্চিত করুন।",
  },
  {
    heading: "Rhythmic Accuracy",
    details: "কেহারবা, দাদরা, তিনতাল-ভিত্তিক phrase landing on sam অনুশীলন।",
  },
  {
    heading: "Breath Phrasing",
    details: "দীর্ঘ ফ্রেজকে logical breath points-এ ভাগ করুন, tone break ছাড়া phrase সম্পন্ন করুন।",
  },
  {
    heading: "Pattern Memory",
    details: "প্রতিটি পালটা মুখস্থ করে without looking বাজানো—performance readiness-এর ভিত্তি।",
  },
  {
    heading: "Weekly Assessment",
    details: "প্রতি সপ্তাহে একটি recorded practice session: timing, pitch, clarity স্কোরিং করুন।",
  },
];

export default async function StandardPage() {
  await ensureSeedData();
  const standardPatterns = await getStandardPatterns();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,_#fffbeb_0%,_#fef3c7_35%,_#fff7ed_70%)] text-stone-900">
      <AmbientSoundPlayer
        storageKey="sound-standard-birds"
        primaryAudioUrl="https://orangefreesounds.com/wp-content/uploads/2022/05/Birds-and-water-sounds.mp3"
        primaryVolume={0.14}
        labelOnBn="প্রকৃতির পাখির শব্দ চালু"
        labelOffBn="প্রকৃতির পাখির শব্দ বন্ধ"
        descriptionBn="Standard ব্যাকগ্রাউন্ড: wild natural birds + water ambience।"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <SiteTopbar />

        <header className="rounded-3xl border border-amber-200 bg-white/85 p-6 shadow-xl backdrop-blur md:p-8">
          <h1 className="text-2xl font-bold text-amber-900 md:text-4xl">Standard Homepage: সারগাম অনুশীলন</h1>
          <p className="mt-2 text-stone-700">এই স্তরে আপনার লক্ষ্য হবে গতি, নিখুঁততা, এবং রিদমিক কন্ট্রোলের পেশাদার উন্নয়ন।</p>
        </header>

        <section className="mt-8 rounded-3xl border border-amber-200 bg-white/90 p-6 shadow-lg md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <BookOpenText className="h-6 w-6 text-amber-700" />
            <h2 className="text-xl font-semibold text-amber-900 md:text-2xl">ইতিহাসভিত্তিক পালটা ও সারগাম</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {standardPatterns.map((pattern) => (
              <article key={pattern.id} className="rounded-2xl border border-amber-200 bg-gradient-to-br from-white to-amber-50 p-4">
                <h3 className="text-lg font-semibold text-amber-900">{pattern.titleBn}</h3>
                <p className="mt-2 text-sm text-stone-700">{pattern.historyBn}</p>
                <p className="mt-3 rounded-lg bg-white p-2 text-sm font-medium text-amber-800">{pattern.sargamPattern}</p>
                <p className="mt-2 text-sm text-stone-600">{pattern.tempoGuideBn}</p>
              </article>
            ))}
          </div>
        </section>

        <EssentialItemsSection
          title="Standard Essential Items"
          subtitle="এই দক্ষতাগুলো আয়ত্ত হলে আপনি Advanced লেভেলের জন্য প্রস্তুত।"
          items={standardEssentials}
          themeClass="border-amber-200 text-amber-900"
        />
      </div>
    </main>
  );
}
