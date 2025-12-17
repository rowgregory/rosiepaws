import { FC } from 'react'

const Title: FC<{ title: string }> = ({ title }) => {
  return <h1 className="text-[28px] font-bold text-[#30313d] h-9 flex items-center">{title}</h1>
}

export default Title
