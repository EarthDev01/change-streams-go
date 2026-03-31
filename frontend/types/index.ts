export type UserRole = 'user' | 'admin'

export type OrderStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'refund_requested'
  | 'refunded'

export type TransactionType = 'topup' | 'purchase' | 'refund'

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  credit_balance: number
  created_at: string
  updated_at: string
}

export interface Package {
  id: string
  name: string
  description: string
  price: number
  is_active: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  package_id: string
  amount: number
  status: OrderStatus
  note?: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  reference_id?: string
  created_at: string
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface AuthResult {
  token: string
  user: User
}

export interface RegisterInput {
  username: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface TopupInput {
  amount: number
}

export interface CreatePackageInput {
  name: string
  description: string
  price: number
}
