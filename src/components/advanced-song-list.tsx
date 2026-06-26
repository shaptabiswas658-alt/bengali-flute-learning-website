"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Filter } from "lucide-react";

type SongItem = {
  id: number;
  titleBn: string;
  artistBn: string;
  difficultyBn: string;
  notationSargam: string;
  detailedNotationBn: string;
  fullSongBn: string;
  rhythmGuideBn: string;
  sourceName: string;
  sourceUrl: string;
  youtubeViews?: number;
  collectedFromChannel?: string;
};



export function AdvancedSongList({ songs }: { songs: SongItem[] }) {
  const [openId, setOpenId] = useState<number | null>(songs[0]?.id ?? null);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

  const allChannels = useMemo(() => {
    const channels = songs
      .map((song) => song.collectedFromChannel || song.sourceName)
      .filter((channel): channel is string => Boolean(channel));

    return [...new Set(channels)].sort((a, b) => a.localeCompare(b));
  }, [songs]);

  const filteredSongs = useMemo(() => {
    if (selectedChannels.length === 0) {
      return [...songs];
    }

    return songs.filter((song) => {
      const channel = song.collectedFromChannel || song.sourceName;
      return selectedChannels.includes(channel);
    });
  }, [songs, selectedChannels]);



  const toggleChannel = (channel: string) => {
    setSelectedChannels((prev) => {
      if (prev.includes(channel)) {
        return prev.filter((c) => c !== channel);
      }
      return [...prev, channel];
    });
    setOpenId(null);
  };

  const clearFilters = () => {
    setSelectedChannels([]);
    setOpenId(songs[0]?.id ?? null);
  };

  return (
    <div className="space-y-3">
      <section className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-orange-900">
            <Filter className="h-4 w-4" /> চ্যানেল ফিল্টার
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full bg-white px-3 py-1 text-xs font-medium text-orange-700 hover:bg-orange-100"
          >
            সব চ্যানেল
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {allChannels.map((channel) => {
            const active = selectedChannels.includes(channel);

            return (
              <button
                key={channel}
                type="button"
                onClick={() => toggleChannel(channel)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  active
                    ? "bg-orange-700 text-white"
                    : "border border-orange-200 bg-white text-orange-800 hover:bg-orange-100"
                }`}
              >
                {channel}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-xs text-slate-600">
          {selectedChannels.length === 0
            ? `দেখানো হচ্ছে: সব চ্যানেল (${filteredSongs.length}টি গান)`
            : `নির্বাচিত চ্যানেল: ${selectedChannels.join(", ")} (${filteredSongs.length}টি গান)`}
        </p>


      </section>

      {filteredSongs.map((song) => {
        const isOpen = openId === song.id;

        return (
          <article key={song.id} className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setOpenId((prev) => (prev === song.id ? null : song.id))}
              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left hover:bg-orange-50/70"
            >
              <div>
                <p className="font-semibold text-orange-900">{song.titleBn}</p>
                <p className="text-xs text-slate-600">
                  {song.artistBn} • {song.difficultyBn} • {song.sourceName}
                  {song.youtubeViews ? ` • ${song.youtubeViews.toLocaleString("en-US")} views` : ""}
                </p>
              </div>
              {isOpen ? <ChevronUp className="h-5 w-5 text-orange-700" /> : <ChevronDown className="h-5 w-5 text-orange-700" />}
            </button>

            {isOpen ? (
              <div className="border-t border-orange-100 bg-orange-50/30 px-4 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-white p-3">
                    <h4 className="font-semibold text-orange-800">পুরো গানের লিরিক/টেক্সট</h4>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">{song.fullSongBn}</p>
                  </div>

                  <div className="rounded-xl bg-white p-3">
                    <h4 className="font-semibold text-orange-800">ফুল ফ্লুট নোটেশন</h4>
                    <p className="mt-2 text-sm text-slate-700">সংক্ষিপ্ত: {song.notationSargam}</p>
                    <p className="mt-2 whitespace-pre-line rounded-lg bg-orange-50 p-2 text-sm leading-relaxed text-slate-800">
                      {song.detailedNotationBn}
                    </p>
                    <p className="mt-2 text-xs text-slate-600">তাল/প্র্যাকটিস: {song.rhythmGuideBn}</p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-600">
                  নির্বাচিত সোর্স: {song.collectedFromChannel || song.sourceName}
                  {song.youtubeViews ? ` (Highest view: ${song.youtubeViews.toLocaleString("en-US")})` : ""}
                </p>

                <a
                  href={song.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800 hover:bg-orange-200"
                >
                  <ExternalLink className="h-4 w-4" /> YouTube: {song.sourceName}
                </a>
              </div>
            ) : null}
          </article>
        );
      })}

      {filteredSongs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-orange-200 bg-white p-4 text-sm text-slate-600">
          এই চ্যানেল ফিল্টারে কোনো গান পাওয়া যায়নি। অন্য চ্যানেল নির্বাচন করুন বা “সব চ্যানেল” চাপুন।
        </div>
      ) : null}
    </div>
  );
}
