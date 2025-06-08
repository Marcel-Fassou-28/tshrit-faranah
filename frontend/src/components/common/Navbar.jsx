import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, UserCircle, Menu, X, Home, CarFront, Info, Contact, ShoppingCart, LogOut } from 'lucide-react';
import { useAuth, slugify } from '../context/AuthContext';
import Logo from './../../assets/logo.PNG'
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const { cartItemCount } = useCart();

  return (
    <nav className="fixed top-0 w-full py-3 bg-white flex items-center justify-between shadow-sm h-16 z-50 pl-4 sm:pl-6 lg:pl-8 pr-3 sm:pr-5">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/">
          <img src={Logo} alt="Logo" className="h-10 md:h-12 lg:h-14 cursor-pointer transform scale-125 sm:scale-150" />
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className={`flex gap-4 xs:gap-6 absolute ${token ? "left-[60%] xs:left-[47.5%] sm:left-[55%] md:left-[67.5%] lg:left-[75%]" : "left-[47%] xs:left-[60%] md:left-[70%]"} transform -translate-x-1/2 space-x-8 lg:space-x-16`}>
        
          {token && user.role =='admin' ? <Link
            to={`/admin/dashboard/${user.id}/${slugify(user.prenom)}-${slugify(user.nom)}`}
            className="font-semibold text-gray-700 hover:text-[rgba(254,175,48)] transition duration-200"
          >
            Dashboard
          </Link> : <Link
            to={"/"}
            className="font-semibold text-gray-700 hover:text-[rgba(254,175,48)] transition duration-200"
          >
            Accueil
          </Link>}
          {token && user.role =='admin' ?  <Link
            to={`/admin/dashboard/${user.id}/${slugify(user.prenom)}-${slugify(user.nom)}/produits`}
            className="font-semibold text-gray-700 hover:text-[rgba(254,175,48)] transition duration-200"
          >
            Produits
          </Link>:
          <Link to={'/client/panier'} className='relative group transition duration-300 group-hover: ease-in-out'>
            <ShoppingCart size={20} className='inline-block mr-1 group-hover:text-[rgba(254,175,48)]'/>
            <span className='font-semibold hidden sm:inline-block group-hover:text-[rgba(254,175,48)]'>Panier</span>
            {cartItemCount > 0 && (
                        <span className='absolute text-white -top-2 -left-2 bg-[rgba(254,175,48)] rounded-full px-1 font-semibold transition duration-300 ease-in-out text-xs'>
                            {cartItemCount}
                        </span>)}
          </Link>}
      </div>

      {/* Desktop Profile and Buttons */}
      <div className="flex items-center space-x-3 lg:space-x-8">
        {token ? (
          <div className="flex items-center space-x-4">
            {/* Lien de déconnexion */}
            <Link
              to={"/logout"}
              onClick={logout}
              className="flex  items-center px-2 py-1.5 border border-black rounded-md text-black font-semibold hover:bg-[rgba(254,175,48)] hover:text-white transition duration-200"
              aria-label="Déconnexion"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              <span className="hidden xs:inline">Déconnexion</span>
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-2 lg:space-x-3">
            <Link
              to="/login"
              className="flex items-center px-2 py-1.5 border border-black rounded-md text-black font-semibold hover:bg-[rgba(254,175,48)] hover:text-white transition duration-200"
              aria-label="Connexion"
            >
              <UserCircle className="w-4 h-4 mr-1.5" />
              <span className="hidden lg:inline">Connexion</span>
              
            </Link>
            <Link
              to="/register"
              className="flex items-center px-2 py-1.5 border border-black rounded-md text-black font-semibold hover:bg-[rgba(254,175,48)] hover:text-white transition duration-200"
              aria-label="S'inscrire"
            >
              <UserPlus className="w-4 h-4 mr-1.5" />
              <span className="hidden lg:inline">S'inscrire</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;



