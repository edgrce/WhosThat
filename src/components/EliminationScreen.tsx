import bg from "../assets/bg.jpeg";
import { useEffect } from "react";

type Props = {
  role: string;
  username: string;
  onContinue: () => void;
};

export default function EliminationScreen({ role, onContinue }: Props) {
  // Lanjut saat klik di mana saja
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Pastikan event target adalah element yang valid
      if (e.target instanceof HTMLElement) {
        onContinue();
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [onContinue]);

  const roleText = role?.toLowerCase() || "civilian";

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        cursor: "pointer",
      }}
      title="Click anywhere to continue"
    >
      {/* Overlay gelap */}
      <div className="absolute inset-0 bg-[#0b1b2a]/60 z-0" />

      {/* Teks utama */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 select-none">
        <h1
          className="text-3xl md:text-4xl font-bold text-white mb-12 drop-shadow-lg animate-fade-in"
          style={{
            fontFamily: "'Luckiest Guy', cursive",
            textShadow: "2px 4px 12px #22364a, 0 2px 0 #000",
            letterSpacing: 1,
          }}
        >
          a {roleText} has been eliminated
        </h1>
        <p className="text-white/80 text-lg animate-fade-in" style={{ animationDelay: "0.3s" }}>
          Click anywhere to continue
        </p>
      </div>
    </div>
  );
}