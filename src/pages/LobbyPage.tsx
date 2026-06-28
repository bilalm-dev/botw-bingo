import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { generateBalancedGrid, type BingoCell as BingoCellData } from "../lib/generateGrid"
import { getOrCreatePlayerUid } from "../lib/playerUid"
import { BingoCell } from "../components/BingoCell"

type Player = {
  id: string
  pseudo: string
  player_uid: string
}

type WinCondition = "bingo" | "territoire"

function LobbyPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()

  const [roomUuid, setRoomUuid] = useState<string | null>(null)
  const [createdBy, setCreatedBy] = useState<string | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [grid, setGrid] = useState<BingoCellData[]>([])
  const [winner, setWinner] = useState<string | null>(null)
  const [status, setStatus] = useState<string>("playing")
  const [winCondition, setWinCondition] = useState<WinCondition>("bingo")

  const [playerUid] = useState(() => getOrCreatePlayerUid())

  // référence toujours à jour, indépendante des re-renders, pour éviter les races
  // entre l'init de la grille et l'arrivée des events realtime sur room_cells
  const templateRef = useRef<BingoCellData[]>([])

  const myPlayer = players.find((p) => p.player_uid === playerUid)
  const pseudo = myPlayer?.pseudo ?? localStorage.getItem("botw_pseudo") ?? "Joueur"

  const isHost = createdBy === playerUid

  // ---------------- INIT ----------------
  useEffect(() => {
    async function init() {
      if (!roomId) return

      const { data: room } = await supabase
        .from("rooms")
        .select("id, winner, created_by, status, grid_state, win_condition")
        .eq("code", roomId)
        .maybeSingle()

      if (!room) return

      // sécurité : si grid_state est vide/invalide (ancienne room, ou bug),
      // on génère une grille de secours plutôt que de planter
      const loadedTemplate: BingoCellData[] =
        Array.isArray(room.grid_state) && room.grid_state.length === 25
          ? room.grid_state
          : generateBalancedGrid()

      templateRef.current = loadedTemplate

      setRoomUuid(room.id)
      setWinner(room.winner ?? null)
      setCreatedBy(room.created_by ?? null)
      setStatus(room.status)
      setWinCondition((room.win_condition as WinCondition) ?? "bingo")

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
            .select("winner, status, created_by, win_condition")
            .eq("id", roomUuid)
            .maybeSingle()

          if (!data) return

          setStatus(data.status)
          setWinner(data.winner ?? null)
          setCreatedBy(data.created_by ?? null)
          setWinCondition((data.win_condition as WinCondition) ?? "bingo")

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
  const isMine = (cell: BingoCellData) => cell.checkedBy === playerUid

  function checkWin(g: BingoCellData[]) {
    if (g.length !== 25) return false

    if (winCondition === "territoire") {
      const myCount = g.filter(isMine).length
      return myCount >= 13
    }

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
  }, [grid, winner, status, winCondition])

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
    <div className="min-h-screen bg-void p-6 font-body text-white">
      <h1 className="mb-1 text-center font-display text-2xl tracking-wide text-ancient-gold">
        Bingo Hyrule
      </h1>
      <p className="mb-6 text-center text-xs uppercase tracking-widest text-parchment/40">
        Mode : {winCondition === "territoire" ? "Conquête de territoire" : "Bingo classique"}
      </p>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {players.map((p) => {
          const isSelf = p.player_uid === playerUid
          const isPlayerHost = p.player_uid === createdBy

          return (
            <span
              key={p.id}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm ${
                isSelf
                  ? "border-korok-moss/50 bg-korok-moss/10 text-korok-moss"
                  : "border-guardian-ember/40 bg-guardian-ember/5 text-guardian-ember"
              }`}
            >
              {isPlayerHost && (
                <span className="h-2 w-2 rotate-45 bg-ancient-gold" aria-hidden="true" />
              )}
              {p.pseudo}
            </span>
          )
        })}
      </div>

      {winner && (
        <div className="mx-auto mb-6 max-w-md animate-fade-up rounded-lg border border-ancient-gold/40 bg-ancient-gold/10 p-5 text-center">
          <p className="mb-3 font-display text-lg tracking-wide text-ancient-gold">
            🏆 {winner} a gagné la partie !
          </p>

          {isHost && (
            <button
              onClick={resetGame}
              className="rounded-md bg-sheikah-teal px-6 py-2 font-display text-void transition hover:brightness-110"
            >
              Relancer une partie
            </button>
          )}
        </div>
      )}

      <div className="mx-auto grid max-w-3xl grid-cols-5 gap-2 sm:gap-3">
        {grid.map((cell) => (
          <BingoCell
            key={cell.id}
            label={cell.label}
            checked={!!cell.checked}
            mine={isMine(cell)}
            disabled={!!winner || !!cell.checked}
            onClick={() => toggleCell(cell.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default LobbyPage