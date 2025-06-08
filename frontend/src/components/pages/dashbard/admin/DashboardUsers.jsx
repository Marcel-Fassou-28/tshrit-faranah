import Sidebar from '../utilities/Sidebar'
import StatCard from '../utilities/StatCard'
import { motion } from 'framer-motion'
import { AlertTriangle, DollarSign, Package, TrendingUp, User2, User2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import instance from '../../../config/Axios'
import UsersTable from './users/UsersTable'

function DashboardUsers() {
  const [stats, setStats] = useState({
    total_users: 0,
    new_users: 0,
    admin_users: 0,
    client_users: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await instance.get('/users/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data && response.data.data) {
          setStats(response.data.data);
        } else {
          throw new Error('Invalid response format: Expected data object');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard statistics.');
      }
    };

    fetchStats();
  }, []);

  return (
    <div className='flex h-screen overflow-hidden -mt-6'>
      <Sidebar />
      <div className='flex-1 overflow-auto relative z-10 pt-4 scrollbar-hide'>
                  <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div
        className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 1}}
        >
          <StatCard name="Total Utilisateurs" icon={Package} value={stats.total_users} color="#D97706" />
          <StatCard name="Nouvelles Utilisateurs" icon={TrendingUp} value={stats.new_users} color="#3B82F6" />
          <StatCard name="Nombre d'Admin" icon={User2} value={stats.admin_users} color="#F97316" />
          <StatCard name="Nombre de Clients" icon={User2Icon} value={stats.client_users} color='#ef4444'/>
        </motion.div>
        <UsersTable />
      </main>  
      </div>
    </div>
  )
}

export default DashboardUsers