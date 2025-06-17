interface Player {
  id: string;
  role: string;
  eliminated?: boolean;
  isMrWhiteCorrect?: boolean;
}

type Winner = "civilian" | "undercover" | "mrwhite";

interface ScoreData {
  baseScore: number;
  roleBonus: number;
  eliminationPenalty: number;
  totalScore: number;
}

export function calculateScores(players: Player[], winner: Winner): Record<string, ScoreData> {
  return players.reduce((acc, player) => {
    const scoreData: ScoreData = {
      baseScore: 0,
      roleBonus: 0,
      eliminationPenalty: 0,
      totalScore: 0
    };

    // ✅ Base Score
    // Mr White: jika MENANG, selalu dapat base walau eliminated
    if (
      (player.role === "mrwhite" && winner === "mrwhite" && player.isMrWhiteCorrect) ||
      (player.role === winner && player.role !== "mrwhite" && !player.eliminated)
    ) {
      scoreData.baseScore = 100;
    }

    // ✅ Role-specific bonus
    if (player.role === "undercover" && winner === "undercover") {
      scoreData.roleBonus = 50;
    }

    if (player.role === "mrwhite" && player.isMrWhiteCorrect) {
      scoreData.roleBonus = 100;
    }

    // ✅ Penalty for losing & eliminated
    if (player.eliminated && player.role !== winner) {
      scoreData.eliminationPenalty = -30;
    }

    // ✅ Total
    scoreData.totalScore = Math.max(
      0,
      scoreData.baseScore + scoreData.roleBonus + scoreData.eliminationPenalty
    );

    acc[player.id] = scoreData;
    return acc;
  }, {} as Record<string, ScoreData>);
}
