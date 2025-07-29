export const SettingCard = ({
  title,
  description,
  children,
  icon: Icon
}: {
  title: string
  description: string
  children: React.ReactNode
  icon: any
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-gray-100 rounded-lg">
        <Icon className="w-5 h-5 text-gray-700" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
)
