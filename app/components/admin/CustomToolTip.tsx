const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border border-purple-200 rounded-2xl shadow-xl">
        <p className="font-semibold text-gray-800 mb-2">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {`${entry.name}: ${
              entry.name.includes('Revenue') || entry.name.includes('MRR') ? '$' : entry.name.includes('%') ? '' : ''
            }${entry.value.toLocaleString()}${entry.name.includes('%') ? '%' : ''}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default CustomTooltip
