import { doc, updateDoc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import { calculateScores } from "../utils/scoreUtils";

// ✅ Interface Player: sama persis dengan yang di scoreUtils & useGameElimination
export interface Player {
  id: string;
  role: string;
  eliminated?: boolean;
  isMrWhiteCorrect?: boolean;
}

/**
 * Optional: fungsi processElimination di hook ini 
 * kalau kamu pisah voting dan score.
 * Biasanya yang aktif di VoteScreen: useGameElimination.
 */
export async function processElimination(
  gameId: string,
  playerId: string,
  navigate: (path: string, options?: any) => void
) {
  // 1️⃣ Tandai eliminated di Firestore
  const playerRef = doc(db, "games", gameId, "players", playerId);
  await updateDoc(playerRef, { eliminated: true });

  // 2️⃣ Cek game status
  const gameDoc = await getDoc(doc(db, "games", gameId));
  const gameData = gameDoc.data();

  if (gameData?.status === "finished" && gameData?.winner) {
    // 3️⃣ Ambil semua player
    const snap = await getDocs(collection(db, "games", gameId, "players"));
    const players: Player[] = snap.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        role: data.role,
        eliminated: data.eliminated,
        isMrWhiteCorrect: data.isMrWhiteCorrect || false,
      };
    });

    // 4️⃣ Hitung score
    const scores = calculateScores(players, gameData.winner);

    // 5️⃣ Update score di Firestore
    await Promise.all(
      Object.entries(scores).map(([id, s]) =>
        updateDoc(doc(db, "games", gameId, "players", id), {
          score: s.totalScore,
        })
      )
    );

    // 6️⃣ Pindah ke leaderboard
    navigate("/leaderboard", {
      state: {
        gameId,
        winner: gameData.winner,
      },
    });
  }
}
