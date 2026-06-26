import { db } from "@/db";
import { songNotations } from "@/db/schema";
import { sql } from "drizzle-orm";

type YouTubeSearchItem = {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    description?: string;
    channelTitle?: string;
  };
};

type YouTubeVideoItem = {
  id?: string;
  snippet?: {
    title?: string;
    description?: string;
    channelTitle?: string;
  };
  statistics?: {
    viewCount?: string;
  };
};

const TARGET_CHANNELS = [
  "Bongshi dhoni",
  "Selim Flute Academy",
  "Flutist Sabbir",
  "Newaz Flute And Dotara",
  "SM Flute",
  "Anindya Joy",
  "Saaz Band",
  "Chayan Flute",
] as const;

const SEARCH_KEYWORDS = "flute bansuri notation sargam bangla";

function isDisallowedVideo(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  return /(\bcover\b|flute\s*cover|bansuri\s*cover|instrumental\s*cover|কভার|ফ্লুট\s*কভার|বাঁশি\s*কভার|\breview\b|reaction|unboxing|comparison|vs\b|shorts?\b)/i.test(
    text,
  );
}

function isTutorialVideo(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();

  const hasFluteContext = /(flute|bansuri|bansi|bongshi|বাঁশি|ফ্লুট)/i.test(text);
  const hasTutorialIntent = /(tutorial|lesson|how to|learn|notation|sargam|class|training|practice|শেখা|টিউটোরিয়াল|সারগাম|নোটেশন)/i.test(
    text,
  );

  return hasFluteContext && hasTutorialIntent;
}

function normalizeSongTitle(raw: string) {
  return raw
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/official|tutorial|notation|sargam|bansuri|flute|cover|lesson|academy|channel/gi, " ")
    .replace(/[|:,_\-–—]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractNotation(description: string) {
  const lines = description.split("\n").map((line) => line.trim());
  const notationLines = lines.filter((line) => /\b(sa|re|ga|ma|pa|dha|ni|s')\b/i.test(line));

  if (notationLines.length === 0) {
    return "ভিডিওর বর্ণনায় পূর্ণ নোটেশন উল্লেখ নেই। YouTube ভিডিও দেখে ধাপে ধাপে তুলে নিন।";
  }

  return notationLines.slice(0, 8).join("\n");
}

async function fetchChannelId(apiKey: string, channelName: string) {
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "channel");
  url.searchParams.set("q", channelName);
  url.searchParams.set("maxResults", "5");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = (await res.json()) as { items?: Array<{ id?: { channelId?: string } }> };
  return data.items?.[0]?.id?.channelId ?? null;
}

async function fetchChannelVideos(apiKey: string, channelId: string, pages = 5) {
  const allVideoIds: string[] = [];
  let pageToken: string | undefined;

  for (let i = 0; i < pages; i += 1) {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("channelId", channelId);
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("q", SEARCH_KEYWORDS);
    url.searchParams.set("order", "relevance");
    url.searchParams.set("key", apiKey);
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url);
    if (!res.ok) break;

    const data = (await res.json()) as { items?: YouTubeSearchItem[]; nextPageToken?: string };
    const videoIds =
      data.items
        ?.map((item) => item.id?.videoId)
        .filter((id): id is string => Boolean(id))
        .filter((id, idx, arr) => arr.indexOf(id) === idx) ?? [];

    allVideoIds.push(...videoIds);
    if (!data.nextPageToken) break;
    pageToken = data.nextPageToken;
  }

  return allVideoIds.filter((id, idx, arr) => arr.indexOf(id) === idx);
}

async function fetchVideoDetails(apiKey: string, videoIds: string[]) {
  const out: YouTubeVideoItem[] = [];

  for (let i = 0; i < videoIds.length; i += 50) {
    const chunk = videoIds.slice(i, i + 50);
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "snippet,statistics");
    url.searchParams.set("id", chunk.join(","));
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("key", apiKey);

    const res = await fetch(url);
    if (!res.ok) continue;

    const data = (await res.json()) as { items?: YouTubeVideoItem[] };
    out.push(...(data.items ?? []));
  }

  return out;
}

export async function syncYouTubeSongsFromChannels() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      message: "YOUTUBE_API_KEY পাওয়া যায়নি।",
      inserted: 0,
      scannedChannels: 0,
    };
  }

  const allVideos: YouTubeVideoItem[] = [];

  for (const channelName of TARGET_CHANNELS) {
    const channelId = await fetchChannelId(apiKey, channelName);
    if (!channelId) continue;

    const ids = await fetchChannelVideos(apiKey, channelId, 6);
    if (ids.length === 0) continue;

    const details = await fetchVideoDetails(apiKey, ids);
    const filtered = details.filter((video) =>
      video.snippet?.channelTitle?.toLowerCase().includes(channelName.toLowerCase().split(" ")[0] ?? ""),
    );

    allVideos.push(...(filtered.length > 0 ? filtered : details));
  }

  const byNormalizedTitle = new Map<
    string,
    {
      title: string;
      videoId: string;
      channel: string;
      views: number;
      description: string;
    }
  >();

  for (const v of allVideos) {
    const title = v.snippet?.title?.trim();
    const description = v.snippet?.description?.trim() ?? "";
    const videoId = v.id?.trim();
    if (!title || !videoId) continue;

    if (isDisallowedVideo(title, description)) {
      continue;
    }

    if (!isTutorialVideo(title, description)) {
      continue;
    }

    const views = Number.parseInt(v.statistics?.viewCount ?? "0", 10) || 0;
    const normalized = normalizeSongTitle(title);
    if (!normalized) continue;

    const current = byNormalizedTitle.get(normalized);
    if (!current || views > current.views) {
      byNormalizedTitle.set(normalized, {
        title,
        videoId,
        channel: v.snippet?.channelTitle ?? "Unknown Channel",
        views,
        description: v.snippet?.description ?? "",
      });
    }
  }

  const rows = [...byNormalizedTitle.values()].map((item, idx) => ({
    titleBn: item.title,
    artistBn: "YouTube সংগ্রহ",
    difficultyBn: "উন্নত",
    notationSargam: "ভিডিওর ভিত্তিতে অনুশীলন করুন (sa-re-ga-ma-pa-dha-ni-sa')",
    detailedNotationBn: extractNotation(item.description),
    fullSongBn: `${item.title}\n\nনোট: এটি YouTube ভিডিও থেকে স্বয়ংক্রিয়ভাবে সংগৃহীত। পূর্ণ গান ও নোটেশন ভিডিও দেখে তুলুন।`,
    rhythmGuideBn: "গানটি ধীর লয়ে ভেঙে অনুশীলন করে পরে আসল গতিতে যান।",
    sourceType: "youtube" as const,
    sourceName: item.channel,
    sourceUrl: `https://www.youtube.com/watch?v=${item.videoId}`,
    youtubeVideoId: item.videoId,
    youtubeViews: item.views,
    collectedFromChannel: item.channel,
    autoCollected: 1,
    createdAt: new Date(),
    __order: idx,
  }));

  if (rows.length === 0) {
    return {
      ok: false,
      message: "কোনো ভিডিও সংগ্রহ করা যায়নি।",
      inserted: 0,
      scannedChannels: TARGET_CHANNELS.length,
    };
  }

  await db
    .insert(songNotations)
    .values(rows.map(({ __order: _drop, ...rest }) => rest))
    .onConflictDoUpdate({
      target: songNotations.sourceUrl,
      set: {
        titleBn: sql`excluded.title_bn`,
        artistBn: sql`excluded.artist_bn`,
        difficultyBn: sql`excluded.difficulty_bn`,
        notationSargam: sql`excluded.notation_sargam`,
        detailedNotationBn: sql`excluded.detailed_notation_bn`,
        fullSongBn: sql`excluded.full_song_bn`,
        rhythmGuideBn: sql`excluded.rhythm_guide_bn`,
        sourceType: sql`excluded.source_type`,
        sourceName: sql`excluded.source_name`,
        youtubeVideoId: sql`excluded.youtube_video_id`,
        youtubeViews: sql`excluded.youtube_views`,
        collectedFromChannel: sql`excluded.collected_from_channel`,
        autoCollected: sql`excluded.auto_collected`,
      },
    });

  return {
    ok: true,
    message: "YouTube থেকে গান সংগ্রহ সম্পন্ন হয়েছে।",
    inserted: rows.length,
    scannedChannels: TARGET_CHANNELS.length,
  };
}
