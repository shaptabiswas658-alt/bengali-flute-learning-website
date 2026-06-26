import Link from "next/link";

export function SiteTopbar({ showBrand = true }: { showBrand?: boolean }) {
  return (
    <header className="mb-6 rounded-2xl border border-amber-200/70 bg-amber-50/80 p-3 shadow-sm backdrop-blur md:mb-8 md:p-4">
      <nav className="flex flex-wrap items-center justify-between gap-3">
        {showBrand ? (
          <Link href="/" className="text-sm font-bold text-amber-900 md:text-base">
            বাঁশির পাঠশালা
          </Link>
        ) : (
          <div />
        )}

        <div className="flex flex-wrap gap-2 text-xs md:text-sm">
          <Link href="/beginner" className="rounded-full bg-lime-100 px-3 py-1 font-medium text-lime-900 hover:bg-lime-200">
            Beginner
          </Link>
          <Link href="/standard" className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-900 hover:bg-amber-200">
            Standard
          </Link>
          <Link href="/advanced" className="rounded-full bg-orange-100 px-3 py-1 font-medium text-orange-900 hover:bg-orange-200">
            Advanced
          </Link>
        </div>
      </nav>
    </header>
  );
}
