import { useEffect, useState } from 'react';
import Sidebar from '../utilities/Sidebar'
import StatCard from '../utilities/StatCard';
import { AlertTriangle, DollarSign, Package, TrendingUp } from 'lucide-react';
import CommandTable from './commandes/CommandTable';
import { motion } from 'framer-motion';
import instance from '../../../config/Axios';

function DashboardCommandes() {

  const [stats, setStats] = useState({
      total_orders: 0,
      new_orders: 0,
      total_revenue: '0.00',
    });
    const [error, setError] = useState(null);
    useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await instance.get('/commands/stats', {
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
        className='grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8'
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 1}}
        >
          <StatCard name="Total Commandes" icon={Package} value={stats.total_orders} color="#D97706" />
          <StatCard name="Nouvelles Commandes" icon={TrendingUp} value={stats.new_orders} color="#3B82F6" />
          <StatCard name="Total Revenue" icon={DollarSign} value={stats.total_revenue} color='#ef4444' suffix=" GNF" />
        </motion.div>
        <CommandTable />
      </main>
      </div>
    </div>
  )
}

export default DashboardCommandes