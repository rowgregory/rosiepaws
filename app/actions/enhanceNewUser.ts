import prisma from '@/prisma/client'

export async function enhanceNewUser(email: string, name: string) {
  try {
    const nameParts = (name || '').split(' ')

    console.log('NAME PARTS IN ENHANCE NEW USER: ', nameParts)
    // Check if user already has the enhanced fields
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        stripeSubscription: true
      }
    })

    console.log('USER IN ENHANCE NEW USER: ', user)

    if (!user) {
      return false
    }

    // Only enhance if user doesn't have firstName (indicating first-time setup)
    if (!user.firstName) {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || ''
        }
      })

      console.log('Enhanced new user:', updatedUser.firstName, 'with last name:', updatedUser.lastName)
      return true
    }

    console.log('Existing user sign-in:', user.id)
    return true
  } catch (error: any) {
    console.error('Error enhancing user:', error)
    return false
  }
}
