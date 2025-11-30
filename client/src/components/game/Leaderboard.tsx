import { useEffect } from "react";
import { useTriviaGame } from "@/lib/stores/useTriviaGame";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trophy, Medal, Zap, Target, RefreshCw } from "lucide-react";

export function Leaderboard() {
  const { setScreen, leaderboard, requestLeaderboard, connected } = useTriviaGame();

  useEffect(() => {
    if (connected) {
      requestLeaderboard();
    }
  }, [connected, requestLeaderboard]);

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-400 text-yellow-900";
      case 1:
        return "bg-gray-300 text-gray-700";
      case 2:
        return "bg-orange-300 text-orange-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-orange-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={() => setScreen("menu")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={requestLeaderboard}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <Card className="bg-white/95 backdrop-blur shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <CardTitle className="text-2xl text-gray-800">
                Global Leaderboard
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Trophy className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No players yet</p>
                <p className="text-sm mt-2">
                  Be the first to complete a game and claim the top spot!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      index < 3
                        ? "bg-gradient-to-r from-gray-50 to-gray-100 border-2"
                        : "bg-gray-50 border"
                    } ${
                      index === 0
                        ? "border-yellow-300"
                        : index === 1
                        ? "border-gray-300"
                        : index === 2
                        ? "border-orange-300"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${getRankStyle(
                            index
                          )}`}
                        >
                          {index + 1}
                        </span>
                        {getRankIcon(index)}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 text-lg">
                          {entry.playerName}
                        </span>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{entry.gamesPlayed} games</span>
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-orange-500" />
                            {entry.bestStreak} best streak
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3 text-green-500" />
                            {Math.round(entry.winRate * 100)}% accuracy
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-blue-600">
                        {entry.totalScore.toLocaleString()}
                      </span>
                      <div className="text-xs text-gray-500">Total Score</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
