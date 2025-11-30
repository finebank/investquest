import { useEffect } from "react";
import { useTriviaGame } from "@/lib/stores/useTriviaGame";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, RefreshCw } from "lucide-react";
import { categoryLabels, difficultyLabels } from "@shared/trivia";

export function JoinRoom() {
  const { setScreen, rooms, joinRoom, requestRoomsList, connected } = useTriviaGame();

  useEffect(() => {
    if (connected) {
      requestRoomsList();
      const interval = setInterval(requestRoomsList, 5000);
      return () => clearInterval(interval);
    }
  }, [connected, requestRoomsList]);

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
            onClick={requestRoomsList}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <Card className="bg-white/95 backdrop-blur shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-gray-800 text-2xl">
              Available Rooms
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rooms.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No rooms available</p>
                <p className="text-sm mt-2">
                  Create a new room or wait for others to create one
                </p>
                <Button
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={() => setScreen("create_room")}
                >
                  Create a Room
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {room.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Users className="h-4 w-4" />
                          <span>
                            {room.playerCount}/{room.maxPlayers} Players
                          </span>
                          <span className="mx-2">•</span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              room.difficulty === "easy"
                                ? "bg-green-100 text-green-700"
                                : room.difficulty === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {difficultyLabels[room.difficulty]}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {room.categories.slice(0, 3).map((cat) => (
                            <span
                              key={cat}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
                            >
                              {categoryLabels[cat]}
                            </span>
                          ))}
                          {room.categories.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{room.categories.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => joinRoom(room.id)}
                        disabled={room.playerCount >= room.maxPlayers}
                      >
                        Join
                      </Button>
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
