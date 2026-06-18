import { useState } from "react"
import { useParams } from "react-router-dom"
import { bingoGrid, type BingoCell } from "../data/bingoGrid"

function LobbyPage() {
  const { roomId } = useParams()

  const [grid, setGrid] = useState<BingoCell[]>(bingoGrid)

  const [winner, setWinner] = useState(false)

  function toggleCell(id: number) {
  setGrid((prev) => {
    const updated = prev.map((cell) =>
      cell.id === id
        ? { ...cell, checked: !cell.checked }
        : cell
    )

    setWinner(checkWin(updated))

    return updated
  })
}

function checkWin(grid: BingoCell[]) {
  const size = 5

  // 🔵 LIGNES
  for (let row = 0; row < size; row++) {
    let win = true

    for (let col = 0; col < size; col++) {
      const index = row * size + col
      if (!grid[index].checked) {
        win = false
        break
      }
    }

    if (win) return true
  }

  // 🔵 COLONNES
  for (let col = 0; col < size; col++) {
    let win = true

    for (let row = 0; row < size; row++) {
      const index = row * size + col
      if (!grid[index].checked) {
        win = false
        break
      }
    }

    if (win) return true
  }

  // 🔵 DIAGONALE ↘
  let diag1 = true
  for (let i = 0; i < size; i++) {
    if (!grid[i * size + i].checked) {
      diag1 = false
      break
    }
  }
  if (diag1) return true

  // 🔵 DIAGONALE ↙
  let diag2 = true
  for (let i = 0; i < size; i++) {
    if (!grid[i * size + (size - 1 - i)].checked) {
      diag2 = false
      break
    }
  }
  if (diag2) return true

  return false
}

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-2xl font-bold text-center mb-2">
        Lobby
      </h1>

      {winner && (
  <div className="text-center text-green-400 font-bold mb-4">
    🎉 BINGO ! Tu as gagné !
  </div>
)}

      <p className="text-center text-gray-300 mb-1">
        Room : {roomId}
      </p>

      <p className="text-center text-gray-500 mb-6 text-sm">
        En attente des joueurs...
      </p>

      <div className="grid grid-cols-5 gap-2 max-w-4xl mx-auto">
        {grid.map((cell) => (
          <div
            key={cell.id}
            onClick={() => toggleCell(cell.id)}
            className={`
              p-2 rounded text-xs text-center cursor-pointer transition select-none
              ${
                cell.checked
                  ? "bg-green-600"
                  : "bg-slate-800 hover:bg-slate-700"
              }
            `}
          >
            {cell.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LobbyPage