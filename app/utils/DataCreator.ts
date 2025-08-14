import { User, Group, Activity } from '@/types/data'

/**
 * Utility functions for creating new data entries
 * These can be used to programmatically add data or as templates
 */

export class DataCreator {
  
  /**
   * Create a new user entry
   */
  static createUser(params: {
    name: string
    amount: number
    type: 'get' | 'owe'
    transactions?: Array<{description: string, amount: number}>
  }): User {
    const id = params.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    return {
      id,
      name: params.name,
      amount: params.amount,
      type: params.type,
      transactions: params.transactions
    }
  }

  /**
   * Create a new group entry
   */
  static createGroup(params: {
    name: string
    amount: number
    type: 'get' | 'owe'
    members: string[]
  }): Group {
    const id = params.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    return {
      id,
      name: params.name,
      amount: params.amount,
      type: params.type,
      members: params.members
    }
  }

  /**
   * Create a new activity entry
   */
  static createActivity(params: {
    type: 'expense' | 'payment'
    amount: number
    currency?: string
    status?: 'pending' | 'completed' | 'settled'
    paymentMethod: string
    notes?: string
    // For expenses
    category?: string
    paidBy?: string
    yourShare?: number
    group?: string
    // For payments
    from?: string
    to?: string
  }): Activity {
    const timestamp = Date.now()
    const id = `${params.type}-${timestamp}`
    
    return {
      id,
      type: params.type,
      category: params.category,
      amount: params.amount,
      paidBy: params.paidBy,
      currency: params.currency || 'INR',
      yourShare: params.yourShare,
      group: params.group,
      status: params.status || 'pending',
      paymentMethod: params.paymentMethod,
      notes: params.notes,
      from: params.from,
      to: params.to
    }
  }

  /**
   * Generate sample data for testing
   */
  static generateSampleUser(): User {
    return this.createUser({
      name: 'Sample User',
      amount: 500.0,
      type: 'get',
      transactions: [
        { description: 'Sample transaction', amount: 500.0 }
      ]
    })
  }

  static generateSampleGroup(): Group {
    return this.createGroup({
      name: 'Sample Group',
      amount: 750.0,
      type: 'owe',
      members: ['User 1', 'User 2', 'User 3']
    })
  }

  static generateSampleExpense(): Activity {
    return this.createActivity({
      type: 'expense',
      category: 'Food',
      amount: 800.0,
      paidBy: 'Sample User',
      yourShare: 400.0,
      group: 'Sample Group',
      paymentMethod: 'UPI',
      notes: 'Sample restaurant bill'
    })
  }

  static generateSamplePayment(): Activity {
    return this.createActivity({
      type: 'payment',
      amount: 200.0,
      from: 'You',
      to: 'Sample User',
      paymentMethod: 'Bank Transfer',
      status: 'completed',
      notes: 'Settlement payment'
    })
  }
}

// Example usage:
/*
const newUser = DataCreator.createUser({
  name: 'John Doe',
  amount: 1200.50,
  type: 'get'
})

const newGroup = DataCreator.createGroup({
  name: 'Weekend Trip',
  amount: 2500.0,
  type: 'owe',
  members: ['Alice', 'Bob', 'Charlie']
})

const newExpense = DataCreator.createActivity({
  type: 'expense',
  category: 'Travel',
  amount: 1500.0,
  paidBy: 'Alice',
  yourShare: 500.0,
  group: 'Weekend Trip',
  paymentMethod: 'Card',
  notes: 'Hotel booking for 3 nights'
})
*/
