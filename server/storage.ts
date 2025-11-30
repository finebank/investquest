import { 
  users, 
  achievements, 
  userAchievements, 
  gameHistory, 
  categoryStats,
  leaderboardEntries,
  tournaments,
  tournamentParticipants,
  seasons,
  seasonRankings,
  type User, 
  type InsertUser,
  type Achievement,
  type UserAchievement,
  type GameHistory,
  type CategoryStat,
  type LeaderboardEntry,
  type Tournament,
  type TournamentParticipant,
  type Season,
  type SeasonRanking
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, gte, lte } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]>;
  unlockAchievement(userId: number, achievementId: number): Promise<UserAchievement>;
  updateAchievementProgress(userId: number, achievementId: number, progress: number): Promise<void>;
  
  recordGameHistory(game: Omit<GameHistory, 'id' | 'playedAt'>): Promise<GameHistory>;
  getUserGameHistory(userId: number, limit?: number): Promise<GameHistory[]>;
  
  getCategoryStats(userId: number): Promise<CategoryStat[]>;
  updateCategoryStats(userId: number, category: string, correct: boolean, timeSeconds: number): Promise<void>;
  
  getLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
  updateLeaderboard(entry: Omit<LeaderboardEntry, 'id' | 'lastUpdated'>): Promise<LeaderboardEntry>;
  
  getActiveTournaments(): Promise<Tournament[]>;
  getTournament(id: number): Promise<Tournament | undefined>;
  joinTournament(tournamentId: number, userId: number): Promise<TournamentParticipant>;
  updateTournamentScore(tournamentId: number, userId: number, score: number): Promise<void>;
  getTournamentLeaderboard(tournamentId: number): Promise<TournamentParticipant[]>;
  
  getCurrentSeason(): Promise<Season | undefined>;
  getSeasonRankings(seasonId: number, limit?: number): Promise<(SeasonRanking & { user: User })[]>;
  updateSeasonRanking(seasonId: number, userId: number, score: number): Promise<void>;

  usePowerUp(userId: number, powerUpType: 'skip' | 'doublePoints' | 'extraTime'): Promise<boolean>;
  addPowerUp(userId: number, powerUpType: 'skip' | 'doublePoints' | 'extraTime', amount: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      displayName: insertUser.displayName || insertUser.username,
    }).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAchievements(): Promise<Achievement[]> {
    return db.select().from(achievements);
  }

  async getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const results = await db
      .select({
        id: userAchievements.id,
        odaUserId: userAchievements.userId,
        achievementId: userAchievements.achievementId,
        unlockedAt: userAchievements.unlockedAt,
        progress: userAchievements.progress,
        achievement: achievements,
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId));
    
    return results.map(r => ({
      id: r.id,
      userId: r.odaUserId,
      achievementId: r.achievementId,
      unlockedAt: r.unlockedAt,
      progress: r.progress,
      achievement: r.achievement,
    }));
  }

  async unlockAchievement(userId: number, achievementId: number): Promise<UserAchievement> {
    const [existing] = await db.select()
      .from(userAchievements)
      .where(and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementId, achievementId)
      ));
    
    if (existing) {
      return existing;
    }

    const [achievement] = await db.insert(userAchievements)
      .values({ userId, achievementId, progress: 100 })
      .returning();
    return achievement;
  }

  async updateAchievementProgress(userId: number, achievementId: number, progress: number): Promise<void> {
    const [existing] = await db.select()
      .from(userAchievements)
      .where(and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementId, achievementId)
      ));

    if (existing) {
      await db.update(userAchievements)
        .set({ progress })
        .where(eq(userAchievements.id, existing.id));
    } else {
      await db.insert(userAchievements)
        .values({ userId, achievementId, progress });
    }
  }

  async recordGameHistory(game: Omit<GameHistory, 'id' | 'playedAt'>): Promise<GameHistory> {
    const [record] = await db.insert(gameHistory)
      .values(game)
      .returning();
    return record;
  }

  async getUserGameHistory(userId: number, limit = 20): Promise<GameHistory[]> {
    return db.select()
      .from(gameHistory)
      .where(eq(gameHistory.odaUserId, userId))
      .orderBy(desc(gameHistory.playedAt))
      .limit(limit);
  }

  async getCategoryStats(userId: number): Promise<CategoryStat[]> {
    return db.select()
      .from(categoryStats)
      .where(eq(categoryStats.userId, userId));
  }

  async updateCategoryStats(userId: number, category: string, correct: boolean, timeSeconds: number): Promise<void> {
    const [existing] = await db.select()
      .from(categoryStats)
      .where(and(
        eq(categoryStats.userId, userId),
        eq(categoryStats.category, category)
      ));

    if (existing) {
      const newTotal = (existing.questionsAnswered || 0) + 1;
      const newCorrect = (existing.correctAnswers || 0) + (correct ? 1 : 0);
      const avgTime = existing.averageTimeSeconds || 0;
      const newAvgTime = ((avgTime * (existing.questionsAnswered || 0)) + timeSeconds) / newTotal;

      await db.update(categoryStats)
        .set({
          questionsAnswered: newTotal,
          correctAnswers: newCorrect,
          averageTimeSeconds: newAvgTime,
        })
        .where(eq(categoryStats.id, existing.id));
    } else {
      await db.insert(categoryStats)
        .values({
          userId,
          category,
          questionsAnswered: 1,
          correctAnswers: correct ? 1 : 0,
          averageTimeSeconds: timeSeconds,
        });
    }
  }

  async getLeaderboard(limit = 100): Promise<LeaderboardEntry[]> {
    return db.select()
      .from(leaderboardEntries)
      .orderBy(desc(leaderboardEntries.score))
      .limit(limit);
  }

  async updateLeaderboard(entry: Omit<LeaderboardEntry, 'id' | 'lastUpdated'>): Promise<LeaderboardEntry> {
    if (entry.userId) {
      const [existing] = await db.select()
        .from(leaderboardEntries)
        .where(eq(leaderboardEntries.userId, entry.userId));

      if (existing) {
        const [updated] = await db.update(leaderboardEntries)
          .set({
            score: (existing.score || 0) + entry.score,
            gamesPlayed: (existing.gamesPlayed || 0) + 1,
            gamesWon: (existing.gamesWon || 0) + (entry.gamesWon || 0),
            bestStreak: Math.max(existing.bestStreak || 0, entry.bestStreak || 0),
            accuracy: entry.accuracy,
            lastUpdated: new Date(),
          })
          .where(eq(leaderboardEntries.id, existing.id))
          .returning();
        return updated;
      }
    }

    const [newEntry] = await db.insert(leaderboardEntries)
      .values(entry)
      .returning();
    return newEntry;
  }

  async getActiveTournaments(): Promise<Tournament[]> {
    const now = new Date();
    return db.select()
      .from(tournaments)
      .where(and(
        gte(tournaments.endDate, now),
        lte(tournaments.startDate, now)
      ));
  }

  async getTournament(id: number): Promise<Tournament | undefined> {
    const [tournament] = await db.select()
      .from(tournaments)
      .where(eq(tournaments.id, id));
    return tournament;
  }

  async joinTournament(tournamentId: number, userId: number): Promise<TournamentParticipant> {
    const [existing] = await db.select()
      .from(tournamentParticipants)
      .where(and(
        eq(tournamentParticipants.tournamentId, tournamentId),
        eq(tournamentParticipants.userId, userId)
      ));

    if (existing) {
      return existing;
    }

    const [participant] = await db.insert(tournamentParticipants)
      .values({ tournamentId, userId })
      .returning();
    return participant;
  }

  async updateTournamentScore(tournamentId: number, userId: number, score: number): Promise<void> {
    const [existing] = await db.select()
      .from(tournamentParticipants)
      .where(and(
        eq(tournamentParticipants.tournamentId, tournamentId),
        eq(tournamentParticipants.userId, userId)
      ));

    if (existing) {
      await db.update(tournamentParticipants)
        .set({
          score: (existing.score || 0) + score,
          gamesPlayed: (existing.gamesPlayed || 0) + 1,
        })
        .where(eq(tournamentParticipants.id, existing.id));
    }
  }

  async getTournamentLeaderboard(tournamentId: number): Promise<TournamentParticipant[]> {
    return db.select()
      .from(tournamentParticipants)
      .where(eq(tournamentParticipants.tournamentId, tournamentId))
      .orderBy(desc(tournamentParticipants.score));
  }

  async getCurrentSeason(): Promise<Season | undefined> {
    const now = new Date();
    const [season] = await db.select()
      .from(seasons)
      .where(and(
        lte(seasons.startDate, now),
        gte(seasons.endDate, now),
        eq(seasons.status, 'active')
      ));
    return season;
  }

  async getSeasonRankings(seasonId: number, limit = 100): Promise<(SeasonRanking & { user: User })[]> {
    const results = await db
      .select({
        id: seasonRankings.id,
        seasonId: seasonRankings.seasonId,
        userId: seasonRankings.userId,
        totalScore: seasonRankings.totalScore,
        gamesPlayed: seasonRankings.gamesPlayed,
        rank: seasonRankings.rank,
        tier: seasonRankings.tier,
        user: users,
      })
      .from(seasonRankings)
      .innerJoin(users, eq(seasonRankings.userId, users.id))
      .where(eq(seasonRankings.seasonId, seasonId))
      .orderBy(desc(seasonRankings.totalScore))
      .limit(limit);

    return results.map(r => ({
      ...r,
      user: r.user,
    }));
  }

  async updateSeasonRanking(seasonId: number, userId: number, score: number): Promise<void> {
    const [existing] = await db.select()
      .from(seasonRankings)
      .where(and(
        eq(seasonRankings.seasonId, seasonId),
        eq(seasonRankings.userId, userId)
      ));

    if (existing) {
      const newTotal = (existing.totalScore || 0) + score;
      let tier = 'bronze';
      if (newTotal >= 50000) tier = 'diamond';
      else if (newTotal >= 25000) tier = 'platinum';
      else if (newTotal >= 10000) tier = 'gold';
      else if (newTotal >= 5000) tier = 'silver';

      await db.update(seasonRankings)
        .set({
          totalScore: newTotal,
          gamesPlayed: (existing.gamesPlayed || 0) + 1,
          tier,
        })
        .where(eq(seasonRankings.id, existing.id));
    } else {
      await db.insert(seasonRankings)
        .values({
          seasonId,
          userId,
          totalScore: score,
          gamesPlayed: 1,
          tier: 'bronze',
        });
    }
  }

  async usePowerUp(userId: number, powerUpType: 'skip' | 'doublePoints' | 'extraTime'): Promise<boolean> {
    const user = await this.getUser(userId);
    if (!user) return false;

    const fieldMap = {
      skip: 'skipPowerUps',
      doublePoints: 'doublePointsPowerUps',
      extraTime: 'extraTimePowerUps',
    } as const;

    const field = fieldMap[powerUpType];
    const currentCount = user[field] || 0;

    if (currentCount <= 0) return false;

    await db.update(users)
      .set({ [field]: currentCount - 1 })
      .where(eq(users.id, userId));
    
    return true;
  }

  async addPowerUp(userId: number, powerUpType: 'skip' | 'doublePoints' | 'extraTime', amount: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;

    const fieldMap = {
      skip: 'skipPowerUps',
      doublePoints: 'doublePointsPowerUps',
      extraTime: 'extraTimePowerUps',
    } as const;

    const field = fieldMap[powerUpType];
    const currentCount = user[field] || 0;

    await db.update(users)
      .set({ [field]: currentCount + amount })
      .where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
