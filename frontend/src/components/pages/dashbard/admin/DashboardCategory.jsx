import { DollarSign, Package, ShoppingBag } from 'lucide-react'
import Sidebar from '../utilities/Sidebar'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react';
import StatCard from '../utilities/StatCard';
import CategoryTable from './categories/CategoryTable';
import instance from '../../../config/Axios';

function DashboardCategory() {
    const [stats, setStats] = useState({
        total_categorie: 0,
        total_products: 0,
        total_revenue: '0.00',
      });
      const [error, setError] = useState(null);

    useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await instance.get('/categorie/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.success) {
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
          <StatCard name="Total Categorie" icon={Package} value={stats.total_categorie} color="#D97706" />
          <StatCard name="Total Produit" icon={ShoppingBag} value={stats.total_products} color="#3B82F6" />
          <StatCard name="Total Revenue" icon={DollarSign} value={stats.total_revenue} color='#ef4444' suffix=" GNF" />
        </motion.div>
        <CategoryTable />
        </main>
      </div>
    </div>
  )
}

export default DashboardCategory
