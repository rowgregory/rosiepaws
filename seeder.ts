import { PrismaClient, PetType } from '@prisma/client'

const prisma = new PrismaClient()

const petsData = [
  {
    name: 'Buddy',
    type: PetType.DOG, // Assuming PetType enum includes DOG
    breed: 'Golden Retriever',
    age: '3 years',
    gender: 'Male',
    weight: '65 lbs',
    spayedNeutered: 'Yes',
    microchipId: 'MC123456789',
    allergies: 'None',
    emergencyContactName: 'Sarah Johnson',
    emergencyContactPhone: '(555) 123-4567',
    lastVisit: new Date('2025-06-15'),
    nextVisit: new Date('2025-08-15'),
    notes: 'Very friendly and energetic. Loves playing fetch.'
  },
  {
    name: 'Whiskers',
    type: PetType.CAT,
    breed: 'Persian',
    age: '5 years',
    gender: 'Female',
    weight: '12 lbs',
    spayedNeutered: 'Yes',
    microchipId: 'MC987654321',
    allergies: 'Fish',
    emergencyContactName: 'Mike Davis',
    emergencyContactPhone: '(555) 987-6543',
    lastVisit: new Date('2025-07-01'),
    nextVisit: new Date('2025-10-01'),
    notes: 'Indoor cat, very calm and loves to sleep in sunny spots.'
  },
  {
    name: 'Max',
    type: PetType.DOG,
    breed: 'German Shepherd',
    age: '2 years',
    gender: 'Male',
    weight: '75 lbs',
    spayedNeutered: 'No',
    microchipId: 'MC456789123',
    allergies: 'Chicken',
    emergencyContactName: 'Lisa Wilson',
    emergencyContactPhone: '(555) 456-7890',
    lastVisit: new Date('2025-05-20'),
    nextVisit: new Date('2025-07-20'),
    notes: 'Training in progress. Very intelligent and protective.'
  },
  {
    name: 'Luna',
    type: PetType.CAT,
    breed: 'Maine Coon',
    age: '4 years',
    gender: 'Female',
    weight: '15 lbs',
    spayedNeutered: 'Yes',
    microchipId: 'MC789123456',
    allergies: null,
    emergencyContactName: 'David Brown',
    emergencyContactPhone: '(555) 789-0123',
    lastVisit: new Date('2025-06-30'),
    nextVisit: new Date('2025-09-30'),
    notes: 'Large breed cat, very gentle and good with children.'
  },
  {
    name: 'Charlie',
    type: PetType.DOG,
    breed: 'Labrador',
    age: '6 years',
    gender: 'Male',
    weight: '70 lbs',
    spayedNeutered: 'Yes',
    microchipId: 'MC321654987',
    allergies: 'Grass pollen',
    emergencyContactName: 'Emily Garcia',
    emergencyContactPhone: '(555) 321-6549',
    lastVisit: new Date('2025-07-10'),
    nextVisit: new Date('2025-10-10'),
    notes: 'Senior dog, needs joint supplements. Very loyal companion.'
  },
  {
    name: 'Bella',
    type: PetType.DOG,
    breed: 'Border Collie',
    age: '1 year',
    gender: 'Female',
    weight: '45 lbs',
    spayedNeutered: 'Yes',
    microchipId: 'MC654987321',
    allergies: null,
    emergencyContactName: 'Robert Miller',
    emergencyContactPhone: '(555) 654-9873',
    lastVisit: new Date('2025-07-05'),
    nextVisit: new Date('2025-08-05'),
    notes: 'Very active puppy, needs lots of exercise and mental stimulation.'
  },
  {
    name: 'Mittens',
    type: PetType.CAT,
    breed: 'Siamese',
    age: '7 years',
    gender: 'Female',
    weight: '10 lbs',
    spayedNeutered: 'Yes',
    microchipId: 'MC147258369',
    allergies: 'Dairy',
    emergencyContactName: 'John Doe',
    emergencyContactPhone: '(555) 147-2583',
    lastVisit: new Date('2025-06-25'),
    nextVisit: new Date('2025-09-25'),
    notes: 'Vocal cat, likes to communicate. Senior cat with good health.'
  },
  {
    name: 'Rocky',
    type: PetType.DOG,
    breed: 'Bulldog',
    age: '4 years',
    gender: 'Male',
    weight: '55 lbs',
    spayedNeutered: 'Yes',
    microchipId: 'MC369258147',
    allergies: 'Beef',
    emergencyContactName: 'Jane Smith',
    emergencyContactPhone: '(555) 369-2581',
    lastVisit: new Date('2025-07-12'),
    nextVisit: new Date('2025-10-12'),
    notes: 'Breathing issues typical for breed. Loves lounging and short walks.'
  },
  {
    name: 'Shadow',
    type: PetType.CAT,
    breed: 'Black Shorthair',
    age: '3 years',
    gender: 'Male',
    weight: '13 lbs',
    spayedNeutered: 'Yes',
    microchipId: 'MC258147369',
    allergies: null,
    emergencyContactName: 'Admin User',
    emergencyContactPhone: '(555) 258-1473',
    lastVisit: new Date('2025-06-20'),
    nextVisit: new Date('2025-08-20'),
    notes: 'Very independent cat, prefers quiet environments.'
  },
  {
    name: 'Zeus',
    type: PetType.DOG,
    breed: 'Great Dane',
    age: '5 years',
    gender: 'Male',
    weight: '140 lbs',
    spayedNeutered: 'Yes',
    microchipId: 'MC147369258',
    allergies: 'Corn',
    emergencyContactName: 'Super User',
    emergencyContactPhone: '(555) 147-3692',
    lastVisit: new Date('2025-07-08'),
    nextVisit: new Date('2025-10-08'),
    notes: 'Gentle giant, very calm and friendly. Needs large space.'
  }
]

const usersData = [
  {
    email: 'user1@example.com',
    role: 'FREE',
    isSuperUser: false,
    isAdmin: false,
    isFreeUser: true,
    isComfortUser: false,

    isLegacyUser: false,
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    image: 'https://via.placeholder.com/150',
    tokens: 250,
    tokensUsed: 0
  },
  {
    email: 'user2@example.com',
    role: 'FREE',
    isSuperUser: false,
    isAdmin: false,
    isFreeUser: true,
    isComfortUser: false,

    isLegacyUser: false,
    firstName: 'Jane',
    lastName: 'Smith',
    name: 'Jane Smith',
    image: 'https://via.placeholder.com/150',
    tokens: 250,
    tokensUsed: 0
  },
  {
    email: 'user3@example.com',
    role: 'COMFORT',
    isSuperUser: false,
    isAdmin: false,
    isFreeUser: false,
    isComfortUser: true,

    isLegacyUser: false,
    firstName: 'Mike',
    lastName: 'Johnson',
    name: 'Mike Johnson',
    image: 'https://via.placeholder.com/150',
    tokens: 1500,
    tokensUsed: 250
  },
  {
    email: 'user4@example.com',
    role: 'FREE',
    isSuperUser: false,
    isAdmin: false,
    isFreeUser: true,
    isComfortUser: false,

    isLegacyUser: false,
    firstName: 'Sarah',
    lastName: 'Wilson',
    name: 'Sarah Wilson',
    image: 'https://via.placeholder.com/150',
    tokens: 500,
    tokensUsed: 250
  },
  {
    email: 'user5@example.com',
    role: 'LEGACY',
    isSuperUser: false,
    isAdmin: false,
    isFreeUser: false,
    isComfortUser: false,
    isLegacyUser: false,
    firstName: 'David',
    lastName: 'Brown',
    name: 'David Brown',
    image: 'https://via.placeholder.com/150',
    tokens: 2000,
    tokensUsed: 500
  },
  {
    email: 'admin@example.com',
    role: 'ADMIN',
    isSuperUser: false,
    isAdmin: true,
    isFreeUser: false,
    isComfortUser: false,

    isLegacyUser: false,
    firstName: 'TestAdmin',
    lastName: 'User',
    name: 'Admin User',
    image: 'https://via.placeholder.com/150',
    tokens: 5000,
    tokensUsed: 100
  },
  {
    email: 'user7@example.com',
    role: 'FREE',
    isSuperUser: false,
    isAdmin: false,
    isFreeUser: true,
    isComfortUser: false,

    isLegacyUser: false,
    firstName: 'Lisa',
    lastName: 'Davis',
    name: 'Lisa Davis',
    image: 'https://via.placeholder.com/150',
    tokens: 250,
    tokensUsed: 0
  },
  {
    email: 'user8@example.com',
    role: 'LEGACY',
    isSuperUser: false,
    isAdmin: false,
    isFreeUser: false,
    isComfortUser: false,

    isLegacyUser: true,
    firstName: 'Robert',
    lastName: 'Miller',
    name: 'Robert Miller',
    image: 'https://via.placeholder.com/150',
    tokens: 1000,
    tokensUsed: 750
  },
  {
    email: 'user9@example.com',
    role: 'COMFORT',
    isSuperUser: false,
    isAdmin: false,
    isFreeUser: false,
    isComfortUser: true,

    isLegacyUser: false,
    firstName: 'Emily',
    lastName: 'Garcia',
    name: 'Emily Garcia',
    image: 'https://via.placeholder.com/150',
    tokens: 1200,
    tokensUsed: 300
  },
  {
    email: 'super@example.com',
    role: 'ADMIN',
    isSuperUser: true,
    isAdmin: true,
    isFreeUser: false,
    isComfortUser: false,

    isLegacyUser: false,
    firstName: 'Super',
    lastName: 'User',
    name: 'Super User',
    image: 'https://via.placeholder.com/150',
    tokens: 10000,
    tokensUsed: 0
  }
]

// Sample subscription data that matches your StripeSubscription schema
const subscriptionsData = [
  {
    userId: 'user_001', // You'll need to replace with actual user IDs from your database
    customerId: 'cus_stripe_customer_001',
    paymentMethodId: 'pm_stripe_payment_method_001',
    subscriptionId: 'sub_stripe_subscription_001',
    status: 'active',
    plan: 'COMFORT',
    planPrice: 1199, // $19.99 in cents
    tokensIncluded: 45000,
    trialEndsAt: new Date('2025-08-22'),
    cancelAtPeriodEnd: false,
    canceledAt: null,
    currentPeriodEnd: new Date('2025-09-22'),
    paymentMethod: 'card',
    paymentMethodBrand: 'visa',
    paymentMethodLast4: '4242'
  },
  {
    userId: 'user_002',
    customerId: 'cus_stripe_customer_002',
    paymentMethodId: 'pm_stripe_payment_method_002',
    subscriptionId: 'sub_stripe_subscription_002',
    status: 'active',
    plan: 'LEGACY',
    planPrice: 2299, // $29.99 in cents
    tokensIncluded: 120000,
    trialEndsAt: null,
    cancelAtPeriodEnd: false,
    canceledAt: null,
    currentPeriodEnd: new Date('2025-08-15'),
    paymentMethod: 'card',
    paymentMethodBrand: 'mastercard',
    paymentMethodLast4: '5555'
  },
  {
    userId: 'user_003',
    customerId: 'cus_stripe_customer_003',
    paymentMethodId: 'pm_stripe_payment_method_003',
    subscriptionId: null,
    status: 'inactive',
    plan: 'COMFORT',
    planPrice: 1199,
    tokensIncluded: 45000,
    trialEndsAt: null,
    cancelAtPeriodEnd: false,
    canceledAt: null,
    currentPeriodEnd: null,
    paymentMethod: 'apple_pay',
    paymentMethodBrand: null,
    paymentMethodLast4: null
  },
  {
    userId: 'user_004',
    customerId: 'cus_stripe_customer_004',
    paymentMethodId: 'pm_stripe_payment_method_004',
    subscriptionId: 'sub_stripe_subscription_004',
    status: 'past_due',
    plan: 'COMFORT',
    planPrice: 1199,
    tokensIncluded: 45000,
    trialEndsAt: null,
    cancelAtPeriodEnd: true,
    canceledAt: null,
    currentPeriodEnd: new Date('2025-07-30'),
    paymentMethod: 'card',
    paymentMethodBrand: 'amex',
    paymentMethodLast4: '1111'
  },
  {
    userId: 'user_005',
    customerId: 'cus_stripe_customer_005',
    paymentMethodId: 'pm_stripe_payment_method_005',
    subscriptionId: 'sub_stripe_subscription_005',
    status: 'canceled',
    plan: 'LEGACY',
    planPrice: 2299,
    tokensIncluded: 120000,
    trialEndsAt: null,
    cancelAtPeriodEnd: false,
    canceledAt: new Date('2025-07-15'),
    currentPeriodEnd: new Date('2025-07-15'),
    paymentMethod: 'google_pay',
    paymentMethodBrand: null,
    paymentMethodLast4: null
  },
  {
    userId: 'user_006',
    customerId: 'cus_stripe_customer_006',
    paymentMethodId: 'pm_stripe_payment_method_006',
    subscriptionId: 'sub_stripe_subscription_006',
    status: 'trialing',
    plan: 'LEGACY',
    planPrice: 3499, // $49.99 in cents
    tokensIncluded: 1000000,
    trialEndsAt: new Date('2025-08-01'),
    cancelAtPeriodEnd: false,
    canceledAt: null,
    currentPeriodEnd: new Date('2025-09-01'),
    paymentMethod: 'card',
    paymentMethodBrand: 'visa',
    paymentMethodLast4: '0123'
  },
  {
    userId: 'user_007',
    customerId: 'cus_stripe_customer_007',
    paymentMethodId: 'pm_stripe_payment_method_007',
    subscriptionId: 'sub_stripe_subscription_007',
    status: 'active',
    plan: 'COMFORT',
    planPrice: 1199,
    tokensIncluded: 45000,
    trialEndsAt: null,
    cancelAtPeriodEnd: false,
    canceledAt: null,
    currentPeriodEnd: new Date('2025-08-25'),
    paymentMethod: 'link',
    paymentMethodBrand: null,
    paymentMethodLast4: null
  },
  {
    userId: 'user_008',
    customerId: 'cus_stripe_customer_008',
    paymentMethodId: 'pm_stripe_payment_method_008',
    subscriptionId: 'sub_stripe_subscription_008',
    status: 'unpaid',
    plan: 'LEGACY',
    planPrice: 2299,
    tokensIncluded: 120000,
    trialEndsAt: null,
    cancelAtPeriodEnd: true,
    canceledAt: null,
    currentPeriodEnd: new Date('2025-07-20'),
    paymentMethod: 'card',
    paymentMethodBrand: 'discover',
    paymentMethodLast4: '6789'
  },
  {
    userId: 'user_009',
    customerId: 'cus_stripe_customer_009',
    paymentMethodId: 'pm_stripe_payment_method_009',
    subscriptionId: 'sub_stripe_subscription_009',
    status: 'active',
    plan: 'LEGACY',
    planPrice: 3499,
    tokensIncluded: 1000000,
    trialEndsAt: null,
    cancelAtPeriodEnd: false,
    canceledAt: null,
    currentPeriodEnd: new Date('2025-09-10'),
    paymentMethod: 'card',
    paymentMethodBrand: 'mastercard',
    paymentMethodLast4: '9999'
  },
  {
    userId: 'user_010',
    customerId: 'cus_stripe_customer_010',
    paymentMethodId: 'pm_stripe_payment_method_010',
    subscriptionId: null,
    status: 'inactive',
    plan: 'COMFORT',
    planPrice: 45000,
    tokensIncluded: 120000,
    trialEndsAt: null,
    cancelAtPeriodEnd: false,
    canceledAt: null,
    currentPeriodEnd: null,
    paymentMethod: 'sepa_debit',
    paymentMethodBrand: null,
    paymentMethodLast4: null
  }
]

const onlySubscriptions = false

const importData = async () => {
  try {
    // Delete in correct order (children first, then parents)
    await prisma.stripeSubscription.deleteMany()
    await prisma.pet.deleteMany()
    await prisma.user.deleteMany()

    await prisma.user.createMany({
      data: usersData
    })
    console.log('Users created!')

    // Get the created users to get their IDs
    const users = await prisma.user.findMany({
      select: { id: true },
      orderBy: { createdAt: 'asc' }
    })

    // Update pet data with real user IDs (ownerId)
    const updatedPetsData = petsData.map((pet, index) => ({
      ...pet,
      ownerId: users[index].id
    }))

    // Create pets
    await prisma.pet.createMany({
      data: updatedPetsData
    })
    console.log('Pets created!')

    // Update subscription data with real user IDs
    const updatedSubscriptionsData = subscriptionsData.map((subscription, index) => ({
      ...subscription,
      userId: users[index].id
    }))

    // Then create subscriptions
    await prisma.stripeSubscription.deleteMany()
    await prisma.stripeSubscription.createMany({
      data: updatedSubscriptionsData
    })
    console.log('Subscription Data Imported!')
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}

const importSubscriptions = async () => {
  try {
    // First create users if they don't exist
    const existingUsers = await prisma.user.count()
    let users: string | any[]
    if (existingUsers < 10) {
      console.log('Creating users first...')
      // Delete in correct order
      await prisma.stripeSubscription.deleteMany()
      await prisma.pet.deleteMany()
      await prisma.user.deleteMany()

      await prisma.user.createMany({
        data: usersData
      })
      console.log('Users created!')

      // Get users for pet creation
      users = await prisma.user.findMany({
        take: 10,
        select: { id: true },
        orderBy: { createdAt: 'asc' }
      })

      // Create pets for each user
      const updatedPetsData = petsData.map((pet, index) => ({
        ...pet,
        ownerId: users[index].id
      }))

      await prisma.pet.createMany({
        data: updatedPetsData
      })
      console.log('Pets created!')
    }

    // Get users for subscription creation
    users = await prisma.user.findMany({
      take: 10,
      select: { id: true },
      orderBy: { createdAt: 'asc' }
    })

    // Update subscription data with real user IDs
    const updatedSubscriptionsData = subscriptionsData.slice(0, users.length).map((subscription, index) => ({
      ...subscription,
      userId: users[index].id
    }))

    await prisma.stripeSubscription.deleteMany()
    await prisma.stripeSubscription.createMany({
      data: updatedSubscriptionsData
    })
    console.log(`Subscriptions imported`)
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    // Delete in correct order (children first, then parents)
    await prisma.stripeSubscription.deleteMany()
    await prisma.tokenTransaction.deleteMany()
    await prisma.galleryItem.deleteMany()
    await prisma.pet.deleteMany()
    await prisma.session.deleteMany()
    await prisma.account.deleteMany()
    await prisma.user.deleteMany()
    console.log('All Data Destroyed!')
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  if (onlySubscriptions) {
    importSubscriptions()
  } else {
    importData()
  }
}
