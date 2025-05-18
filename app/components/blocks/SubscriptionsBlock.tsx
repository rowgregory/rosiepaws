import StarSVG from '@/public/svg/StarSVG'
import React from 'react'

const subscriptionPlans = [
  {
    name: 'Basic',
    price: 23,
    trialPeriodDays: 7,
    features: [
      'Daily Pain Score Tracking',
      'Food & Water Intake Logging',
      'Medication Schedule & Reminders',
      'Dashboard View of Pet Data',
      'Access to Visual Graphs',
      '50% Off eBooks After Trial'
    ]
  },
  {
    name: 'Premium',
    price: 35,
    trialPeriodDays: 7,
    features: [
      'All Basic Features',
      'Seizure Tracking with Video Option',
      'Blood Sugar Monitoring (up to 4 entries/day)',
      'Advanced Graphing & Insights',
      'Priority Support'
    ]
  }
]

const SubscriptionsBlock = () => {
  return (
    <div className="bg-[#e6e2d8] bg-darkstripeslight bg-repeat bg-center pb-40">
      <div className="w-full h-80 relative px-4 ">
        <div className="bg-climpek bg-repeat w-full h-full absolute top-0 left-0" />
      </div>
      <div className="mx-auto mt-[-100px] relative z-20 max-w-[1200px] w-full flex flex-col items-center">
        <div className="flex items-center justify-center relative w-full gap-x-6">
          <span className="w-full h-1 bg-olivepetal" />
          <h1 className="text-[30px] font-barlowcondensed uppercase font-bold text-olivepetal whitespace-nowrap">
            Best Offers For You
          </h1>
          <span className="w-full h-1 bg-olivepetal" />
        </div>
        <div className="h-10 w-10 bg-hourglass bg-center bg-no-repeat bg-contain mt-3" />
        <h2
          className="text-[100px] 1200:text-[200px] text-center font-barlowcondensed uppercase text-olivepetal font-bold mt-[-20px] 1200:mt-[-55px]"
          style={{ filter: 'drop-shadow(5px 6px 0 #c8c8a3)' }}
        >
          Choose Plan
        </h2>
        <div className="flex flex-col md:flex-row gap-x-7">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.name}
              className="bg-portfoliopattern bg-center bg-repeat bg-[#f3f0ea] w-[370px] h-[575px] p-3"
            >
              <div className="border-3 border-peachblossum w-full h-full">
                <h1 className="text-white bg-peachblossum text-center py-5 text-4xl font-barlowcondensed uppercase font-bold bg-dust bg-center bg-repeat flex items-center gap-x-5 justify-center">
                  <StarSVG />
                  {plan.name}
                  <StarSVG />
                </h1>
                <div className="grid grid-cols-[1fr_1fr]">
                  <h2 className="font-satisfy text-[75px] text-center text-olivepetal border-b-3 border-b-peachblossum px-5 flex items-center justify-center pt-3">
                    ${plan.price}
                  </h2>
                  <h3 className="font-satisfy text-[35px] text-center text-olivepetal border-l-3 border-b-3 border-b-peachblossum border-l-peachblossum px-5 flex items-center justify-center leading-[40px]">
                    For One Person
                  </h3>
                </div>
                <div className="px-5">
                  {plan.features.map((feature, i) => (
                    <div
                      key={i}
                      className={`text-lg font-merrieweather text-[#333] text-center py-3 ${
                        i !== 0 ? 'border-t-2 border-dashed border-t-[#D5CDC1]' : ''
                      }`}
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionsBlock
