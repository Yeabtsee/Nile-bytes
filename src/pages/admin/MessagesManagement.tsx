import { useEffect, useState } from 'react';
import { Mail, Search, Trash2, Archive, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Message {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  status: 'new' | 'read' | 'archived';
  created_at: string;
}

export function MessagesManagement() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'archived'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      let query = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (id: string, status: 'new' | 'read' | 'archived') => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      await fetchMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    } catch (error) {
      console.error('Error updating message status:', error);
      alert('Failed to update message status');
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    if (message.status === 'new') {
      await updateMessageStatus(message.id, 'read');
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (msg.company && msg.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700';
      case 'read':
        return 'bg-green-100 text-green-700';
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages & Leads</h1>
        <p className="text-gray-600">Manage contact form submissions</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        <div className="flex space-x-2">
          {(['all', 'new', 'read', 'archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {filteredMessages.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No messages found</p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all cursor-pointer ${
                    selectedMessage?.id === message.id
                      ? 'border-blue-500'
                      : 'border-transparent hover:border-gray-200'
                  }`}
                  onClick={() => handleViewMessage(message)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{message.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(message.status)}`}>
                          {message.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{message.email}</p>
                      {message.company && (
                        <p className="text-sm text-gray-500">{message.company}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(message.created_at)}</span>
                  </div>
                  <p className="text-gray-700 line-clamp-2">{message.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedMessage ? (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Message Details</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedMessage.status)}`}>
                  {selectedMessage.status}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Name</label>
                  <p className="text-gray-900 mt-1">{selectedMessage.name}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <p className="text-gray-900 mt-1">
                    <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:text-blue-700">
                      {selectedMessage.email}
                    </a>
                  </p>
                </div>

                {selectedMessage.company && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Company</label>
                    <p className="text-gray-900 mt-1">{selectedMessage.company}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold text-gray-700">Date</label>
                  <p className="text-gray-900 mt-1">{formatDate(selectedMessage.created_at)}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Message</label>
                  <p className="text-gray-900 mt-1 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-200">
                {selectedMessage.status !== 'read' && (
                  <button
                    onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-semibold"
                  >
                    <Eye className="w-5 h-5" />
                    <span>Mark as Read</span>
                  </button>
                )}

                {selectedMessage.status !== 'archived' && (
                  <button
                    onClick={() => updateMessageStatus(selectedMessage.id, 'archived')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                  >
                    <Archive className="w-5 h-5" />
                    <span>Archive</span>
                  </button>
                )}

                <button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-semibold"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
