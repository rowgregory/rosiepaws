import Stripe from 'stripe'

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('New subscription created:', subscription.id)
  // You might not need to do anything here since checkout.session.completed handles the main logic
}

export default handleSubscriptionCreated
