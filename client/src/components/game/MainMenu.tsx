import { useState, useEffect } from "react";
import { useTriviaGame } from "@/lib/stores/useTriviaGame";
import { useAuth } from "@/lib/stores/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Play, TrendingUp, User, LogIn, LogOut, Settings } from "lucide-react";
import { AuthModal } from "./AuthModal";

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

  const { user, isLoading, checkAuth, logout } = useAuth();
  
  const [nameInput, setNameInput] = useState(playerName);
  const [stats, setStats] = useState({ totalQuestions: 0, categories: 0, activeRooms: 0 });
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      setNameInput(user.displayName || user.username);
      setPlayerName(user.displayName || user.username);
    }
  }, [user, setPlayerName]);

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

  const handleContinue = (screen: "single_player" | "create_room" | "join_room" | "leaderboard" | "profile") => {
    if (screen === "profile") {
      setScreen(screen);
      return;
    }
    
    if (!nameInput.trim()) {
      return;
    }
    setPlayerName(nameInput.trim());
    if (screen === "leaderboard") {
      requestLeaderboard();
    }
    setScreen(screen);
  };

  const handleLogout = async () => {
    await logout();
    setNameInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="absolute top-4 right-4 flex gap-2">
          {isLoading ? (
            <div className="text-white/50 text-sm">Loading...</div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => handleContinue("profile")}
                className="text-white hover:bg-white/10 flex items-center gap-2"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: user.avatarColor || "#3b82f6" }}
                >
                  {(user.displayName || user.username).charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user.displayName || user.username}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setShowAuthModal(true)}
              className="text-white hover:bg-white/10"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>

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
              {user ? `Welcome back, ${user.displayName || user.username}!` : "Enter Your Name"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!user && (
              <Input
                type="text"
                placeholder="Your nickname"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="text-center text-lg py-6"
                maxLength={20}
              />
            )}

            {user && (
              <div className="flex items-center justify-center gap-4 py-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>{user.totalScore?.toLocaleString() || 0} pts</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Play className="w-4 h-4 text-blue-500" />
                  <span>{user.totalGamesPlayed || 0} games</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-green-500" />
                  <span>{user.gamesWon || 0} wins</span>
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}

            <div className="grid gap-3">
              <Button
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                onClick={() => handleContinue("single_player")}
                disabled={!user && !nameInput.trim()}
              >
                <Play className="mr-2 h-5 w-5" />
                Practice Mode
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-6 text-lg"
                onClick={() => handleContinue("create_room")}
                disabled={(!user && !nameInput.trim()) || !connected}
              >
                <Users className="mr-2 h-5 w-5" />
                Create Multiplayer Room
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 py-6 text-lg"
                onClick={() => handleContinue("join_room")}
                disabled={(!user && !nameInput.trim()) || !connected}
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

              {user && (
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full text-gray-600 hover:bg-gray-100 py-4"
                  onClick={() => handleContinue("profile")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  My Profile & Achievements
                </Button>
              )}
            </div>

            {!connected && (
              <p className="text-center text-sm text-gray-500">
                Connecting to server...
              </p>
            )}

            {!user && (
              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setShowAuthModal(true)}
                  className="text-blue-600"
                >
                  Sign in to save your progress and earn achievements
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-blue-200 text-sm mt-6">
          Learn about Unit Trusts, ASB, EPF, Stocks, REITs & more!
        </p>
      </div>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
