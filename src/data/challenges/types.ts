export type ChallengeCategory = "combat" | "exploration" | "survie"
export type ChallengeDifficulty = "facile" | "moyen" | "difficile"

// Classement fin, purement informatif/organisationnel.
// N'intervient PAS dans l'équilibrage de la grille (qui reste basé sur category).
export type ChallengeTheme =
  | "general"
  | "sanctuaires"
  | "korogus"
  | "quetes"
  | "divines"
  | "equipement"
  | "collection"

export type Challenge = {
  id: number
  label: string
  category: ChallengeCategory
  difficulty: ChallengeDifficulty
  theme?: ChallengeTheme
}