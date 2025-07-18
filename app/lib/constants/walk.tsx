import { MapPin, Zap, AlertTriangle, Heart, Thermometer, Eye, CheckCircle } from 'lucide-react'

interface GuideSection {
  id: string
  title: string
  icon: React.ElementType
  content: React.ReactNode
  color: string
}

export const WALK_PACE_OPTIONS = [
  {
    id: 'slow',
    label: 'Slow & Relaxed',
    description: 'Leisurely stroll, lots of sniffing',
    icon: '🐌',
    color: 'border-blue-500 bg-blue-50'
  },
  {
    id: 'moderate',
    label: 'Moderate',
    description: 'Steady walking pace',
    icon: '🚶‍♂️',
    color: 'border-green-500 bg-green-50'
  },
  {
    id: 'brisk',
    label: 'Brisk',
    description: 'Fast walking, light jogging',
    icon: '🏃‍♂️',
    color: 'border-orange-500 bg-orange-50'
  },
  {
    id: 'energetic',
    label: 'Energetic',
    description: 'Running, high energy',
    icon: '⚡',
    color: 'border-red-500 bg-red-50'
  }
]

export const WALK_DISTRACTION_LEVELS = [
  {
    id: 'focused',
    label: 'Very Focused',
    description: 'Stayed close, minimal distractions',
    icon: '🎯',
    color: 'border-green-500 bg-green-50'
  },
  {
    id: 'somewhat-focused',
    label: 'Somewhat Focused',
    description: 'Occasional distractions',
    icon: '👀',
    color: 'border-yellow-500 bg-yellow-50'
  },
  {
    id: 'distracted',
    label: 'Distracted',
    description: 'Frequently distracted by surroundings',
    icon: '🌟',
    color: 'border-orange-500 bg-orange-50'
  },
  {
    id: 'very-distracted',
    label: 'Very Distracted',
    description: 'Constantly pulling, chasing, investigating',
    icon: '🦋',
    color: 'border-red-500 bg-red-50'
  }
]

export const WALK_CONTAINER_VARIANTS: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

export const guideSections: GuideSection[] = [
  {
    id: 'basics',
    title: 'Walk Basics',
    icon: MapPin,
    color: 'from-blue-500 to-cyan-500',
    content: (
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Distance Guidelines</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex justify-between">
              <span>Small dogs (under 25 lbs):</span>
              <span className="font-medium">0.5 - 2 miles</span>
            </div>
            <div className="flex justify-between">
              <span>Medium dogs (25-60 lbs):</span>
              <span className="font-medium">1 - 3 miles</span>
            </div>
            <div className="flex justify-between">
              <span>Large dogs (60+ lbs):</span>
              <span className="font-medium">2 - 5 miles</span>
            </div>
            <div className="flex justify-between">
              <span>Cats (leash trained):</span>
              <span className="font-medium">0.1 - 0.5 miles</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <h4 className="font-semibold text-amber-900 mb-2">Duration Tips</h4>
          <ul className="space-y-1 text-sm text-amber-800">
            <li>• Start with shorter walks for new routines</li>
            <li>• Senior pets may need reduced duration</li>
            <li>• Puppies: 5 minutes per month of age, twice daily</li>
            <li>• Build endurance gradually over weeks</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'pace',
    title: 'Understanding Pace',
    icon: Zap,
    color: 'from-orange-500 to-red-500',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">🐌</span>
              <span className="font-semibold text-gray-900">Slow & Relaxed</span>
            </div>
            <p className="text-sm text-gray-700">
              Leisurely stroll, lots of sniffing, perfect for senior pets or hot weather.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">🚶</span>
              <span className="font-semibold text-blue-900">Moderate Pace</span>
            </div>
            <p className="text-sm text-blue-700">Steady walking, some sniffing breaks, ideal for most adult pets.</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">🏃</span>
              <span className="font-semibold text-orange-900">Brisk Walk</span>
            </div>
            <p className="text-sm text-orange-700">Fast-paced walk, minimal stops, great for energetic dogs.</p>
          </div>

          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">⚡</span>
              <span className="font-semibold text-red-900">Fast/Running</span>
            </div>
            <p className="text-sm text-red-700">Jogging or running pace, for very active and fit pets only.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'distractions',
    title: 'Distraction Levels',
    icon: Eye,
    color: 'from-purple-500 to-pink-500',
    content: (
      <div className="space-y-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">🎯 None - Focused</h4>
          <p className="text-sm text-green-800 mb-2">Pet stays focused on walking, minimal interest in surroundings.</p>
          <ul className="text-xs text-green-700 space-y-1">
            <li>• Ideal for training or busy environments</li>
            <li>• Shows good leash manners</li>
            <li>• May indicate tiredness or concentration</li>
          </ul>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">😌 Minimal Distractions</h4>
          <p className="text-sm text-blue-800 mb-2">Occasional sniffing or looking around, but easily redirected.</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Normal curiosity level</li>
            <li>• Good balance of exercise and exploration</li>
            <li>• Responds well to commands</li>
          </ul>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <h4 className="font-semibold text-yellow-900 mb-2">👀 Moderate Distractions</h4>
          <p className="text-sm text-yellow-800 mb-2">
            Interested in various sights, sounds, and smells during the walk.
          </p>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Natural exploration behavior</li>
            <li>• May need gentle guidance</li>
            <li>• Good mental stimulation</li>
          </ul>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <h4 className="font-semibold text-orange-900 mb-2">🐿️ High Distractions</h4>
          <p className="text-sm text-orange-800 mb-2">
            Very interested in environment, may chase squirrels, greet other pets.
          </p>
          <ul className="text-xs text-orange-700 space-y-1">
            <li>• May need additional training</li>
            <li>• Consider shorter or different routes</li>
            <li>• Watch for overstimulation signs</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'mood',
    title: 'Mood Assessment',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    content: (
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">What to Observe</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-green-900 mb-2">Positive Signs (7-10)</h5>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Tail wagging or held high</li>
                <li>• Alert and interested</li>
                <li>• Good energy throughout</li>
                <li>• Playful behavior</li>
                <li>• Normal breathing</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-red-900 mb-2">Concerning Signs (1-3)</h5>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• Excessive panting</li>
                <li>• Reluctance to move</li>
                <li>• Tail tucked under</li>
                <li>• Seeking shade frequently</li>
                <li>• Limping or favoring a leg</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Rating Scale</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-red-700">1-3: Poor</span>
              <span className="text-yellow-700">4-6: Average</span>
              <span className="text-green-700">7-10: Excellent</span>
            </div>
            <div className="w-full bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 h-2 rounded-full"></div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'safety',
    title: 'Safety & Weather',
    icon: AlertTriangle,
    color: 'from-red-500 to-orange-500',
    content: (
      <div className="space-y-4">
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <h4 className="font-semibold text-red-900 mb-2 flex items-center space-x-2">
            <Thermometer className="w-4 h-4" />
            <span>Temperature Guidelines</span>
          </h4>
          <div className="space-y-2 text-sm text-red-800">
            <div>
              <strong>Hot Weather (85°F+):</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Walk early morning or evening</li>
                <li>• Check pavement temperature with your hand</li>
                <li>• Bring water for both you and your pet</li>
                <li>• Watch for excessive panting or drooling</li>
              </ul>
            </div>
            <div>
              <strong>Cold Weather (32°F or below):</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Consider protective gear for sensitive pets</li>
                <li>• Shorter walks may be necessary</li>
                <li>• Watch for shivering or lifting paws</li>
                <li>• Wipe paws after walks to remove salt/ice</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <h4 className="font-semibold text-amber-900 mb-2">General Safety Tips</h4>
          <ul className="space-y-1 text-sm text-amber-800">
            <li>• Always use a leash unless in designated off-leash areas</li>
            <li>• Bring waste bags and clean up after your pet</li>
            <li>• Ensure your pet has ID tags</li>
            <li>• Be aware of traffic and other hazards</li>
            <li>• Know your route and have a way to contact help</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'tips',
    title: 'Pro Tips',
    icon: CheckCircle,
    color: 'from-green-500 to-emerald-500',
    content: (
      <div className="space-y-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h4 className="font-semibold text-green-900 mb-3">Making Walks Better</h4>
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-green-800 mb-1">For Dogs:</h5>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Vary your routes to provide mental stimulation</li>
                <li>• Allow time for sniffing - it&apos;s their way of &quot;reading the news&quot;</li>
                <li>• Use positive reinforcement for good leash behavior</li>
                <li>• Consider bringing training treats</li>
              </ul>
            </div>

            <div>
              <h5 className="font-medium text-green-800 mb-1">For Cats:</h5>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Start with short indoor harness training</li>
                <li>• Choose quiet, low-traffic areas</li>
                <li>• Let them set the pace initially</li>
                <li>• Consider a pet stroller for longer outings</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Building Routine</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Consistency helps pets know what to expect</li>
            <li>• Gradually increase distance and duration</li>
            <li>• Track progress to see improvements</li>
            <li>• Adjust based on age, health, and fitness level</li>
            <li>• Make it enjoyable for both of you!</li>
          </ul>
        </div>
      </div>
    )
  }
]
