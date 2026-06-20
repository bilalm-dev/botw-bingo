export function getOrCreatePlayerUid(): string {
  const existing = localStorage.getItem("botw_player_uid")
  if (existing) return existing

  const id = crypto.randomUUID()
  localStorage.setItem("botw_player_uid", id)
  return id
}