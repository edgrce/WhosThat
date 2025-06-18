import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import bg from "../assets/bg.jpeg";
import cardIcon from "../assets/cards.png";

export default function PlayerShowWord() {
  const navigate = useNavigate();
  const { state } = useLocation() as any;
  const {
    gameId,
    playersCount,
    roles,
    difficulty,
    currentPlayer,
    assignedRoles = [],
    assignedNames = [],
    usernames = [],
    username,
    isNextRound = false,
  } = state || {};

  const [role, setRole] = useState("");
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch role & word dari Firestore biar akurat
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "games", gameId, "players", username);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setRole(data.role);
        setWord(data.word);
      }
      setLoading(false);
    };
    fetchData();
  }, [gameId, username]);

  const nextPlayer = currentPlayer + 1;

  const handleOk = () => {
    if (nextPlayer <= playersCount) {
      navigate("/playerdraw", {
        state: {
          gameId,
          playersCount,
          roles,
          difficulty,
          currentPlayer: nextPlayer,
          assignedRoles,
          assignedNames,
          usernames,
          isNextRound,
        },
      });
    } else {
      // Semua sudah dapat, lanjut ke VoteScreen
      navigate("/votescreen", { state: { gameId, roles } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#0b1b2a]/70 z-0" />
      <div className="relative z-10 bg-[#e5e5e5] rounded-xl shadow-xl p-10 flex flex-col items-center w-[90vw] max-w-xl">
        <img src={cardIcon} alt="player" className="w-24 h-24 mb-2" />
        <div className="text-xl font-bold mb-2">{username}</div>
        <div className="bg-gray-300 rounded-xl w-full h-48 flex items-center justify-center text-4xl font-bold mb-8">
          {role === "mrwhite" ? (
            <span className="text-gray-500 text-center">
              No Word <br />
              You're Mr.White
            </span>
          ) : (
            word
          )}
        </div>
        <button
          className="bg-[#0b1b2a] text-white px-10 py-2 rounded-lg text-lg font-bold hover:bg-[#22364a] transition"
          onClick={handleOk}
        >
          Ok
        </button>
      </div>
    </div>
  );
}
