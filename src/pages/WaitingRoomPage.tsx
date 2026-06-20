import { useParams } from "react-router-dom"

function WaitingRoomPage() {
  const { roomId } = useParams()

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">
        Salle d'attente
      </h1>

      <p className="text-gray-300">
        Room : {roomId}
      </p>

      <p className="mt-4 text-gray-500">
        En attente des joueurs...
      </p>
    </div>
  )
}

export default WaitingRoomPage