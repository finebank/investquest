import { pgTable, text, serial, integer, boolean, timestamp, varchar, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  avatarColor: text("avatar_color").default("#3b82f6"),
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at").defaultNow(),
  totalGamesPlayed: integer("total_games_played").default(0),
  totalQuestionsAnswered: integer("total_questions_answered").default(0),
  totalCorrectAnswers: integer("total_correct_answers").default(0),
  totalScore: integer("total_score").default(0),
  highestStreak: integer("highest_streak").default(0),
  gamesWon: integer("games_won").default(0),
  skipPowerUps: integer("skip_power_ups").default(3),
  doublePointsPowerUps: integer("double_points_power_ups").default(2),
  extraTimePowerUps: integer("extra_time_power_ups").default(2),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(),
  requirement: integer("requirement").default(1),
  points: integer("points").default(10),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  progress: integer("progress").default(0),
});

export const gameHistory = pgTable("game_history", {
  id: serial("id").primaryKey(),
  odaUserId: integer("user_id").references(() => users.id),
visitorPlayerName: text("visitor_player_name"),
  gameMode: text("game_mode").notNull(),
  score: integer("score").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  bestStreak: integer("best_streak").default(0),
  difficulty: text("difficulty").notNull(),
  categories: text("categories").array(),
  duration: integer("duration"),
  playedAt: timestamp("played_at").defaultNow(),
  isWinner: boolean("is_winner").default(false),
  roomId: text("room_id"),
  placement: integer("placement"),
});

export const categoryStats = pgTable("category_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  category: text("category").notNull(),
  questionsAnswered: integer("questions_answered").default(0),
  correctAnswers: integer("correct_answers").default(0),
  averageTimeSeconds: real("average_time_seconds"),
});

export const leaderboardEntries = pgTable("leaderboard_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  playerName: text("player_name").notNull(),
  score: integer("score").notNull(),
  gamesPlayed: integer("games_played").default(1),
  gamesWon: integer("games_won").default(0),
  bestStreak: integer("best_streak").default(0),
  accuracy: real("accuracy").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").default("upcoming"),
  prizeDescription: text("prize_description"),
  maxParticipants: integer("max_participants").default(64),
  entryRequirement: integer("entry_requirement").default(0),
  categories: text("categories").array(),
  difficulty: text("difficulty"),
});

export const tournamentParticipants = pgTable("tournament_participants", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").notNull().references(() => tournaments.id),
  userId: integer("user_id").notNull().references(() => users.id),
  score: integer("score").default(0),
  gamesPlayed: integer("games_played").default(0),
  rank: integer("rank"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const seasons = pgTable("seasons", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").default("active"),
  rewards: json("rewards"),
});

export const seasonRankings = pgTable("season_rankings", {
  id: serial("id").primaryKey(),
  seasonId: integer("season_id").notNull().references(() => seasons.id),
  userId: integer("user_id").notNull().references(() => users.id),
  totalScore: integer("total_score").default(0),
  gamesPlayed: integer("games_played").default(0),
  rank: integer("rank"),
  tier: text("tier").default("bronze"),
});

export const usersRelations = relations(users, ({ many }) => ({
  achievements: many(userAchievements),
  gameHistory: many(gameHistory),
  categoryStats: many(categoryStats),
  tournamentParticipations: many(tournamentParticipants),
  seasonRankings: many(seasonRankings),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export const gameHistoryRelations = relations(gameHistory, ({ one }) => ({
  user: one(users, {
    fields: [gameHistory.odaUserId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  avatarColor: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  code: true,
  name: true,
  description: true,
  icon: true,
  category: true,
  requirement: true,
  points: true,
});

export const insertGameHistorySchema = createInsertSchema(gameHistory).omit({
  id: true,
  playedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type GameHistory = typeof gameHistory.$inferSelect;
export type CategoryStat = typeof categoryStats.$inferSelect;
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type Tournament = typeof tournaments.$inferSelect;
export type TournamentParticipant = typeof tournamentParticipants.$inferSelect;
export type Season = typeof seasons.$inferSelect;
export type SeasonRanking = typeof seasonRankings.$inferSelect;
