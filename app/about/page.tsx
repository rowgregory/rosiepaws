'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Stethoscope, Bell, TrendingUp, Share2, Smartphone, User } from 'lucide-react'
import { MotionLink } from '../components/common/MotionLink'
import Picture from '../components/common/Picture'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        className="relative py-24 px-4 bg-gradient-to-b from-gray-50 to-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeInUp} initial="initial" animate="animate">
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-pink-50 text-pink-700 rounded-full text-sm font-medium mb-6"
              variants={fadeInUp}
            >
              <Heart className="w-4 h-4 mr-2" />
              Pet Health Tracking
            </motion.div>
            <motion.h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight" variants={fadeInUp}>
              Introducing{' '}
              <span className="bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Rosie Paws
              </span>
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light"
              variants={fadeInUp}
            >
              Professional health tracking platform designed for modern pet care management
            </motion.p>
          </motion.div>

          <motion.div className="flex justify-center" variants={fadeInUp} initial="initial" animate="animate">
            <Picture src="/images/dr.jpg" priority={false} className="w-40 h-40 rounded-xl object-cover" />
          </motion.div>
        </div>
      </motion.section>

      {/* Introduction Section */}
      <motion.section
        className="py-20 px-4"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Solution Overview</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 mx-auto"></div>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Addressing Critical Gaps in Pet Healthcare</h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                After years of providing veterinary pain management and integrative care, the need for a simple,
                effective way for pet parents to monitor their pet&apos;s health became clear. Rosie Paws was created to
                fill this gap—a tool designed to empower pet parents to track their pet&apos;s health through every
                stage of life.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Pets are cherished family members, and their health journeys are unique. Whether navigating the playful
                days of puppyhood, managing an illness or injury, or supporting a beloved companion through a
                life-limiting condition, keeping track of health information can be overwhelming. Rosie Paws offers a
                seamless solution, making it easier to stay organized and proactive about your pet&apos;s well-being.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-gray-50 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">The Meaning Behind Rosie Paws</h4>
                <p className="text-gray-700 leading-relaxed">
                  The name &quot;Rosie Paws&quot; represents the gentle, loving approach brought to veterinary medicine.
                  Inspired by the same compassionate philosophy as Sea Legs Integrative Veterinary Health, Dr.
                  Coble&apos;s brick and mortar clinic, Rosie Paws carries a deeply personal significance. Rosie was the
                  name of one of Dr. Coble&apos;s former pets, whose journey profoundly shaped her approach to
                  palliative care and continues to influence her practice to this day.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Key Features Section */}
      <motion.section
        className="py-20 px-4 bg-gray-50"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Capabilities</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools designed to support your pet through every stage of life.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {[
              {
                title: 'Comprehensive Health Tracking',
                description:
                  'Record and monitor symptoms, medications, treatments, and daily observations in one convenient place.',
                icon: Stethoscope,
                color: 'bg-blue-600'
              },
              {
                title: 'Life Stage Support',
                description:
                  'Tailored tools for every phase—puppy or kitten milestones, adult wellness, senior care, and palliative support.',
                icon: Heart,
                color: 'bg-emerald-600'
              },
              {
                title: 'Customizable Reminders',
                description: 'Set reminders for medications, appointments, and important health checks.',
                icon: Bell,
                color: 'bg-amber-600'
              },
              {
                title: 'Progress Visualization',
                description:
                  "Visual charts and summaries help identify trends and changes in your pet's health over time.",
                icon: TrendingUp,
                color: 'bg-purple-600'
              },
              {
                title: 'Shareable Reports',
                description: 'Easily share health updates with your veterinary team to support collaborative care.',
                icon: Share2,
                color: 'bg-indigo-600'
              },
              {
                title: 'Mobile Accessibility',
                description:
                  "Access your pet's health information anywhere, anytime with our user-friendly mobile interface.",
                icon: Smartphone,
                color: 'bg-teal-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Target Audience */}
      <motion.section
        className="py-20 px-4"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Designed for Every Pet Parent</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 mx-auto"></div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-12 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-8">
              <User className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Professional-Grade Pet Care Management</h3>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Rosie Paws is built with compassion and expertise, drawing on years of experience in veterinary care. The
              goal is to make health management accessible and stress-free, so pet parents can focus on what matters
              most—cherishing every moment with their pets.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Use Cases */}
      <motion.section
        className="py-20 px-4 bg-gray-50"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Supporting Pets Through All Stages</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 mx-auto"></div>
          </motion.div>

          <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
            {[
              {
                stage: 'Puppyhood and Kittenhood',
                description: 'Track growth, vaccinations, and developmental milestones.',
                color: 'border-l-amber-500 bg-amber-50',
                iconColor: 'bg-amber-500'
              },
              {
                stage: 'Illness or Injury',
                description: 'Monitor symptoms, treatments, and recovery progress.',
                color: 'border-l-blue-500 bg-blue-50',
                iconColor: 'bg-blue-500'
              },
              {
                stage: 'Chronic or Life-Limiting Illness',
                description:
                  'Document comfort measures, quality of life, and daily changes to support informed decisions.',
                color: 'border-l-purple-500 bg-purple-50',
                iconColor: 'bg-purple-500'
              }
            ].map((stage, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`${stage.color} border-l-4 rounded-r-xl p-8 bg-white shadow-sm`}
              >
                <div className="flex items-center space-x-6">
                  <div
                    className={`w-12 h-12 ${stage.iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{stage.stage}</h3>
                    <p className="text-gray-700">{stage.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Value Proposition */}
      <motion.section
        className="py-20 px-4"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center"
            variants={fadeInUp}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-8">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Empowering Pet Parents</h3>
            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
              Rosie Paws is more than a tracking tool—it&apos;s a companion for the journey, providing peace of mind and
              helping ensure pets receive the best possible care at every stage of life.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="py-20 px-4 bg-gradient-to-r from-pink-600 via-orange-600 to-red-600"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.h2 className="text-4xl font-bold mb-6" variants={fadeInUp}>
            Start Your Pet&apos;s Health Journey Today
          </motion.h2>
          <motion.p className="text-xl mb-10 opacity-90 font-light" variants={fadeInUp}>
            Join thousands of pet parents who trust Rosie Paws to keep their furry family members healthy and happy.
          </motion.p>

          <motion.div
            className="flex items-center justify-center space-x-4"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <MotionLink
              href="/auth/login"
              className="relative px-8 py-3 rounded-full text-lg text-white backdrop-blur-lg border border-white/10 overflow-hidden group transition-all duration-300 hover:border-white/30"
            >
              <span className="relative z-10">Launch App</span>

              <div className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000 ease-out" />

              <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </MotionLink>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

export default AboutPage
