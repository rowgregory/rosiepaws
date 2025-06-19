import React, { FC } from 'react'
import { AlertTriangle, Clock, Video, Phone, Shield, Camera, Info, Heart } from 'lucide-react'

const GuardianSeizureGuide: FC = () => {
  const emergencySteps = [
    {
      icon: <Shield className="w-5 h-5 text-blue-500" />,
      title: 'Stay Calm',
      description: 'Keep yourself calm to help your pet effectively. Your energy affects them.'
    },
    {
      icon: <Clock className="w-5 h-5 text-orange-500" />,
      title: 'Time the Seizure',
      description: 'Start timing immediately. Seizures over 5 minutes require emergency care.'
    },
    {
      icon: <Camera className="w-5 h-5 text-purple-500" />,
      title: 'Record if Possible',
      description: 'Video helps veterinarians diagnose seizure type and severity.'
    },
    {
      icon: <Phone className="w-5 h-5 text-red-500" />,
      title: 'Call Vet if Needed',
      description: 'Contact emergency vet for seizures lasting 5+ minutes or multiple seizures.'
    }
  ]

  const safetyTips = [
    'Remove nearby objects that could cause injury',
    "Never put anything in your pet's mouth",
    "Don't restrain your pet during the seizure",
    'Gently cushion their head if possible'
  ]

  return (
    <div className="max-w-md w-full bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">Seizure Response Guide</h3>
        </div>
        <p className="text-sm text-gray-600">Know what to do when your pet has a seizure</p>
      </div>

      {/* Emergency Steps */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 text-sm flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-500" />
          During a Seizure
        </h4>
        {emergencySteps.map((step, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-xs font-bold text-gray-700">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {step.icon}
                <h5 className="font-medium text-gray-900 text-sm">{step.title}</h5>
              </div>
              <p className="text-xs text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Tips */}
      <div className="bg-white/60 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-blue-500" />
          <h4 className="font-medium text-gray-900 text-sm">Safety Tips</h4>
        </div>
        <div className="space-y-2">
          {safetyTips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-xs text-gray-700">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Alert */}
      <div className="bg-red-100 border border-red-300 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-800 text-sm mb-1">When to Seek Emergency Care</h4>
            <div className="space-y-1 text-xs text-red-700">
              <p>• Seizure lasts 5+ minutes</p>
              <p>• Multiple seizures in 24 hours</p>
              <p>• First-time seizure</p>
              <p>• Difficulty breathing after seizure</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Recording Tip */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Video className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-purple-800">
              <span className="font-medium">Recording Tip:</span> Videos help veterinarians distinguish between
              different seizure types and determine the best treatment plan.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/60 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-red-600">5min</div>
          <div className="text-xs text-gray-600">Emergency Threshold</div>
        </div>
        <div className="bg-white/60 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-orange-600">24/7</div>
          <div className="text-xs text-gray-600">Vet Emergency Lines</div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-blue-800">
              <span className="font-medium">Remember:</span> Most seizures end on their own within 1-3 minutes. Your
              calm presence helps your pet recover more quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuardianSeizureGuide
