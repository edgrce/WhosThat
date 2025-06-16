import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import bg from "../assets/bg.jpeg";
import logo from "../assets/logo.png";
import GameLogo from "../components/GameLogo";

const MIN_PLAYERS = 4;
const MAX_PLAYERS = 12;

const defaultRoles = (players: number) => ({
  civilian: players - 2,
  undercover: 1,
  mrWhite: 1,
});

export default function GameSetup() {
  const [players, setPlayers] = useState(5);
  const [roles, setRoles] = useState(defaultRoles(5));
  const [difficulty, setDifficulty] = useState<"easy" | "hard">("easy");
  const navigate = useNavigate();

  const handlePlayersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPlayers(value);
    setRoles(defaultRoles(value));
  };

  const handleRoleChange = (role: keyof typeof roles, delta: number) => {
    const newRoles = { ...roles, [role]: roles[role] + delta };
    const total = Object.values(newRoles).reduce((a, b) => a + b, 0);
    if (newRoles[role] < 1) return;
    if (total > players) return;
    setRoles(newRoles);
  };

  const canStart = Object.values(roles).reduce((a, b) => a + b, 0) === players;

  const handleStart = async () => {
    try {
      const gameId = `game_${Date.now()}`;

      // 1️⃣ Ambil satu pasang kata dari collection words sesuai difficulty
      const q = query(collection(db, "words"), where("difficulty", "==", difficulty));
      const snap = await getDocs(q);
      const wordsArr = snap.docs.map(doc => doc.data());
      if (wordsArr.length === 0) {
        alert("No word found for this difficulty.");
        return;
      }
      const randomWord = wordsArr[Math.floor(Math.random() * wordsArr.length)];

      // 2️⃣ Simpan ke Firestore: games/{gameId}
      const gameRef = doc(db, "games", gameId);
      await setDoc(gameRef, {
        difficulty,
        roles,
        word1: randomWord.word1,
        word2: randomWord.word2,
        createdAt: new Date(),
      });

      // 3️⃣ Lanjut ke player draw, bawa gameId dan info
      navigate("/playerdraw", {
        state: {
          gameId,
          playersCount: players,
          roles,
          difficulty,
          currentPlayer: 1,
          assignedRoles: [],
          assignedNames: [],
        },
      });
    } catch (err) {
      console.error("Failed to start game:", err);
      alert("Failed to start game. Please try again.");
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center font-sans"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0b1b2a]/70 z-0" />

      {/* Logo */}
      <GameLogo src={logo} />

      {/* Main Card */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Player & Slider */}
        <div className="mb-5 text-center text-[#ffe7a0] text-3xl font-bold drop-shadow tracking-wider">
          Player : {players}
        </div>
        <div className="w-[420px] flex items-center justify-center mb-2 relative">
          <input
            type="range"
            min={MIN_PLAYERS}
            max={MAX_PLAYERS}
            value={players}
            onChange={handlePlayersChange}
            className="w-full h-4 rounded-lg appearance-none bg-[#22364a] accent-[#22364a] outline-none mb-10
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-10
              [&::-webkit-slider-thumb]:h-10
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[#22364a]
              [&::-webkit-slider-thumb]:border-4
              [&::-webkit-slider-thumb]:border-[#ffe7a0]
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-moz-range-thumb]:w-10
              [&::-moz-range-thumb]:h-10
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-[#22364a]
              [&::-moz-range-thumb]:border-4
              [&::-moz-range-thumb]:border-[#ffe7a0]
              [&::-ms-thumb]:w-10
              [&::-ms-thumb]:h-10
              [&::-ms-thumb]:rounded-full
              [&::-ms-thumb]:bg-[#22364a]
              [&::-ms-thumb]:border-4
              [&::-ms-thumb]:border-[#ffe7a0]
            "
            style={{
              background: "linear-gradient(to right, #0C3B5D 0%, #0C3B5D 100%)",
            }}
          />
        </div>

        {/* Roles Card */}
        <div className="bg-white/80 rounded-xl shadow-xl w-[420px] px-8 py-6 flex flex-col items-center mb-8">
          {(["civilian", "undercover", "mrWhite"] as const).map((role) => (
            <div
              key={role}
              className={`flex items-center justify-between w-full mb-3 last:mb-0`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-base font-bold  ${
                    role === "civilian"
                      ? "bg-[#bfc3d1] text-[#22364a]"
                      : role === "undercover"
                      ? "bg-[#2c2e4a] text-white"
                      : "bg-[#FFD586] text-[#0C3B5D]"
                  }`}
                >
                  {roles[role]}
                </span>
                <span
                  className={`text-lg font-bold w-60 text-center ${
                    role === "civilian"
                      ? "text-[#22364a] bg-[#bfc3d1] rounded-full px-2"
                      : role === "undercover"
                      ? "text-white bg-[#2c2e4a] rounded-full px-2"
                      : "text-[#2c2e4a] bg-[#FFD586] rounded-full px-2"
                  }`}
                >
                  {role === "mrWhite"
                    ? "Mr. White"
                    : role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-lg transition
                    ${
                      role === "civilian"
                        ? "bg-[#bfc3d1] text-[#22364a] hover:bg-[#dbe0ee]"
                        : role === "undercover"
                        ? "bg-[#2c2e4a] text-white hover:bg-[#3a3c5a]"
                        : "bg-[#FFD586] text-[#22364a] hover:bg-[#fff3c0]"
                    }`}
                  onClick={() => handleRoleChange(role, -1)}
                  disabled={roles[role] <= 1}
                >
                  -
                </button>
                <button
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-lg transition
                    ${
                      role === "civilian"
                        ? "bg-[#bfc3d1] text-[#22364a] hover:bg-[#dbe0ee]"
                        : role === "undercover"
                        ? "bg-[#2c2e4a] text-white hover:bg-[#3a3c5a]"
                        : "bg-[#FFD586] text-[#22364a] hover:bg-[#fff3c0]"
                    }`}
                  onClick={() => handleRoleChange(role, 1)}
                  disabled={
                    Object.values(roles).reduce((a, b) => a + b, 0) >= players
                  }
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Difficulty & Start */}
        <div className="flex gap-6 w-[420px]">
          <div className="flex flex-col items-center bg-white/80 w-1/2 rounded-lg p-2 shawdow">
            <span className="text-xs text-[#22364a] font-bold tracking-wide">
              difficult
            </span>
            <select
              className="w-full px-0 rounded-lg text-[#22364a] font-bold text-2xl text-center border-0 focus:outline-none"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as "easy" | "hard")}
              style={{ fontFamily: "inherit" }}
            >
              <option value="easy">easy</option>
              <option value="hard">hard</option>
            </select>
          </div>
          <button
            className={`w-1/2 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#ffe7a0] text-[#22364a] font-bold text-2xl shadow-lg transition
              ${
                !canStart
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#ffe7a0]/90 hover:shadow-xl cursor-pointer"
              }`}
            disabled={!canStart}
            onClick={handleStart}
          >
            <svg
              className="mr-2"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22364a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" fill="#ffe7a0" />
            </svg>
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
