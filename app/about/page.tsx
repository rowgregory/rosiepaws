'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Heart, GraduationCap, Stethoscope, Calendar, BookOpen } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <motion.section
        className="relative overflow-hidden py-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeInUp} initial="initial" animate="animate">
            <motion.h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6" variants={fadeInUp}>
              Meet <span className="text-pink-500">Dr. Jaclyn Coble</span>
            </motion.h1>
            <motion.p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" variants={fadeInUp}>
              A lifelong animal lover whose childhood dream became a mission to heal and comfort pets through
              compassionate, integrative veterinary care.
            </motion.p>
          </motion.div>

          <motion.div className="flex justify-center mb-12" variants={fadeInUp} initial="initial" animate="animate">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
                <Picture src="/images/dr.jpg" className="w-full h-full rounded-full" priority={true} />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Personal Story Section */}
      <motion.section
        className="py-20 px-4 bg-white/80"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">A Dream Born from Love</h2>
            <p className="text-xl text-gray-600">Every great veterinarian has a story. Here&apos;s mine.</p>
          </motion.div>

          <motion.div className="space-y-8" variants={stagger} initial="initial" animate="animate">
            <motion.div variants={fadeInUp} className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl p-8">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">The Beginning</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Like many veterinarians, my journey began in childhood with an unwavering love for animals. I
                    wasn&apos;t just fascinated by pets – I was captivated by the ocean and all its creatures. This dual
                    passion led me to study marine biology at the University of Massachusetts, where I graduated in
                    2007, gaining a deep appreciation for life in all its forms.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Following the Call</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    After marine biology, I knew my true calling was to heal animals directly. I pursued my veterinary
                    degree at the prestigious Tufts Cummings School of Veterinary Medicine, one of the top veterinary
                    programs in the country. Graduating in 2012, I was ready to turn my childhood dream into reality.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-3xl p-8">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Gaining Experience</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    My real-world veterinary education began with a rotating internship at Angell Animal Medical Center,
                    where I was exposed to complex cases and learned from some of the best veterinarians in New England.
                    This intensive training prepared me for the fast-paced world of emergency veterinary medicine, where
                    I spent years honing my diagnostic and treatment skills throughout the greater Boston area.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Finding My Path</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    After over 12 years in emergency medicine, I realized that while saving lives was incredibly
                    rewarding, I wanted to do more than just treat crises. I wanted to help pets live better, more
                    comfortable lives. This led me to integrative veterinary medicine – combining the best of
                    traditional veterinary care with holistic therapies like acupuncture, rehabilitation, and pain
                    management.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Expertise & Qualifications */}
      <motion.section
        className="py-20 px-4"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Experience & Expertise</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Over a decade of dedicated veterinary practice has shaped my approach to animal care.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {[
              {
                number: '12+',
                label: 'Years in Practice',
                sublabel: 'Since 2012',
                icon: Calendar,
                color: 'from-pink-400 to-pink-600'
              },
              {
                number: '1000+',
                label: 'Emergency Cases',
                sublabel: 'Critical experience',
                icon: Stethoscope,
                color: 'from-purple-400 to-purple-600'
              },
              {
                number: '2',
                label: 'Top Universities',
                sublabel: 'UMass & Tufts',
                icon: GraduationCap,
                color: 'from-indigo-400 to-indigo-600'
              },
              {
                number: '100%',
                label: 'Passion Driven',
                sublabel: 'Lifelong dream',
                icon: Heart,
                color: 'from-teal-400 to-teal-600'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-3xl p-6 shadow-lg text-center hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.sublabel}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-8 text-white text-center"
            variants={fadeInUp}
          >
            <h3 className="text-3xl font-bold mb-4">My Philosophy</h3>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto">
              &quot;Every pet deserves not just to survive, but to thrive. My goal isn&apos;t just to treat illness –
              it&apos;s to enhance quality of life, reduce pain, and strengthen the bond between pets and their
              families. Through integrative medicine, we can address not just symptoms, but the whole animal – body,
              mind, and spirit.&quot;
            </p>
            <div className="mt-6">
              <span className="text-2xl font-bold">- Dr. Jaclyn Morency Coble</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Personal Touch */}
      <motion.section
        className="py-20 px-4 bg-white/80"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Why Rosie Paws?</h2>
          </motion.div>

          <motion.div className="bg-white rounded-3xl p-8 shadow-lg" variants={fadeInUp}>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                After years of practicing at Sea Legs Integrative Veterinary Health, I wanted to create something even
                more personal and intimate. Rosie Paws represents my commitment to providing individualized,
                compassionate care that treats every pet like family.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The name &quot;Rosie&quot; represents the gentle, loving approach I bring to veterinary medicine – like
                a cherished family pet who brings joy and comfort to everyone they meet. Just as every rose is unique
                and beautiful, every pet deserves specialized care tailored to their individual needs.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                When you choose Rosie Paws, you&apos;re not just getting a veterinarian – you&apos;re getting a partner
                in your pet&apos;s health journey, someone who understands that your furry family member deserves the
                very best care, delivered with love, expertise, and genuine compassion.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="py-20 px-4 bg-gradient-to-r from-pink-500 to-purple-600"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.h2 className="text-4xl font-bold mb-6" variants={fadeInUp}>
            Let&apos;s Care for Your Pet Together
          </motion.h2>
          <motion.p className="text-xl mb-8 opacity-90" variants={fadeInUp}>
            I&apos;d love to meet you and your furry family member. Let&apos;s discuss how we can help them live their
            healthiest, happiest life.
          </motion.p>

          <motion.div
            className="flex items-center justify-center space-x-4"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <MotionLink
              href="/auth/login"
              className="relative px-5 py-2.5 rounded-full text-lg text-white backdrop-blur-lg border border-white/10 mt-6 overflow-hidden group transition-all duration-300 hover:border-white/30"
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
