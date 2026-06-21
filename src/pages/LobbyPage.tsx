import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { generateBalancedGrid, type BingoCell } from "../lib/generateGrid"
import { getOrCreatePlayerUid } from "../lib/playerUid"

type Player = {
  id: string
  pseudo: string
  player_uid: string
}

function LobbyPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()

  const [roomUuid, setRoomUuid] = useState<string | null>(null)
  const [createdBy, setCreatedBy] = useState<string | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [grid, setGrid] = useState<BingoCell[]>([])
  const [winner, setWinner] = useState<string | null>(null)
  const [status, setStatus] = useState<string>("playing")

  const [playerUid] = useState(() => getOrCreatePlayerUid())

  // référence toujours à jour, indépendante des re-renders, pour éviter les races
  // entre l'init de la grille et l'arrivée des events realtime sur room_cells
  const templateRef = useRef<BingoCell[]>([])

  const myPlayer = players.find((p) => p.player_uid === playerUid)
  const pseudo = myPlayer?.pseudo ?? localStorage.getItem("botw_pseudo") ?? "Joueur"

  const isHost = createdBy === playerUid

  // ---------------- INIT ----------------
  useEffect(() => {
    async function init() {
      if (!roomId) return

      const { data: room } = await supabase
        .from("rooms")
        .select("id, winner, created_by, status, grid_state")
        .eq("code", roomId)
        .maybeSingle()

      if (!room) return

      // sécurité : si grid_state est vide/invalide (ancienne room, ou bug),
      // on génère une grille de secours plutôt que de planter
      const loadedTemplate: BingoCell[] =
        Array.isArray(room.grid_state) && room.grid_state.length === 25
          ? room.grid_state
          : generateBalancedGrid()

      templateRef.current = loadedTemplate

      setRoomUuid(room.id)
      setWinner(room.winner ?? null)
      setCreatedBy(room.created_by ?? null)
      setStatus(room.status)

      await refreshPlayers(room.id)
      await refreshGrid(room.id)
    }

    init()
  }, [roomId])

  // ---------------- PLAYERS ----------------
  async function refreshPlayers(rId: string) {
    const { data } = await supabase
      .from("players")
      .select("id, pseudo, player_uid")
      .eq("room_id", rId)

    if (data) setPlayers(data)
  }

  // ---------------- GRID — fusion du template (défis) + état coché (room_cells) ----------------
  async function refreshGrid(rId: string) {
    const { data } = await supabase
      .from("room_cells")
      .select("cell_id, checked_by")
      .eq("room_id", rId)

    if (!data) return

    const updated = templateRef.current.map((cell) => {
      const match = data.find((c) => c.cell_id === cell.id)
      return {
        ...cell,
        checked: !!match,
        checkedBy: match?.checked_by ?? null,
      }
    })

    setGrid(updated)
  }

  // ---------------- REALTIME PLAYERS ----------------
  useEffect(() => {
    if (!roomUuid) return

    const channel = supabase
      .channel(`room-${roomUuid}-players`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players", filter: `room_id=eq.${roomUuid}` },
        () => refreshPlayers(roomUuid)
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [roomUuid])

  // ---------------- REALTIME GRID ----------------
  useEffect(() => {
    if (!roomUuid) return

    const channel = supabase
      .channel(`room-${roomUuid}-cells`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room_cells", filter: `room_id=eq.${roomUuid}` },
        () => refreshGrid(roomUuid)
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [roomUuid])

  // ---------------- REALTIME ROOM (winner + status + reset -> redirection collective) ----------------
  useEffect(() => {
    if (!roomUuid) return

    const channel = supabase
      .channel(`room-${roomUuid}-status`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms", filter: `id=eq.${roomUuid}` },
        async () => {
          const { data } = await supabase
            .from("rooms")
            .select("winner, status, created_by")
            .eq("id", roomUuid)
            .maybeSingle()

          if (!data) return

          setStatus(data.status)
          setWinner(data.winner ?? null)
          setCreatedBy(data.created_by ?? null)

          if (data.status === "waiting") {
            navigate(`/waiting/${roomId}`)
          }
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [roomUuid, roomId])

  // ---------------- CLICK CELL ----------------
  async function toggleCell(id: number) {
    if (!roomUuid) return
    if (winner) return

    const cell = grid.find((c) => c.id === id)
    if (cell?.checked) return

    const { error } = await supabase.from("room_cells").insert({
      room_id: roomUuid,
      cell_id: id,
      checked_by: playerUid,
    })

    if (error) {
      if (error.code !== "23505") console.error(error)
      await refreshGrid(roomUuid)
      return
    }

    setGrid((g) =>
      g.map((c) => (c.id === id ? { ...c, checked: true, checkedBy: playerUid } : c))
    )
  }

  // ---------------- WIN CHECK ----------------
  const isMine = (cell: BingoCell) => cell.checkedBy === playerUid

  function checkWin(g: BingoCell[]) {
    if (g.length !== 25) return false
    const size = 5

    for (let r = 0; r < size; r++) {
      if (g.slice(r * size, r * size + size).every(isMine)) return true
    }

    for (let c = 0; c < size; c++) {
      if (g.filter((_, i) => i % size === c).every(isMine)) return true
    }

    const d1 = g.filter((_, i) => i % 6 === 0).every(isMine)
    const d2 = g.filter((_, i) => i % 4 === 0 && i !== 0 && i !== 24).every(isMine)

    return d1 || d2
  }

  useEffect(() => {
    if (status !== "playing") return
    if (winner) return
    if (!checkWin(grid)) return

    setWinner(pseudo)

    if (roomUuid) {
      supabase
        .from("rooms")
        .update({
          winner: pseudo,
          status: "finished",
          finished_at: new Date().toISOString(),
        })
        .eq("id", roomUuid)
        .is("winner", null)
        .then(({ error }) => {
          if (error) console.error(error)
        })
    }
  }, [grid, winner, status])

  // ---------------- RESET / RELANCER (host uniquement) ----------------
  async function resetGame() {
    if (!roomUuid) return

    const { error: deleteError } = await supabase
      .from("room_cells")
      .delete()
      .eq("room_id", roomUuid)

    if (deleteError) {
      console.error(deleteError)
      return
    }

    const { error: updateError } = await supabase
      .from("rooms")
      .update({ winner: null, status: "waiting", finished_at: null, grid_state: {} })
      .eq("id", roomUuid)
      .eq("status", "finished")

    if (updateError) {
      console.error(updateError)
    }
  }

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-center text-2xl font-bold mb-4">Lobby</h1>

      <div className="flex justify-center gap-2 flex-wrap mb-4">
        {players.map((p) => (
          <span
            key={p.id}
            className={`px-3 py-1 rounded text-sm ${
              p.player_uid === playerUid ? "bg-green-600" : "bg-blue-600"
            }`}
          >
            {p.pseudo}
          </span>
        ))}
      </div>

      {winner && (
        <div className="text-center mb-4">
          <p className="text-yellow-400 font-bold mb-3">
            🏆 {winner} a gagné la partie !
          </p>

          {isHost && (
            <button
              onClick={resetGame}
              className="bg-blue-600 px-6 py-2 rounded font-bold"
            >
              Relancer une partie
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-5 gap-2 max-w-4xl mx-auto">
        {grid.map((cell) => (
          <div
            key={cell.id}
            onClick={() => toggleCell(cell.id)}
            className={`p-2 rounded text-xs text-center cursor-pointer select-none transition ${
              !cell.checked
                ? "bg-slate-800 hover:bg-slate-700"
                : isMine(cell)
                ? "bg-green-600"
                : "bg-blue-600"
            }`}
          >
            {cell.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LobbyPage