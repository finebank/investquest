import { useTriviaGame } from "@/lib/stores/useTriviaGame";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Crown, Check, X, Play, Users } from "lucide-react";
import { categoryLabels, difficultyLabels } from "@shared/trivia";

export function Lobby() {
  const { room, playerId, leaveRoom, toggleReady, startGame } = useTriviaGame();

  if (!room) return null;

  const isHost = playerId === room.hostId;
  const currentPlayer = room.players.find((p) => p.id === playerId);
  const allReady = room.players.every((p) => p.isReady || p.id === room.hostId);
  const canStart = isHost && room.players.length >= 1 && (allReady || room.players.length === 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Button
          variant="ghost"
          className="text-white mb-4 hover:bg-white/20"
          onClick={leaveRoom}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Leave Room
        </Button>

        <Card className="bg-white/95 backdrop-blur shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-gray-800 text-2xl">
              {room.name}
            </CardTitle>
            <div className="flex justify-center gap-4 text-sm text-gray-600">
              <span className={`px-3 py-1 rounded ${
                room.difficulty === "easy"
                  ? "bg-green-100 text-green-700"
                  : room.difficulty === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {difficultyLabels[room.difficulty]}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded">
                {room.totalQuestions} Questions
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {room.selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                  >
                    {categoryLabels[cat]}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500">
                  Players ({room.players.length}/6)
                </h3>
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-2">
                {room.players.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      player.id === playerId
                        ? "bg-blue-50 border-2 border-blue-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {player.id === room.hostId && (
                        <Crown className="h-5 w-5 text-yellow-500" />
                      )}
                      <span className="font-medium text-gray-800">
                        {player.name}
                        {player.id === playerId && " (You)"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {player.id === room.hostId ? (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                          Host
                        </span>
                      ) : player.isReady ? (
                        <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          <Check className="h-3 w-3" /> Ready
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                          <X className="h-3 w-3" /> Not Ready
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {!isHost && (
                <Button
                  size="lg"
                  className={`w-full py-6 text-lg ${
                    currentPlayer?.isReady
                      ? "bg-gray-500 hover:bg-gray-600"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  onClick={toggleReady}
                >
                  {currentPlayer?.isReady ? (
                    <>
                      <X className="mr-2 h-5 w-5" />
                      Cancel Ready
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Ready Up
                    </>
                  )}
                </Button>
              )}

              {isHost && (
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg"
                  onClick={startGame}
                  disabled={!canStart}
                >
                  <Play className="mr-2 h-5 w-5" />
                  {canStart ? "Start Game" : "Waiting for players..."}
                </Button>
              )}
            </div>

            {isHost && !canStart && room.players.length > 1 && (
              <p className="text-center text-sm text-gray-500">
                Waiting for all players to be ready...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
