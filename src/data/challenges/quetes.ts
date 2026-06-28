import type { Challenge } from "./types"

export const quetesChallenges: Omit<Challenge, "id">[] = [
  // Facile
  { label: "Parler à Impa à Cocorico", category: "survie", difficulty: "facile", theme: "quetes" },
  { label: "Visiter le Laboratoire Antique d'Akkala", category: "exploration", difficulty: "facile", theme: "quetes" },
  { label: "Parler à Purah", category: "survie", difficulty: "facile", theme: "quetes" },
  { label: "Retrouver un premier Souvenir perdu", category: "exploration", difficulty: "facile", theme: "quetes" },
  { label: "Découvrir l'existence de l'Épée de Légende auprès d'un PNJ", category: "survie", difficulty: "facile", theme: "quetes" },
  { label: "Observer le Château d'Hyrule depuis un point éloigné", category: "exploration", difficulty: "facile", theme: "quetes" },
  { label: "Activer la fonction Album de la Tablette Sheikah", category: "survie", difficulty: "facile", theme: "quetes" },
  { label: "Retrouver un Souvenir perdu sur le Plateau du Prélude", category: "exploration", difficulty: "facile", theme: "quetes" },

  // Moyen
  { label: "Retrouver 5 Souvenirs perdus", category: "exploration", difficulty: "moyen", theme: "quetes" },
  { label: "Localiser un Souvenir perdu grâce à une photo de paysage", category: "exploration", difficulty: "moyen", theme: "quetes" },
  { label: "Recevoir une mise à jour de la Tablette Sheikah de la part de Purah", category: "survie", difficulty: "moyen", theme: "quetes" },
  { label: "Localiser un Souvenir perdu dans le Désert Gerudo", category: "exploration", difficulty: "moyen", theme: "quetes" },
  { label: "Localiser un Souvenir perdu dans le Domaine Zora", category: "exploration", difficulty: "moyen", theme: "quetes" },
  { label: "Localiser un Souvenir perdu dans la région du Mont de la Mort", category: "exploration", difficulty: "moyen", theme: "quetes" },
  { label: "Localiser un Souvenir perdu près du Village Piaf", category: "exploration", difficulty: "moyen", theme: "quetes" },
  { label: "Retrouver 10 Souvenirs perdus", category: "exploration", difficulty: "moyen", theme: "quetes" },

  // Difficile
  { label: "Retrouver les 18 Souvenirs perdus", category: "exploration", difficulty: "difficile", theme: "quetes" },
  { label: "S'approcher du Château d'Hyrule sans déclencher l'alerte de Ganon", category: "exploration", difficulty: "difficile", theme: "quetes" },
  { label: "Atteindre l'intérieur du Château d'Hyrule", category: "exploration", difficulty: "difficile", theme: "quetes" },
  { label: "Vaincre Ganon Calamité au sommet du Château d'Hyrule", category: "combat", difficulty: "difficile", theme: "quetes" },
  { label: "Récupérer l'Épée de Légende dans les Bois Perdus", category: "exploration", difficulty: "difficile", theme: "quetes" },
  { label: "Récupérer l'Épée de Légende sans subir de dégâts pendant l'épreuve", category: "combat", difficulty: "difficile", theme: "quetes" },
  { label: "Vaincre Ganon en utilisant l'Épée de Légende", category: "combat", difficulty: "difficile", theme: "quetes" },
  { label: "Terminer la quête principale du jeu (vaincre Ganon)", category: "combat", difficulty: "difficile", theme: "quetes" },
]