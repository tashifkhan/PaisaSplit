// Balance types
export interface Transaction {
  description: string
  amount: number
}

export interface User {
  id: string
  name: string
  amount: number
  type: 'get' | 'owe'
  transactions?: Transaction[]
}

export interface BalanceSummary {
  youOwe: number
  youGet: number
}

export interface BalanceData {
  summary: BalanceSummary
  users: User[]
}

// Group types
export interface Group {
  id: string
  name: string
  amount: number
  type: 'get' | 'owe'
  members: string[]
}

export interface GroupSummary {
  overallOwed: number
}

export interface GroupData {
  summary: GroupSummary
  groups: Group[]
}

// Activity types
export interface Activity {
  id: string
  type: 'expense' | 'payment'
  category?: string
  amount: number
  paidBy?: string
  currency: string
  yourShare?: number
  group?: string
  status: 'pending' | 'completed' | 'settled'
  paymentMethod: string
  notes?: string
  from?: string
  to?: string
}

export interface DayActivity {
  date: string
  activities: Activity[]
}

export interface Filter {
  id: string
  label: string
}

export interface ActivityData {
  filters: Filter[]
  activities: DayActivity[]
}

// Metadata types
export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export interface PaymentMethod {
  id: string
  name: string
  icon: string
}

export interface MetaData {
  categories: Category[]
  paymentMethods: PaymentMethod[]
}

// Profile types
export interface ProfileUser {
  id: string
  name: string
  email: string
  avatar: string
  defaultCurrency: string
  defaultLanguage: string
}

export interface MenuItem {
  id: string
  icon: string
  title: string
  link?: string
  action?: string
  hideOnWeb?: boolean
}

export interface SettingsItem {
  id: string
  icon: string
  title: string
  subtitle: string
  route: string
}

export interface Language {
  code: string
  name: string
}

export interface Currency {
  code: string
  symbol: string
  name: string
}

export interface ProfileData {
  user: ProfileUser
  menuItems: MenuItem[]
  settingsItems: SettingsItem[]
  languages: Language[]
  currencies: Currency[]
}

// Support types
export interface SocialLink {
  id: string
  icon: string
  title: string
  url: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
}

export interface SupportData {
  socialLinks: SocialLink[]
  faqs: FAQ[]
}

// Spending Report types
export interface SpendingCategory {
  id: string
  name: string
  amount: number
  color: string
  icon: string
}

export interface SpendingPerson {
  id: string
  name: string
  amount: number
  color: string
}

export interface SpendingGroup {
  id: string
  name: string
  amount: number
  color: string
}

export interface SpendingPeriod {
  total: number
  categories: SpendingCategory[]
  people: SpendingPerson[]
  groups: SpendingGroup[]
}

export interface Transaction {
  id: string
  title: string
  amount: number
  date: string
  category: string
}

export interface SpendingReportData {
  defaultCurrency: string
  periods: string[]
  spendingData: {
    annual: SpendingPeriod
    monthly: SpendingPeriod
  }
  recentTransactions: Transaction[]
}

// Common types
export type AmountType = 'get' | 'owe' | 'settled'
