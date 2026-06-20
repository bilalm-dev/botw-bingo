import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { bingoGrid, type BingoCell } from "../data/bingoGrid"
import { getOrCreatePlayerUid } from "../lib/playerUid"

type Player = {
  id: string
  pseudo: string
  player_uid: string
}

function LobbyPage() {
  const { roomId } = useParams()

  const [roomUuid, setRoomUuid] = useState<string | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [grid, setGrid] = useState<BingoCell[]>(bingoGrid)
  const [winner, setWinner] = useState<string | null>(null)

  const [playerUid] = useState(() => getOrCreatePlayerUid())
  const pseudo = localStorage.getItem("botw_pseudo") ?? ""

  // ---------------- INIT ----------------
  useEffect(() => {
    async function init() {
      if (!roomId) return

      const { data: room } = await supabase
        .from("rooms")
        .select("id, winner")
        .eq("code", roomId)
        .maybeSingle()

      if (!room) return

      setRoomUuid(room.id)
      setWinner(room.winner ?? null)

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

  // ---------------- GRID — grille PARTAGÉE, chaque case n'est cochée qu'une fois ----------------
  async function refreshGrid(rId: string) {
    const { data } = await supabase
      .from("room_cells")
      .select("cell_id, checked_by")
      .eq("room_id", rId)

    if (!data) return

    const updated = bingoGrid.map((cell) => {
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

  // ---------------- REALTIME WINNER ----------------
  useEffect(() => {
    if (!roomUuid) return

    const channel = supabase
      .channel(`room-${roomUuid}-winner`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms", filter: `id=eq.${roomUuid}` },
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
      void supabase.removeChannel(channel)
    }
  }, [roomUuid])

  // ---------------- CLICK CELL ----------------
  async function toggleCell(id: number) {
    if (!roomUuid) return
    if (winner) return

    const cell = grid.find((c) => c.id === id)
    if (cell?.checked) return // déjà verrouillée, peu importe qui l'a cochée

    const { error } = await supabase.from("room_cells").insert({
      room_id: roomUuid,
      cell_id: id,
      checked_by: playerUid,
    })

    if (error) {
      // 23505 = un autre joueur a validé cette case juste avant nous (course gagnée par lui)
      if (error.code !== "23505") console.error(error)
      await refreshGrid(roomUuid) // on resynchronise pour afficher qui l'a vraiment eue
      return
    }

    // mise à jour optimiste locale, le realtime confirmera derrière
    setGrid((g) =>
      g.map((c) => (c.id === id ? { ...c, checked: true, checkedBy: playerUid } : c))
    )
  }

  // ---------------- WIN CHECK (sur les cases QUE J'AI validées) ----------------
  const isMine = (cell: BingoCell) => cell.checkedBy === playerUid

  function checkWin(g: BingoCell[]) {
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
    if (winner) return
    if (!checkWin(grid)) return

    setWinner(pseudo)

    if (roomUuid) {
      // .is("winner", null) => seul le 1er joueur qui valide une victoire l'emporte réellement
      supabase
        .from("rooms")
        .update({ winner: pseudo, finished_at: new Date().toISOString() })
        .eq("id", roomUuid)
        .is("winner", null)
        .then(({ error }) => {
          if (error) console.error(error)
        })
    }
  }, [grid, winner])

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
        <div className="text-center text-yellow-400 font-bold mb-4">
          🏆 {winner} a gagné la partie !
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