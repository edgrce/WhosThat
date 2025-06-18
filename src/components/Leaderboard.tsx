import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import civilianIcon from "../assets/civilain.png";
import undercoverIcon from "../assets/undercover.png";
import mrwhiteIcon from "../assets/mrwhite.png";

interface Player {
  username: string;
  role: string;
  score: number;
  totalScore?: number;
}

interface LeaderboardProps {
  gameId?: string;
  readOnly?: boolean;
}

export default function Leaderboard({
  gameId,
  readOnly = false,
}: LeaderboardProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [maxScore, setMaxScore] = useState(0);

  useEffect(() => {
    const fetchPlayers = async () => {
      let playersRef;
      if (gameId) {
        playersRef = collection(db, "games", gameId, "players");
      } else {
        playersRef = collection(db, "users");
      }

      const q = query(playersRef, orderBy("totalScore", "desc"));
      const snap = await getDocs(q);
      const data: Player[] = [];
      let max = 0;
      snap.forEach((docSnap) => {
        const p = docSnap.data() as Player;
        data.push(p);
        if ((p.totalScore ?? 0) > max) max = p.totalScore ?? 0;
      });
      setPlayers(data);
      setMaxScore(max);
    };

    fetchPlayers();
  }, [gameId]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "civilian":
        return civilianIcon;
      case "undercover":
        return undercoverIcon;
      case "mrwhite":
        return mrwhiteIcon;
      default:
        return "";
    }
  };

  const handleClear = async () => {
    const confirm = window.confirm("Are you sure you want to reset all scores?");
    if (!confirm) return;

    const q = query(
      gameId ? collection(db, "games", gameId, "players") : collection(db, "users")
    );
    const snap = await getDocs(q);
    await Promise.all(
      snap.docs.map((docSnap) =>
        updateDoc(docSnap.ref, { totalScore: 0, score: 0 })
      )
    );
    window.location.reload();
  };

  return (
    <div className="bg-white/90 rounded-2xl shadow-xl mt-20 px-4 sm:px-6 md:px-8 py-6 sm:py-8 w-full max-w-3xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center text-[#22364a]">
        Leaderboard
      </h1>

      <div className="space-y-4">
        {players.map((p, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 bg-white/70 px-4 py-3 rounded-lg"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0 ? "bg-yellow-500" : "bg-blue-600"
                }`}
              >
                {index === 0 ? "👑" : p.username.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm sm:text-base font-bold text-[#22364a] truncate">
                  {p.username}
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2 mt-1">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      index === 0 ? "bg-yellow-400" : "bg-gray-400"
                    }`}
                    style={{
                      width: `${
                        maxScore > 0 ? ((p.totalScore ?? 0) / maxScore) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <div className="text-right">
                <div className="text-sm sm:text-base font-bold text-[#22364a]">
                  {p.totalScore ?? 0}
                </div>
                <div className="text-xs text-gray-500">points</div>
              </div>
              <img
                src={getRoleIcon(p.role)}
                alt={p.role}
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
            </div>
          </div>
        ))}
      </div>

      {!readOnly && (
        <button
          onClick={handleClear}
          className="w-full mt-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
        >
          Reset Scores
        </button>
      )}
    </div>
  );
}
