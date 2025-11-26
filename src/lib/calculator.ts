import type { CalculationResult, DayExtras, OrderInput, UserSettings } from '../types'

type CalculationInput = {
  orders: OrderInput[]
  extras: DayExtras
  settings: UserSettings
}

export function calculateDay({
  orders,
  extras,
  settings,
}: CalculationInput): CalculationResult {
  const totalOrders = orders.reduce((acc, order) => acc + (order.amount || 0), 0)
  const totalCash = orders
    .filter((order) => order.paymentType === 'cash')
    .reduce((acc, order) => acc + (order.amount || 0), 0)
  const totalCard = orders
    .filter((order) => order.paymentType === 'card')
    .reduce((acc, order) => acc + (order.amount || 0), 0)

  const totalTips =
    settings.showTips && orders.length
      ? orders.reduce((acc, order) => acc + (order.tips || 0), 0)
      : 0

  const gross = totalOrders + totalTips
  const rentAmount =
    settings.showRentPercent && extras.rentPercent > 0
      ? (gross * extras.rentPercent) / 100
      : 0

  const infoServiceCost = settings.showInfoServiceCost ? extras.infoServiceCost : 0
  const medic = settings.showMedicMechanic ? extras.medicCost : 0
  const mechanic = settings.showMedicMechanic ? extras.mechanicCost : 0

  const extrasTotal =
    infoServiceCost + medic + mechanic + extras.dailyExpenses + (settings.includeRentInProfit ? rentAmount : 0)

  const netProfit = gross - extrasTotal

  return {
    totalOrders,
    totalCash,
    totalCard,
    totalTips,
    gross,
    rentAmount,
    extrasTotal,
    netProfit,
  }
}
