export function StructredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'Rosie Paws',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '500'
    },
    description: 'Pet health tracking app for dogs and cats. Monitor medications, pain, seizures, and vital signs.',
    image:
      'https://firebasestorage.googleapis.com/v0/b/rosie-paws.firebasestorage.app/o/images%2Frosie-rich-preview.png',
    url: 'https://www.rosiepawsapp.com'
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
