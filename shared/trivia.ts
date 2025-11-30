import { z } from "zod";

export type InvestmentCategory = 
  | "unit_trusts"
  | "asb_asn"
  | "epf"
  | "stocks_bursa"
  | "reits"
  | "fixed_deposits"
  | "sukuk_bonds"
  | "prs";

export type Difficulty = "easy" | "medium" | "hard";

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: InvestmentCategory;
  difficulty: Difficulty;
  explanation: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  streak: number;
  bestStreak: number;
  correctAnswers: number;
  totalAnswers: number;
  isReady: boolean;
}

export interface GameRoom {
  id: string;
  name: string;
  hostId: string;
  players: Player[];
  status: "waiting" | "playing" | "finished";
  currentQuestion: number;
  totalQuestions: number;
  selectedCategories: InvestmentCategory[];
  difficulty: Difficulty;
  createdAt: number;
}

export interface GameState {
  roomId: string;
  currentQuestion: TriviaQuestion | null;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: number;
  players: Player[];
  answers: Record<string, number>;
  showAnswer: boolean;
  gameStatus: "waiting" | "countdown" | "question" | "answer" | "finished";
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  totalScore: number;
  gamesPlayed: number;
  correctAnswers: number;
  totalAnswers: number;
  bestStreak: number;
  winRate: number;
  lastPlayed: number;
}

export const categoryLabels: Record<InvestmentCategory, string> = {
  unit_trusts: "Unit Trusts",
  asb_asn: "ASB/ASN",
  epf: "EPF/KWSP",
  stocks_bursa: "Stocks (Bursa Malaysia)",
  reits: "REITs",
  fixed_deposits: "Fixed Deposits",
  sukuk_bonds: "Sukuk/Bonds",
  prs: "Private Retirement Scheme"
};

export const categoryColors: Record<InvestmentCategory, string> = {
  unit_trusts: "#3B82F6",
  asb_asn: "#10B981",
  epf: "#F59E0B",
  stocks_bursa: "#EF4444",
  reits: "#8B5CF6",
  fixed_deposits: "#06B6D4",
  sukuk_bonds: "#EC4899",
  prs: "#84CC16"
};

export const difficultyLabels: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard"
};

export const difficultyPoints: Record<Difficulty, number> = {
  easy: 100,
  medium: 200,
  hard: 300
};

export const streakBonusMultiplier = (streak: number): number => {
  if (streak >= 10) return 2.0;
  if (streak >= 7) return 1.75;
  if (streak >= 5) return 1.5;
  if (streak >= 3) return 1.25;
  return 1.0;
};

export type WebSocketMessageType =
  | "join_room"
  | "leave_room"
  | "create_room"
  | "player_ready"
  | "start_game"
  | "submit_answer"
  | "game_state"
  | "room_update"
  | "player_joined"
  | "player_left"
  | "error"
  | "rooms_list"
  | "leaderboard"
  | "chat_message";

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: unknown;
}

export const createPlayerSchema = z.object({
  name: z.string().min(2).max(20)
});

export const createRoomSchema = z.object({
  name: z.string().min(3).max(30),
  categories: z.array(z.string()),
  difficulty: z.enum(["easy", "medium", "hard"]),
  totalQuestions: z.number().min(5).max(30)
});
