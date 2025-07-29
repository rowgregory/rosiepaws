const PetTypeBadge = ({ type }: { type: string }) => {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'DOG':
        return { color: 'bg-blue-100 text-blue-800', label: 'Dog' }
      case 'CAT':
        return { color: 'bg-purple-100 text-purple-800', label: 'Cat' }
      default:
        return { color: 'bg-gray-100 text-gray-800', label: type }
    }
  }

  const config = getTypeConfig(type)

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}

export default PetTypeBadge
