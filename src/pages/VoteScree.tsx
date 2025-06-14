import bg from "../assets/bg.jpeg";
import logo from "../assets/logo.png";
import civilianIcon from "../assets/civilain.png";
import undercoverIcon from "../assets/undercover.png";
import mrWhiteIcon from "../assets/mrwhite.png";
import cardSilhouette from "../assets/cards.png";
import GameLogo from "../components/GameLogo";
import RoleList from "../components/RoleList";
import { useState } from "react";

// Dummy roles & players, ganti dengan data dari Firestore/game state
const roles = {
  civilian: 3,
  undercover: 1,
  mrWhite: 1,
};
const players = [
  { id: "1", name: "Name 1" },
  { id: "2", name: "Name 2" },
  { id: "3", name: "Name 3" },
  { id: "4", name: "Name 4" },
  { id: "5", name: "Name 5" },
];

const ROLE_META = {
  civilian: {
    label: "Civilain",
    color: "#8fa9d9",
    icon: civilianIcon,
  },
  undercover: {
    label: "Undercover",
    color: "#2d2e3e",
    icon: undercoverIcon,
  },
  mrWhite: {
    label: "Mr. White",
    color: "#ffe7a0",
    icon: mrWhiteIcon,
  },
};

export default function VoteScreen() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

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

      {/* Main Layout */}
      <div className="relative z-10 flex flex-row items-center justify-center w-full max-w-7xl px-2 md:px-8">
        {/* Left Card: Voting Panel & Roles */}
        <div className="bg-[#f5f6f7]/95 rounded-2xl shadow-xl w-[320px] min-h-[320px] flex flex-col px-8 py-8 mr-4 md:mr-12">
          <div
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "'Luckiest Guy', cursive" }}
          >
            Find Them
          </div>
          <div className="text-[#3b5c7e] text-md mb-6 font-semibold">
            vote to eliminate
          </div>
          <RoleList roles={roles} meta={ROLE_META} />
          <button
            className="w-full bg-[#FFD6BA] text-[#22364a] cursor-pointer font-bold text-2xl py-2 rounded-lg shadow-lg hover:bg-[#FFB3B3]/90 transition mt-8"
            style={{ marginTop: "auto" }}
            disabled={selectedIdx === null}
          >
            Vote
          </button>
        </div>
        {/* Player Cards Grid */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className="grid gap-8"
            style={{
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gridTemplateRows: `repeat(${Math.ceil(players.length / 3)}, minmax(0, 1fr))`,
              minWidth: 340,
              maxWidth: 700,
            }}
          >
            {players.map((player, idx) => (
              <div key={player.id} className="flex flex-col items-center">
                <div className="relative">
                  <button
                    className={`bg-[#ffe7a0] rounded-xl shadow-lg w-[120px] h-[170px] md:w-[150px] md:h-[210px] flex items-center justify-center border-4 border-[#22364a] transition
                      hover:scale-105
                      ${selectedIdx === idx ? "ring-4 ring-blue-400" : ""}
                    `}
                    onClick={() => setSelectedIdx(idx)}
                  >
                    <img
                      src={cardSilhouette}
                      alt="?"
                      className="w-16 h-16 md:w-20 md:h-20 opacity-90"
                    />
                  </button>
                  <span
                    className="absolute -top-4 -left-4 bg-[#8fa9d9] text-[#22364a] font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-white text-lg"
                    style={{ fontFamily: "'Luckiest Guy', cursive" }}
                  >
                    {idx + 1}
                  </span>
                </div>
                <div
                  className="mt-2 text-xl font-bold text-white drop-shadow"
                  style={{ fontFamily: "'Luckiest Guy', cursive" }}
                >
                  {player.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}