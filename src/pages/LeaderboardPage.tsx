import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import bg from "../assets/bg.jpeg";
import Leaderboard from "../components/Leaderboard";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";

export default function LeaderboardPage() {
  const [lastGameId, setLastGameId] = useState<string | null>(null);

  useEffect(() => {
    const getLastGame = async () => {
      const q = query(collection(db, "games"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setLastGameId(snap.docs[0].id);
      }
    };
    getLastGame();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar - sticky on left */}
      <Sidebar />

      {/* Content Area */}
      <div className="relative flex flex-col flex-1 min-h-screen">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center -z-10"
          style={{ backgroundImage: `url(${bg})` }}
        />
        <div className="absolute inset-0 -z-10" />

        {/* Navbar - stick on top */}
        <Navbar />

        {/* Main */}
        <main className="flex-1 flex items-center justify-center px-4 py-6 overflow-y-auto">
          <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl px-2 sm:px-4">
            {lastGameId && (
              <Leaderboard gameId={lastGameId} readOnly={false} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
