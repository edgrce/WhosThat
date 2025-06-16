import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, setDoc, collection, query, where, getDocs, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import bg from "../assets/bg.jpeg";

type Roles = {
  civilian: number;
  undercover: number;
  mrWhite: number;
};

function getRandomRole(roles: Roles, assignedRoles: string[]): keyof Roles {
  let pool: (keyof Roles)[] = [];
  Object.entries(roles).forEach(([role, count]) => {
    const already = assignedRoles.filter((r) => r === role).length;
    for (let i = 0; i < (count as number) - already; i++) pool.push(role as keyof Roles);
  });
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function LoginUsername() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const {
    gameId,
    playersCount,
    roles,
    difficulty,
    currentPlayer,
    assignedRoles = [],
    assignedNames = [],
  } = location.state || {};

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username required");
      return;
    }
    if (assignedNames.includes(username)) {
      setError("Username already used in this game.");
      return;
    }
    try {
      const gameDoc = await getDoc(doc(db, "games", gameId));
      const gameData = gameDoc.data();

      let word1 = gameData?.word1;
      let word2 = gameData?.word2;

      if (!word1 || !word2) {
        // Fallback: cari di words collection kalau belum generate
        const q = query(
          collection(db, "words"),
          where("difficulty", "==", difficulty)
        );
        const snap = await getDocs(q);
        const wordsArr = snap.docs.map(doc => doc.data());
        if (wordsArr.length === 0) {
          setError("No word found for this difficulty.");
          return;
        }
        const randomWord = wordsArr[Math.floor(Math.random() * wordsArr.length)];
        word1 = randomWord.word1;
        word2 = randomWord.word2;

        // Simpan ke games/{gameId} supaya stabil
        await updateDoc(doc(db, "games", gameId), {
          word1,
          word2,
        });
      }

      // Tentukan role
      const role = getRandomRole(roles, assignedRoles).toLowerCase();
      let word = "";
      if (role === "civilian") word = word1;
      else if (role === "undercover") word = word2;
      else word = ""; // Mr White tidak punya kata

      const playerRef = doc(db, "games", gameId, "players", username);
      await setDoc(playerRef, {
        username,
        role,
        word,
        score: 0,
        createdAt: new Date(),
      });

      navigate("/playershowword", {
        state: {
          gameId,
          playersCount,
          roles,
          difficulty,
          currentPlayer,
          assignedRoles: [...assignedRoles, role],
          assignedNames: [...assignedNames, username],
          username,
          role,
          word,
        },
      });
    } catch (err) {
      console.error(err);
      setError("Login failed");
    }
  };

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
      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-[#e5e5e5] rounded-xl shadow-xl p-10 flex flex-col items-center w-[90vw] max-w-md"
      >
        <svg width="96" height="96" fill="#22364a" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="5" />
          <path d="M12 14c-5 0-8 2.5-8 5v1h16v-1c0-2.5-3-5-8-5z" />
        </svg>
        <input
          type="text"
          placeholder="Username"
          className="mt-8 mb-8 bg-transparent border-b-2 border-[#22364a] text-center text-[#22364a] text-xl outline-none w-64"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button
          type="submit"
          className="bg-[#0b1b2a] text-white px-10 py-2 rounded-lg text-lg font-bold hover:bg-[#22364a] transition"
        >
          Ok
        </button>
      </form>
    </div>
  );
}
