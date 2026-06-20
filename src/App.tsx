import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LobbyPage from "./pages/LobbyPage"
import WaitingRoomPage from "./pages/WaitingRoomPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lobby/:roomId" element={<LobbyPage />} />
      <Route path="/waiting/:roomId" element={<WaitingRoomPage />} />
    </Routes>
  )
}

export default App