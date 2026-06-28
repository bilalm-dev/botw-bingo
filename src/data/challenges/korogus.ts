import type { Challenge } from "./types"

export const korogusChallenges: Omit<Challenge, "id">[] = [
  // Facile
  { label: "Trouver un Korogu caché sous un rocher à soulever", category: "exploration", difficulty: "facile", theme: "korogus" },
  { label: "Trouver un Korogu en complétant un cercle de pierres incomplet", category: "exploration", difficulty: "facile", theme: "korogus" },
  { label: "Trouver un Korogu en suivant une traînée de feuilles scintillantes", category: "exploration", difficulty: "facile", theme: "korogus" },
  { label: "Trouver un Korogu en plongeant au centre d'un cercle de nénuphars", category: "exploration", difficulty: "facile", theme: "korogus" },
  { label: "Trouver un Korogu en déposant un fruit sur un plateau d'offrande vide", category: "exploration", difficulty: "facile", theme: "korogus" },
  { label: "Trouver un Korogu en suivant une fleur isolée sur un chemin", category: "exploration", difficulty: "facile", theme: "korogus" },
  { label: "Échanger une Noix Korogu à Noïa contre un emplacement d'inventaire", category: "survie", difficulty: "facile", theme: "korogus" },
  { label: "Trouver un Korogu sur le Plateau du Prélude", category: "exploration", difficulty: "facile", theme: "korogus" },

  // Moyen
  { label: "Trouver un Korogu en alignant les fruits de 3 arbres identiques", category: "exploration", difficulty: "moyen", theme: "korogus" },
  { label: "Trouver un Korogu en allumant une torche jumelle à une torche déjà enflammée", category: "exploration", difficulty: "moyen", theme: "korogus" },
  { label: "Trouver un Korogu en tirant à l'arc sur un ballon révélé par un moulin à vent", category: "exploration", difficulty: "moyen", theme: "korogus" },
  { label: "Trouver un Korogu en complétant un parcours chronométré depuis une souche", category: "exploration", difficulty: "moyen", theme: "korogus" },
  { label: "Trouver un Korogu en poussant un gros rocher dans un trou", category: "exploration", difficulty: "moyen", theme: "korogus" },
  { label: "Trouver un Korogu en utilisant le module Stasis sur un rocher", category: "exploration", difficulty: "moyen", theme: "korogus" },
  { label: "Trouver un Korogu en utilisant le module Polaris sur une bille en métal", category: "exploration", difficulty: "moyen", theme: "korogus" },
  { label: "Obtenir un nouvel emplacement d'arc auprès de Noïa", category: "survie", difficulty: "moyen", theme: "korogus" },

  // Difficile
  { label: "Trouver 10 Korogus dans une seule session", category: "exploration", difficulty: "difficile", theme: "korogus" },
  { label: "Trouver un Korogu particulièrement bien caché (énigme à plusieurs étapes)", category: "exploration", difficulty: "difficile", theme: "korogus" },
  { label: "Atteindre 441 Noix Korogu (inventaire maximal)", category: "survie", difficulty: "difficile", theme: "korogus" },
  { label: "Débloquer le dernier emplacement d'arme auprès de Noïa", category: "survie", difficulty: "difficile", theme: "korogus" },
  { label: "Trouver un Korogu en pleine zone hostile (camp ennemi à proximité)", category: "exploration", difficulty: "difficile", theme: "korogus" },
  { label: "Trouver un Korogu dans une région entière sans aide extérieure", category: "exploration", difficulty: "difficile", theme: "korogus" },
  { label: "Trouver les 900 Noix Korogu (quête complète)", category: "exploration", difficulty: "difficile", theme: "korogus" },
  { label: "Obtenir la récompense finale de Noïa après les 900 Noix Korogu", category: "survie", difficulty: "difficile", theme: "korogus" },
]