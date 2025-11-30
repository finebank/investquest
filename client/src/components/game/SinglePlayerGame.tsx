import { useEffect, useRef, useState } from "react";
import { useTriviaGame } from "@/lib/stores/useTriviaGame";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer, Zap, Check, X, ArrowLeft } from "lucide-react";
import { categoryLabels, categoryColors, difficultyPoints, streakBonusMultiplier } from "@shared/trivia";
import { useAudio } from "@/lib/stores/useAudio";

export function SinglePlayerGame() {
  const {
    singlePlayerQuestions,
    singlePlayerQuestionIndex,
    singlePlayerScore,
    singlePlayerStreak,
    singlePlayerBestStreak,
    singlePlayerTimeRemaining,
    singlePlayerShowAnswer,
    singlePlayerCorrectAnswers,
    selectedAnswer,
    submitSinglePlayerAnswer,
    nextSinglePlayerQuestion,
    setScreen,
    resetSinglePlayer,
    updateSinglePlayerTimer,
  } = useTriviaGame();
  
  const { playSuccess, playHit } = useAudio();
  const [timeRemaining, setTimeRemaining] = useState(20);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevShowAnswerRef = useRef(false);

  const currentQuestion = singlePlayerQuestions[singlePlayerQuestionIndex];

  useEffect(() => {
    if (singlePlayerShowAnswer && !prevShowAnswerRef.current) {
      if (currentQuestion && selectedAnswer !== null) {
        if (selectedAnswer === currentQuestion.correctAnswer) {
          playSuccess();
        } else {
          playHit();
        }
      }
    }
    prevShowAnswerRef.current = singlePlayerShowAnswer;
  }, [singlePlayerShowAnswer, selectedAnswer, currentQuestion, playSuccess, playHit]);

  useEffect(() => {
    setTimeRemaining(20);
    updateSinglePlayerTimer(20);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (!singlePlayerShowAnswer) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          updateSinglePlayerTimer(newTime);
          if (newTime <= 0) {
            clearInterval(timerRef.current!);
            updateSinglePlayerTimer(0);
            submitSinglePlayerAnswer(-1);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [singlePlayerQuestionIndex, singlePlayerShowAnswer, updateSinglePlayerTimer]);

  useEffect(() => {
    if (singlePlayerShowAnswer && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [singlePlayerShowAnswer]);

  const handleLeave = () => {
    resetSinglePlayer();
    setScreen("menu");
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={handleLeave}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Leave
          </Button>
          <div className="text-white">
            <span className="text-xl font-bold">
              Question {singlePlayerQuestionIndex + 1}/{singlePlayerQuestions.length}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {singlePlayerStreak > 0 && (
              <div className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full animate-pulse">
                <Zap className="h-5 w-5" />
                <span className="font-bold">{singlePlayerStreak} Streak!</span>
                {singlePlayerStreak >= 3 && (
                  <span className="text-sm">
                    (x{streakBonusMultiplier(singlePlayerStreak).toFixed(2)})
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
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
                  {currentQuestion.options.map((option: string, index: number) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === currentQuestion.correctAnswer;
                    
                    let buttonStyle = "border-2 border-gray-200 hover:border-blue-400 bg-white";
                    
                    if (singlePlayerShowAnswer) {
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
                        onClick={() => !singlePlayerShowAnswer && submitSinglePlayerAnswer(index)}
                        disabled={singlePlayerShowAnswer}
                      >
                        <span className="flex items-center gap-3 w-full">
                          <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 shrink-0">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-gray-800 flex-1">{option}</span>
                          {singlePlayerShowAnswer && isCorrect && (
                            <Check className="h-5 w-5 text-green-600 shrink-0" />
                          )}
                          {singlePlayerShowAnswer && isSelected && !isCorrect && (
                            <X className="h-5 w-5 text-red-600 shrink-0" />
                          )}
                        </span>
                      </Button>
                    );
                  })}
                </div>

                {singlePlayerShowAnswer && (
                  <>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-800 mb-2">Explanation</h3>
                      <p className="text-blue-700">{currentQuestion.explanation}</p>
                    </div>
                    <Button
                      size="lg"
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                      onClick={nextSinglePlayerQuestion}
                    >
                      {singlePlayerQuestionIndex + 1 >= singlePlayerQuestions.length
                        ? "See Results"
                        : "Next Question"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-white/95 backdrop-blur shadow-xl">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-700 mb-4 text-center">Your Stats</h3>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-blue-600">
                    {singlePlayerScore}
                  </div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-green-50 p-3 rounded">
                    <div className="font-bold text-green-600 text-xl">
                      {singlePlayerCorrectAnswers}
                    </div>
                    <div className="text-xs text-gray-500">Correct</div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded">
                    <div className="font-bold text-orange-600 text-xl">
                      {singlePlayerBestStreak}
                    </div>
                    <div className="text-xs text-gray-500">Best Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
