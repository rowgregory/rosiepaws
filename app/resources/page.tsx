'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Eye,
  Heart,
  Star,
  Lock,
  UserPlus,
  Download,
  BookOpen,
  Video,
  FileImage,
  Calendar,
  Trophy,
  Zap
} from 'lucide-react'
import { useGetAllMediaQuery } from '../redux/services/mediaApi'
import Picture from '../components/common/Picture'
import { IMedia } from '../types'
import { MotionLink } from '../components/common/MotionLink'
import { RootState, useAppSelector } from '../redux/store'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
}

const ResourceCard = ({ item }: { item: any }) => {
  const isEbook = item.type === 'ebook'

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white h-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer relative"
      whileHover={{ y: -5 }}
    >
      {/* Lock Overlay for Preview */}
      <div className="absolute inset-0 bg-black/80 z-20 flex items-center justify-center transition-opacity duration-300">
        <motion.div initial={{ scale: 0.8 }} whileHover={{ scale: 1 }} className="text-center text-white">
          <Lock className="w-12 h-12 mx-auto mb-3" />
          <p className="font-semibold mb-2">Sign Up to Access</p>
          <p className="text-sm text-gray-300 mb-4">Preview available after login</p>
          <MotionLink
            href="/auth/login"
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-600 rounded-lg font-medium hover:from-pink-600 hover:to-orange-700 transition-all duration-200"
          >
            Get Access Now
          </MotionLink>
        </motion.div>
      </div>

      {/* Thumbnail - Blurred/Obscured */}
      <div className="relative h-48 overflow-hidden">
        {isEbook ? (
          // PDF Preview/Placeholder for eBooks
          <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center blur-sm">
            <div className="text-center opacity-60">
              <FileText className="w-16 h-16 text-red-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-red-700">PDF Document</div>
              <div className="text-xs text-red-600">{item.size}</div>
            </div>
          </div>
        ) : (
          // Image thumbnail for Posters - Blurred
          <div className="relative">
            <Picture
              priority={false}
              src={item.thumbnail}
              className="w-full h-full object-cover blur-sm opacity-70 transition-transform duration-300 group-hover:scale-105"
            />
            {/* Additional overlay to obscure content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        )}
      </div>

      {/* Content - Limited Information */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full mb-2">
              {item.category}
            </span>
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">{item.title}</h3>
          </div>
        </div>

        {/* Truncated/Teaser Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-1">
          {item?.description?.split(' ').slice(0, 6).join(' ')}...
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{item.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{item.rating}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`px-2 py-1 rounded text-xs font-medium ${
                isEbook ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}
            >
              {isEbook ? 'eBook' : 'Poster'}
            </div>
            <Lock className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const ResourcesPage = () => {
  const { data } = useGetAllMediaQuery(undefined) as any
  const { medias } = useAppSelector((state: RootState) => state.media)

  const eBooksAndGuides = medias?.filter((media) => media.type === 'EBOOK' || media.type === 'DOCUMENT')?.length
  const posters = medias?.filter((media) => media.type === 'POSTER')?.length

  const stats = [
    { icon: FileText, label: 'eBooks & Guides', value: `${eBooksAndGuides}+`, color: 'text-red-500' },
    { icon: FileImage, label: 'Reference Posters', value: `${posters}+`, color: 'text-green-500' },
    { icon: Video, label: 'Video Tutorials', value: 'Coming Soon', color: 'text-blue-500' },
    { icon: Calendar, label: 'Updated Monthly', value: 'Fresh Content', color: 'text-orange-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-pink-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <BookOpen className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Premium Pet Care Resources</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Unlock access to our comprehensive library of veterinarian-approved guides, worksheets, and reference
              materials designed to help you provide the best care for your pet.
            </p>

            <MotionLink
              href="/auth/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto w-fit"
            >
              <UserPlus className="w-5 h-5" />
              <span>Sign Up for Free Access</span>
            </MotionLink>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl p-6 text-center shadow-lg"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Benefits Banner */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-8 text-white"
          >
            <div className="grid md:grid-cols-3 gap-6 items-center">
              <div className="flex items-center space-x-3">
                <Trophy className="w-8 h-8 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Expert Content</h3>
                  <p className="text-green-100 text-sm">Vetted by professionals</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Download className="w-8 h-8 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Download & Print</h3>
                  <p className="text-green-100 text-sm">Use offline anytime</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="w-8 h-8 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-1">Always Updated</h3>
                  <p className="text-green-100 text-sm">Latest best practices</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Resource Grid */}
          <div>
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Available Resources</h2>
              <div className="text-sm text-gray-500">
                Preview only • <span className="text-pink-600 font-medium">Sign up to access full library</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data?.media?.map((item: IMedia) => (
                <ResourceCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-pink-500 to-orange-600 rounded-2xl p-8 text-white text-center"
          >
            <Heart className="w-16 h-16 mx-auto mb-6 text-white/80" />
            <h3 className="text-3xl font-bold mb-4">Ready to Give Your Pet the Best Care?</h3>
            <p className="text-pink-100 max-w-2xl mx-auto mb-8">
              Join thousands of pet parents who trust our resources to keep their furry friends healthy and happy. Get
              instant access to our complete library when you create your free account.
            </p>
            <MotionLink
              href="/auth/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-white text-pink-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Create Free Account</span>
            </MotionLink>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

export default ResourcesPage
