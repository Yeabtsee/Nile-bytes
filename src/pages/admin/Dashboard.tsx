import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FolderKanban, Users, Mail, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function Dashboard() {
  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    team: 0,
    messages: 0,
    newMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [servicesRes, projectsRes, teamRes, messagesRes, newMessagesRes] = await Promise.all([
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('portfolio_projects').select('id', { count: 'exact', head: true }),
        supabase.from('team_members').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('status', 'new')
      ]);

      setStats({
        services: servicesRes.count || 0,
        projects: projectsRes.count || 0,
        team: teamRes.count || 0,
        messages: messagesRes.count || 0,
        newMessages: newMessagesRes.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Services',
      value: stats.services,
      icon: Briefcase,
      color: 'bg-blue-500',
      link: '/admin/services'
    },
    {
      title: 'Portfolio Projects',
      value: stats.projects,
      icon: FolderKanban,
      color: 'bg-cyan-500',
      link: '/admin/portfolio'
    },
    {
      title: 'Team Members',
      value: stats.team,
      icon: Users,
      color: 'bg-green-500',
      link: '/admin/team'
    },
    {
      title: 'Total Messages',
      value: stats.messages,
      icon: Mail,
      color: 'bg-orange-500',
      link: '/admin/messages'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-12 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  to={card.link}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </Link>
              );
            })}
          </div>

          {stats.newMessages > 0 && (
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-6 h-6" />
                    <h3 className="text-xl font-bold">New Messages</h3>
                  </div>
                  <p className="text-blue-100 mb-4">
                    You have {stats.newMessages} new message{stats.newMessages !== 1 ? 's' : ''} waiting for your attention
                  </p>
                  <Link
                    to="/admin/messages"
                    className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                  >
                    View Messages
                  </Link>
                </div>
                <Mail className="w-16 h-16 text-blue-200" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
