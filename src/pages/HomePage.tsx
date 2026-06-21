import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { getOrCreatePlayerUid } from "../lib/playerUid"

function generateRoomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = "BOTW-"
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

function HomePage() {
  const [pseudo, setPseudo] = useState("")
  const [roomCode, setRoomCode] = useState("")
  const navigate = useNavigate()

  // calculé une seule fois, stable pour toute la session
  const [playerUid] = useState(() => getOrCreatePlayerUid())

  useEffect(() => {
    const saved = localStorage.getItem("botw_pseudo")
    if (saved) setPseudo(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem("botw_pseudo", pseudo)
  }, [pseudo])

  async function handleCreateRoom() {
    if (!pseudo.trim()) return

    const code = generateRoomCode()

    const { data: room, error } = await supabase
      .from("rooms")
      .insert({
        code,
        status: "waiting",
        created_by: playerUid,
      })
      .select("id")
      .single()

    if (error || !room) {
      console.error(error)
      return
    }

    const { error: playerError } = await supabase.from("players").upsert(
      {
        room_id: room.id,
        pseudo,
        player_uid: playerUid,
      },
      { onConflict: "room_id,player_uid" }
    )

    if (playerError) {
      console.error(playerError)
      return
    }

    navigate(`/waiting/${code}`)
  }

  async function handleJoinRoom() {
    if (!pseudo.trim() || !roomCode.trim()) return

    const code = roomCode.trim().toUpperCase()

    const { data: room } = await supabase
      .from("rooms")
      .select("id, status")
      .eq("code", code)
      .maybeSingle()

    if (!room) {
      alert("Room inexistante")
      return
    }

    if (room.status !== "waiting") {
      alert("Partie déjà commencée")
      return
    }

    const { error } = await supabase.from("players").upsert(
      {
        room_id: room.id,
        pseudo,
        player_uid: playerUid,
      },
      { onConflict: "room_id,player_uid" }
    )

    if (error) {
      console.error(error)
      return
    }

    navigate(`/waiting/${code}`)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-void px-4 font-body text-white">
      <div className="w-full max-w-md animate-fade-up rounded-xl border border-white/10 bg-slate-stone/60 p-8 shadow-2xl backdrop-blur">
        <h1 className="mb-1 text-center font-display text-3xl tracking-wide text-ancient-gold">
          Bingo Hyrule
        </h1>
        <p className="mb-8 text-center text-xs uppercase tracking-[0.2em] text-parchment/40">
          Breath of the Wild Bingo
        </p>

        <label className="mb-1 block text-xs uppercase tracking-wide text-parchment/50">
          Pseudo
        </label>
        <input
          className="mb-6 w-full rounded-md border border-white/10 bg-void/60 px-3 py-2.5 text-white placeholder:text-parchment/30 focus:border-sheikah-teal/60 focus:outline-none focus:ring-1 focus:ring-sheikah-teal/40"
          placeholder="Ton pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
        />

        <button
          className="mb-8 w-full rounded-md bg-ancient-gold px-4 py-2.5 font-display tracking-wide text-void transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-parchment/40"
          onClick={handleCreateRoom}
          disabled={!pseudo.trim()}
        >
          Créer une partie
        </button>

        <div className="mb-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-widest text-parchment/30">
            ou
          </span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <label className="mb-1 block text-xs uppercase tracking-wide text-parchment/50">
          Code de room
        </label>
        <input
          className="mb-4 w-full rounded-md border border-sheikah-teal/20 bg-void/60 px-3 py-2.5 font-rune tracking-widest text-sheikah-teal placeholder:font-body placeholder:tracking-normal placeholder:text-parchment/30 focus:border-sheikah-teal/60 focus:outline-none focus:ring-1 focus:ring-sheikah-teal/40"
          placeholder="BOTW-4F9K"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />

        <button
          className="w-full rounded-md bg-korok-moss px-4 py-2.5 font-display tracking-wide text-void transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-parchment/40"
          onClick={handleJoinRoom}
          disabled={!pseudo.trim() || !roomCode.trim()}
        >
          Rejoindre une partie
        </button>

        <p className="mt-6 text-center text-xs text-parchment/30">
          Pseudo : {pseudo || "non défini"}
        </p>
      </div>
    </div>
  )
}

export default HomePage