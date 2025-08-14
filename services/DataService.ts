import { BalanceData, GroupData, ActivityData, MetaData, ProfileData, SupportData, SpendingReportData } from '@/types/data'

// Import JSON data
import balancesData from '@/data/balances.json'
import groupsData from '@/data/groups.json'
import activitiesData from '@/data/activities.json'
import metaData from '@/data/metadata.json'
import profileData from '@/data/profile.json'
import supportData from '@/data/support.json'
import spendingReportsData from '@/data/spending-reports.json'

export class DataService {
  // Balance data
  static getBalanceData(): BalanceData {
    return balancesData as BalanceData
  }

  static getUserById(id: string) {
    const data = this.getBalanceData()
    return data.users.find(user => user.id === id)
  }

  static getUserByName(name: string) {
    const data = this.getBalanceData()
    return data.users.find(user => user.name.toLowerCase() === name.toLowerCase())
  }

  // Group data
  static getGroupData(): GroupData {
    return groupsData as GroupData
  }

  static getGroupById(id: string) {
    const data = this.getGroupData()
    return data.groups.find(group => group.id === id)
  }

  static getGroupByName(name: string) {
    const data = this.getGroupData()
    return data.groups.find(group => group.name.toLowerCase() === name.toLowerCase())
  }

  // Activity data
  static getActivityData(): ActivityData {
    return activitiesData as ActivityData
  }

  static getActivityById(id: string) {
    const data = this.getActivityData()
    for (const day of data.activities) {
      const activity = day.activities.find(activity => activity.id === id)
      if (activity) return activity
    }
    return null
  }

  static getFilters() {
    const data = this.getActivityData()
    return data.filters
  }

  // Metadata
  static getMetaData(): MetaData {
    return metaData as MetaData
  }

  static getCategories() {
    const data = this.getMetaData()
    return data.categories
  }

  static getCategoryById(id: string) {
    const data = this.getMetaData()
    return data.categories.find(category => category.id === id)
  }

  static getPaymentMethods() {
    const data = this.getMetaData()
    return data.paymentMethods
  }

  static getPaymentMethodById(id: string) {
    const data = this.getMetaData()
    return data.paymentMethods.find(method => method.id === id)
  }

  // Profile data
  static getProfileData(): ProfileData {
    return profileData as ProfileData
  }

  static getCurrentUser() {
    const data = this.getProfileData()
    return data.user
  }

  static getMenuItems() {
    const data = this.getProfileData()
    return data.menuItems
  }

  static getSettingsItems() {
    const data = this.getProfileData()
    return data.settingsItems
  }

  static getLanguages() {
    const data = this.getProfileData()
    return data.languages
  }

  static getCurrencies() {
    const data = this.getProfileData()
    return data.currencies
  }

  static getLanguageByCode(code: string) {
    const data = this.getProfileData()
    return data.languages.find(lang => lang.code === code)
  }

  static getCurrencyByCode(code: string) {
    const data = this.getProfileData()
    return data.currencies.find(currency => currency.code === code)
  }

  // Support data
  static getSupportData(): SupportData {
    return supportData as SupportData
  }

  static getSocialLinks() {
    const data = this.getSupportData()
    return data.socialLinks
  }

  static getFAQs() {
    const data = this.getSupportData()
    return data.faqs
  }

  // Spending Reports data
  static getSpendingReportData(): SpendingReportData {
    return spendingReportsData as SpendingReportData
  }

  static getSpendingDataForPeriod(period: 'monthly' | 'annual') {
    const data = this.getSpendingReportData()
    return data.spendingData[period]
  }

  static getRecentTransactions() {
    const data = this.getSpendingReportData()
    return data.recentTransactions
  }

  static getDefaultCurrency() {
    const profileData = this.getProfileData()
    const spendingData = this.getSpendingReportData()
    return profileData.user.defaultCurrency || spendingData.defaultCurrency
  }

  // Search and filter methods
  static searchActivities(query: string) {
    const data = this.getActivityData()
    return data.activities
      .map(day => ({
        ...day,
        activities: day.activities.filter(activity =>
          activity.notes?.toLowerCase().includes(query.toLowerCase()) ||
          activity.category?.toLowerCase().includes(query.toLowerCase()) ||
          activity.group?.toLowerCase().includes(query.toLowerCase())
        )
      }))
      .filter(day => day.activities.length > 0)
  }

  static filterActivitiesByType(type: string) {
    const data = this.getActivityData()
    return data.activities
      .map(day => ({
        ...day,
        activities: day.activities.filter(activity => {
          if (type === 'all') return true
          if (type === 'expenses') return activity.type === 'expense'
          if (type === 'payments') return activity.type === 'payment'
          if (type === 'groups') return !!activity.group
          return true
        })
      }))
      .filter(day => day.activities.length > 0)
  }

  // Utility methods
  static formatAmount(amount: number, currency: string = 'INR'): string {
    const roundedAmount = Math.round(amount)
    return roundedAmount.toLocaleString('en-IN')
  }

  static getCurrencySymbol(currency: string = 'INR'): string {
    const currencyData = this.getCurrencyByCode(currency)
    if (currencyData) {
      return currencyData.symbol
    }
    
    // Fallback to hardcoded symbols
    switch (currency) {
      case 'INR':
        return '₹'
      case 'USD':
        return '$'
      case 'EUR':
        return '€'
      case 'GBP':
        return '£'
      default:
        return '₹'
    }
  }

  static convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
    // Simple conversion rates - in a real app, you'd fetch these from an API
    const rates: { [key: string]: number } = {
      'INR': 1,
      'USD': 0.012,
      'EUR': 0.011,
      'GBP': 0.0095
    }

    if (fromCurrency === toCurrency) return amount
    
    // Convert to INR first, then to target currency
    const inrAmount = fromCurrency === 'INR' ? amount : amount / rates[fromCurrency]
    return toCurrency === 'INR' ? inrAmount : inrAmount * rates[toCurrency]
  }
}
