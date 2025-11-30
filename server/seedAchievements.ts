import { db } from "./db";
import { achievements } from "@shared/schema";

const achievementsList = [
  { code: "first_game", name: "First Steps", description: "Complete your first trivia game", icon: "🎮", category: "games", requirement: 1, points: 10 },
  { code: "games_10", name: "Getting Started", description: "Complete 10 trivia games", icon: "🎯", category: "games", requirement: 10, points: 25 },
  { code: "games_50", name: "Dedicated Player", description: "Complete 50 trivia games", icon: "🏆", category: "games", requirement: 50, points: 50 },
  { code: "games_100", name: "Trivia Master", description: "Complete 100 trivia games", icon: "👑", category: "games", requirement: 100, points: 100 },
  
  { code: "streak_5", name: "On Fire", description: "Achieve a 5-question streak", icon: "🔥", category: "streak", requirement: 5, points: 15 },
  { code: "streak_10", name: "Unstoppable", description: "Achieve a 10-question streak", icon: "⚡", category: "streak", requirement: 10, points: 30 },
  { code: "streak_15", name: "Legendary Streak", description: "Achieve a 15-question streak", icon: "💎", category: "streak", requirement: 15, points: 75 },
  
  { code: "perfect_easy", name: "Easy Perfection", description: "Get 100% accuracy on an easy game", icon: "⭐", category: "accuracy", requirement: 1, points: 20 },
  { code: "perfect_medium", name: "Medium Perfection", description: "Get 100% accuracy on a medium game", icon: "🌟", category: "accuracy", requirement: 1, points: 40 },
  { code: "perfect_hard", name: "Hard Perfection", description: "Get 100% accuracy on a hard game", icon: "✨", category: "accuracy", requirement: 1, points: 80 },
  
  { code: "category_unit_trusts", name: "Unit Trust Expert", description: "Master Unit Trusts category (80% accuracy in 20 questions)", icon: "📈", category: "category", requirement: 20, points: 50 },
  { code: "category_asb_asn", name: "ASB/ASN Expert", description: "Master ASB/ASN category (80% accuracy in 20 questions)", icon: "🏦", category: "category", requirement: 20, points: 50 },
  { code: "category_epf", name: "EPF Expert", description: "Master EPF/KWSP category (80% accuracy in 20 questions)", icon: "💼", category: "category", requirement: 20, points: 50 },
  { code: "category_stocks", name: "Stock Market Expert", description: "Master Stocks category (80% accuracy in 20 questions)", icon: "📊", category: "category", requirement: 20, points: 50 },
  { code: "category_reits", name: "REIT Expert", description: "Master REITs category (80% accuracy in 20 questions)", icon: "🏢", category: "category", requirement: 20, points: 50 },
  { code: "category_fd", name: "Fixed Deposit Expert", description: "Master Fixed Deposits category (80% accuracy in 20 questions)", icon: "🔒", category: "category", requirement: 20, points: 50 },
  { code: "category_sukuk", name: "Sukuk/Bonds Expert", description: "Master Sukuk/Bonds category (80% accuracy in 20 questions)", icon: "📜", category: "category", requirement: 20, points: 50 },
  { code: "category_prs", name: "PRS Expert", description: "Master PRS category (80% accuracy in 20 questions)", icon: "🎯", category: "category", requirement: 20, points: 50 },
  
  { code: "mp_first_win", name: "First Victory", description: "Win your first multiplayer game", icon: "🥇", category: "multiplayer", requirement: 1, points: 25 },
  { code: "mp_wins_10", name: "Champion", description: "Win 10 multiplayer games", icon: "🏅", category: "multiplayer", requirement: 10, points: 75 },
  { code: "mp_wins_50", name: "Legendary Champion", description: "Win 50 multiplayer games", icon: "🏆", category: "multiplayer", requirement: 50, points: 150 },
  
  { code: "score_1000", name: "Score Hunter", description: "Accumulate 1,000 total points", icon: "💯", category: "score", requirement: 1000, points: 20 },
  { code: "score_10000", name: "Score Master", description: "Accumulate 10,000 total points", icon: "🎖️", category: "score", requirement: 10000, points: 50 },
  { code: "score_100000", name: "Score Legend", description: "Accumulate 100,000 total points", icon: "👑", category: "score", requirement: 100000, points: 150 },
  
  { code: "speed_demon", name: "Speed Demon", description: "Answer 5 questions correctly in under 3 seconds each", icon: "⚡", category: "special", requirement: 5, points: 60 },
  { code: "all_categories", name: "Well Rounded", description: "Play games in all 8 investment categories", icon: "🌐", category: "special", requirement: 8, points: 40 },
];

export async function seedAchievements() {
  try {
    const existing = await db.select().from(achievements);
    if (existing.length > 0) {
      console.log("Achievements already seeded");
      return;
    }

    await db.insert(achievements).values(achievementsList);
    console.log(`Seeded ${achievementsList.length} achievements`);
  } catch (error) {
    console.error("Error seeding achievements:", error);
  }
}
