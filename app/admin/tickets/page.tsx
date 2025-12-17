'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Eye,
  User,
  Calendar,
  Paperclip,
  Monitor,
  Mail,
  X,
  Loader2
} from 'lucide-react'
import { RootState, useAppSelector } from '@/app/redux/store'
import {
  formatDateShort,
  formatDateTime,
  getTicketPriorityColor,
  getTicketPriorityIcon,
  getTicketStats,
  getTicketStatusColor,
  getTicketStatusLabel,
  getUniqueTicketCategories,
  ticketFilter
} from '@/app/lib/utils'
import { useCreateTicketMessageMutation, useUpdateTicketStatusMutation } from '@/app/redux/services/ticketApi'
import FilterSearch from '@/app/components/admin/form-elements/FilterSearch'
import { statusButtons } from '@/app/lib/constants/admin/tickets'
import AdminPageHeader from '@/app/components/admin/common/AdminPageHeader'

const AdminTicketsPage = () => {
  const { tickets } = useAppSelector((state: RootState) => state.admin)
  const [selectedTicket, setSelectedTicket] = useState(null) as any
  const [responseText, setResponseText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [updateTicketStatus, { isLoading }] = useUpdateTicketStatusMutation()
  const [currentStatus, setCurrentStatus] = useState('')
  const [createTicketMessage] = useCreateTicketMessageMutation()

  const handleSendResponse = async (ticketId: string) => {
    if (!responseText.trim() || !selectedTicket) return

    const newMessage = {
      ticketId,
      content: responseText,
      authorEmail: 'support@rosiepawsapp.com',
      authorName: 'Support Team',
      attachments: null
    }

    await createTicketMessage(newMessage)
      .unwrap()
      .then((data: any) =>
        setSelectedTicket((ticket: any) => ({
          ...ticket,
          messages: [...ticket.messages, data.message]
        }))
      )
      .catch((err: any) => console.log('ERR: ', err))

    setResponseText('')
  }

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    setCurrentStatus(newStatus)

    await updateTicketStatus({ ticketId, status: newStatus })
      .unwrap()
      .then((data: any) =>
        setSelectedTicket((ticket: any) => ({
          ...ticket,
          status: data.newStatus,
          ...(data.ticketMessage && { messages: [...ticket.messages, data.ticketMessage] })
        }))
      )
      .catch((err: any) => console.log(`Err: ${err}`))
  }

  const stats = getTicketStats(tickets)
  const categories = getUniqueTicketCategories(tickets)
  const filteredTickets = ticketFilter(tickets, searchTerm, statusFilter, categoryFilter, priorityFilter)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <AdminPageHeader title="Support Tickets" subtitle="Manage and respond to customer support requests" />

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
      >
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Open</p>
              <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <X className="w-8 h-8 text-gray-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Closed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.closed}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tickets List */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-4 rounded-lg border border-gray-200 mb-6"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <FilterSearch placeholder="Search tickets..." searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category, i) => (
                  <option key={i} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Tickets */}
          <div className="space-y-4">
            {filteredTickets.map((ticket, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white p-6 rounded-lg border border-gray-200 cursor-pointer transition-all hover:shadow-md ${
                  selectedTicket?.id === ticket.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{ticket.subject}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{ticket.description}</p>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTicketPriorityColor(ticket.priority)}`}
                    >
                      {getTicketPriorityIcon(ticket.priority)}
                      <span className="ml-1 capitalize">{ticket.priority}</span>
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTicketStatusColor(ticket.status)}`}
                    >
                      {getTicketStatusLabel(ticket.status)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {ticket.user.name}
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {ticket.email}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDateShort(ticket.createdAt)}
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {ticket.messages.length} messages
                    </div>
                    {ticket.attachments && ticket.attachments?.length > 0 && (
                      <div className="flex items-center">
                        <Paperclip className="w-4 h-4 mr-1" />
                        {ticket.attachments.length} files
                      </div>
                    )}
                  </div>

                  <span className="text-xs">Updated: {formatDateShort(ticket.updatedAt)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ticket Detail Panel */}
        <div className="lg:col-span-1">
          {selectedTicket ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-lg border border-gray-200 sticky top-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Ticket Details</h3>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTicketStatusColor(selectedTicket.status)}`}
                >
                  {getTicketStatusLabel(selectedTicket.status)}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedTicket.subject}</h4>
                  <p className="text-sm text-gray-600">{selectedTicket.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Priority:</span>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getTicketPriorityColor(selectedTicket.priority)}`}
                    >
                      {getTicketPriorityIcon(selectedTicket.priority)}
                      <span className="ml-1 capitalize">{selectedTicket.priority}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500">Category:</span>
                    <p className="font-medium">{selectedTicket.category}</p>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="text-gray-500">User:</span>
                  <p className="font-medium">{selectedTicket.user.name}</p>
                </div>

                <div className="text-sm">
                  <span className="text-gray-500">Email:</span>
                  <p className="font-medium text-blue-600">{selectedTicket.email}</p>
                </div>

                <div className="text-sm">
                  <span className="text-gray-500 flex items-center mb-1">
                    <Monitor className="w-4 h-4 mr-1" />
                    Device Info:
                  </span>
                  <div className="bg-gray-100 p-2 rounded text-xs font-mono text-gray-700 break-all">
                    {selectedTicket.deviceInfo}
                  </div>
                </div>

                {selectedTicket?.attachments?.length > 0 && (
                  <div className="text-sm">
                    <span className="text-gray-500 flex items-center">
                      <Paperclip className="w-4 h-4 mr-1" />
                      Attachments:
                    </span>
                    <div className="mt-1">
                      {selectedTicket.attachments.map((file: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                          <span className="font-medium">{file.name}</span>
                          <span className="text-gray-500">{file.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <p className="font-medium">{formatDateShort(selectedTicket.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Updated:</span>
                    <p className="font-medium">{formatDateShort(selectedTicket.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Messages ({selectedTicket.messages.length})</h4>
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {selectedTicket.messages.map((message: any) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${message.isStaff ? 'bg-blue-50 ml-4' : 'bg-gray-50 mr-4'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium ${message.isStaff ? 'text-blue-600' : 'text-gray-700'}`}>
                          {message.authorName}
                        </span>
                        <span className="text-xs text-gray-500">{formatDateTime(message.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{message.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Status Actions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Quick Status Update</label>
                <div className="grid grid-cols-2 gap-2">
                  {statusButtons.map((status) => {
                    const IconComponent = status.icon
                    const buttonClicked = currentStatus === status.value
                    const isCurrentStatus = selectedTicket.status === status.value
                    const isDisabled = isCurrentStatus || isLoading

                    return (
                      <button
                        key={status.value}
                        onClick={() => handleStatusChange(selectedTicket.id, status.value)}
                        disabled={isDisabled}
                        className={`flex items-center justify-center px-3 py-2 text-sm font-medium border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${status.colors}`}
                      >
                        {isLoading && buttonClicked ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <IconComponent className="w-4 h-4 mr-1" />
                        )}
                        {status.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Response */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Send Response</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <button
                  onClick={() => handleSendResponse(selectedTicket.id)}
                  disabled={!responseText.trim()}
                  className="mt-3 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Response
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center"
            >
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Ticket</h3>
              <p className="text-gray-600">Choose a ticket from the list to view details and respond</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminTicketsPage
