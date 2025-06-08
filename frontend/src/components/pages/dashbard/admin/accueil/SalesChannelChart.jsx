import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import instance from '../../../../config/Axios';

// Theme constants
const THEME = {
  primary: '#FEAF30',
  background: 'rgba(255,255,255,0.98)',
  border: 'border-gray-200',
  textPrimary: 'text-black/80',
  textSecondary: 'text-black/50',
  grid: '#E5E7EB',
  axis: '#6B7280',
};

// Colors
const COLORS = ['#FEAF30', '#F97316', '#D97706', '#3B82F6', '#10B981', '#6B7280'];

// Animation variants
const chartVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const SalesChannelChart = React.memo(() => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await instance.get('/statistics/category-sales', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (response.data && Array.isArray(response.data.data)) {
          setCategoryData(response.data.data);
        } else {
          throw new Error('Invalid response format: Expected an array in data.data');
        }
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.response?.data?.message || 'Failed to load category sales data.');
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  // Custom tooltip formatter
  const formatTooltip = (value) => {
    return [`${value.toLocaleString('en-US')} GNF`, 'Revenue'];
  };

  if (loading) {
    return (
      <motion.div
        className={`flex flex-col items-center lg:col-span-2 rounded-xl ${THEME.border} justify-center border text-center shadow-sm h-[300px] sm:h-[350px]`}
        role="status"
        style={{
          background: `linear-gradient(145deg, ${THEME.background}, rgba(254,175,48,0.05))`,
        }}
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        aria-label="Loading category sales data"
      >
        <div className="text-center">
          <div className="pt-16 flex flex-col md:flex-row min-h-screen">
            <main className="flex-1 p-6 md:p-8 flex justify-center items-center relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-[rgba(254,175,48)]"></div>
            </main>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className={`flex flex-col items-center lg:col-span-2 rounded-xl ${THEME.border} justify-center border text-center shadow-sm h-[300px] sm:h-[350px]`}
        role="alert"
        style={{
          background: `linear-gradient(145deg, ${THEME.background}, rgba(254,175,48,0.05))`,
        }}
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        aria-label="Error loading data"
      >
        <AlertCircle size={40} className="mb-2" style={{ color: THEME.primary }} />
        <p className={`text-lg font-semibold ${THEME.textSecondary}`}>
          {error}
        </p>
      </motion.div>
    );
  }

  if (!categoryData.length) {
    return (
      <motion.div
        className={`flex flex-col items-center lg:col-span-2 rounded-xl ${THEME.border} justify-center border text-center shadow-sm h-[300px] sm:h-[350px]`}
        role="alert"
        style={{
          background: `linear-gradient(145deg, ${THEME.background}, rgba(254,175,48,0.05))`,
        }}
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        aria-label="No data available"
      >
        <AlertCircle size={40} className="mb-2" style={{ color: THEME.primary }} />
        <p className={`text-lg font-semibold ${THEME.textSecondary}`}>
          No Data Available
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`rounded-xl ${THEME.border} shadow-sm p-6 lg:col-span-2 overflow-hidden`}
      style={{
        background: `linear-gradient(145deg, ${THEME.background}, rgba(254,175,48,0.05))`,
      }}
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      aria-labelledby="sales-channel-chart-title"
    >
      <h2
        id="sales-channel-chart-title"
        className={`text-lg font-semibold ${THEME.textPrimary} mb-4`}
      >
        Sales by Category
      </h2>
      <div className="h-[300px] sm:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={THEME.grid} strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke={THEME.axis} tick={{ fontSize: 12 }} />
            <YAxis
              stroke={THEME.axis}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000}k GNF`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: THEME.background,
                border: `1px solid ${THEME.border.split(' ')[1]}`,
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}
              itemStyle={{ color: THEME.textPrimary.replace('text-', '') }}
              formatter={formatTooltip}
            />
            <Legend wrapperStyle={{ color: THEME.textSecondary.replace('text-', '') }} />
            <Bar dataKey="value">
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});

export default SalesChannelChart;
