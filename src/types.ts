export type PaymentType = 'cash' | 'card'

export type OrderInput = {
  id: string
  amount: number
  paymentType: PaymentType
  tips?: number
  time?: string
}

export type DayExtras = {
  dailyExpenses: number
  infoServiceCost: number
  rentPercent: number
  medicCost: number
  mechanicCost: number
}

export type CalculationResult = {
  totalOrders: number
  totalCash: number
  totalCard: number
  totalTips: number
  gross: number
  rentAmount: number
  extrasTotal: number
  netProfit: number
}

export type UserSettings = {
  showOrderTime: boolean
  showTips: boolean
  showInfoServiceCost: boolean
  showRentPercent: boolean
  showMedicMechanic: boolean
  includeRentInProfit: boolean
  colorScheme: 'light' | 'dark'
  accentColor: 'cyan' | 'teal' | 'green' | 'blue'
  // Тарифы по умолчанию
  defaultRentPercent: number
  defaultInfoServiceCost: number
  defaultMedicCost: number
  defaultMechanicCost: number
}

export type DayRecord = DayExtras & {
  id: string
  date: string
  orders: OrderInput[]
  totals: CalculationResult
  notes?: string
  createdAt: number
}

export type ApiToken = {
  access_token: string
  token_type: string
}

export type ApiUser = {
  id: number
  email: string
  created_at: number
}

export type AuthPayload = {
  token: ApiToken
  user: ApiUser
}
