import { FC } from 'react'

interface TableColumn {
  key: string
  label: string
  align?: 'left' | 'center' | 'right' | undefined | string
}

interface TableHeaderProps {
  columns: TableColumn[]
}

const TableHeader: FC<TableHeaderProps> = ({ columns }) => {
  return (
    <thead>
      <tr className="border-b border-gray-200 bg-gray-50">
        {columns.map((column) => (
          <th
            key={column.key}
            className={`py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider ${
              column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
            }`}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default TableHeader
