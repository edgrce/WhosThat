import bg from "../assets/bg.jpeg";
import logo from "../assets/logo.png";
import cardSilhouette from "../assets/cards.png";
import GameLogo from "../components/GameLogo";
import RoleList from "../components/RoleList";
import EliminationScreen from "../components/EliminationScreen";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "../firebase/config";
import ROLE_META from "../constants/RoleMeta";
import {
  finalizeEliminationAndCheckWinner,
} from "../hooks/useGameElimination";

type Player = {
  id: string;
  username: string;
  role: string;
  score: number;
  word: string;
  eliminated?: boolean;
};

export default function VoteScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { gameId, roles: initRoles } = location.state || {};

  const [roles, setRoles] = useState(initRoles || {});
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [eliminatedPlayer, setEliminatedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (!gameId) return;

    const fetchAll = async () => {
      // ✅ Kalau roles kosong, ambil dari Firestore supaya tidak stuck
      if (!initRoles) {
        const gameDoc = await getDoc(doc(db, "games", gameId));
        const rolesFromDB = gameDoc.data()?.roles || {};
        setRoles(rolesFromDB);
      }

      // ✅ Fetch players
      const snap = await getDocs(collection(db, "games", gameId, "players"));
      const arr: Player[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        arr.push({
          id: docSnap.id,
          username: data.username,
          role: data.role?.toLowerCase(),
          score: data.score,
          word: data.word,
          eliminated: data.eliminated,
        });
      });
      setPlayers(arr);
    };

    fetchAll();
  }, [gameId, eliminatedPlayer]);

  const handleElimination = () => {
    if (selectedIdx === null) return;
    const player = players[selectedIdx];
    setEliminatedPlayer(player);
    setShowConfirm(false);
  };

  if (eliminatedPlayer) {
    const role = eliminatedPlayer.role.toLowerCase();

    if (role === "mrwhite") {
      // ✅ Mr White → Tandai eliminated + redirect ke tebak kata
      // Jangan finalize winner di sini!
      const playerRef = doc(db, "games", gameId, "players", eliminatedPlayer.id);
      updateDoc(playerRef, { eliminated: true }).then(() => {
        navigate("/mrwhiteguess", { state: { gameId } });
      });
      return null;
    }

    return (
      <EliminationScreen
        role={eliminatedPlayer.role}
        username={eliminatedPlayer.username}
        onContinue={async () => {
          try {
            await finalizeEliminationAndCheckWinner(
              gameId,
              eliminatedPlayer.id,
              navigate
            );
            setEliminatedPlayer(null);
            setSelectedIdx(null);
          } catch (error) {
            console.error("Failed to finalize:", error);
          }
        }}
      />
    );
  }

  if (!roles) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b1b2a] text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center font-sans"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#0b1b2a]/70 z-0" />
      <GameLogo src={logo} onClick={() => navigate("/dashboard")} />

      <div className="relative z-10 flex flex-row items-center justify-center w-full max-w-7xl px-2 md:px-8">
        <div className="bg-[#f5f6f7]/95 rounded-2xl shadow-xl w-[320px] min-h-[320px] flex flex-col px-8 py-8 mr-4 md:mr-12">
          <div className="text-2xl font-bold mb-2">Find Them</div>
          <div className="text-[#3b5c7e] text-md mb-6 font-semibold">
            vote to eliminate
          </div>
          <RoleList roles={roles} meta={ROLE_META} />
          <button
            className={`w-full font-bold text-2xl py-2 rounded-lg shadow-lg transition mt-8 ${
              selectedIdx === null
                ? "bg-[#ffe7a0] text-[#22364a] cursor-not-allowed"
                : "bg-[#FFB3B3] text-[#22364a] hover:bg-[#FFB3B3]/90 cursor-pointer"
            }`}
            disabled={selectedIdx === null}
            onClick={() => setShowConfirm(true)}
          >
            Elimination
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className="grid gap-8"
            style={{
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gridTemplateRows: `repeat(${Math.ceil(
                players.length / 3
              )}, minmax(0, 1fr))`,
              minWidth: 340,
              maxWidth: 700,
            }}
          >
            {players.map((player, idx) => {
              const isEliminated = player.eliminated;
              return (
                <div key={player.id} className="flex flex-col items-center">
                  <div className="relative">
                    <button
                      className={`bg-[#ffe7a0] rounded-xl shadow-lg w-[120px] h-[170px] md:w-[150px] md:h-[210px] flex items-center justify-center border-4 border-[#22364a] transition
                        ${
                          selectedIdx === idx
                            ? "ring-4 ring-pink-400 scale-105"
                            : ""
                        }
                        ${
                          isEliminated
                            ? "opacity-40 grayscale blur-[1px] cursor-not-allowed"
                            : "hover:scale-105"
                        }
                      `}
                      onClick={() => !isEliminated && setSelectedIdx(idx)}
                      disabled={isEliminated}
                    >
                      <img
                        src={cardSilhouette}
                        alt="?"
                        className="w-16 h-16 md:w-20 md:h-20 opacity-90"
                      />
                    </button>
                    <span
                      className={`absolute -top-4 -left-4 font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-white text-lg
                        ${
                          isEliminated
                            ? "bg-pink-300 text-white"
                            : "bg-[#8fa9d9] text-[#22364a]"
                        }
                      `}
                    >
                      {idx + 1}
                    </span>
                  </div>
                  <div
                    className={`mt-2 text-xl font-bold drop-shadow ${
                      isEliminated ? "text-pink-300 line-through" : "text-white"
                    }`}
                  >
                    {player.username}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showConfirm && selectedIdx !== null && !eliminatedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center">
            <div className="text-2xl font-bold mb-4 text-[#22364a]">
              Are you sure you want to eliminate{" "}
              <span className="text-pink-600">
                {players[selectedIdx].username}
              </span>
              ?
            </div>
            <div className="flex gap-6 mt-4">
              <button
                className="bg-[#FFB3B3] text-[#22364a] font-bold px-6 py-2 rounded-lg shadow hover:bg-[#ffe7a0] transition"
                onClick={handleElimination}
              >
                Yes, Eliminate
              </button>
              <button
                className="bg-gray-300 text-[#22364a] font-bold px-6 py-2 rounded-lg shadow hover:bg-gray-400 transition"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
