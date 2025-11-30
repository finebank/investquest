import { useEffect, useState } from "react";
import { useTriviaGame } from "@/lib/stores/useTriviaGame";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Star, Home, RotateCcw, Zap, Target, CheckCircle } from "lucide-react";
import ReactConfetti from "react-confetti";

export function ResultsScreen() {
  const {
    gameState,
    playerId,
    setScreen,
    resetSinglePlayer,
    singlePlayerScore,
    singlePlayerBestStreak,
    singlePlayerCorrectAnswers,
    singlePlayerQuestions,
    room,
    leaveRoom,
  } = useTriviaGame();

  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const isMultiplayer = gameState && gameState.players.length > 0;
  
  let players = [];
  let currentPlayer = null;
  let winner = null;
  let rank = 0;

  if (isMultiplayer) {
    players = [...gameState.players].sort((a, b) => b.score - a.score);
    currentPlayer = players.find((p) => p.id === playerId);
    winner = players[0];
    rank = players.findIndex((p) => p.id === playerId) + 1;
  } else {
    const totalQuestions = singlePlayerQuestions.length;
    const accuracy = totalQuestions > 0 ? Math.round((singlePlayerCorrectAnswers / totalQuestions) * 100) : 0;
    
    currentPlayer = {
      id: "single",
      name: "You",
      score: singlePlayerScore,
      bestStreak: singlePlayerBestStreak,
      correctAnswers: singlePlayerCorrectAnswers,
      totalAnswers: totalQuestions,
      accuracy,
    };
  }

  const handlePlayAgain = () => {
    if (isMultiplayer) {
      leaveRoom();
    } else {
      resetSinglePlayer();
    }
    setScreen("create_room");
  };

  const handleGoHome = () => {
    if (isMultiplayer) {
      leaveRoom();
    } else {
      resetSinglePlayer();
    }
    setScreen("menu");
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 3:
        return <Medal className="h-8 w-8 text-orange-400" />;
      default:
        return <Star className="h-8 w-8 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600 flex items-center justify-center p-4">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <div className="w-full max-w-2xl">
        <Card className="bg-white/95 backdrop-blur shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              {isMultiplayer ? (
                rank === 1 ? (
                  <div className="relative">
                    <Trophy className="h-20 w-20 text-yellow-500" />
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      1
                    </div>
                  </div>
                ) : (
                  getRankIcon(rank)
                )
              ) : (
                <Trophy className="h-20 w-20 text-yellow-500" />
              )}
            </div>
            <CardTitle className="text-3xl text-gray-800">
              {isMultiplayer
                ? rank === 1
                  ? "Victory!"
                  : `${rank}${rank === 2 ? "nd" : rank === 3 ? "rd" : "th"} Place!`
                : "Game Complete!"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {isMultiplayer && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-700 text-center">
                  Final Standings
                </h3>
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      player.id === playerId
                        ? "bg-blue-100 border-2 border-blue-300"
                        : index === 0
                        ? "bg-yellow-50 border border-yellow-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                          index === 0
                            ? "bg-yellow-400 text-yellow-900"
                            : index === 1
                            ? "bg-gray-300 text-gray-700"
                            : index === 2
                            ? "bg-orange-300 text-orange-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-gray-800">
                          {player.name}
                          {player.id === playerId && " (You)"}
                        </span>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{player.correctAnswers} correct</span>
                          {player.bestStreak > 0 && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Zap className="h-3 w-3 text-orange-500" />
                                {player.bestStreak} streak
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {player.score}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {currentPlayer && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">
                  Your Performance
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-center mb-2">
                      <Trophy className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                      {currentPlayer.score}
                    </div>
                    <div className="text-sm text-gray-500">Total Score</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-center mb-2">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {currentPlayer.correctAnswers}/{currentPlayer.totalAnswers || singlePlayerQuestions.length}
                    </div>
                    <div className="text-sm text-gray-500">Correct</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-center mb-2">
                      <Zap className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="text-3xl font-bold text-orange-600">
                      {currentPlayer.bestStreak}
                    </div>
                    <div className="text-sm text-gray-500">Best Streak</div>
                  </div>
                </div>
                {!isMultiplayer && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow">
                      <Target className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">
                        Accuracy: {currentPlayer.accuracy || Math.round((currentPlayer.correctAnswers / singlePlayerQuestions.length) * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Button
                size="lg"
                variant="outline"
                className="py-6"
                onClick={handleGoHome}
              >
                <Home className="mr-2 h-5 w-5" />
                Home
              </Button>
              <Button
                size="lg"
                className="py-6 bg-blue-600 hover:bg-blue-700"
                onClick={handlePlayAgain}
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
