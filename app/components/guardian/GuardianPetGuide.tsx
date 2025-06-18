import React, { FC } from 'react'
import { Heart, PawPrint, Shield, Stethoscope, Calendar, Info } from 'lucide-react'

const GuardianPetGuide: FC = () => {
  const tips = [
    {
      icon: <PawPrint className="w-5 h-5 text-indigo-500" />,
      title: 'Name & Breed',
      description: 'Use their full name and specific breed for accurate health tracking and recommendations.'
    },
    {
      icon: <Calendar className="w-5 h-5 text-green-500" />,
      title: 'Age Matters',
      description:
        'Include months for puppies/kittens under 2 years. This helps with vaccination and feeding schedules.'
    },
    {
      icon: <Stethoscope className="w-5 h-5 text-red-500" />,
      title: 'Weight Tracking',
      description: 'Regular weight monitoring helps detect health issues early. Update monthly for growing pets.'
    },
    {
      icon: <Shield className="w-5 h-5 text-purple-500" />,
      title: 'Special Notes',
      description: 'Include allergies, medications, behavioral notes, and emergency contacts for complete care.'
    }
  ]

  const breedTips = [
    { type: '🐶', breeds: ['Sheepadoodle', 'Golden Retriever', 'Labrador', 'German Shepherd', 'Bulldog'] },
    { type: '🐱', breeds: ['Persian', 'Siamese', 'Maine Coon', 'British Shorthair'] }
  ]

  return (
    <div className="w-full max-w-md bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-6 h-6 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-900">Pet Profile Guide</h3>
        </div>
        <p className="text-sm text-gray-600">Create a complete profile for the best care recommendations</p>
      </div>

      {/* Tips */}
      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
            {tip.icon}
            <div>
              <h4 className="font-medium text-gray-900 text-sm">{tip.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Popular Breeds */}
      <div className="bg-white/60 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-indigo-500" />
          <h4 className="font-medium text-gray-900 text-sm">Popular Breeds</h4>
        </div>
        <div className="space-y-3">
          {breedTips.map((category, index) => (
            <div key={index}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{category.type}</span>
                <span className="text-xs font-medium text-gray-700">{category.type === '🐶' ? 'Dogs' : 'Cats'}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {category.breeds.map((breed) => (
                  <span key={breed} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                    {breed}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/60 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-indigo-600">24/7</div>
          <div className="text-xs text-gray-600">Health Monitoring</div>
        </div>
      </div>
    </div>
  )
}

export default GuardianPetGuide
