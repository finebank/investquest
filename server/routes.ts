import type { Express, Request, Response, NextFunction } from "express";
import { type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { gameManager } from "./gameManager";
import { questionBank } from "@shared/questions";
import { categoryLabels, difficultyLabels } from "@shared/trivia";
import { seedAchievements } from "./seedAchievements";
import bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

const SessionStore = MemoryStore(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await seedAchievements();

  app.use(
    session({
      store: new SessionStore({
        checkPeriod: 86400000,
      }),
      secret: process.env.SESSION_SECRET || "myinvest-trivia-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  gameManager.init(wss);

  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    next();
  };

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, displayName } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        displayName: displayName || username,
      });

      req.session.userId = user.id;

      const { password: _, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      await storage.updateUser(user.id, { lastLoginAt: new Date() });
      req.session.userId = user.id;

      const { password: _, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.json({ user: null });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.json({ user: null });
    }

    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  });

  app.get("/api/user/profile", requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const achievements = await storage.getUserAchievements(user.id);
    const categoryStats = await storage.getCategoryStats(user.id);
    const gameHistory = await storage.getUserGameHistory(user.id, 10);

    const { password: _, ...safeUser } = user;
    res.json({
      user: safeUser,
      achievements,
      categoryStats,
      recentGames: gameHistory,
    });
  });

  app.patch("/api/user/profile", requireAuth, async (req, res) => {
    const { displayName, avatarColor } = req.body;
    
    const updates: { displayName?: string; avatarColor?: string } = {};
    if (displayName) updates.displayName = displayName;
    if (avatarColor) updates.avatarColor = avatarColor;

    const user = await storage.updateUser(req.session.userId!, updates);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  });

  app.get("/api/achievements", async (_req, res) => {
    const achievements = await storage.getAchievements();
    res.json(achievements);
  });

  app.get("/api/user/achievements", requireAuth, async (req, res) => {
    const achievements = await storage.getUserAchievements(req.session.userId!);
    res.json(achievements);
  });

  app.post("/api/user/powerup/use", requireAuth, async (req, res) => {
    const { type } = req.body;
    
    if (!["skip", "doublePoints", "extraTime"].includes(type)) {
      return res.status(400).json({ error: "Invalid power-up type" });
    }

    const success = await storage.usePowerUp(req.session.userId!, type);
    if (!success) {
      return res.status(400).json({ error: "No power-ups available" });
    }

    res.json({ success: true });
  });

  app.post("/api/game/complete", async (req, res) => {
    try {
      const { gameMode, score, correctAnswers, totalQuestions, bestStreak, difficulty, categories, duration, isWinner, roomId, placement, playerName } = req.body;

      const gameData = {
        odaUserId: req.session.userId || null,
        visitorPlayerName: req.session.userId ? null : playerName,
        gameMode,
        score,
        correctAnswers,
        totalQuestions,
        bestStreak: bestStreak || 0,
        difficulty,
        categories: categories || [],
        duration: duration || 0,
        isWinner: isWinner || false,
        roomId: roomId || null,
        placement: placement || null,
      };

      const record = await storage.recordGameHistory(gameData);

      if (req.session.userId) {
        const user = await storage.getUser(req.session.userId);
        if (user) {
          await storage.updateUser(user.id, {
            totalGamesPlayed: (user.totalGamesPlayed || 0) + 1,
            totalQuestionsAnswered: (user.totalQuestionsAnswered || 0) + totalQuestions,
            totalCorrectAnswers: (user.totalCorrectAnswers || 0) + correctAnswers,
            totalScore: (user.totalScore || 0) + score,
            highestStreak: Math.max(user.highestStreak || 0, bestStreak || 0),
            gamesWon: (user.gamesWon || 0) + (isWinner ? 1 : 0),
          });

          if ((user.totalGamesPlayed || 0) % 5 === 0) {
            await storage.addPowerUp(user.id, "skip", 1);
          }
          if ((user.totalGamesPlayed || 0) % 10 === 0) {
            await storage.addPowerUp(user.id, "doublePoints", 1);
            await storage.addPowerUp(user.id, "extraTime", 1);
          }
        }
      }

      const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      await storage.updateLeaderboard({
        userId: req.session.userId || null,
        playerName: playerName || "Anonymous",
        score,
        gamesPlayed: 1,
        gamesWon: isWinner ? 1 : 0,
        bestStreak: bestStreak || 0,
        accuracy,
      });

      res.json({ success: true, gameId: record.id });
    } catch (error) {
      console.error("Error recording game:", error);
      res.status(500).json({ error: "Failed to record game" });
    }
  });

  app.get("/api/questions/categories", (_req, res) => {
    const categories = Object.entries(categoryLabels).map(([id, label]) => ({
      id,
      label,
      count: questionBank.filter((q) => q.category === id).length,
    }));
    res.json(categories);
  });

  app.get("/api/questions/difficulties", (_req, res) => {
    const difficulties = Object.entries(difficultyLabels).map(
      ([id, label]) => ({
        id,
        label,
        count: questionBank.filter((q) => q.difficulty === id).length,
      })
    );
    res.json(difficulties);
  });

  app.get("/api/leaderboard", async (_req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard(50);
      res.json(leaderboard);
    } catch (error) {
      res.json(gameManager.getLeaderboard());
    }
  });

  app.get("/api/rooms", (_req, res) => {
    res.json(gameManager.getRooms());
  });

  app.get("/api/stats", (_req, res) => {
    res.json({
      totalQuestions: questionBank.length,
      categories: Object.keys(categoryLabels).length,
      activeRooms: gameManager.getRooms().length,
    });
  });

  app.get("/api/tournaments", async (_req, res) => {
    const tournaments = await storage.getActiveTournaments();
    res.json(tournaments);
  });

  app.get("/api/tournaments/:id", async (req, res) => {
    const tournament = await storage.getTournament(parseInt(req.params.id));
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }
    res.json(tournament);
  });

  app.get("/api/tournaments/:id/leaderboard", async (req, res) => {
    const leaderboard = await storage.getTournamentLeaderboard(parseInt(req.params.id));
    res.json(leaderboard);
  });

  app.post("/api/tournaments/:id/join", requireAuth, async (req, res) => {
    const participant = await storage.joinTournament(
      parseInt(req.params.id),
      req.session.userId!
    );
    res.json(participant);
  });

  app.get("/api/seasons/current", async (_req, res) => {
    const season = await storage.getCurrentSeason();
    res.json(season || null);
  });

  app.get("/api/seasons/:id/rankings", async (req, res) => {
    const rankings = await storage.getSeasonRankings(parseInt(req.params.id));
    res.json(rankings);
  });

  return httpServer;
}
