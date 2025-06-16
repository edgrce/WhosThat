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

    // Base scoring
    if (!player.eliminated && player.role === winner) {
      scoreData.baseScore = 100;
      
      // Role-specific bonuses
      if (player.role === "undercover") {
        scoreData.roleBonus = 50;
      } else if (player.role === "mrwhite" && player.isMrWhiteCorrect) {
        scoreData.roleBonus = 100;
      }
    }

    // Penalties
    if (player.eliminated && player.role !== winner) {
      scoreData.eliminationPenalty = -30;
    }

    scoreData.totalScore = Math.max(
      0,
      scoreData.baseScore + scoreData.roleBonus + scoreData.eliminationPenalty
    );

    acc[player.id] = scoreData;
    return acc;
  }, {} as Record<string, ScoreData>);
}