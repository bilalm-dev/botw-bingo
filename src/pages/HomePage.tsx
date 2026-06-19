import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

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

  const { error } = await supabase
    .from("rooms")
    .insert({
      code,
      status: "waiting",
      grid_state: {},
    })

  if (error) {
  console.error("SUPABASE ERROR:", error)
  alert(JSON.stringify(error, null, 2))
  return
  }

  navigate(`/lobby/${code}`)
}

  function handleJoinRoom() {
  if (!pseudo.trim() || !roomCode.trim()) return

  navigate(`/lobby/${roomCode}`)
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="space-y-4 text-center w-full max-w-sm">
        <h1 className="text-3xl font-bold">
          Breath of the Wild Bingo
        </h1>

        <input
          className="w-full px-3 py-2 rounded bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ton pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
        />

        <div className="pt-4 space-y-2">
          <button
            className="w-full bg-blue-600 py-2 rounded disabled:opacity-50"
            onClick={handleCreateRoom}
            disabled={!pseudo.trim()}
          >
            Créer une partie
          </button>

          <input
            className="w-full px-3 py-2 rounded bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Code de room (ex: BOTW-4F9K)"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />

          <button
            className="w-full bg-green-600 py-2 rounded disabled:opacity-50"
            onClick={handleJoinRoom}
            disabled={!pseudo.trim() || !roomCode.trim()}
          >
            Rejoindre une partie
          </button>

          <button
          onClick={async () => {
            const { data, error } = await supabase
              .from("rooms")
              .select("*")

            console.log("DATA", data)
            console.log("ERROR", error)
          }}
        >
          Test Supabase
        </button>
        </div>

        <p className="text-sm text-gray-400">
          Pseudo : {pseudo || "non défini"}
        </p>
      </div>
    </div>
  )
}

export default HomePage