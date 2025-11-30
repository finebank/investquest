# MyInvest Trivia - Malaysian Investment Quiz Game

## Overview
A multiplayer trivia game focused on Malaysian investment vehicles, designed to help players learn about various investment options available in Malaysia through an engaging quiz format.

## Features
- **94+ Trivia Questions** across 8 investment categories
- **Multiple Game Modes**: Single-player practice and real-time multiplayer
- **Difficulty Levels**: Easy, Medium, and Hard
- **Streak System**: Bonus multipliers for consecutive correct answers
- **Time-Based Scoring**: Faster answers earn more points
- **Live Leaderboard**: Track top performers globally
- **Educational Content**: Explanations for each answer

## Investment Categories
1. Unit Trusts
2. ASB/ASN (Amanah Saham Bumiputera/Nasional)
3. EPF/KWSP (Employees Provident Fund)
4. Stocks (Bursa Malaysia)
5. REITs (Real Estate Investment Trusts)
6. Fixed Deposits
7. Sukuk/Bonds (Islamic Bonds)
8. Private Retirement Scheme (PRS)

## Tech Stack
- **Frontend**: React with TypeScript, TailwindCSS
- **Backend**: Express.js with WebSocket support
- **State Management**: Zustand
- **Real-time**: Native WebSocket API
- **UI Components**: Radix UI primitives

## Project Structure
```
├── client/
│   ├── src/
│   │   ├── components/game/   # Game UI components
│   │   ├── lib/stores/        # Zustand stores
│   │   └── App.tsx            # Main app entry
│   └── public/                # Static assets
├── server/
│   ├── gameManager.ts         # WebSocket game logic
│   └── routes.ts              # API endpoints
└── shared/
    ├── trivia.ts              # Shared types
    └── questions.ts           # Question bank
```

## Game Mechanics

### Scoring System
- **Base Points**: Easy (100), Medium (200), Hard (300)
- **Time Bonus**: +5 points per second remaining
- **Streak Multipliers**:
  - 3+ streak: 1.25x
  - 5+ streak: 1.5x
  - 7+ streak: 1.75x
  - 10+ streak: 2.0x

### Multiplayer
- Create or join rooms with custom settings
- 2-6 players per room
- Real-time score updates via WebSocket
- Host controls game start

## API Endpoints
- `GET /api/stats` - Game statistics
- `GET /api/questions/categories` - Available categories
- `GET /api/questions/difficulties` - Difficulty levels
- `GET /api/leaderboard` - Top players
- `GET /api/rooms` - Available game rooms
- `WS /ws` - WebSocket connection for real-time gameplay

## Recent Changes
- Initial implementation of Malaysian Investment Trivia Game
- Added 94+ questions across 8 investment categories
- Implemented real-time multiplayer with WebSocket
- Created single-player practice mode
- Added streak bonuses and time-based scoring
- Built global leaderboard system
