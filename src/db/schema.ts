import { integer, pgEnum, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const lessonLevelEnum = pgEnum("lesson_level", ["beginner", "standard", "advanced"]);
export const sourceTypeEnum = pgEnum("source_type", ["database", "youtube", "website"]);

export const lessons = pgTable(
  "lessons",
  {
    id: serial("id").primaryKey(),
    level: lessonLevelEnum("level").notNull(),
    titleBn: text("title_bn").notNull(),
    descriptionBn: text("description_bn").notNull(),
    focusNotes: text("focus_notes").notNull(),
    animationHintBn: text("animation_hint_bn").notNull(),
    gifUrl: text("gif_url"),
    orderIndex: integer("order_index").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("lessons_level_order_unique").on(table.level, table.orderIndex)],
);

export const practicePatterns = pgTable(
  "practice_patterns",
  {
    id: serial("id").primaryKey(),
    titleBn: text("title_bn").notNull(),
    historyBn: text("history_bn").notNull(),
    sargamPattern: text("sargam_pattern").notNull(),
    tempoGuideBn: text("tempo_guide_bn").notNull(),
    orderIndex: integer("order_index").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("practice_patterns_order_unique").on(table.orderIndex)],
);

export const songNotations = pgTable(
  "song_notations",
  {
    id: serial("id").primaryKey(),
    titleBn: text("title_bn").notNull(),
    artistBn: text("artist_bn").notNull(),
    difficultyBn: text("difficulty_bn").notNull(),
    notationSargam: text("notation_sargam").notNull(),
    detailedNotationBn: text("detailed_notation_bn").notNull().default(""),
    fullSongBn: text("full_song_bn").notNull().default(""),
    rhythmGuideBn: text("rhythm_guide_bn").notNull(),
    sourceType: sourceTypeEnum("source_type").notNull(),
    sourceName: text("source_name").notNull(),
    sourceUrl: text("source_url").notNull(),
    youtubeVideoId: text("youtube_video_id"),
    youtubeViews: integer("youtube_views").notNull().default(0),
    collectedFromChannel: text("collected_from_channel").notNull().default(""),
    autoCollected: integer("auto_collected").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("song_notations_title_artist_unique").on(table.titleBn, table.artistBn),
    uniqueIndex("song_notations_source_url_unique").on(table.sourceUrl),
  ],
);

export const ragaPractices = pgTable(
  "raga_practices",
  {
    id: serial("id").primaryKey(),
    ragaNameBn: text("raga_name_bn").notNull(),
    thaatBn: text("thaat_bn").notNull(),
    arohBn: text("aroh_bn").notNull(),
    avrohBn: text("avroh_bn").notNull(),
    pakadBn: text("pakad_bn").notNull(),
    vadiSamvadiBn: text("vadi_samvadi_bn").notNull(),
    practiceMethodBn: text("practice_method_bn").notNull(),
    timeBn: text("time_bn").notNull(),
    sourceBookBn: text("source_book_bn").notNull(),
    orderIndex: integer("order_index").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("raga_practices_order_unique").on(table.orderIndex)],
);

export type Lesson = typeof lessons.$inferSelect;
export type PracticePattern = typeof practicePatterns.$inferSelect;
export type SongNotation = typeof songNotations.$inferSelect;
export type RagaPractice = typeof ragaPractices.$inferSelect;
