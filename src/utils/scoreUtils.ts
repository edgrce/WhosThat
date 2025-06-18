interface Player {
  id: string;
  role: string;
  eliminated?: boolean;
  isMrWhiteCorrect?: boolean;
}

export type Winner = "civilian" | "undercover" | "mrwhite";

export interface ScoreData {
  baseScore: number;
  roleBonus: number;
  eliminationPenalty: number;
  roundScore: number;  // ✅ score hanya untuk ronde ini
  totalScore: number;  // ✅ AKAN diakumulasi di Firestore update
}

export function calculateScores(players: Player[], winner: Winner): Record<string, ScoreData> {
  return players.reduce((acc, player) => {
    const scoreData: ScoreData = {
      baseScore: 0,
      roleBonus: 0,
      eliminationPenalty: 0,
      roundScore: 0,   // ✅ init
      totalScore: 0,   // ✅ init
    };

    if (player.role === "mrwhite" && player.isMrWhiteCorrect) {
      scoreData.baseScore = 100;
      scoreData.roleBonus = 100;
    } else if (player.role === winner && !player.eliminated) {
      scoreData.baseScore = 100;
      if (player.role === "undercover") {
        scoreData.roleBonus = 50;
      }
    }

    if (player.eliminated && player.role !== winner) {
      scoreData.eliminationPenalty = -30;
    }

    scoreData.roundScore = Math.max(
      0,
      scoreData.baseScore + scoreData.roleBonus + scoreData.eliminationPenalty
    );

    // ✅ `totalScore` DI SINI = sama dulu, AKAN ditambahkan di useGameElimination.ts
    scoreData.totalScore = scoreData.roundScore;

    acc[player.id] = scoreData;
    return acc;
  }, {} as Record<string, ScoreData>);
}
