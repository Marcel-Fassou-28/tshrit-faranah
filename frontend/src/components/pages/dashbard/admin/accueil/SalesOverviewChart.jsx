import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AlertCircle, Loader2 } from 'lucide-react';
import instance from '../../../../config/Axios';

// Theme constants
const THEME = {
  primary: '#FEAF30',
  secondary: '#D97706',
  background: 'rgba(255,255,255,0.98)',
  border: 'border-gray-200',
  textPrimary: 'text-black/80',
  textSecondary: 'text-black/50',
  grid: '#E5E7EB',
  axis: '#6B7280',
};

// Animation variants
const chartVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const SalesOverviewChart = React.memo(() => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await instance.get('/statistics/monthly-sales', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data && Array.isArray(response.data.data)) {
          setSalesData(response.data.data);
        } else {
          throw new Error('Invalid response format: Expected an array in data.data');
        }
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.response?.data?.message || 'Failed to load sales data.');
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  // Custom tooltip formatter
  const formatTooltip = (value) => {
    return [`${value.toLocaleString('en-US')} GNF`, 'Sales'];
  };

  if (loading) {
      return (
        <motion.div
          className={`flex flex-col items-center rounded-xl ${THEME.border} justify-center border text-center shadow-sm h-[280px] sm:h-[320px]`}
          role="status"
          style={{
            background: `linear-gradient(145deg, ${THEME.background}, rgba(254,175,48,0.05))`,
          }}
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          aria-label="Loading category distribution"
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
        className={`flex flex-col items-center rounded-xl ${THEME.border} justify-center border text-center shadow-sm h-[280px] sm:h-[320px]`}
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

  if (!salesData.length) {
    return (
      <motion.div
        className={`flex flex-col items-center rounded-xl ${THEME.border} justify-center border text-center shadow-sm h-[280px] sm:h-[320px]`}
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
      className={`rounded-xl ${THEME.border} shadow-sm p-6 overflow-hidden`}
      style={{
        background: `linear-gradient(145deg, ${THEME.background}, rgba(254,175,48,0.05))`,
      }}
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      aria-labelledby="sales-overview-chart-title"
    >
      <h2
        id="sales-overview-chart-title"
        className={`text-lg font-semibold ${THEME.textPrimary} mb-4`}
      >
        Sales Overview
      </h2>
      <div className="h-[280px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            <Line
              type="monotone"
              dataKey="sales"
              stroke={THEME.primary}
              strokeWidth={3}
              dot={{ fill: THEME.secondary, stroke: THEME.secondary, strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: THEME.secondary, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});

export default SalesOverviewChart;
