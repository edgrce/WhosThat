import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import bg from "../assets/bg.jpeg";
import civilianIcon from "../assets/civilain.png";
import undercoverIcon from "../assets/undercover.png";
import mrwhiteIcon from "../assets/mrwhite.png";

interface Player {
  username: string;
  role: string;
  score: number;
  totalScore?: number;
  word?: string;
}

export default function Leaderboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { gameId, winner } = location.state || {};
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxScore, setMaxScore] = useState(0);
  const [word1, setWord1] = useState("word1");
  const [word2, setWord2] = useState("word2");

  useEffect(() => {
    const fetchPlayersAndWords = async () => {
      try {
        // Ambil kata pemenang
        const gameDoc = await getDoc(doc(db, "games", gameId));
        const data = gameDoc.data();
        if (data?.word1) setWord1(data.word1);
        if (data?.word2) setWord2(data.word2);

        // Ambil player dan sort totalScore
        const playersRef = collection(db, "games", gameId, "players");
        const q = query(playersRef, orderBy("totalScore", "desc"));
        const querySnapshot = await getDocs(q);

        const playersData: Player[] = [];
        let max = 0;

        querySnapshot.forEach((doc) => {
          const player = doc.data() as Player;
          playersData.push(player);
          if ((player.totalScore ?? 0) > max) {
            max = player.totalScore ?? 0;
          }
        });

        setPlayers(playersData);
        setMaxScore(max);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayersAndWords();
  }, [gameId]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "civilian":
        return civilianIcon;
      case "undercover":
        return undercoverIcon;
      case "mrWhite":
        return mrwhiteIcon;
      default:
        return "";
    }
  };

  const getWinnerText = () => {
    switch (winner) {
      case "civilian":
        return "Civilians win!";
      case "undercover":
        return "Undercover wins!";
      case "mrWhite":
        return "Mr. White wins!";
      default:
        return "Game Over";
    }
  };

  const handleNext = async () => {
    try {
      // Buat ID game baru
      const newGameId = `game_${Date.now()}`;

      // Ambil roles, difficulty & kata lama
      const gameDoc = await getDoc(doc(db, "games", gameId));
      const gameData = gameDoc.data();
      const roles = gameData?.roles || {};
      const difficulty = gameData?.difficulty || "easy";

      // Ambil kata baru
      const qWords = query(
        collection(db, "words"),
        where("difficulty", "==", difficulty)
      );
      const snapWords = await getDocs(qWords);
      if (snapWords.empty) throw new Error("No words found!");
      const picked = snapWords.docs[
        Math.floor(Math.random() * snapWords.docs.length)
      ].data();
      const newWord1 = picked.word1;
      const newWord2 = picked.word2;

      // Siapkan pool roles acak
      const rolePool: string[] = [];
      Object.entries(roles).forEach(([role, count]) => {
        for (let i = 0; i < (count as number); i++) {
          rolePool.push(role);
        }
      });
      const shuffledRoles = rolePool.sort(() => Math.random() - 0.5);

      // Buat game baru di Firestore
      await setDoc(doc(db, "games", newGameId), {
        roles,
        difficulty,
        word1: newWord1,
        word2: newWord2,
        shuffledRoles,
        status: "setup",
      });

      // Salin player + pertahankan totalScore
      const snap = await getDocs(collection(db, "games", gameId, "players"));
      const usernames = snap.docs.map((doc) => doc.data().username);

      await Promise.all(
        snap.docs.map(async (docSnap) => {
          const p = docSnap.data();
          await setDoc(doc(db, "games", newGameId, "players", p.username), {
            username: p.username,
            totalScore: p.totalScore ?? 0,
          });
        })
      );

      navigate("/playerdraw", {
        state: {
          gameId: newGameId,
          playersCount: usernames.length,
          roles,
          difficulty,
          currentPlayer: 1,
          usernames,
          isNextRound: true,
        },
      });
    } catch (err) {
      console.error("Next round error:", err);
    }
  };

  const handleEnd = () => navigate("/dashboard");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="fixed inset-0 bg-black/60 z-0" />

      <div className="relative z-10 w-full max-w-md bg-gray-100 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gray-100 p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {getWinnerText()}
          </h1>

          <div className="flex items-center justify-center space-x-8 mb-6">
            <div className="flex items-center space-x-2">
              <img src={undercoverIcon} alt="undercover" className="w-6 h-6" />
              <span className="text-lg font-semibold text-gray-700">
                {word2}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <img src={civilianIcon} alt="civilian" className="w-6 h-6" />
              <span className="text-lg font-semibold text-gray-700">
                {word1}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-4 space-y-3">
          {players.map((player, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    index === 0 ? "bg-yellow-500" : "bg-blue-600"
                  }`}
                >
                  {index === 0
                    ? "👑"
                    : player.username.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    {player.username}
                  </div>
                  <div className="w-48 bg-gray-300 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === 0 ? "bg-yellow-400" : "bg-gray-400"
                      }`}
                      style={{
                        width: `${
                          maxScore > 0
                            ? ((player.totalScore ?? 0) / maxScore) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-800">
                    {player.totalScore ?? 0}
                  </div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <img
                    src={getRoleIcon(player.role)}
                    alt={player.role}
                    className="w-6 h-6"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 space-y-3">
          <button
            onClick={handleEnd}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
          >
            End
          </button>
          <button
            onClick={handleNext}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
