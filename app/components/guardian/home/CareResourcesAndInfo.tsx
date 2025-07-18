import React from 'react'
import { motion } from 'framer-motion'
import { Heart, BookOpen, Phone, AlertTriangle, ArrowRight, Activity, FileText } from 'lucide-react'
import { useAppDispatch } from '@/app/redux/store'
import { setOpenEmergencySignsDrawer } from '@/app/redux/features/dashboardSlice'
import { setOpenDisabilityEndOfLifeCareDrawer, setOpenSupport24Dropdown } from '@/app/redux/features/appSlice'

const CareResourcesAndInfo = () => {
  const dispatch = useAppDispatch()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="mb-12"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <BookOpen className="w-8 h-8 mr-3 text-rose-500" />
          Care Resources & Expert Guidance
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Access professional veterinary resources and expert guides to support your pet&apos;s health journey
        </p>
      </div>

      {/* Dr. Jaci Coble's Professional Guides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Dr. Jaci Coble&apos;s Professional Guides</h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            You&apos;ll get 2 free eBooks personally written by Sea Legs&apos; veterinarian—who specializes in
            palliative and rehabilitative pet care—to help guide end-of-life pet decisions. Paid plans include more
            eBooks depending on your chosen tier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.a
            href="https://vet-ebooks.com/comfort-care-at-home"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group block"
          >
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-blue-100 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm text-blue-600 font-medium bg-blue-100 px-3 py-1 rounded-full">
                  62 Pages • PDF
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors">
                Comfort Care at Home: A Complete Guide
              </h4>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                Expert strategies for creating the optimal home environment, managing pain, and providing compassionate
                end-of-life care for dogs and cats.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Dr. Jaci Coble, DVM</span>
                <ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.a>

          <motion.a
            href="https://vet-ebooks.com/quality-of-life-assessment"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group block"
          >
            <div className="bg-gradient-to-br from-slate-50 to-emerald-50 border-2 border-emerald-100 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mr-4">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm text-emerald-600 font-medium bg-emerald-100 px-3 py-1 rounded-full">
                  48 Pages • PDF
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-emerald-700 transition-colors">
                Quality of Life Assessment Tools
              </h4>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                Scientific frameworks and practical scales to objectively evaluate your pet&apos;s daily comfort,
                mobility, and overall wellbeing.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Dr. Jaci Coble, DVM</span>
                <ArrowRight className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.a>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
            <FileText className="w-4 h-4 mr-2" />
            All eBooks are professionally authored and peer-reviewed
          </div>
        </div>
      </motion.div>

      {/* Care Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Dog Care Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">🐕</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Dog Care Essentials</h3>
          </div>

          <div className="space-y-4">
            <motion.div
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
              className="p-4 bg-amber-50 rounded-xl border border-amber-100 hover:border-amber-200 transition-colors cursor-pointer"
            >
              <h4 className="font-semibold text-amber-900 mb-2">Senior Dog Nutrition</h4>
              <p className="text-amber-700 text-sm">
                Specialized dietary needs for aging dogs and appetite stimulation techniques
              </p>
            </motion.div>
            <motion.div
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
              className="p-4 bg-orange-50 rounded-xl border border-orange-100 hover:border-orange-200 transition-colors cursor-pointer"
            >
              <h4 className="font-semibold text-orange-900 mb-2">Mobility Support</h4>
              <p className="text-orange-700 text-sm">
                Helping dogs with arthritis and mobility issues stay comfortable
              </p>
            </motion.div>
            <motion.div
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
              className="p-4 bg-red-50 rounded-xl border border-red-100 hover:border-red-200 transition-colors cursor-pointer"
            >
              <h4 className="font-semibold text-red-900 mb-2">Breathing & Heart Health</h4>
              <p className="text-red-700 text-sm">Managing respiratory and cardiac conditions in senior dogs</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Cat Care Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">🐱</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Cat Care Essentials</h3>
          </div>

          <div className="space-y-4">
            <motion.div
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
              className="p-4 bg-purple-50 rounded-xl border border-purple-100 hover:border-purple-200 transition-colors cursor-pointer"
            >
              <h4 className="font-semibold text-purple-900 mb-2">Kidney Disease Management</h4>
              <p className="text-purple-700 text-sm">
                Supporting cats with chronic kidney disease through diet and care
              </p>
            </motion.div>
            <motion.div
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
              className="p-4 bg-pink-50 rounded-xl border border-pink-100 hover:border-pink-200 transition-colors cursor-pointer"
            >
              <h4 className="font-semibold text-pink-900 mb-2">Stress Reduction</h4>
              <p className="text-pink-700 text-sm">Creating calm environments and reducing anxiety in sick cats</p>
            </motion.div>
            <motion.div
              whileHover={{ x: 5, transition: { duration: 0.2 } }}
              className="p-4 bg-rose-50 rounded-xl border border-rose-100 hover:border-rose-200 transition-colors cursor-pointer"
            >
              <h4 className="font-semibold text-rose-900 mb-2">Hydration & Appetite</h4>
              <p className="text-rose-700 text-sm">Encouraging eating and drinking in cats who are losing interest</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Emergency & Support Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white cursor-pointer"
        >
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-8 h-8 mr-3" />
            <h3 className="text-lg font-bold">Emergency Signs</h3>
          </div>
          <p className="text-red-100 mb-4">Know when to seek immediate veterinary care</p>
          <button
            onClick={() => dispatch(setOpenEmergencySignsDrawer())}
            className="bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors"
          >
            View Guide
          </button>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white cursor-pointer"
        >
          <div className="flex items-center mb-4">
            <Phone className="w-8 h-8 mr-3" />
            <h3 className="text-lg font-bold">24/7 Support</h3>
          </div>
          <p className="text-blue-100 mb-4">Connect with veterinary professionals anytime</p>
          <button
            onClick={() => dispatch(setOpenSupport24Dropdown())}
            className="bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors"
          >
            Get Help
          </button>
        </motion.div>

        <motion.div
          onClick={() => dispatch(setOpenDisabilityEndOfLifeCareDrawer())}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white cursor-pointer"
        >
          <div className="flex items-center mb-4">
            <Heart className="w-8 h-8 mr-3" />
            <h3 className="text-lg font-bold">Special Care Guide</h3>
          </div>
          <p className="text-purple-100 mb-4">Support for disabilities and end-of-life care decisions</p>
          <div className="flex items-center justify-between">
            <button className="bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors">
              View Guide
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default CareResourcesAndInfo
