import { IUser } from '@/app/types'
import TokensSVG from '@/public/svg/TokensSVG'
import { FC } from 'react'
import { MotionLink } from '../../common/MotionLink'

interface IToken {
  toggleSidebar: boolean
  user: IUser | null
  loading: boolean
}

const Token: FC<IToken> = ({ toggleSidebar, user, loading }) => {
  return (
    <MotionLink
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      href="/buy"
      className={`mx-auto ${toggleSidebar ? 'h-10 w-10 rounded-lg justify-center' : 'pl-3 rounded-full w-fit'} border-1 border-gray-300 gap-x-3 flex items-center my-7`}
    >
      <div className={`${toggleSidebar ? 'flex-col' : 'flex-row'} flex items-center justify-center`}>
        <TokensSVG color1="#f472b6" color2="#fb923c" id="pinkToOrange" />
        <span className="text-12">
          {loading ? (
            <div className="border-2 border-orange-500 border-t-0 rounded-full animate-spin w-2.5 h-2.5" />
          ) : user?.isLegacyUser ? (
            '♾️'
          ) : (
            user?.tokens?.toLocaleString()
          )}
        </span>
      </div>
      {!toggleSidebar && (
        <div className="bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 rounded-full h-7 flex items-center justify-center text-12 font-semibold text-white px-2 border-1 border-pink-500 hover:bg-gradient-to-r hover:from-zinc-500 hover:to-zinc-600 hover:border-zinc-500">
          {user?.isLegacyUser ? 'Subscription' : 'Upgrade'}
        </div>
      )}
    </MotionLink>
  )
}

export default Token
