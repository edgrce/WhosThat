interface Player {
  role: string;
  eliminated?: boolean;
}

export type Winner = "civilian" | "undercover" | "mrwhite";

export function checkWinningCondition(players: Player[]): Winner | null {
  const alivePlayers = players.filter(p => !p.eliminated);
  const aliveCivilians = alivePlayers.filter(p => p.role === "civilian");
  const aliveUndercovers = alivePlayers.filter(p => p.role === "undercover");
  const aliveMrWhites = alivePlayers.filter(p => p.role === "mrwhite");

  if (aliveUndercovers.length === 0 && aliveMrWhites.length === 0) {
    return "civilian";
  }

  if (aliveUndercovers.length >= aliveCivilians.length && aliveUndercovers.length > 0) {
    return "undercover";
  }

  if (aliveMrWhites.length > 0 && aliveCivilians.length === 0 && aliveUndercovers.length === 0) {
    return "mrwhite";
  }

  return null;
}