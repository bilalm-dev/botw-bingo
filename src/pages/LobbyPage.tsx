import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { bingoGrid, type BingoCell } from "../data/bingoGrid"
import { supabase } from "../lib/supabase"

type Player = {
  id: string
  pseudo: string
}

function LobbyPage() {
  const { roomId } = useParams()

  const [roomUuid, setRoomUuid] = useState("")
  const [pseudo] = useState(localStorage.getItem("botw_pseudo") ?? "")

  const [grid, setGrid] = useState<BingoCell[]>(bingoGrid)
  const [players, setPlayers] = useState<Player[]>([])
  const [winner, setWinner] = useState<string | null>(null)

  // -----------------------------
  // INIT ROOM
  // -----------------------------
  useEffect(() => {
    async function init() {
      if (!roomId || !pseudo) return

      const { data: room } = await supabase
        .from("rooms")
        .select("id, winner")
        .eq("code", roomId)
        .maybeSingle()

      if (!room) return

      setRoomUuid(room.id)
      setWinner(room.winner ?? null)

      // LOAD GRID STATE
      const { data: cells } = await supabase
        .from("room_cells")
        .select("cell_id, checked_by")
        .eq("room_id", room.id)

      if (cells) {
        const updated = bingoGrid.map((cell) => {
          const found = cells.find((c) => c.cell_id === cell.id)

          return {
            ...cell,
            checked: !!found,
            checkedBy: found?.checked_by ?? null,
          }
        })

        setGrid(updated)
      }

      // UPSERT PLAYER (SAFE)
      await supabase.from("players").upsert(
        {
          room_id: room.id,
          pseudo,
          joined_at: new Date().toISOString(),
        },
        { onConflict: "room_id,pseudo" }
      )

      const { data: playersData } = await supabase
        .from("players")
        .select("id, pseudo")
        .eq("room_id", room.id)

      if (playersData) setPlayers(playersData)
    }

    init()
  }, [roomId, pseudo])

  // -----------------------------
  // PLAYERS REALTIME
  // -----------------------------
  useEffect(() => {
    if (!roomUuid) return

    const channel = supabase
      .channel("players-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        async () => {
          const { data } = await supabase
            .from("players")
            .select("id, pseudo")
            .eq("room_id", roomUuid)

          if (data) setPlayers(data)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomUuid])

  // -----------------------------
  // CELLS REALTIME
  // -----------------------------
  useEffect(() => {
    if (!roomUuid) return

    const channel = supabase
      .channel("cells-sync")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "room_cells" },
        (payload) => {
          const { cell_id, checked_by } = payload.new

          setGrid((prev) =>
            prev.map((c) =>
              c.id === cell_id
                ? {
                    ...c,
                    checked: true,
                    checkedBy: checked_by,
                  }
                : c
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomUuid])

  // -----------------------------
  // WINNER REALTIME (FIX IMPORTANT)
  // -----------------------------
  useEffect(() => {
    if (!roomUuid) return

    const channel = supabase
      .channel("winner-sync")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${roomUuid}`,
        },
        async () => {
          const { data } = await supabase
            .from("rooms")
            .select("winner")
            .eq("id", roomUuid)
            .maybeSingle()

          setWinner(data?.winner ?? null)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomUuid])

  // -----------------------------
  // WIN CHECK (IMPORTANT FIX)
  // -----------------------------
  function checkWin(grid: BingoCell[], player: string) {
    const size = 5

    const mine = (c: BingoCell) => c.checkedBy === player

    for (let r = 0; r < size; r++) {
      let ok = true
      for (let c = 0; c < size; c++) {
        if (!mine(grid[r * size + c])) ok = false
      }
      if (ok) return true
    }

    for (let c = 0; c < size; c++) {
      let ok = true
      for (let r = 0; r < size; r++) {
        if (!mine(grid[r * size + c])) ok = false
      }
      if (ok) return true
    }

    let d1 = true
    let d2 = true

    for (let i = 0; i < size; i++) {
      if (!mine(grid[i * size + i])) d1 = false
      if (!mine(grid[i * size + (size - 1 - i)])) d2 = false
    }

    return d1 || d2
  }

  // -----------------------------
  // CLICK CELL
  // -----------------------------
  async function toggleCell(id: number) {
    if (!roomUuid) return
    if (winner) return

    const cell = grid.find((c) => c.id === id)
    if (cell?.checked) return

    const updated = grid.map((c) =>
      c.id === id
        ? { ...c, checked: true, checkedBy: pseudo }
        : c
    )

    setGrid(updated)

    await supabase.from("room_cells").insert({
      room_id: roomUuid,
      cell_id: id,
      checked_by: pseudo,
    })

    const isWin = checkWin(updated, pseudo)

    console.log("GRID", updated)
    console.log("PSEUDO", pseudo)
    console.log("WIN ?", checkWin(updated, pseudo))

    if (isWin) {
  console.log("VICTOIRE DETECTEE")

  console.log("roomUuid =", roomUuid)
  console.log("pseudo =", pseudo)

  const { data, error } = await supabase
  .from("rooms")
  .update({
    winner: pseudo,
    finished_at: new Date().toISOString(),
  })
  .eq("id", roomUuid)
  .select()

console.log("UPDATED DATA", data)
console.log("UPDATE RESULT", error)
}
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      <h1 className="text-center text-2xl font-bold mb-2">
        Lobby
      </h1>

      <p className="text-center text-gray-300 mb-4">
        Room : {roomId}
      </p>

      {/* PLAYERS */}
      <div className="flex justify-center gap-2 flex-wrap mb-4">
        {players.map((p) => (
          <span
            key={p.id}
            className={`px-3 py-1 rounded text-sm ${
              p.pseudo === pseudo
                ? "bg-green-600"
                : "bg-blue-600"
            }`}
          >
            {p.pseudo}
          </span>
        ))}
      </div>

      {/* WINNER */}
      {winner && (
        <div className="text-center text-yellow-400 font-bold mb-4">
          🏆 {winner} a gagné !
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-5 gap-2 max-w-4xl mx-auto">
        {grid.map((cell) => (
          <div
            key={cell.id}
            onClick={() => toggleCell(cell.id)}
            className={`
              p-2 rounded text-xs text-center cursor-pointer select-none
              ${
                !cell.checked
                  ? "bg-slate-800 hover:bg-slate-700"
                  : cell.checkedBy === pseudo
                  ? "bg-green-600"
                  : "bg-blue-600"
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