import { useState } from "react";
import { useAuth } from "@/lib/stores/useAuth";
import { useTriviaGame } from "@/lib/stores/useTriviaGame";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Trophy, 
  Target, 
  Zap, 
  GamepadIcon, 
  Medal,
  Edit2,
  Check,
  X,
  SkipForward,
  Clock,
  Star
} from "lucide-react";
import { categoryLabels } from "@shared/trivia";

const avatarColors = [
  "#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", 
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1"
];

export function UserProfile() {
  const { user, achievements, categoryStats, recentGames, updateProfile, logout } = useAuth();
  const { setScreen } = useTriviaGame();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || "");

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4 flex items-center justify-center">
        <Card className="bg-gray-800/50 border-gray-700 p-8">
          <p className="text-white">Please log in to view your profile</p>
          <Button onClick={() => setScreen("menu")} className="mt-4">
            Back to Menu
          </Button>
        </Card>
      </div>
    );
  }

  const accuracy = user.totalQuestionsAnswered && user.totalQuestionsAnswered > 0
    ? Math.round((user.totalCorrectAnswers || 0) / user.totalQuestionsAnswered * 100)
    : 0;

  const handleSaveName = async () => {
    await updateProfile({ displayName: newDisplayName });
    setIsEditingName(false);
  };

  const handleColorChange = async (color: string) => {
    await updateProfile({ avatarColor: color });
  };

  const handleLogout = async () => {
    await logout();
    setScreen("menu");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => setScreen("menu")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-red-500/50 text-red-400 hover:bg-red-500/20"
          >
            Sign Out
          </Button>
        </div>

        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white"
                style={{ backgroundColor: user.avatarColor || "#3b82f6" }}
              >
                {(user.displayName || user.username).charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white w-48"
                      />
                      <Button size="sm" onClick={handleSaveName} className="bg-green-600">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setIsEditingName(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-white">
                        {user.displayName || user.username}
                      </h2>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setNewDisplayName(user.displayName || user.username);
                          setIsEditingName(true);
                        }}
                        className="text-gray-400 hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
                <p className="text-gray-400">@{user.username}</p>

                <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                  {avatarColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
                        user.avatarColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-gray-800" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <GamepadIcon className="w-6 h-6 mx-auto mb-1 text-blue-400" />
                  <div className="text-2xl font-bold text-white">{user.totalGamesPlayed || 0}</div>
                  <div className="text-xs text-gray-400">Games</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <Trophy className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
                  <div className="text-2xl font-bold text-white">{user.gamesWon || 0}</div>
                  <div className="text-xs text-gray-400">Wins</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <Zap className="w-6 h-6 mx-auto mb-1 text-orange-400" />
                  <div className="text-2xl font-bold text-white">{user.highestStreak || 0}</div>
                  <div className="text-xs text-gray-400">Best Streak</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <Target className="w-6 h-6 mx-auto mb-1 text-green-400" />
                  <div className="text-2xl font-bold text-white">{accuracy}%</div>
                  <div className="text-xs text-gray-400">Accuracy</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 border-purple-500/30">
            <CardContent className="p-4 flex items-center gap-3">
              <SkipForward className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">{user.skipPowerUps || 0}</div>
                <div className="text-xs text-purple-300">Skip Power-ups</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-600/30 to-yellow-800/30 border-yellow-500/30">
            <CardContent className="p-4 flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">{user.doublePointsPowerUps || 0}</div>
                <div className="text-xs text-yellow-300">Double Points</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-cyan-600/30 to-cyan-800/30 border-cyan-500/30">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="w-8 h-8 text-cyan-400" />
              <div>
                <div className="text-2xl font-bold text-white">{user.extraTimePowerUps || 0}</div>
                <div className="text-xs text-cyan-300">Extra Time</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="history">Game History</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {achievements.length === 0 ? (
                <Card className="col-span-full bg-gray-800/50 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <Medal className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <p className="text-gray-400">No achievements yet. Start playing to earn badges!</p>
                  </CardContent>
                </Card>
              ) : (
                achievements.map((ua) => (
                  <Card key={ua.id} className="bg-gray-800/50 border-gray-700 hover:border-yellow-500/50 transition-colors">
                    <CardContent className="p-4 text-center">
                      <div className="text-4xl mb-2">{ua.achievement.icon}</div>
                      <h3 className="font-bold text-white">{ua.achievement.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{ua.achievement.description}</p>
                      <div className="mt-2 text-xs text-yellow-400">
                        +{ua.achievement.points} pts
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-4">
            <div className="grid gap-4">
              {Object.entries(categoryLabels).map(([id, label]) => {
                const stat = categoryStats.find((s) => s.category === id);
                const answered = stat?.questionsAnswered || 0;
                const correct = stat?.correctAnswers || 0;
                const catAccuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

                return (
                  <Card key={id} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-white">{label}</h3>
                        <span className="text-sm text-gray-400">
                          {correct}/{answered} correct
                        </span>
                      </div>
                      <Progress value={catAccuracy} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{catAccuracy}% accuracy</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="space-y-3">
              {recentGames.length === 0 ? (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <GamepadIcon className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <p className="text-gray-400">No games played yet. Start your first game!</p>
                  </CardContent>
                </Card>
              ) : (
                recentGames.map((game) => (
                  <Card key={game.id} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white capitalize">
                              {game.gameMode}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              game.difficulty === "easy" ? "bg-green-500/20 text-green-400" :
                              game.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                              "bg-red-500/20 text-red-400"
                            }`}>
                              {game.difficulty}
                            </span>
                            {game.isWinner && (
                              <Trophy className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                          <p className="text-sm text-gray-400">
                            {game.correctAnswers}/{game.totalQuestions} correct
                            {game.bestStreak && game.bestStreak > 0 && ` • ${game.bestStreak} streak`}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-white">{game.score}</div>
                          <div className="text-xs text-gray-500">
                            {game.playedAt && new Date(game.playedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
