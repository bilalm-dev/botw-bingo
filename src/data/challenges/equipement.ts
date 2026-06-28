import type { Challenge } from "./types"

export const equipementChallenges: Omit<Challenge, "id">[] = [
  // Facile
  { label: "Acheter la Tenue Furtive à Cocorico", category: "survie", difficulty: "facile", theme: "equipement" },
  { label: "Obtenir l'Armure Zora au Domaine Zora", category: "survie", difficulty: "facile", theme: "equipement" },
  { label: "Acheter la Tenue Piaf au village Piaf", category: "survie", difficulty: "facile", theme: "equipement" },
  { label: "Obtenir une pièce de la Tenue d'Escalade", category: "exploration", difficulty: "facile", theme: "equipement" },
  { label: "Acheter une pièce de la Tenue des Sablons au Club Secret Gerudo", category: "survie", difficulty: "facile", theme: "equipement" },
  { label: "Obtenir la Tenue de Pierre au village Goron", category: "survie", difficulty: "facile", theme: "equipement" },
  { label: "Améliorer une tenue une fois chez une Grande Fée", category: "survie", difficulty: "facile", theme: "equipement" },
  { label: "Équiper une tenue complète (3 pièces) pour la première fois", category: "survie", difficulty: "facile", theme: "equipement" },

  // Moyen
  { label: "Compléter l'ensemble complet de la Tenue Furtive (3 pièces)", category: "survie", difficulty: "moyen", theme: "equipement" },
  { label: "Compléter l'ensemble complet de l'Armure Zora (3 pièces)", category: "survie", difficulty: "moyen", theme: "equipement" },
  { label: "Obtenir la Tenue de Barbare en récompense d'un des Labyrinthes d'Hyrule", category: "exploration", difficulty: "moyen", theme: "equipement" },
  { label: "Obtenir la Tenue Isolante (résistance à l'électricité)", category: "survie", difficulty: "moyen", theme: "equipement" },
  { label: "Trouver une pièce de la Tenue d'Escalade cachée dans un sanctuaire", category: "exploration", difficulty: "moyen", theme: "equipement" },
  { label: "Améliorer une tenue au niveau 2 chez une Grande Fée", category: "survie", difficulty: "moyen", theme: "equipement" },
  { label: "Récupérer le Bouclier Hylia", category: "exploration", difficulty: "moyen", theme: "equipement" },
  { label: "Trouver l'Épée de Légende dans les Bois Perdus", category: "exploration", difficulty: "moyen", theme: "equipement" },

  // Difficile
  { label: "Compléter les trois Labyrinthes d'Hyrule pour obtenir la Tenue de Barbare", category: "exploration", difficulty: "difficile", theme: "equipement" },
  { label: "Améliorer une tenue au niveau 4 (maximum) chez une Grande Fée", category: "survie", difficulty: "difficile", theme: "equipement" },
  { label: "Compléter l'ensemble complet de la Tenue des Sablons", category: "survie", difficulty: "difficile", theme: "equipement" },
  { label: "Posséder au moins 5 ensembles de tenues complets différents", category: "survie", difficulty: "difficile", theme: "equipement" },
  { label: "Améliorer 3 tenues différentes au niveau maximum", category: "survie", difficulty: "difficile", theme: "equipement" },
  { label: "Compléter l'ensemble complet de la Tenue Piaf", category: "survie", difficulty: "difficile", theme: "equipement" },
  { label: "Posséder le Bouclier Hylia et l'Épée de Légende en même temps", category: "exploration", difficulty: "difficile", theme: "equipement" },
  { label: "Débloquer toutes les pièces de la Tenue d'Escalade", category: "exploration", difficulty: "difficile", theme: "equipement" },
]