import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Users, Stethoscope } from 'lucide-react'

const Audience = () => {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const cardVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  const cards = [
    {
      icon: Heart,
      title: 'For Pet Owners',
      description:
        "Monitor your pet's health with comprehensive tracking tools for pain, feeding, hydration, and vital signs. Keep detailed records and never miss important care milestones.",
      gradient: 'from-rose-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'For Families',
      description:
        'Share pet care responsibilities seamlessly across family members. Coordinate feeding schedules, medication reminders, and health updates in real-time collaboration.',
      gradient: 'from-pink-500 to-orange-500'
    },
    {
      icon: Stethoscope,
      title: 'For Vet Visits',
      description:
        'Generate comprehensive health reports from your tracking data to share with your veterinarian. Provide detailed insights into symptoms, behaviors, and care patterns for informed discussions.',
      gradient: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="uppercase text-sm font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 mb-4"
          >
            Honoring Sacred Time
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
          >
            Facing life&apos;s final chapter
          </motion.h2>
        </div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {cards.map((card, index) => (
            <motion.div key={index} variants={cardVariants} className="group relative h-full">
              {/* Gradient glow layer */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300 pointer-events-none`}
              />

              {/* Card */}
              <div className="relative bg-white border border-gray-200 rounded-2xl p-6 md:p-8 h-full shadow-sm hover:shadow-xl transition-all duration-300 group-hover:border-gray-300">
                {/* Icon Only */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base group-hover:text-gray-700 transition-colors duration-300">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Audience
