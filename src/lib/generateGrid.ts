import { challengePool, type Challenge } from "../data/challenges"

export type BingoCell = {
  id: number
  label: string
  checked?: boolean
  checkedBy?: string | null
}

const CATEGORIES = ["combat", "exploration", "survie"] as const
const DIFFICULTIES = ["facile", "moyen", "difficile"] as const

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Répartit "total" éléments entre "parts" groupes le plus équitablement possible
// ex: splitCount(25, 3) => [9, 8, 8]
function splitCount(total: number, parts: number): number[] {
  const base = Math.floor(total / parts)
  const remainder = total % parts
  return Array.from({ length: parts }, (_, i) => base + (i < remainder ? 1 : 0))
}

export function generateBalancedGrid(size = 25): BingoCell[] {
  const categoryTargets = splitCount(size, CATEGORIES.length)
  const selected: Challenge[] = []

  CATEGORIES.forEach((category, idx) => {
    const targetForCategory = categoryTargets[idx]
    const difficultyTargets = splitCount(targetForCategory, DIFFICULTIES.length)

    DIFFICULTIES.forEach((difficulty, dIdx) => {
      const need = difficultyTargets[dIdx]
      if (need === 0) return

      const candidates = shuffle(
        challengePool.filter(
          (c) =>
            c.category === category &&
            c.difficulty === difficulty &&
            !selected.some((s) => s.id === c.id)
        )
      )

      selected.push(...candidates.slice(0, need))
    })
  })

  // Sécurité : si jamais une case précise du pool n'a pas assez d'entrées,
  // on complète avec n'importe quel défi pas encore utilisé.
  if (selected.length < size) {
    const remainingPool = shuffle(
      challengePool.filter((c) => !selected.some((s) => s.id === c.id))
    )
    selected.push(...remainingPool.slice(0, size - selected.length))
  }

  const finalChallenges = shuffle(selected).slice(0, size)

  return finalChallenges.map((c, index) => ({
    id: index + 1, // position dans la grille (1 à 25) = cell_id utilisé dans room_cells
    label: c.label,
  }))
}