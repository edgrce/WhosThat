import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import bg from "../assets/bg.jpeg";

type Roles = {
  civilian: number;
  undercover: number;
  mrWhite: number;
};

function getRandomRole(roles: Roles, realAssignedRoles: string[]): keyof Roles {
  const pool: (keyof Roles)[] = [];

  Object.entries(roles).forEach(([role, count]) => {
    const used = realAssignedRoles.filter(
      (r) => r?.toLowerCase() === role.toLowerCase()
    ).length;
    const remaining = (count as number) - used;
    for (let i = 0; i < remaining; i++) {
      pool.push(role as keyof Roles);
    }
  });

  if (pool.length === 0) {
    throw new Error("No available role left to assign!");
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

export default function LoginUsername() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Extract state & fallback
  const {
    gameId,
    playersCount,
    roles,
    difficulty,
    currentPlayer,
    assignedRoles = [],
    assignedNames = [],
  } = location.state || {};

  // ✅ Auto redirect kalau tidak ada gameId → mencegah blank page
  useEffect(() => {
    if (!gameId) {
      navigate("/dashboard");
    }
  }, [gameId, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username required");
      return;
    }

    try {
      // ✅ Ambil players yang sudah login
      const playersSnap = await getDocs(
        collection(db, "games", gameId, "players")
      );
      const realAssignedRoles = playersSnap.docs.map((doc) =>
        doc.data().role?.toLowerCase()
      );
      const realAssignedNames = playersSnap.docs.map((doc) =>
        doc.data().username
      );

      if (realAssignedNames.includes(username)) {
        setError("Username already used in this game.");
        return;
      }

      const gameDoc = await getDoc(doc(db, "games", gameId));
      let word1 = gameDoc.data()?.word1;
      let word2 = gameDoc.data()?.word2;

      if (!word1 || !word2) {
        const q = query(
          collection(db, "words"),
          where("difficulty", "==", difficulty)
        );
        const snap = await getDocs(q);
        const wordsArr = snap.docs.map((doc) => doc.data());
        if (wordsArr.length === 0) {
          setError("No word found for this difficulty.");
          return;
        }
        const randomWord =
          wordsArr[Math.floor(Math.random() * wordsArr.length)];
        word1 = randomWord.word1;
        word2 = randomWord.word2;

        await updateDoc(doc(db, "games", gameId), { word1, word2 });
      }

      const role = getRandomRole(roles, realAssignedRoles).toLowerCase();
      let word = "";
      if (role === "civilian") word = word1;
      else if (role === "undercover") word = word2;

      const playerRef = doc(db, "games", gameId, "players", username);
      await setDoc(playerRef, {
        username,
        role,
        word,
        score: 0,
        totalScore: 0, // ✅ pastikan awal totalScore ada
        createdAt: new Date(),
      });

      navigate("/playershowword", {
        state: {
          gameId,
          playersCount,
          roles,
          difficulty,
          currentPlayer,
          assignedRoles: [...realAssignedRoles, role],
          assignedNames: [...realAssignedNames, username],
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
          onChange={(e) => setUsername(e.target.value)}
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
