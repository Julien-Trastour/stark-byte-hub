export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  address?: string
  address2?: string
  zipCode?: string
  city?: string
  country?: string
  avatarUrl?: string
  role: {
    id: string
    name: string
  }
  createdAt: string
}
