import { FC, MouseEventHandler } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

interface AwesomeIconProps {
  icon: IconDefinition
  className: string
  onClick?: MouseEventHandler<SVGSVGElement>
}

const AwesomeIcon: FC<AwesomeIconProps> = ({ icon, className, onClick }) => {
  return <FontAwesomeIcon onClick={onClick} icon={icon} className={`${className}`} />
}

export default AwesomeIcon
