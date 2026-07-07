import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { setBgVolume, startBgMusic } from "@/lib/sounds";

/**
 * Watches route changes and adjusts BG music volume.
 * Medium (0.4) on landing/dashboard/profile/results/admin/auth pages.
 * Dim (0.08) during /quiz/* so students aren't distracted.
 */
export default function BackgroundMusic() {
  const location = useLocation();

  useEffect(() => {
    // Ensure the audio object exists; actual play() requires first gesture.
    startBgMusic();

    const path = location.pathname || "/";
    const isQuiz = path.startsWith("/quiz/");
    setBgVolume(isQuiz ? 0.08 : 0.4);
  }, [location.pathname]);

  return null;
}
