export interface Transaction {
   id: number
   title: string
   amount: number
   date: string
   category: string
}

export interface Category {
   name: string
   amount: number
   color: string
   icon: string
}

export interface MonthlySpending {
   total: number
   categories: Category[]
}

export interface SpendingReport {
   monthly: MonthlySpending
   transactions: Transaction[]
}
