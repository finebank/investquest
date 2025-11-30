import { WebSocket, WebSocketServer } from "ws";
import { questionBank } from "@shared/questions";
import type {
  Player,
  GameRoom,
  GameState,
  TriviaQuestion,
  InvestmentCategory,
  Difficulty,
  LeaderboardEntry,
  WebSocketMessage,
} from "@shared/trivia";
import { difficultyPoints, streakBonusMultiplier } from "@shared/trivia";
import { log } from "./index";

interface ConnectedClient {
  ws: WebSocket;
  playerId: string;
  playerName: string;
  roomId: string | null;
}

class GameManager {
  private wss: WebSocketServer | null = null;
  private clients: Map<WebSocket, ConnectedClient> = new Map();
  private rooms: Map<string, GameRoom> = new Map();
  private gameStates: Map<string, GameState> = new Map();
  private leaderboard: Map<string, LeaderboardEntry> = new Map();
  private questionTimers: Map<string, NodeJS.Timeout> = new Map();

  init(wss: WebSocketServer) {
    this.wss = wss;

    wss.on("connection", (ws: WebSocket) => {
      log("New WebSocket connection", "game");

      ws.on("message", (data: string) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          log(`Error parsing message: ${error}`, "game");
          this.sendError(ws, "Invalid message format");
        }
      });

      ws.on("close", () => {
        this.handleDisconnect(ws);
      });

      ws.on("error", (error) => {
        log(`WebSocket error: ${error}`, "game");
      });
    });
  }

  private handleMessage(ws: WebSocket, message: WebSocketMessage) {
    const { type, payload } = message;

    switch (type) {
      case "create_room":
        this.handleCreateRoom(ws, payload as {
          playerName: string;
          roomName: string;
          categories: InvestmentCategory[];
          difficulty: Difficulty;
          totalQuestions: number;
        });
        break;
      case "join_room":
        this.handleJoinRoom(ws, payload as { roomId: string; playerName: string });
        break;
      case "leave_room":
        this.handleLeaveRoom(ws);
        break;
      case "player_ready":
        this.handlePlayerReady(ws);
        break;
      case "start_game":
        this.handleStartGame(ws);
        break;
      case "submit_answer":
        this.handleSubmitAnswer(ws, payload as { answer: number });
        break;
      case "rooms_list":
        this.sendRoomsList(ws);
        break;
      case "leaderboard":
        this.sendLeaderboard(ws);
        break;
      default:
        this.sendError(ws, "Unknown message type");
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  private handleCreateRoom(
    ws: WebSocket,
    data: {
      playerName: string;
      roomName: string;
      categories: InvestmentCategory[];
      difficulty: Difficulty;
      totalQuestions: number;
    }
  ) {
    const playerId = this.generateId();
    const roomId = this.generateId();

    const player: Player = {
      id: playerId,
      name: data.playerName,
      score: 0,
      streak: 0,
      bestStreak: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      isReady: false,
    };

    const room: GameRoom = {
      id: roomId,
      name: data.roomName,
      hostId: playerId,
      players: [player],
      status: "waiting",
      currentQuestion: 0,
      totalQuestions: data.totalQuestions,
      selectedCategories: data.categories,
      difficulty: data.difficulty,
      createdAt: Date.now(),
    };

    this.rooms.set(roomId, room);
    this.clients.set(ws, {
      ws,
      playerId,
      playerName: data.playerName,
      roomId,
    });

    this.send(ws, {
      type: "room_update",
      payload: { room, playerId },
    });

    this.broadcastRoomsList();
    log(`Room created: ${roomId} by ${data.playerName}`, "game");
  }

  private handleJoinRoom(ws: WebSocket, data: { roomId: string; playerName: string }) {
    const room = this.rooms.get(data.roomId);
    
    if (!room) {
      this.sendError(ws, "Room not found");
      return;
    }

    if (room.status !== "waiting") {
      this.sendError(ws, "Game already in progress");
      return;
    }

    if (room.players.length >= 6) {
      this.sendError(ws, "Room is full");
      return;
    }

    const playerId = this.generateId();
    const player: Player = {
      id: playerId,
      name: data.playerName,
      score: 0,
      streak: 0,
      bestStreak: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      isReady: false,
    };

    room.players.push(player);
    this.clients.set(ws, {
      ws,
      playerId,
      playerName: data.playerName,
      roomId: data.roomId,
    });

    this.send(ws, {
      type: "room_update",
      payload: { room, playerId },
    });

    this.broadcastToRoom(data.roomId, {
      type: "player_joined",
      payload: { player, room },
    }, ws);

    this.broadcastRoomsList();
    log(`Player ${data.playerName} joined room ${data.roomId}`, "game");
  }

  private handleLeaveRoom(ws: WebSocket) {
    const client = this.clients.get(ws);
    if (!client || !client.roomId) return;

    const room = this.rooms.get(client.roomId);
    if (!room) return;

    room.players = room.players.filter((p) => p.id !== client.playerId);

    if (room.players.length === 0) {
      this.rooms.delete(client.roomId);
      this.gameStates.delete(client.roomId);
      const timer = this.questionTimers.get(client.roomId);
      if (timer) {
        clearInterval(timer);
        this.questionTimers.delete(client.roomId);
      }
    } else {
      if (room.hostId === client.playerId) {
        room.hostId = room.players[0].id;
      }
      this.broadcastToRoom(client.roomId, {
        type: "player_left",
        payload: { playerId: client.playerId, room },
      });
    }

    client.roomId = null;
    this.broadcastRoomsList();
    log(`Player ${client.playerName} left room`, "game");
  }

  private handlePlayerReady(ws: WebSocket) {
    const client = this.clients.get(ws);
    if (!client || !client.roomId) return;

    const room = this.rooms.get(client.roomId);
    if (!room) return;

    const player = room.players.find((p) => p.id === client.playerId);
    if (player) {
      player.isReady = !player.isReady;
      this.broadcastToRoom(client.roomId, {
        type: "room_update",
        payload: { room },
      });
    }
  }

  private handleStartGame(ws: WebSocket) {
    const client = this.clients.get(ws);
    if (!client || !client.roomId) return;

    const room = this.rooms.get(client.roomId);
    if (!room) return;

    if (room.hostId !== client.playerId) {
      this.sendError(ws, "Only the host can start the game");
      return;
    }

    if (room.players.length < 1) {
      this.sendError(ws, "Need at least 1 player to start");
      return;
    }

    room.status = "playing";
    room.currentQuestion = 0;

    room.players.forEach((p) => {
      p.score = 0;
      p.streak = 0;
      p.bestStreak = 0;
      p.correctAnswers = 0;
      p.totalAnswers = 0;
      p.isReady = false;
    });

    const questions = this.selectQuestions(
      room.selectedCategories,
      room.difficulty,
      room.totalQuestions
    );

    const gameState: GameState = {
      roomId: client.roomId,
      currentQuestion: questions[0],
      questionNumber: 1,
      totalQuestions: room.totalQuestions,
      timeRemaining: 20,
      players: room.players,
      answers: {},
      showAnswer: false,
      gameStatus: "countdown",
    };

    this.gameStates.set(client.roomId, gameState);
    (gameState as any).questions = questions;

    this.broadcastToRoom(client.roomId, {
      type: "game_state",
      payload: gameState,
    });

    setTimeout(() => {
      gameState.gameStatus = "question";
      this.broadcastToRoom(client.roomId!, {
        type: "game_state",
        payload: gameState,
      });
      this.startQuestionTimer(client.roomId!);
    }, 3000);

    log(`Game started in room ${client.roomId}`, "game");
  }

  private selectQuestions(
    categories: InvestmentCategory[],
    difficulty: Difficulty,
    count: number
  ): TriviaQuestion[] {
    let filtered = questionBank.filter(
      (q) =>
        categories.includes(q.category) &&
        (difficulty === "easy" ? true : 
         difficulty === "medium" ? ["easy", "medium"].includes(q.difficulty) :
         true)
    );

    if (filtered.length < count) {
      filtered = questionBank.filter((q) => categories.includes(q.category));
    }

    if (filtered.length < count) {
      filtered = [...questionBank];
    }

    const shuffled = filtered.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  private startQuestionTimer(roomId: string) {
    const gameState = this.gameStates.get(roomId);
    if (!gameState) return;

    const timer = setInterval(() => {
      gameState.timeRemaining--;

      if (gameState.timeRemaining <= 0) {
        clearInterval(timer);
        this.questionTimers.delete(roomId);
        this.showAnswer(roomId);
      } else {
        this.broadcastToRoom(roomId, {
          type: "game_state",
          payload: gameState,
        });
      }
    }, 1000);

    this.questionTimers.set(roomId, timer);
  }

  private handleSubmitAnswer(ws: WebSocket, data: { answer: number }) {
    const client = this.clients.get(ws);
    if (!client || !client.roomId) return;

    const gameState = this.gameStates.get(client.roomId);
    if (!gameState || gameState.showAnswer) return;

    if (gameState.answers[client.playerId] !== undefined) return;

    gameState.answers[client.playerId] = data.answer;

    const room = this.rooms.get(client.roomId);
    if (!room) return;

    const player = room.players.find((p) => p.id === client.playerId);
    if (!player || !gameState.currentQuestion) return;

    player.totalAnswers++;

    if (data.answer === gameState.currentQuestion.correctAnswer) {
      player.correctAnswers++;
      player.streak++;
      if (player.streak > player.bestStreak) {
        player.bestStreak = player.streak;
      }

      const basePoints = difficultyPoints[gameState.currentQuestion.difficulty];
      const timeBonus = Math.floor(gameState.timeRemaining * 5);
      const streakMultiplier = streakBonusMultiplier(player.streak);
      const points = Math.floor((basePoints + timeBonus) * streakMultiplier);
      player.score += points;
    } else {
      player.streak = 0;
    }

    gameState.players = room.players;

    this.broadcastToRoom(client.roomId, {
      type: "game_state",
      payload: gameState,
    });

    const allAnswered = room.players.every(
      (p) => gameState.answers[p.id] !== undefined
    );
    if (allAnswered) {
      const timer = this.questionTimers.get(client.roomId);
      if (timer) {
        clearInterval(timer);
        this.questionTimers.delete(client.roomId);
      }
      this.showAnswer(client.roomId);
    }
  }

  private showAnswer(roomId: string) {
    const gameState = this.gameStates.get(roomId);
    const room = this.rooms.get(roomId);
    if (!gameState || !room) return;

    gameState.showAnswer = true;
    gameState.gameStatus = "answer";

    this.broadcastToRoom(roomId, {
      type: "game_state",
      payload: gameState,
    });

    setTimeout(() => {
      this.nextQuestion(roomId);
    }, 4000);
  }

  private nextQuestion(roomId: string) {
    const gameState = this.gameStates.get(roomId);
    const room = this.rooms.get(roomId);
    if (!gameState || !room) return;

    const questions = (gameState as any).questions as TriviaQuestion[];

    if (gameState.questionNumber >= room.totalQuestions) {
      this.endGame(roomId);
      return;
    }

    gameState.questionNumber++;
    gameState.currentQuestion = questions[gameState.questionNumber - 1];
    gameState.timeRemaining = 20;
    gameState.answers = {};
    gameState.showAnswer = false;
    gameState.gameStatus = "question";

    this.broadcastToRoom(roomId, {
      type: "game_state",
      payload: gameState,
    });

    this.startQuestionTimer(roomId);
  }

  private endGame(roomId: string) {
    const gameState = this.gameStates.get(roomId);
    const room = this.rooms.get(roomId);
    if (!gameState || !room) return;

    gameState.gameStatus = "finished";
    room.status = "finished";

    room.players.forEach((player) => {
      this.updateLeaderboard(player);
    });

    this.broadcastToRoom(roomId, {
      type: "game_state",
      payload: gameState,
    });

    setTimeout(() => {
      room.status = "waiting";
      room.currentQuestion = 0;
      room.players.forEach((p) => {
        p.score = 0;
        p.streak = 0;
        p.correctAnswers = 0;
        p.totalAnswers = 0;
        p.isReady = false;
      });
      
      this.broadcastToRoom(roomId, {
        type: "room_update",
        payload: { room },
      });
      this.broadcastRoomsList();
    }, 10000);

    log(`Game ended in room ${roomId}`, "game");
  }

  private updateLeaderboard(player: Player) {
    const existing = this.leaderboard.get(player.name);
    
    if (existing) {
      existing.totalScore += player.score;
      existing.gamesPlayed++;
      existing.correctAnswers += player.correctAnswers;
      existing.totalAnswers += player.totalAnswers;
      if (player.bestStreak > existing.bestStreak) {
        existing.bestStreak = player.bestStreak;
      }
      existing.winRate = existing.correctAnswers / existing.totalAnswers;
      existing.lastPlayed = Date.now();
    } else {
      this.leaderboard.set(player.name, {
        id: player.id,
        playerName: player.name,
        totalScore: player.score,
        gamesPlayed: 1,
        correctAnswers: player.correctAnswers,
        totalAnswers: player.totalAnswers,
        bestStreak: player.bestStreak,
        winRate: player.totalAnswers > 0 ? player.correctAnswers / player.totalAnswers : 0,
        lastPlayed: Date.now(),
      });
    }
  }

  private handleDisconnect(ws: WebSocket) {
    const client = this.clients.get(ws);
    if (client) {
      if (client.roomId) {
        this.handleLeaveRoom(ws);
      }
      this.clients.delete(ws);
      log(`Client disconnected: ${client.playerName}`, "game");
    }
  }

  private send(ws: WebSocket, message: WebSocketMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private sendError(ws: WebSocket, error: string) {
    this.send(ws, { type: "error", payload: { message: error } });
  }

  private broadcastToRoom(
    roomId: string,
    message: WebSocketMessage,
    excludeWs?: WebSocket
  ) {
    this.clients.forEach((client, ws) => {
      if (client.roomId === roomId && ws !== excludeWs) {
        this.send(ws, message);
      }
    });
  }

  private broadcastRoomsList() {
    const roomsList = Array.from(this.rooms.values())
      .filter((r) => r.status === "waiting")
      .map((r) => ({
        id: r.id,
        name: r.name,
        playerCount: r.players.length,
        maxPlayers: 6,
        difficulty: r.difficulty,
        categories: r.selectedCategories,
      }));

    const message: WebSocketMessage = {
      type: "rooms_list",
      payload: roomsList,
    };

    this.clients.forEach((_, ws) => {
      this.send(ws, message);
    });
  }

  private sendRoomsList(ws: WebSocket) {
    const roomsList = Array.from(this.rooms.values())
      .filter((r) => r.status === "waiting")
      .map((r) => ({
        id: r.id,
        name: r.name,
        playerCount: r.players.length,
        maxPlayers: 6,
        difficulty: r.difficulty,
        categories: r.selectedCategories,
      }));

    this.send(ws, {
      type: "rooms_list",
      payload: roomsList,
    });
  }

  private sendLeaderboard(ws: WebSocket) {
    const entries = Array.from(this.leaderboard.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 20);

    this.send(ws, {
      type: "leaderboard",
      payload: entries,
    });
  }

  getLeaderboard(): LeaderboardEntry[] {
    return Array.from(this.leaderboard.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 20);
  }

  getRooms() {
    return Array.from(this.rooms.values())
      .filter((r) => r.status === "waiting")
      .map((r) => ({
        id: r.id,
        name: r.name,
        playerCount: r.players.length,
        maxPlayers: 6,
        difficulty: r.difficulty,
        categories: r.selectedCategories,
      }));
  }
}

export const gameManager = new GameManager();
