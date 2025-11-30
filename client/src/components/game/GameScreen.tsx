import { useEffect, useRef } from "react";
import { useTriviaGame } from "@/lib/stores/useTriviaGame";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer, Zap, Users, Check, X } from "lucide-react";
import { categoryLabels, categoryColors, difficultyPoints, streakBonusMultiplier } from "@shared/trivia";
import { useAudio } from "@/lib/stores/useAudio";

export function GameScreen() {
  const { gameState, playerId, selectedAnswer, submitAnswer } = useTriviaGame();
  const { playSuccess, playHit } = useAudio();
  const prevShowAnswerRef = useRef(false);

  useEffect(() => {
    if (gameState?.showAnswer && !prevShowAnswerRef.current) {
      const currentQuestion = gameState.currentQuestion;
      if (currentQuestion && selectedAnswer !== null) {
        if (selectedAnswer === currentQuestion.correctAnswer) {
          playSuccess();
        } else {
          playHit();
        }
      }
    }
    prevShowAnswerRef.current = gameState?.showAnswer || false;
  }, [gameState?.showAnswer, selectedAnswer, playSuccess, playHit]);

  if (!gameState || !gameState.currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const { currentQuestion, questionNumber, totalQuestions, timeRemaining, players, showAnswer } = gameState;
  const currentPlayer = players.find((p) => p.id === playerId);
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="text-white">
            <span className="text-xl font-bold">
              Question {questionNumber}/{totalQuestions}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {currentPlayer && currentPlayer.streak > 0 && (
              <div className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full animate-pulse">
                <Zap className="h-5 w-5" />
                <span className="font-bold">{currentPlayer.streak} Streak!</span>
                {currentPlayer.streak >= 3 && (
                  <span className="text-sm">
                    (x{streakBonusMultiplier(currentPlayer.streak).toFixed(2)})
                  </span>
                )}
              </div>
            )}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                timeRemaining <= 5 ? "bg-red-500 animate-pulse" : "bg-white/20"
              } text-white`}
            >
              <Timer className="h-5 w-5" />
              <span className="font-bold text-xl">{timeRemaining}s</span>
            </div>
          </div>
        </div>

        <Progress value={(timeRemaining / 20) * 100} className="mb-6 h-2" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card className="bg-white/95 backdrop-blur shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: categoryColors[currentQuestion.category] }}
                  >
                    {categoryLabels[currentQuestion.category]}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentQuestion.difficulty === "easy"
                        ? "bg-green-100 text-green-700"
                        : currentQuestion.difficulty === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {difficultyPoints[currentQuestion.difficulty]} pts
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  {currentQuestion.question}
                </h2>

                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === currentQuestion.correctAnswer;
                    
                    let buttonStyle = "border-2 border-gray-200 hover:border-blue-400 bg-white";
                    
                    if (showAnswer) {
                      if (isCorrect) {
                        buttonStyle = "border-2 border-green-500 bg-green-100";
                      } else if (isSelected && !isCorrect) {
                        buttonStyle = "border-2 border-red-500 bg-red-100";
                      } else {
                        buttonStyle = "border-2 border-gray-200 bg-gray-50 opacity-60";
                      }
                    } else if (isSelected) {
                      buttonStyle = "border-2 border-blue-500 bg-blue-100";
                    }

                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className={`w-full p-4 h-auto text-left justify-start ${buttonStyle}`}
                        onClick={() => !showAnswer && submitAnswer(index)}
                        disabled={showAnswer || selectedAnswer !== null}
                      >
                        <span className="flex items-center gap-3 w-full">
                          <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 shrink-0">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-gray-800 flex-1">{option}</span>
                          {showAnswer && isCorrect && (
                            <Check className="h-5 w-5 text-green-600 shrink-0" />
                          )}
                          {showAnswer && isSelected && !isCorrect && (
                            <X className="h-5 w-5 text-red-600 shrink-0" />
                          )}
                        </span>
                      </Button>
                    );
                  })}
                </div>

                {showAnswer && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">Explanation</h3>
                    <p className="text-blue-700">{currentQuestion.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-white/95 backdrop-blur shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-gray-500" />
                  <h3 className="font-semibold text-gray-700">Live Scores</h3>
                </div>
                <div className="space-y-2">
                  {sortedPlayers.map((player, index) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        player.id === playerId
                          ? "bg-blue-100 border border-blue-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
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
                          <span className="font-medium text-gray-800 text-sm">
                            {player.name}
                            {player.id === playerId && " (You)"}
                          </span>
                          {player.streak > 0 && (
                            <div className="flex items-center gap-1 text-orange-500">
                              <Zap className="h-3 w-3" />
                              <span className="text-xs">{player.streak}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-blue-600">
                        {player.score}
                      </span>
                    </div>
                  ))}
                </div>

                {currentPlayer && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {currentPlayer.score}
                      </div>
                      <div className="text-sm text-gray-500">Your Score</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                      <div className="bg-green-50 p-2 rounded">
                        <div className="font-bold text-green-600">
                          {currentPlayer.correctAnswers}
                        </div>
                        <div className="text-xs text-gray-500">Correct</div>
                      </div>
                      <div className="bg-orange-50 p-2 rounded">
                        <div className="font-bold text-orange-600">
                          {currentPlayer.bestStreak}
                        </div>
                        <div className="text-xs text-gray-500">Best Streak</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
