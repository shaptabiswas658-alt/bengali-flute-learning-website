"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

type SyncResponse = {
  ok: boolean;
  message: string;
  inserted?: number;
  scannedChannels?: number;
  error?: string;
};

export function YouTubeSyncButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<SyncResponse | null>(null);

  const runSync = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/youtube-sync", { method: "POST" });
      const data = (await res.json()) as SyncResponse;
      setStatus(data);
    } catch {
      setStatus({ ok: false, message: "Sync request ব্যর্থ হয়েছে।" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4 rounded-xl border border-orange-100 bg-orange-50/70 p-3">
      <button
        type="button"
        onClick={runSync}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full bg-orange-700 px-4 py-2 text-sm font-medium text-white hover:bg-orange-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        {loading ? "YouTube sync চলছে..." : "YouTube থেকে গান/নোটেশন সংগ্রহ করুন"}
      </button>

      <p className="mt-2 text-xs text-slate-600">
        চ্যানেল: Bongshi dhoni, Selim Flute Academy, Flutist Sabbir, Newaz Flute And Dotara, SM Flute, Anindya Joy, Saaz Band,
        Chayan Flute
      </p>
      <p className="mt-1 text-xs text-slate-500">স্বয়ংক্রিয় sync চালাতে server env-এ <code>YOUTUBE_API_KEY</code> থাকতে হবে।</p>

      {status ? (
        <p className={`mt-2 text-sm ${status.ok ? "text-emerald-700" : "text-rose-700"}`}>
          {status.message}
          {typeof status.inserted === "number" ? ` | সংগ্রহ: ${status.inserted}` : ""}
          {typeof status.scannedChannels === "number" ? ` | চ্যানেল: ${status.scannedChannels}` : ""}
        </p>
      ) : null}
    </div>
  );
}
