export const plans = [
  {
    id: 'free',
    name: 'Free',
    role: 'free_user',
    subtitle: 'Pet owners who want to explore without any commitment',
    price: '$0',
    period: '/month',
    features: [
      '150 daily tokens for quick pet tasks',
      'Basic pet profile creation and management',
      'Simple appointment scheduling and reminders',
      'Access to essential pet care tips and guides',
      'Basic health tracking for weight and medications',
      'Standard customer support via email'
    ],
    color: 'from-sky-400 to-emerald-500',
    textColor: 'text-sky-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    popular: false
  },
  {
    id: 'comfort',
    name: 'Comfort',
    role: 'comfort_user',
    subtitle: 'Single pet families seeking reliable care management',
    price: '$23',
    period: '/month',
    features: [
      '5,000 Fast Tokens on your Billing Date',
      'Basic health monitoring',
      'Vaccination reminders',
      'Weight tracking',
      'Photo memories (up to 50)',
      'Basic health reports'
    ],
    color: 'from-pink-400 to-rose-500',
    textColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    popular: false
  },
  {
    id: 'legacy',
    name: 'Legacy',
    role: 'legacy_user',
    subtitle: 'Pet parents navigating end-of-life care and cherishing memories',
    price: '$45',
    period: '/month',
    features: [
      'Unlimited tokens',
      'Advanced behavior tracking',
      'Personalized care plans',
      '24/7 phone support',
      'Health trend analysis',
      'Emergency contact system',
      'Premium memory books',
      'Advanced data export options'
    ],
    color: 'from-purple-400 to-indigo-500',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    popular: false
  }
]
