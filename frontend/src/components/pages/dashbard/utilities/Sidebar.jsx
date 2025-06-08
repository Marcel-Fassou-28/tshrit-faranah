import { AnimatePresence, motion } from 'framer-motion';
import { BarChart2, Boxes, DollarSign, Menu, Settings, ShoppingBag, ShoppingCart, Users } from 'lucide-react';
import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, slugify } from '../../../context/AuthContext';


const Sidebar = () => {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const {user, token} = useAuth();

  // Theme constants
const THEME = {
  primary: '#FEAF30',
  primaryHover: 'rgba(254,175,48,0.15)',
  activeBg: 'rgba(254,175,48,0.25)',
  sidebarBg: 'rgba(255,255,255,0.98)',
  textPrimary: 'text-black/80',
  textSecondary: 'text-black/50',
  border: 'border-gray-200',
};

const SIDEBAR_ITEMS = [
  { name: 'Accueil', icon: BarChart2, color: '#FEAF30', href: '' },
  { name: 'Produits', icon: ShoppingBag, color: '#F97316', href: 'produits' },
  { name: 'Utilisateurs', icon: Users, color: '#3B82F6', href: 'utilisateurs' },
  { name: 'Commandes', icon: ShoppingCart, color: '#D97706', href: 'commandes' },
  { name: 'Categorie', icon: Boxes, color: '#D97716', href: 'categories' },
]

// Animation variants
const sidebarVariants = {
  open: { width: 240 },
  closed: { width: 72 },
};

const textVariants = {
  open: { opacity: 1, width: 'auto', x: 0 },
  closed: { opacity: 0, width: 0, x: -10 },
};
  

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return (
    <motion.div
      className={`relative z-20 h-screen flex-shrink-0 ${THEME.border} shadow-sm overflow-hidden`}
      variants={sidebarVariants}
      animate={isSidebarOpen ? 'open' : 'closed'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div
        className="h-full flex flex-col p-3"
        style={{
          background: `linear-gradient(145deg, ${THEME.sidebarBg}, rgba(254,175,48,0.8))`,
        }}
      >
        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Réduire la barre latérale' : 'Ouvrir la barre latérale'}
          className="p-2 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-[rgba(254,175,48)] transition-colors self-start"
        >
          <Menu size={22} className={THEME.textSecondary} />
        </motion.button>

        {/* Navigation */}
        <nav className="mt-6 flex-grow">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = location.pathname === item.href || (item.href === '/' && location.pathname === '');
            return (
              <Link key={item.href} to={`/${user.role}/dashboard/${user.id}/${slugify(user.nom)}-${slugify(user.prenom)}/${item.href}`} aria-label={item.name}>
                <motion.div
                  className={`flex items-center p-3 rounded-xl mb-1.5 transition-colors ${
                    isActive ? THEME.activeBg : 'hover:' + THEME.primaryHover
                  } focus:ring-2 focus:ring-[rgba(254,175,48)] outline-none`}
                  whileHover={{ x: isSidebarOpen ? 3 : 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon
                    size={20}
                    style={{ color: isActive ? item.color : `${item.color}99`, minWidth: '20px' }} // Slightly fade inactive icons
                    aria-hidden="true"
                  />
                  <AnimatePresence initial={false}>
                    {isSidebarOpen && (
                      <motion.span
                        className={`ml-3 ${THEME.textPrimary} font-semibold text-sm whitespace-nowrap`}
                        variants={textVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ duration: 0.2, delay: 0.1 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;