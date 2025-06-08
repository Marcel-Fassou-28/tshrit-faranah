import Sidebar from '../utilities/Sidebar'
import StatCard from '../utilities/StatCard'
import { BarChart2, ShoppingBag, Users, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import SalesOverviewChart from './accueil/SalesOverviewChart'
import CategoryDistributionChart from './accueil/CategoryDistributionChart'
import SalesChannelChart from './accueil/SalesChannelChart'
import instance from '../../../config/Axios';
import { useState, useEffect } from 'react'

function DashboardAdmin() {
  const [stats, setStats] = useState({
    total_sales: 0,
    new_users: 0,
    total_products: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await instance.get('/statistics', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setStats(response.data.data);
      } catch (err) {
        setError('Failed to load statistics.');
      }
    };

    fetchStatistics();
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
          <StatCard name="Total Ventes" icon={Zap} value={stats.total_sales} color="#D97706" suffix=" GNF" />
          <StatCard name="Nombre d'Utilisateurs" icon={Users} value={stats.new_users} color="#3B82F6" />
          <StatCard name="Total Produit" icon={ShoppingBag} value={stats.total_products} color="#F97316" />
        </motion.div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <SalesOverviewChart />
            <CategoryDistributionChart />
            <SalesChannelChart />
        </div>
      </main>
      </div>
    </div>
  )
}

export default DashboardAdmin
