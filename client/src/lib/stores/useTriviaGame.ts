import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type {
  Player,
  GameRoom,
  GameState,
  InvestmentCategory,
  Difficulty,
  LeaderboardEntry,
  WebSocketMessage,
} from "@shared/trivia";

type Screen = "menu" | "lobby" | "create_room" | "join_room" | "game" | "results" | "leaderboard" | "single_player";

interface TriviaGameState {
  screen: Screen;
  playerName: string;
  playerId: string | null;
  room: GameRoom | null;
  gameState: GameState | null;
  rooms: Array<{
    id: string;
    name: string;
    playerCount: number;
    maxPlayers: number;
    difficulty: Difficulty;
    categories: InvestmentCategory[];
  }>;
  leaderboard: LeaderboardEntry[];
  ws: WebSocket | null;
  connected: boolean;
  error: string | null;
  selectedAnswer: number | null;
  
  singlePlayerScore: number;
  singlePlayerStreak: number;
  singlePlayerBestStreak: number;
  singlePlayerQuestionIndex: number;
  singlePlayerQuestions: any[];
  singlePlayerTimeRemaining: number;
  singlePlayerShowAnswer: boolean;
  singlePlayerCorrectAnswers: number;

  setScreen: (screen: Screen) => void;
  setPlayerName: (name: string) => void;
  setError: (error: string | null) => void;
  setSelectedAnswer: (answer: number | null) => void;
  
  connect: () => void;
  disconnect: () => void;
  
  createRoom: (data: {
    roomName: string;
    categories: InvestmentCategory[];
    difficulty: Difficulty;
    totalQuestions: number;
  }) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  toggleReady: () => void;
  startGame: () => void;
  submitAnswer: (answer: number) => void;
  requestRoomsList: () => void;
  requestLeaderboard: () => void;

  startSinglePlayer: (categories: InvestmentCategory[], difficulty: Difficulty, totalQuestions: number) => void;
  submitSinglePlayerAnswer: (answer: number) => void;
  nextSinglePlayerQuestion: () => void;
  resetSinglePlayer: () => void;
}

export const useTriviaGame = create<TriviaGameState>()(
  subscribeWithSelector((set, get) => ({
    screen: "menu",
    playerName: "",
    playerId: null,
    room: null,
    gameState: null,
    rooms: [],
    leaderboard: [],
    ws: null,
    connected: false,
    error: null,
    selectedAnswer: null,
    
    singlePlayerScore: 0,
    singlePlayerStreak: 0,
    singlePlayerBestStreak: 0,
    singlePlayerQuestionIndex: 0,
    singlePlayerQuestions: [],
    singlePlayerTimeRemaining: 20,
    singlePlayerShowAnswer: false,
    singlePlayerCorrectAnswers: 0,

    setScreen: (screen) => set({ screen, error: null }),
    setPlayerName: (name) => set({ playerName: name }),
    setError: (error) => set({ error }),
    setSelectedAnswer: (answer) => set({ selectedAnswer: answer }),

    connect: () => {
      const { ws } = get();
      if (ws) return;

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const newWs = new WebSocket(`${protocol}//${window.location.host}/ws`);

      newWs.onopen = () => {
        console.log("WebSocket connected");
        set({ connected: true, error: null });
        get().requestRoomsList();
      };

      newWs.onclose = () => {
        console.log("WebSocket disconnected");
        set({ connected: false, ws: null });
      };

      newWs.onerror = (error) => {
        console.error("WebSocket error:", error);
        set({ error: "Connection error. Please try again." });
      };

      newWs.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          get().handleMessage(message);
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      set({ ws: newWs });
    },

    handleMessage: (message: WebSocketMessage) => {
      const { type, payload } = message;

      switch (type) {
        case "room_update": {
          const data = payload as { room: GameRoom; playerId?: string };
          set({
            room: data.room,
            playerId: data.playerId || get().playerId,
            screen: "lobby",
          });
          break;
        }
        case "player_joined":
        case "player_left": {
          const data = payload as { room: GameRoom };
          set({ room: data.room });
          break;
        }
        case "game_state": {
          const gameState = payload as GameState;
          set({
            gameState,
            screen: gameState.gameStatus === "finished" ? "results" : "game",
            selectedAnswer: gameState.showAnswer ? get().selectedAnswer : null,
          });
          break;
        }
        case "rooms_list": {
          set({ rooms: payload as any[] });
          break;
        }
        case "leaderboard": {
          set({ leaderboard: payload as LeaderboardEntry[] });
          break;
        }
        case "error": {
          const data = payload as { message: string };
          set({ error: data.message });
          break;
        }
      }
    },

    disconnect: () => {
      const { ws } = get();
      if (ws) {
        ws.close();
        set({ ws: null, connected: false });
      }
    },

    createRoom: (data) => {
      const { ws, playerName } = get();
      if (!ws || !playerName) return;

      ws.send(JSON.stringify({
        type: "create_room",
        payload: {
          playerName,
          roomName: data.roomName,
          categories: data.categories,
          difficulty: data.difficulty,
          totalQuestions: data.totalQuestions,
        },
      }));
    },

    joinRoom: (roomId) => {
      const { ws, playerName } = get();
      if (!ws || !playerName) return;

      ws.send(JSON.stringify({
        type: "join_room",
        payload: { roomId, playerName },
      }));
    },

    leaveRoom: () => {
      const { ws } = get();
      if (!ws) return;

      ws.send(JSON.stringify({ type: "leave_room", payload: {} }));
      set({ room: null, gameState: null, screen: "menu" });
    },

    toggleReady: () => {
      const { ws } = get();
      if (!ws) return;

      ws.send(JSON.stringify({ type: "player_ready", payload: {} }));
    },

    startGame: () => {
      const { ws } = get();
      if (!ws) return;

      ws.send(JSON.stringify({ type: "start_game", payload: {} }));
    },

    submitAnswer: (answer) => {
      const { ws, gameState } = get();
      if (!ws || !gameState || gameState.showAnswer) return;

      set({ selectedAnswer: answer });
      ws.send(JSON.stringify({ type: "submit_answer", payload: { answer } }));
    },

    requestRoomsList: () => {
      const { ws } = get();
      if (!ws) return;

      ws.send(JSON.stringify({ type: "rooms_list", payload: {} }));
    },

    requestLeaderboard: () => {
      const { ws } = get();
      if (!ws) return;

      ws.send(JSON.stringify({ type: "leaderboard", payload: {} }));
    },

    startSinglePlayer: async (categories, difficulty, totalQuestions) => {
      try {
        const response = await fetch("/api/questions/categories");
        const categoriesData = await response.json();
        
        const { questionBank } = await import("@shared/questions");
        
        let filtered = questionBank.filter(
          (q) =>
            categories.includes(q.category) &&
            (difficulty === "easy" ? q.difficulty === "easy" : 
             difficulty === "medium" ? ["easy", "medium"].includes(q.difficulty) :
             true)
        );

        if (filtered.length < totalQuestions) {
          filtered = questionBank.filter((q) => categories.includes(q.category));
        }

        const shuffled = filtered.sort(() => Math.random() - 0.5);
        const questions = shuffled.slice(0, totalQuestions);

        set({
          screen: "single_player",
          singlePlayerQuestions: questions,
          singlePlayerQuestionIndex: 0,
          singlePlayerScore: 0,
          singlePlayerStreak: 0,
          singlePlayerBestStreak: 0,
          singlePlayerTimeRemaining: 20,
          singlePlayerShowAnswer: false,
          singlePlayerCorrectAnswers: 0,
          selectedAnswer: null,
        });
      } catch (error) {
        console.error("Error starting single player:", error);
      }
    },

    submitSinglePlayerAnswer: (answer) => {
      const state = get();
      if (state.singlePlayerShowAnswer) return;

      const currentQuestion = state.singlePlayerQuestions[state.singlePlayerQuestionIndex];
      const isCorrect = answer === currentQuestion.correctAnswer;
      
      const difficultyPoints: Record<string, number> = {
        easy: 100,
        medium: 200,
        hard: 300,
      };

      let newStreak = state.singlePlayerStreak;
      let newScore = state.singlePlayerScore;
      let newCorrectAnswers = state.singlePlayerCorrectAnswers;

      if (isCorrect) {
        newStreak++;
        newCorrectAnswers++;
        const basePoints = difficultyPoints[currentQuestion.difficulty];
        const timeBonus = Math.floor(state.singlePlayerTimeRemaining * 5);
        const streakMultiplier = newStreak >= 10 ? 2.0 : 
                                 newStreak >= 7 ? 1.75 : 
                                 newStreak >= 5 ? 1.5 : 
                                 newStreak >= 3 ? 1.25 : 1.0;
        newScore += Math.floor((basePoints + timeBonus) * streakMultiplier);
      } else {
        newStreak = 0;
      }

      set({
        selectedAnswer: answer,
        singlePlayerShowAnswer: true,
        singlePlayerScore: newScore,
        singlePlayerStreak: newStreak,
        singlePlayerBestStreak: Math.max(newStreak, state.singlePlayerBestStreak),
        singlePlayerCorrectAnswers: newCorrectAnswers,
      });
    },

    nextSinglePlayerQuestion: () => {
      const state = get();
      const nextIndex = state.singlePlayerQuestionIndex + 1;

      if (nextIndex >= state.singlePlayerQuestions.length) {
        set({ screen: "results" });
        return;
      }

      set({
        singlePlayerQuestionIndex: nextIndex,
        singlePlayerTimeRemaining: 20,
        singlePlayerShowAnswer: false,
        selectedAnswer: null,
      });
    },

    resetSinglePlayer: () => {
      set({
        singlePlayerScore: 0,
        singlePlayerStreak: 0,
        singlePlayerBestStreak: 0,
        singlePlayerQuestionIndex: 0,
        singlePlayerQuestions: [],
        singlePlayerTimeRemaining: 20,
        singlePlayerShowAnswer: false,
        singlePlayerCorrectAnswers: 0,
        selectedAnswer: null,
      });
    },
  }))
);
