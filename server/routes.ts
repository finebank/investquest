import type { Express } from "express";
import { type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { gameManager } from "./gameManager";
import { questionBank } from "@shared/questions";
import { categoryLabels, difficultyLabels } from "@shared/trivia";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  gameManager.init(wss);

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

  app.get("/api/leaderboard", (_req, res) => {
    res.json(gameManager.getLeaderboard());
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

  return httpServer;
}
