import { useState } from "react";
import { useTriviaGame } from "@/lib/stores/useTriviaGame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Play } from "lucide-react";
import { categoryLabels, difficultyLabels, type InvestmentCategory, type Difficulty } from "@shared/trivia";

export function CreateRoom() {
  const { setScreen, createRoom, playerName, startSinglePlayer } = useTriviaGame();
  const [roomName, setRoomName] = useState(`${playerName}'s Room`);
  const [selectedCategories, setSelectedCategories] = useState<InvestmentCategory[]>(
    Object.keys(categoryLabels) as InvestmentCategory[]
  );
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [isSinglePlayer, setIsSinglePlayer] = useState(false);

  const toggleCategory = (category: InvestmentCategory) => {
    if (selectedCategories.includes(category)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== category));
      }
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleStart = () => {
    if (isSinglePlayer) {
      startSinglePlayer(selectedCategories, difficulty, totalQuestions);
    } else {
      if (!roomName.trim() || selectedCategories.length === 0) return;
      createRoom({
        roomName: roomName.trim(),
        categories: selectedCategories,
        difficulty,
        totalQuestions,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Button
          variant="ghost"
          className="text-white mb-4 hover:bg-white/20"
          onClick={() => setScreen("menu")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Menu
        </Button>

        <Card className="bg-white/95 backdrop-blur shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-gray-800 text-2xl">
              Game Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4 justify-center">
              <Button
                variant={!isSinglePlayer ? "default" : "outline"}
                onClick={() => setIsSinglePlayer(false)}
                className={!isSinglePlayer ? "bg-blue-600" : ""}
              >
                Multiplayer
              </Button>
              <Button
                variant={isSinglePlayer ? "default" : "outline"}
                onClick={() => setIsSinglePlayer(true)}
                className={isSinglePlayer ? "bg-green-600" : ""}
              >
                Single Player
              </Button>
            </div>

            {!isSinglePlayer && (
              <div>
                <Label htmlFor="roomName" className="text-gray-700">
                  Room Name
                </Label>
                <Input
                  id="roomName"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter room name"
                  maxLength={30}
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label className="text-gray-700 block mb-3">
                Categories (select at least one)
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(categoryLabels) as [InvestmentCategory, string][]).map(
                  ([id, label]) => (
                    <div
                      key={id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCategories.includes(id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => toggleCategory(id)}
                    >
                      <Checkbox
                        checked={selectedCategories.includes(id)}
                        onCheckedChange={() => toggleCategory(id)}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {label}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <Label className="text-gray-700 block mb-3">Difficulty</Label>
              <div className="flex gap-3">
                {(Object.entries(difficultyLabels) as [Difficulty, string][]).map(
                  ([id, label]) => (
                    <Button
                      key={id}
                      variant={difficulty === id ? "default" : "outline"}
                      className={`flex-1 ${
                        difficulty === id
                          ? id === "easy"
                            ? "bg-green-500 hover:bg-green-600"
                            : id === "medium"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-red-500 hover:bg-red-600"
                          : ""
                      }`}
                      onClick={() => setDifficulty(id)}
                    >
                      {label}
                    </Button>
                  )
                )}
              </div>
            </div>

            <div>
              <Label className="text-gray-700 block mb-3">
                Number of Questions: {totalQuestions}
              </Label>
              <div className="flex gap-3">
                {[5, 10, 15, 20, 25].map((num) => (
                  <Button
                    key={num}
                    variant={totalQuestions === num ? "default" : "outline"}
                    className={`flex-1 ${
                      totalQuestions === num ? "bg-blue-600" : ""
                    }`}
                    onClick={() => setTotalQuestions(num)}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg"
              onClick={handleStart}
              disabled={
                !isSinglePlayer && (!roomName.trim() || selectedCategories.length === 0)
              }
            >
              <Play className="mr-2 h-5 w-5" />
              {isSinglePlayer ? "Start Practice" : "Create Room"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
