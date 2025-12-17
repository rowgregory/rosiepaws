'use client'

import { useState } from 'react'
import {
  FileText,
  Search,
  Clock,
  Info,
  AlertTriangle,
  XCircle,
  Bug,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  CheckCircle
} from 'lucide-react'
import { RootState, useAppSelector } from '@/app/redux/store'
import { useFetchAdminDashboardDataQuery } from '@/app/redux/services/adminApi'
import {
  calculateLogStats,
  copyLogToClipboard,
  getLevelColor,
  getLevelIcon,
  logFilter,
  toggleLogExpansion
} from '@/app/lib/utils/admin/logs'
import { formatDate, formatTime } from '@/app/lib/utils/common/dateUtils'
import AdminPageHeader from '@/app/components/admin/common/AdminPageHeader'

const Logs = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [expandedLogs, setExpandedLogs] = useState(new Set())
  const { logs } = useAppSelector((state: RootState) => state.admin)
  const logStats = calculateLogStats(logs)
  const [copiedLogId, setCopiedLogId] = useState(null) as any
  const filteredLogs = logFilter(logs, searchTerm, levelFilter, dateFilter)
  const { refetch, isLoading, isFetching } = useFetchAdminDashboardDataQuery(undefined)

  const refreshLogs = () => refetch()

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <AdminPageHeader
        title="System Logs"
        subtitle="Monitor application events and system activity"
        onExport={refreshLogs}
        isLoading={isLoading || isFetching}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Logs</p>
              <p className="text-2xl font-bold text-gray-900">{logStats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Errors</p>
              <p className="text-2xl font-bold text-red-600">{logStats.error}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Warnings</p>
              <p className="text-2xl font-bold text-yellow-600">{logStats.warn}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Info</p>
              <p className="text-2xl font-bold text-blue-600">{logStats.info}</p>
            </div>
            <Info className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Debug</p>
              <p className="text-2xl font-bold text-gray-600">{logStats.debug}</p>
            </div>
            <Bug className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs by message or metadata..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="error">Error</option>
              <option value="warn">Warning</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <div key={log.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <button
                    onClick={() => toggleLogExpansion(log.id, setExpandedLogs)}
                    className="mt-1 text-gray-400 hover:text-gray-600"
                  >
                    {expandedLogs.has(log.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(log.level)}`}
                      >
                        {getLevelIcon(log.level)}
                        {log.level.toUpperCase()}
                      </span>

                      {log.metadata?.name && (
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{log.metadata.name}</span>
                      )}

                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatTime(log.createdAt)}
                      </div>
                    </div>

                    <p className="text-gray-900 font-medium mb-1">{log.message}</p>

                    {log.metadata?.location && (
                      <p className="text-sm text-gray-600">
                        📍 {Array.isArray(log.metadata.location) ? log.metadata.location[0] : log.metadata.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyLogToClipboard(JSON.stringify(log, null, 2), log.id, setCopiedLogId)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Copy log data"
                  >
                    {copiedLogId === log.id ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {log.metadata?.url && (
                    <button
                      onClick={() => window.open(log?.metadata?.url, '_blank')}
                      className="text-gray-400 hover:text-gray-600"
                      title="Open URL"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {expandedLogs.has(log.id) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Metadata</h4>
                  <div className="bg-gray-50 rounded-lg p-3 overflow-x-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(log.metadata || {}, null, 2)}
                    </pre>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>ID: {log.id}</span>
                      <span>Created: {formatDate(log.createdAt)}</span>
                      {log.metadata?.userId && <span>User: {log.metadata.userId}</span>}
                      {log.metadata?.email && <span>Email: {log.metadata.email}</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Logs
