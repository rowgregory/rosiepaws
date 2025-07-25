'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Calendar,
  Clock,
  User,
  Mail,
  Tag,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Paperclip,
  Download,
  Send,
  Upload,
  Loader2
} from 'lucide-react'
import { useCreateTicketMessageMutation, useFetchTicketByIdQuery } from '@/app/redux/services/ticketApi'
import { RootState, useAppSelector } from '@/app/redux/store'

const getStatusColor = (status: any) => {
  switch (status) {
    case 'open':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'closed':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getPriorityColor = (priority: any) => {
  switch (priority) {
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getStatusIcon = (status: any) => {
  switch (status) {
    case 'open':
      return <AlertCircle className="w-4 h-4" />
    case 'in_progress':
      return <Clock className="w-4 h-4" />
    case 'resolved':
      return <CheckCircle className="w-4 h-4" />
    case 'closed':
      return <XCircle className="w-4 h-4" />
    default:
      return <AlertCircle className="w-4 h-4" />
  }
}

const TicketDetailPage = () => {
  const params = useParams() // Get params from Next.js
  const router = useRouter()
  const ticketId = params.ticketId as string // Extract ticketId from params

  const [newMessage, setNewMessage] = useState('')
  const [attachments, setAttachments] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { isLoading, isError, error } = useFetchTicketByIdQuery(ticketId, {
    skip: !ticketId // Skip query if no ticketId
  }) as any
  const [createTicketMessage] = useCreateTicketMessageMutation()

  const { ticket } = useAppSelector((state: RootState) => state.ticket)
  const { user } = useAppSelector((state: RootState) => state.user)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleString()
  }

  const handleFileUpload = (e: any) => {
    const files: any = Array.from(e.target.files)
    setAttachments(files)
  }

  const handleSubmitMessage = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!newMessage.trim() || !ticket) return

    setIsSubmitting(true)
    try {
      await createTicketMessage({
        ticketId: ticket.id,
        content: newMessage,
        attachments,
        authEmail: user?.email,
        authorName: user?.name
      }).unwrap()

      setNewMessage('')
      setAttachments([])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ticket Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error?.data?.message ||
              'The ticket you are looking for does not exist or you do not have permission to view it.'}
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // No ticket data
  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Ticket Data</h2>
          <p className="text-gray-600">Unable to load ticket information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ticket #{ticket?.id?.slice(-8)}</h1>
                <p className="text-gray-600 mt-1">{ticket?.subject}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ticket?.status)}`}
                >
                  {getStatusIcon(ticket?.status)}
                  {ticket?.status?.replace('_', ' ').toUpperCase()}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(ticket?.priority)}`}
                >
                  {ticket?.priority?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Category</p>
                    <p className="text-sm text-gray-600 capitalize">{ticket?.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Submitted by</p>
                    <p className="text-sm text-gray-600">{ticket?.user?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{ticket?.email}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-600">{formatDate(ticket?.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-sm text-gray-600">{formatDate(ticket?.updatedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Messages</p>
                    <p className="text-sm text-gray-600">{(ticket?.messages?.length || 0) + 1} total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Original Issue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Original Issue</h2>
          </div>
          <div className="px-6 py-4">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{ticket?.description}</p>

            {ticket?.attachments && ticket?.attachments?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Attachments</h3>
                <div className="space-y-2">
                  {ticket?.attachments.map((attachment: any) => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{attachment?.filename}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(attachment?.size)}</p>
                        </div>
                      </div>
                      <button className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages/Conversation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Conversation</h2>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-6">
              {ticket?.messages && ticket?.messages?.length > 0 ? (
                ticket?.messages?.map((message: any) => (
                  <div key={message?.id} className={`flex gap-4 ${message?.isStaff ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message?.isStaff ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {message?.isStaff ? '🎧' : '👤'}
                    </div>
                    <div className={`flex-1 max-w-3xl ${message?.isStaff ? '' : 'text-right'}`}>
                      <div
                        className={`inline-block p-4 rounded-lg ${
                          message?.isStaff ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className={`text-sm font-medium ${message?.isStaff ? 'text-blue-900' : 'text-gray-900'}`}>
                            {message?.authorName || (message?.isStaff ? 'Support Team' : ticket.user?.name || 'You')}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(message?.createdAt)}</p>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{message?.content}</p>

                        {message?.attachments && message?.attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message?.attachments.map((attachment: any) => (
                              <div key={attachment.id} className="flex items-center gap-2 text-sm">
                                <Paperclip className="w-3 h-3 text-gray-400" />
                                <span className="text-blue-600 hover:underline cursor-pointer">
                                  {attachment.filename}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No messages yet. Our support team will respond soon!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Message Form */}
        {ticket.status !== 'closed' && (
          <form onSubmit={handleSubmitMessage} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Add a Message</h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your message</label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Provide additional details or ask questions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-vertical"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="message-files"
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="message-files"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer text-sm"
                    >
                      Choose Files
                    </label>
                    {attachments.length > 0 && (
                      <div className="mt-3 text-left">
                        <p className="text-sm font-medium text-gray-700 mb-2">Selected files:</p>
                        <ul className="space-y-1">
                          {attachments.map((file: any, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                              <Paperclip className="w-3 h-3" />
                              {file.name} ({formatFileSize(file.size)})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default TicketDetailPage
