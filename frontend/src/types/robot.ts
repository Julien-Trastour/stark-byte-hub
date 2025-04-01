export type RobotStatus = 'online' | 'offline'

export type Robot = {
  id: string
  name?: string
  model?: string
  serialNumber: string
  linkKey: string
  firmware?: string
  color: string
  controllable: boolean
  imageUrl?: string
  commissionedAt?: string
  createdAt: string
  updatedAt: string

  // Champs dynamiques (backend ou état calculé)
  status?: RobotStatus
  battery?: number
  lastSeen?: string
  ip?: string
  linkedAt?: string

  // 👇 Ajout pour la vue admin
  user?: {
    id: string
    firstName: string
    lastName: string
    email?: string
  }
}

export type LinkRobotPayload = {
  serialNumber: string
  linkKey: string
  name: string
}

export type CreateRobotPayload = {
  serialNumber: string
  linkKey: string
  firmware: string
  color: string
  controllable: boolean
  model: string
}

export type UpdateRobotPayload = Partial<Omit<Robot, 'id' | 'createdAt' | 'updatedAt'>>;

