import { useEffect, useState } from "react";
import logo from "@/assets/mv-player-logo.png";

const SplashScreen = ({ onDone }: { onDone: () => void }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDone();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onDone]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <img src={logo} alt="MV Player" className="h-28 w-28 mb-4 animate-fade-in" />
      <h1 className="text-3xl font-bold text-primary animate-fade-in">MV Player</h1>
    </div>
  );
};

export default SplashScreen;
