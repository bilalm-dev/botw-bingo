import type { Challenge } from "./types"

export const collectionChallenges: Omit<Challenge, "id">[] = [
  // Facile
  { label: "Acheter une maison à Élimith", category: "survie", difficulty: "facile", theme: "collection" },
  { label: "Installer un mobilier basique dans la maison d'Élimith (lit, coffre, etc.)", category: "survie", difficulty: "facile", theme: "collection" },
  { label: "Monter un cheval pour la première fois", category: "survie", difficulty: "facile", theme: "collection" },
  { label: "Apprivoiser un cheval sauvage", category: "survie", difficulty: "facile", theme: "collection" },
  { label: "Découvrir le village abandonné qui deviendra Euzéro", category: "exploration", difficulty: "facile", theme: "collection" },
  { label: "Donner le premier matériau de construction pour le projet Euzéro", category: "survie", difficulty: "facile", theme: "collection" },
  { label: "Trouver un cheval avec un pelage particulier", category: "exploration", difficulty: "facile", theme: "collection" },
  { label: "Dormir dans son propre lit à Élimith", category: "survie", difficulty: "facile", theme: "collection" },

  // Moyen
  { label: "Acheter une décoration supplémentaire pour la maison d'Élimith", category: "survie", difficulty: "moyen", theme: "collection" },
  { label: "Installer un présentoir d'arme dans la maison d'Élimith", category: "survie", difficulty: "moyen", theme: "collection" },
  { label: "Recruter un nouvel habitant pour le village d'Euzéro", category: "exploration", difficulty: "moyen", theme: "collection" },
  { label: "Faire construire un nouveau bâtiment à Euzéro", category: "survie", difficulty: "moyen", theme: "collection" },
  { label: "Capturer un cheval rare (robe spéciale)", category: "exploration", difficulty: "moyen", theme: "collection" },
  { label: "Apprivoiser le Cheval Géant", category: "exploration", difficulty: "moyen", theme: "collection" },
  { label: "Augmenter l'affection maximale d'un cheval (5 cœurs)", category: "survie", difficulty: "moyen", theme: "collection" },
  { label: "Faire venir un marchand s'installer à Euzéro", category: "survie", difficulty: "moyen", theme: "collection" },

  // Difficile
  { label: "Compléter toutes les améliorations de la maison d'Élimith", category: "survie", difficulty: "difficile", theme: "collection" },
  { label: "Recruter tous les habitants nécessaires à la complétion d'Euzéro", category: "exploration", difficulty: "difficile", theme: "collection" },
  { label: "Voir le village d'Euzéro entièrement terminé", category: "exploration", difficulty: "difficile", theme: "collection" },
  { label: "Apprivoiser et monter le Cheval Blanc Royal", category: "exploration", difficulty: "difficile", theme: "collection" },
  { label: "Posséder à la fois le Cheval Géant et le Cheval Blanc Royal", category: "exploration", difficulty: "difficile", theme: "collection" },
  { label: "Avoir un cheval avec 5 cœurs d'affection ET toutes les statistiques maximales", category: "survie", difficulty: "difficile", theme: "collection" },
  { label: "Compléter le Projet Euzéro de A à Z (recrutement + constructions + bâtiment final)", category: "exploration", difficulty: "difficile", theme: "collection" },
  { label: "Posséder une collection de 4 chevaux ou plus à l'écurie", category: "survie", difficulty: "difficile", theme: "collection" },
]