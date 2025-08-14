import { ProfileUser, MenuItem, SettingsItem, SocialLink, FAQ, SpendingReportData } from '@/types/data'

/**
 * Utility functions for creating new profile-related data entries
 */

export class ProfileDataCreator {
  
  /**
   * Create a new user profile
   */
  static createUser(params: {
    name: string
    email: string
    avatar?: string
    defaultCurrency?: string
    defaultLanguage?: string
  }): ProfileUser {
    const id = params.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    return {
      id,
      name: params.name,
      email: params.email,
      avatar: params.avatar || 'https://i.pravatar.cc/300',
      defaultCurrency: params.defaultCurrency || 'INR',
      defaultLanguage: params.defaultLanguage || 'en'
    }
  }

  /**
   * Create a new menu item
   */
  static createMenuItem(params: {
    title: string
    icon: string
    link?: string
    action?: string
    hideOnWeb?: boolean
  }): MenuItem {
    const id = params.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    return {
      id,
      icon: params.icon,
      title: params.title,
      link: params.link,
      action: params.action,
      hideOnWeb: params.hideOnWeb
    }
  }

  /**
   * Create a new settings item
   */
  static createSettingsItem(params: {
    title: string
    subtitle: string
    icon: string
    route: string
  }): SettingsItem {
    const id = params.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    return {
      id,
      icon: params.icon,
      title: params.title,
      subtitle: params.subtitle,
      route: params.route
    }
  }

  /**
   * Create a new social link
   */
  static createSocialLink(params: {
    title: string
    icon: string
    url: string
  }): SocialLink {
    const id = params.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    return {
      id,
      icon: params.icon,
      title: params.title,
      url: params.url
    }
  }

  /**
   * Create a new FAQ item
   */
  static createFAQ(params: {
    question: string
    answer: string
  }): FAQ {
    const id = params.question.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)
    
    return {
      id,
      question: params.question,
      answer: params.answer
    }
  }

  /**
   * Create spending category data
   */
  static createSpendingCategory(params: {
    name: string
    amount: number
    color: string
    icon: string
  }) {
    const id = params.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    return {
      id,
      name: params.name,
      amount: params.amount,
      color: params.color,
      icon: params.icon
    }
  }

  /**
   * Create spending person data
   */
  static createSpendingPerson(params: {
    name: string
    amount: number
    color: string
  }) {
    const id = params.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    return {
      id,
      name: params.name,
      amount: params.amount,
      color: params.color
    }
  }

  /**
   * Generate sample profile data for testing
   */
  static generateSampleProfile(): ProfileUser {
    return this.createUser({
      name: 'Sample User',
      email: 'sample@example.com',
      defaultCurrency: 'INR',
      defaultLanguage: 'en'
    })
  }

  static generateSampleMenuItem(): MenuItem {
    return this.createMenuItem({
      title: 'Sample Feature',
      icon: 'star-outline',
      link: '/sample-feature'
    })
  }

  static generateSampleFAQ(): FAQ {
    return this.createFAQ({
      question: 'How do I use this new feature?',
      answer: 'Simply navigate to the feature section and follow the on-screen instructions.'
    })
  }
}

// Example usage:
/*
const newUser = ProfileDataCreator.createUser({
  name: 'John Doe',
  email: 'john@example.com',
  defaultCurrency: 'INR'
})

const newMenuItem = ProfileDataCreator.createMenuItem({
  title: 'Export Data',
  icon: 'download-outline',
  link: '/export'
})

const newFAQ = ProfileDataCreator.createFAQ({
  question: 'How do I export my data?',
  answer: 'Go to Settings > Export Data and choose your preferred format.'
})
*/
