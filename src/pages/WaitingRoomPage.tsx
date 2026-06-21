import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { getOrCreatePlayerUid } from "../lib/playerUid"

type Player = {
  id: string
  pseudo: string
  player_uid: string
}

function WaitingRoomPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()

  const [roomUuid, setRoomUuid] = useState<string | null>(null)
  const [createdBy, setCreatedBy] = useState<string | null>(null)
  const [status, setStatus] = useState("waiting")
  const [players, setPlayers] = useState<Player[]>([])

  const [playerUid] = useState(() => getOrCreatePlayerUid())

  // ---------------- INIT ROOM ----------------
  useEffect(() => {
    async function init() {
      if (!roomId) return

      const { data: room } = await supabase
        .from("rooms")
        .select("id, created_by, status")
        .eq("code", roomId)
        .maybeSingle()

      if (!room) return

      setRoomUuid(room.id)
      setCreatedBy(room.created_by ?? null)
      setStatus(room.status)

      await refreshPlayers(room.id)
    }

    init()
  }, [roomId])

  async function refreshPlayers(rId: string) {
    const { data } = await supabase
      .from("players")
      .select("id, pseudo, player_uid")
      .eq("room_id", rId)

    if (data) setPlayers(data)
  }

  // ---------------- PLAYERS REALTIME (channel scopé à la room) ----------------
  useEffect(() => {
    if (!roomUuid) return

    const channel = supabase
      .channel(`room-${roomUuid}-players`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `room_id=eq.${roomUuid}`,
        },
        () => refreshPlayers(roomUuid)
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [roomUuid])

  // ---------------- ROOM REALTIME (channel scopé à la room) ----------------
  useEffect(() => {
    if (!roomUuid) return

    const channel = supabase
      .channel(`room-${roomUuid}-status`)
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
            .select("status, created_by")
            .eq("id", roomUuid)
            .maybeSingle()

          if (!data) return

          setStatus(data.status)
          setCreatedBy(data.created_by ?? null)

          if (data.status === "playing") {
            navigate(`/lobby/${roomId}`)
          }
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [roomUuid, roomId])

  // ---------------- START GAME ----------------
  async function startGame() {
    if (!roomUuid) return
    if (players.length < 2) return

    const { data, error } = await supabase
        .from("rooms")
        .update({ status: "playing" })
        .eq("id", roomUuid)
        .eq("status", "waiting") // empêche un double-start (double-clic ou 2 clients en course)
        .select("id")

    if (error) {
        console.error(error)
        return
    }

    if (!data || data.length === 0) {
        // la partie a déjà été lancée juste avant (par un autre clic / un autre client)
        console.warn("La partie a déjà été lancée")
    }
    }

  // FIX BUG 2 : comparaison sur l'UID, plus jamais sur le pseudo
  const isHost = createdBy === playerUid

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Salle d'attente</h1>

      <p className="text-gray-400 mb-2">Room : {roomId}</p>
      <p className="text-gray-500 mb-4">Statut : {status}</p>

      <div className="flex gap-2 flex-wrap justify-center mb-6">
        {players.map((p) => (
          <span
            key={p.id}
            className={`px-3 py-1 rounded ${
              p.player_uid === playerUid ? "bg-green-600" : "bg-blue-600"
            }`}
          >
            {p.pseudo}
          </span>
        ))}
      </div>

      {isHost ? (
        <div className="flex flex-col items-center gap-2">
            <button
            onClick={startGame}
            disabled={players.length < 2}
            className="bg-green-600 px-6 py-2 rounded font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            >
            Lancer la partie
            </button>
            {players.length < 2 && (
            <p className="text-xs text-gray-500">
                Il faut au moins 2 joueurs pour lancer la partie
            </p>
            )}
        </div>
        ) : (
        <p className="text-gray-500">En attente du créateur...</p>
        )}
    </div>
  )
}

export default WaitingRoomPage