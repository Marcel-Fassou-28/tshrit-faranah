import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import instance from '../../../../config/Axios';
import { AlertCircle } from 'lucide-react';

// Theme constants
const THEME = {
  primary: '#FEAF30',
  background: 'rgba(255,255,255,0.98)',
  border: 'border-gray-200',
  textPrimary: 'text-black/80',
  textSecondary: 'text-black/50',
};

// Colors
const COLORS = ['#FEAF30', '#F97316', '#D97706', '#3B82F6', '#10B981'];

// Animation variants
const chartVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const CategoryDistributionChart = React.memo(() => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const response = await instance.get('/statistics/categories', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data && Array.isArray(response.data.data)) {
            const formattedData = response.data.data.map(item => ({
              name: item.categoryName || item.name || 'Unknown',
              value: Number(item.amount || item.value || 0),
            }));
            setCategoryData(formattedData);
        } else {
          throw new Error('Invalid response format: Expected an array in data.data');
        }
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.response?.data?.message || 'Failed to load category distribution data.');
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);
  
  
  // Custom tooltip formatter
  const formatTooltip = (value, name) => {
    return [`${value.toLocaleString('en-US')} GNF`, name];
  };

  // Custom label renderer
  const renderCustomLabel = ({ name, percent, cx, cy, midAngle, outerRadius }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill={THEME.textPrimary.replace('text-', '')}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name} (${(percent * 100).toFixed(1)}%)`}
      </text>
    );
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
  if (!categoryData.length) {
    return (
      <motion.div
        className={`flex flex-col items-center rounded-xl ${THEME.border} justify-center border text-center shadow-sm`}
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
      aria-labelledby="category-distribution-chart-title"
    >
      <h2
        id="category-distribution-chart-title"
        className={`text-lg font-semibold ${THEME.textPrimary} mb-4`}
      >
        Category Distribution
      </h2>
      <div className="h-[280px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={90}
              dataKey="value"
              label={renderCustomLabel}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: THEME.background,
                border: `1px solid ${THEME.border.split(' ')[1]}`,
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.8)',
              }}
              itemStyle={{ color: THEME.textPrimary.replace('text-', '') }}
              formatter={formatTooltip}
            />
            <Legend
              wrapperStyle={{ color: THEME.textSecondary.replace('text-', '') }}
              formatter={(value) => (
                <span style={{ color: THEME.textPrimary.replace('text-', '') }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});

export default CategoryDistributionChart;
