import { useEffect } from "react";
import { useTriviaGame } from "@/lib/stores/useTriviaGame";
import { useAudio } from "@/lib/stores/useAudio";
import { MainMenu } from "@/components/game/MainMenu";
import { CreateRoom } from "@/components/game/CreateRoom";
import { JoinRoom } from "@/components/game/JoinRoom";
import { Lobby } from "@/components/game/Lobby";
import { GameScreen } from "@/components/game/GameScreen";
import { SinglePlayerGame } from "@/components/game/SinglePlayerGame";
import { ResultsScreen } from "@/components/game/ResultsScreen";
import { Leaderboard } from "@/components/game/Leaderboard";
import { Toaster } from "@/components/ui/sonner";
import "@fontsource/inter";

function SoundManager() {
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  useEffect(() => {
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);

    const hitSound = new Audio("/sounds/hit.mp3");
    hitSound.volume = 0.5;
    setHitSound(hitSound);

    const successSound = new Audio("/sounds/success.mp3");
    successSound.volume = 0.5;
    setSuccessSound(successSound);

    return () => {
      bgMusic.pause();
      bgMusic.src = "";
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return null;
}

function App() {
  const { screen, connect } = useTriviaGame();

  useEffect(() => {
    connect();
  }, [connect]);

  const renderScreen = () => {
    switch (screen) {
      case "menu":
        return <MainMenu />;
      case "create_room":
        return <CreateRoom />;
      case "join_room":
        return <JoinRoom />;
      case "lobby":
        return <Lobby />;
      case "game":
        return <GameScreen />;
      case "single_player":
        return <SinglePlayerGame />;
      case "results":
        return <ResultsScreen />;
      case "leaderboard":
        return <Leaderboard />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <>
      <SoundManager />
      {renderScreen()}
      <Toaster />
    </>
  );
}

export default App;
