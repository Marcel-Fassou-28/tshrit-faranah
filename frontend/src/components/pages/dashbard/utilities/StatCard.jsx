import { motion } from 'framer-motion';
import React from 'react';
import CountUp from 'react-countup';

// Theme constants
const THEME = {
  primary: '#FEAF30',
  hoverBg: 'rgba(254,175,48,0.1)',
  background: 'rgba(255,255,255,0.98)',
  textPrimary: 'text-black/80',
  textSecondary: 'text-black/50',
  border: 'border-gray-200',
};

// Animation variants
const cardVariants = {
  rest: { y: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
  hover: {
    y: -4,
    boxShadow: '0 10px 15px -3px rgba(254, 175, 48, 0.2)',
    transition: { duration: 0.2 },
  },
};

const StatCard = React.memo(({ name, icon: Icon, value, color, suffix = '' }) => {
  // Parse value to number, remove currency/percentage symbols
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;

  return (
    <motion.div
      className={`overflow-hidden rounded-xl ${THEME.border} shadow-sm`}
      style={{
        background: `linear-gradient(145deg, ${THEME.background}, rgba(254,175,48,0.05))`,
      }}
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      aria-labelledby={`stat-${name.replace(/\s+/g, '-')}`}
    >
      <div className="px-4 py-5 sm:p-6">
        <span className={`flex items-center text-sm font-medium ${THEME.textSecondary}`}>
          <Icon size={18} className="mr-2" style={{ color }} aria-hidden="true" />
          {name}
        </span>
        <p
          className={`mt-1 text-2xl sm:text-3xl font-semibold ${THEME.textPrimary}`}
          id={`stat-${name.replace(/\s+/g, '-')}`}
        >
          <CountUp
            end={numericValue}
            duration={2}
            decimals={suffix === '%' ? 1 : 0}
            separator=","
            suffix={suffix}
            preserveValue
          />
        </p>
      </div>
    </motion.div>
  );
});

export default StatCard;