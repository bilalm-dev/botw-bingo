import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { getOrCreatePlayerUid } from "../lib/playerUid"
import { generateBalancedGrid } from "../lib/generateGrid"

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

    const grid = generateBalancedGrid()

    const { data, error } = await supabase
      .from("rooms")
      .update({ status: "playing", grid_state: grid })
      .eq("id", roomUuid)
      .eq("status", "waiting")
      .select("id")

    if (error) {
      console.error(error)
      return
    }

    if (!data || data.length === 0) {
      console.warn("La partie a déjà été lancée")
    }
  }

  // comparaison sur l'UID, plus jamais sur le pseudo
  const isHost = createdBy === playerUid

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-void px-4 font-body text-white">
      <div className="w-full max-w-md animate-fade-up rounded-xl border border-white/10 bg-slate-stone/60 p-8 shadow-2xl backdrop-blur">
        <h1 className="mb-6 text-center font-display text-2xl tracking-wide text-ancient-gold">
          Salle d'attente
        </h1>

        <div className="mb-2 flex items-center justify-center gap-2 rounded-md border border-sheikah-teal/30 bg-void/60 px-4 py-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sheikah-teal" />
          <span className="font-rune text-sm tracking-widest text-sheikah-teal">
            {roomId}
          </span>
        </div>

        <p className="mb-6 text-center text-xs text-parchment/50">
          Statut : {status}
        </p>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {players.map((p) => {
            const isSelf = p.player_uid === playerUid
            const isPlayerHost = p.player_uid === createdBy

            return (
              <span
                key={p.id}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-body ${
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

        {isHost ? (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={startGame}
              disabled={players.length < 2}
              className="rounded-md bg-ancient-gold px-6 py-2.5 font-display tracking-wide text-void transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-parchment/40"
            >
              Lancer la partie
            </button>
            {players.length < 2 && (
              <p className="text-xs text-parchment/50">
                Il faut au moins 2 joueurs pour lancer la partie
              </p>
            )}
          </div>
        ) : (
          <p className="text-center text-sm italic text-parchment/50">
            En attente du créateur...
          </p>
        )}
      </div>
    </div>
  )
}

export default WaitingRoomPage