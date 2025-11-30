import { useState, useEffect } from "react";
import { useTriviaGame } from "@/lib/stores/useTriviaGame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Play, TrendingUp } from "lucide-react";

export function MainMenu() {
  const {
    playerName,
    setPlayerName,
    setScreen,
    connect,
    connected,
    error,
    requestLeaderboard,
  } = useTriviaGame();
  
  const [nameInput, setNameInput] = useState(playerName);
  const [stats, setStats] = useState({ totalQuestions: 0, categories: 0, activeRooms: 0 });

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!connected) {
      connect();
    }
  }, [connected, connect]);

  const handleContinue = (screen: "single_player" | "create_room" | "join_room" | "leaderboard") => {
    if (!nameInput.trim()) {
      return;
    }
    setPlayerName(nameInput.trim());
    if (screen === "leaderboard") {
      requestLeaderboard();
    }
    setScreen(screen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <TrendingUp className="w-12 h-12 text-blue-700" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            MyInvest Trivia
          </h1>
          <p className="text-blue-200 text-lg">
            Master Malaysian Investment Vehicles
          </p>
          <div className="flex justify-center gap-4 mt-4 text-sm text-blue-100">
            <span>{stats.totalQuestions}+ Questions</span>
            <span>•</span>
            <span>{stats.categories} Categories</span>
            <span>•</span>
            <span>{stats.activeRooms} Active Rooms</span>
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-gray-800">
              Enter Your Name
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              type="text"
              placeholder="Your nickname"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="text-center text-lg py-6"
              maxLength={20}
            />

            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}

            <div className="grid gap-3">
              <Button
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                onClick={() => handleContinue("single_player")}
                disabled={!nameInput.trim()}
              >
                <Play className="mr-2 h-5 w-5" />
                Practice Mode
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-6 text-lg"
                onClick={() => handleContinue("create_room")}
                disabled={!nameInput.trim() || !connected}
              >
                <Users className="mr-2 h-5 w-5" />
                Create Multiplayer Room
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 py-6 text-lg"
                onClick={() => handleContinue("join_room")}
                disabled={!nameInput.trim() || !connected}
              >
                <Users className="mr-2 h-5 w-5" />
                Join Multiplayer Room
              </Button>

              <Button
                size="lg"
                variant="ghost"
                className="w-full text-gray-600 hover:bg-gray-100 py-6 text-lg"
                onClick={() => handleContinue("leaderboard")}
              >
                <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                Leaderboard
              </Button>
            </div>

            {!connected && (
              <p className="text-center text-sm text-gray-500">
                Connecting to server...
              </p>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-blue-200 text-sm mt-6">
          Learn about Unit Trusts, ASB, EPF, Stocks, REITs & more!
        </p>
      </div>
    </div>
  );
}
