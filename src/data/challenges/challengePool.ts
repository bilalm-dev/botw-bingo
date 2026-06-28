import type { Challenge } from "./types"
import { combatChallenges } from "./combat"
import { explorationChallenges } from "./exploration"
import { survieChallenges } from "./survie"
import { sanctuairesChallenges } from "./sanctuaires"
import { korogusChallenges } from "./korogus"
import { quetesChallenges } from "./quetes"
import { divinesChallenges } from "./divines"
import { equipementChallenges } from "./equipement"
import { collectionChallenges } from "./collection"

const allChallenges: Omit<Challenge, "id">[] = [
  ...combatChallenges,
  ...explorationChallenges,
  ...survieChallenges,
  ...sanctuairesChallenges,
  ...korogusChallenges,
  ...quetesChallenges,
  ...divinesChallenges,
  ...equipementChallenges,
  ...collectionChallenges,
]

export const challengePool: Challenge[] = allChallenges.map((challenge, index) => ({
  id: index + 1,
  ...challenge,
}))