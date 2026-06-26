import Link from "next/link";
import { Wind, BookOpenText, Music2 } from "lucide-react";

export default function MainHomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,_#fff7ed_0%,_#fef3c7_35%,_#fefce8_70%)] text-stone-900">
      <div className="relative mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <header className="rounded-3xl border border-amber-200 bg-white/90 p-6 shadow md:p-8">
          <h1 className="text-3xl font-bold text-amber-950 md:text-4xl">বাঁশি শেখার লেভেল নির্বাচন করুন</h1>
          <p className="mt-2 text-stone-700">শুধু শেখার জন্য প্রয়োজনীয় ধাপ: Beginner → Standard → Advanced</p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Link href="/beginner" className="rounded-2xl border border-lime-200 bg-white p-5 shadow-sm hover:bg-lime-50">
            <Wind className="h-6 w-6 text-lime-700" />
            <h2 className="mt-2 text-lg font-semibold text-lime-900">Beginner</h2>
            <p className="mt-1 text-sm text-stone-700">ফিঙ্গারিং, ফুঁ, টোন, সর্গম ভিত্তি</p>
          </Link>

          <Link href="/standard" className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm hover:bg-amber-50">
            <BookOpenText className="h-6 w-6 text-amber-700" />
            <h2 className="mt-2 text-lg font-semibold text-amber-900">Standard</h2>
            <p className="mt-1 text-sm text-stone-700">পালটা, সারগাম, লয়-গতি কন্ট্রোল</p>
          </Link>

          <Link href="/advanced" className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm hover:bg-orange-50">
            <Music2 className="h-6 w-6 text-orange-700" />
            <h2 className="mt-2 text-lg font-semibold text-orange-900">Advanced</h2>
            <p className="mt-1 text-sm text-stone-700">রাগ, পারফরম্যান্স, পূর্ণ নোটেশন অনুশীলন</p>
          </Link>
        </section>
      </div>
    </main>
  );
}
