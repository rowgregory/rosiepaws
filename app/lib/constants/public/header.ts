export const navItems = (path: string) => [
  { name: 'Activiy Center', linkKey: '/activity-center', isActive: path === '/activity-center' },
  { name: 'Resources', linkKey: '/resources', isActive: path === '/resources' },
  { name: 'About', linkKey: '/about', isActive: path === '/about' }
]
