import type { Challenge } from "./types"

export const divinesChallenges: Omit<Challenge, "id">[] = [
  // Facile
  { label: "Découvrir la Créature Divine Vah'Ruta", category: "exploration", difficulty: "facile", theme: "divines" },
  { label: "Découvrir la Créature Divine Vah'Rudania", category: "exploration", difficulty: "facile", theme: "divines" },
  { label: "Découvrir la Créature Divine Vah'Medoh", category: "exploration", difficulty: "facile", theme: "divines" },
  { label: "Découvrir la Créature Divine Vah'Naboris", category: "exploration", difficulty: "facile", theme: "divines" },
  { label: "Activer un Terminal à l'intérieur d'une Créature Divine", category: "exploration", difficulty: "facile", theme: "divines" },
  { label: "Utiliser la Rage de Revali pour planer plus haut", category: "combat", difficulty: "facile", theme: "divines" },
  { label: "Utiliser le Bouclier de Daruk pour bloquer une attaque", category: "combat", difficulty: "facile", theme: "divines" },
  { label: "Parler à un Prodige (Mipha, Daruk, Revali ou Urbosa)", category: "survie", difficulty: "facile", theme: "divines" },

  // Moyen
  { label: "Activer les 5 Terminaux d'une Créature Divine", category: "exploration", difficulty: "moyen", theme: "divines" },
  { label: "Vaincre l'Ombre d'eau de Ganon dans Vah'Ruta", category: "combat", difficulty: "moyen", theme: "divines" },
  { label: "Vaincre l'Ombre de feu de Ganon dans Vah'Rudania", category: "combat", difficulty: "moyen", theme: "divines" },
  { label: "Vaincre l'Ombre de vent de Ganon dans Vah'Medoh", category: "combat", difficulty: "moyen", theme: "divines" },
  { label: "Vaincre l'Ombre de foudre de Ganon dans Vah'Naboris", category: "combat", difficulty: "moyen", theme: "divines" },
  { label: "Obtenir la Prière de Mipha", category: "survie", difficulty: "moyen", theme: "divines" },
  { label: "Obtenir la Colère d'Urbosa", category: "survie", difficulty: "moyen", theme: "divines" },
  { label: "Utiliser la Colère d'Urbosa pour foudroyer un groupe d'ennemis", category: "combat", difficulty: "moyen", theme: "divines" },

  // Difficile
  { label: "Libérer les 4 Créatures Divines", category: "exploration", difficulty: "difficile", theme: "divines" },
  { label: "Vaincre une Ombre de Ganon sans prendre de dégâts", category: "combat", difficulty: "difficile", theme: "divines" },
  { label: "Vaincre une Ombre de Ganon en moins de 3 minutes", category: "combat", difficulty: "difficile", theme: "divines" },
  { label: "Libérer une Créature Divine sans utiliser de potion", category: "exploration", difficulty: "difficile", theme: "divines" },
  { label: "Vaincre les 4 Ombres de Ganon dans la même session", category: "combat", difficulty: "difficile", theme: "divines" },
  { label: "Affronter Ganon au Château d'Hyrule avec les 4 pouvoirs des Prodiges actifs", category: "combat", difficulty: "difficile", theme: "divines" },
  { label: "Vaincre Ganon (Fléau Ganon) lors du combat final", category: "combat", difficulty: "difficile", theme: "divines" },
  { label: "Libérer une Créature Divine en moins de 20 minutes", category: "exploration", difficulty: "difficile", theme: "divines" },
]