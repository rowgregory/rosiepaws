import { IUser } from '@/app/types'

export const initialUserState: IUser = {
  id: '', // Will be generated as cuid() on creation
  email: '', // Must be provided when creating
  role: 'Free', // Default role
  isSuperUser: false, // Default permission
  isAdmin: false, // Default permission
  isFreeUser: true, // Default user type
  isComfortUser: false, // Default user type
  isLegacyUser: false, // Default user type
  firstName: undefined, // Optional field
  lastName: undefined, // Optional field
  stripeCustomerId: undefined, // Optional Stripe integration

  // NextAuth fields
  emailVerified: null, // Email verification timestamp
  name: '', // Optional display name
  image: '', // Optional profile image URL

  // Token fields
  tokens: 750, // Starting tokens for new users
  tokensUsed: 0, // Track total tokens consumed
  lastTokenReset: null, // Optional token reset timestamp

  // Relationships (empty arrays/null for initial state)
  accounts: [], // Account[] relationship
  sessions: [], // Session[] relationship
  pets: [], // Pet[] relationship
  stripeSubscription: undefined, // StripeSubscription? relationship
  tokenTransactions: [], // TokenTransaction[] relationship
  galleryItems: [], // GalleryItem[] relationship
  tickets: [], // Ticket[] relationship

  createdAt: new Date(), // Current timestamp
  updatedAt: new Date() // Current timestamp
}
