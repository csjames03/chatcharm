import { SpendingPoint } from "../src/components/DashBoardOverview"

export function calculateConversionMetrics(data: SpendingPoint[]) {
    if (data.length === 0) {
        return { conversionRate: 0, churnRate: 0 }
    }

    const total = data.reduce((sum, item) => sum + item.amount, 0)

    // Fake logic for demonstration — adjust to your real metric formula
    const average = total / data.length

    const conversionRate = Math.min(total / 1000, 1) // Cap at 100%
    const churnRate = Math.max(0.01, 1 - average / 500) // Avoid 0

    return {
        conversionRate: parseFloat(conversionRate.toFixed(2)),
        churnRate: parseFloat(churnRate.toFixed(2)),
    }
}