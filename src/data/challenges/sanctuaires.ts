import type { Challenge } from "./types"

export const sanctuairesChallenges: Omit<Challenge, "id">[] = [
  // Facile
  { label: "Activer un sanctuaire du Plateau du Prélude", category: "exploration", difficulty: "facile", theme: "sanctuaires" },
  { label: "Résoudre un sanctuaire en moins de 2 minutes", category: "exploration", difficulty: "facile", theme: "sanctuaires" },
  { label: "Activer un sanctuaire situé dans une grotte", category: "exploration", difficulty: "facile", theme: "sanctuaires" },
  { label: "Résoudre une énigme de sanctuaire avec le module Polaris", category: "exploration", difficulty: "facile", theme: "sanctuaires" },
  { label: "Résoudre une énigme de sanctuaire avec le module Cryonis", category: "exploration", difficulty: "facile", theme: "sanctuaires" },
  { label: "Résoudre une énigme de sanctuaire avec le module Stasis", category: "exploration", difficulty: "facile", theme: "sanctuaires" },
  { label: "Activer un sanctuaire qui s'ouvre sans énigme à l'intérieur (juste une bénédiction)", category: "exploration", difficulty: "facile", theme: "sanctuaires" },
  { label: "Trouver un sanctuaire visible depuis le sommet d'une tour Sheikah", category: "exploration", difficulty: "facile", theme: "sanctuaires" },

  // Moyen
  { label: "Résoudre un sanctuaire de combat (vaincre un Gardien miniature à l'intérieur)", category: "combat", difficulty: "moyen", theme: "sanctuaires" },
  { label: "Résoudre un sanctuaire à plusieurs salles", category: "exploration", difficulty: "moyen", theme: "sanctuaires" },
  { label: "Activer un sanctuaire révélé par une quête annexe préalable", category: "exploration", difficulty: "moyen", theme: "sanctuaires" },
  { label: "Résoudre une énigme de sanctuaire en faisant rouler une bille jusqu'à un socle", category: "exploration", difficulty: "moyen", theme: "sanctuaires" },
  { label: "Résoudre une énigme de sanctuaire en évitant des faisceaux laser", category: "exploration", difficulty: "moyen", theme: "sanctuaires" },
  { label: "Activer un sanctuaire caché derrière une stèle à énigme", category: "exploration", difficulty: "moyen", theme: "sanctuaires" },
  { label: "Échanger 4 Emblèmes du Triomphe contre un réceptacle de cœur", category: "survie", difficulty: "moyen", theme: "sanctuaires" },
  { label: "Échanger 4 Emblèmes du Triomphe contre de l'endurance", category: "survie", difficulty: "moyen", theme: "sanctuaires" },

  // Difficile
  { label: "Résoudre un sanctuaire \"jumeau\" nécessitant d'avoir visité un autre sanctuaire au préalable", category: "exploration", difficulty: "difficile", theme: "sanctuaires" },
  { label: "Compléter une série de quêtes annexes menant à un sanctuaire caché", category: "exploration", difficulty: "difficile", theme: "sanctuaires" },
  { label: "Trouver un sanctuaire réputé difficile à localiser sur la carte", category: "exploration", difficulty: "difficile", theme: "sanctuaires" },
  { label: "Résoudre un sanctuaire de combat entièrement sans prendre de dégâts", category: "combat", difficulty: "difficile", theme: "sanctuaires" },
  { label: "Obtenir 8 Emblèmes du Triomphe (2 échanges complets)", category: "survie", difficulty: "difficile", theme: "sanctuaires" },
  { label: "Compléter tous les sanctuaires d'une région entière", category: "exploration", difficulty: "difficile", theme: "sanctuaires" },
  { label: "Résoudre un sanctuaire de combat sans utiliser d'arc", category: "combat", difficulty: "difficile", theme: "sanctuaires" },
  { label: "Compléter les 120 sanctuaires d'Hyrule", category: "exploration", difficulty: "difficile", theme: "sanctuaires" },
]