'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, GitBranch, Code, Zap, Shield, Bell, Settings, ChevronDown, Search } from 'lucide-react'

interface ChangelogEntry {
  id: string
  date: string
  version: string
  category: 'feature' | 'improvement' | 'bugfix' | 'security' | 'breaking'
  title: string
  description: string
  author: string
}

const CHANGELOG_DATA: ChangelogEntry[] = [
  {
    id: '1',
    date: '2025-12-17',
    version: '2.1.0',
    category: 'feature',
    title: 'Admin User Tier Management',
    description:
      'Admins can now update user tiers (Free, Comfort, Legacy) directly from the user table with real-time Pusher notifications.',
    author: 'Sqysh'
  },
  {
    id: '2',
    date: '2025-12-17',
    version: '2.1.0',
    category: 'feature',
    title: 'Real-time Tier Updates with Pusher',
    description:
      'Users receive instant notifications when their tier is changed by an admin. Session automatically refreshes without requiring logout.',
    author: 'Sqysh'
  },
  {
    id: '3',
    date: '2025-12-17',
    version: '2.1.0',
    category: 'improvement',
    title: 'NextAuth v5 Authentication Migration',
    description:
      'Migrated from custom header authentication to NextAuth v5 auth() pattern with requireAuth, requireAdmin, and requireSuperUser helpers.',
    author: 'Sqysh'
  },
  {
    id: '4',
    date: '2025-12-17',
    version: '2.1.0',
    category: 'improvement',
    title: 'Middleware Simplification',
    description:
      'Removed unnecessary x-user header passing. API routes now call auth() directly for better security and simpler code.',
    author: 'Sqysh'
  },
  {
    id: '5',
    date: '2025-12-17',
    version: '2.1.0',
    category: 'feature',
    title: 'RTK Query Tier Update Mutation',
    description: 'Implemented updateUserTier mutation with automatic cache invalidation and optimistic updates.',
    author: 'Sqysh'
  },
  {
    id: '6',
    date: '2025-12-17',
    version: '2.1.0',
    category: 'improvement',
    title: 'Database Schema Updates',
    description:
      'Updated User model with isFreeUser, isComfortUser, and isLegacyUser boolean flags for efficient tier checking.',
    author: 'Sqysh'
  },
  {
    id: '7',
    date: '2025-12-17',
    version: '2.1.0',
    category: 'improvement',
    title: 'SEO Metadata Enhancement',
    description:
      'Added comprehensive metadata with 50+ keywords, structured data (JSON-LD), Twitter cards, and OpenGraph tags for better search visibility.',
    author: 'Sqysh'
  },
  {
    id: '8',
    date: '2025-12-17',
    version: '2.1.0',
    category: 'feature',
    title: 'Automated Sitemap Generation',
    description: 'Implemented next-sitemap package for automatic sitemap.xml and robots.txt generation on every build.',
    author: 'Sqysh'
  },
  {
    id: '9',
    date: '2025-12-17',
    version: '2.1.0',
    category: 'improvement',
    title: 'Code Architecture Cleanup',
    description:
      'Reorganized layout with separate ReduxWrapper and PageWrapper. Removed unnecessary useMemo usage. Extracted structured data and viewport configs.',
    author: 'Sqysh'
  },
  {
    id: '10',
    date: '2025-12-17',
    version: '2.1.0',
    category: 'improvement',
    title: 'Interactive User Table Enhancement',
    description:
      'Added clickable tier badges in user table with dropdown menu for quick tier changes. Includes loading states and disabled states for admin/super users.',
    author: 'Sqysh'
  },
  {
    id: '11',
    date: '2025-12-17',
    version: '2.1.0',
    category: 'bugfix',
    title: 'Package Lock Merge Conflict Resolution',
    description: 'Fixed package-lock.json merge conflicts using git checkout --theirs and npm install regeneration.',
    author: 'Sqysh'
  },
  {
    id: '12',
    date: '2025-12-17',
    version: '2.1.0',
    category: 'improvement',
    title: 'Prisma Function for Tier Updates',
    description:
      'Created dedicated updateUserTier Prisma function with proper error handling and boolean flag management.',
    author: 'Sqysh'
  },
  {
    id: '13',
    date: '2025-12-16',
    version: '2.0.5',
    category: 'security',
    title: 'Next.js Server Component Security Patch',
    description:
      'Updated React, React-DOM, and Next.js dependencies to address critical code injection vulnerability in server components. Patched CVE affecting server-side rendering that could allow malicious code execution.',
    author: 'Sqysh'
  },
  {
    id: '14',
    date: '2025-12-16',
    version: '2.0.5',
    category: 'security',
    title: 'React Ecosystem Security Updates',
    description:
      'Upgraded entire React ecosystem including react@19, react-dom@19, and related dependencies to latest stable versions to mitigate server-side injection risks discovered in Next.js server components.',
    author: 'Sqysh'
  }
]

const CATEGORY_CONFIG = {
  feature: {
    label: 'Feature',
    icon: Zap,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  improvement: {
    label: 'Improvement',
    icon: Settings,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200'
  },
  bugfix: {
    label: 'Bug Fix',
    icon: Code,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200'
  },
  security: {
    label: 'Security',
    icon: Shield,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200'
  },
  breaking: {
    label: 'Breaking',
    icon: Bell,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200'
  }
}

export default function ChangelogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)

  const filteredChangelog = useMemo(() => {
    return CHANGELOG_DATA.filter((entry) => {
      const matchesSearch =
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = !selectedCategory || entry.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Changelog</h1>
              <p className="text-sm text-gray-600">Track updates and improvements to Rosie Paws</p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
        >
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search changelog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === null ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
              const Icon = config.icon
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === key
                      ? `${config.bg} ${config.color} border ${config.border}`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {config.label}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Changelog Entries */}
        <div className="space-y-4">
          {filteredChangelog.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
            >
              <p className="text-gray-500">No changelog entries found</p>
            </motion.div>
          ) : (
            filteredChangelog.map((entry, index) => {
              const config = CATEGORY_CONFIG[entry.category]
              const Icon = config.icon
              const isExpanded = expandedEntry === entry.id

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                    className="w-full p-6 text-left"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`w-5 h-5 ${config.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.color} ${config.border}`}
                          >
                            {config.label}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(entry.date)}
                          </span>
                          <span className="text-xs text-gray-500">v{entry.version}</span>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{entry.title}</h3>

                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3"
                          >
                            <p className="text-sm text-gray-600 leading-relaxed">{entry.description}</p>
                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                              <span>Author:</span>
                              <span className="font-medium text-gray-700">{entry.author}</span>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Expand Icon */}
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>
                </motion.div>
              )
            })
          )}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{CHANGELOG_DATA.length}</div>
            <div className="text-xs text-gray-500">Total Changes</div>
          </div>
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
            <div key={key} className={`rounded-lg border p-4 text-center ${config.bg} ${config.border}`}>
              <div className={`text-2xl font-bold ${config.color}`}>
                {CHANGELOG_DATA.filter((e) => e.category === key).length}
              </div>
              <div className="text-xs text-gray-500">{config.label}s</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
