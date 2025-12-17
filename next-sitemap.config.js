// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.SITE_URL || 'https://www.rosiepawsapp.com',
  generateRobotsTxt: true, // (optional) Generate robots.txt
  generateIndexSitemap: false, // Don't split into multiple sitemaps unless you have 50k+ pages
  exclude: ['/admin/*', '/guardian/*', '/support/*', '/auth/*'], // Exclude authenticated routes
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/'
      },
      {
        userAgent: '*',
        disallow: ['/admin', '/guardian', '/support', '/auth']
      }
    ]
  }
}
