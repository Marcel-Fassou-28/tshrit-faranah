import { useState } from 'react'
import {motion} from "framer-motion"
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, slugify } from '../context/AuthContext';
import instance from '../config/Axios';
import { Link } from 'react-router-dom';
import { Contact, Lock, LogIn} from 'lucide-react';

function Login() {
  const [formData, setFormData] = useState({email: '',password: ''});
  const { login } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data  = await instance.post('/login', formData);

      if (!data.data.success) {
        setError(data.message || 'Identifiants invalides');
        return;
      }
      login(data.data.token, data.data.user);
      const fullSlug = encodeURIComponent(`${slugify(data.data.user.nom)}-${slugify(data.data.user.prenom)}`);
      navigate(`/${data.data.user.role}/dashboard/${data.data.user.id}/${fullSlug}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de la connexion');
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="flex flex-col">
      <motion.div
      className="sm:mx-auto sm:w-full sm:max-w-md"
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.2, delay: 0.2}}
      >
        <h2 className="mt-6 text-center text-3xl text-[rgba(254,175,48)] font-semibold">Connectez-vous</h2>
      </motion.div>
      <motion.div
      className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm"
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.2, delay: 0.2}}>
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px:10">
          <form onSubmit={handleSubmit} className="space-y-4" method='post'>
            {error && <p className="text-red-500 text-center font-semibold -mt-4 mb-2">{error}</p>}
            {state?.message && <p className="text-green-500 text-center font-semibold transition-all -pt-4 pb-1">{state.message}</p>}
            {state?.error && <p className="text-red-500 text-center font-semibold transition-all -pt-4 pb-1">{state.error}</p>}
            
            {/* Téléphone */}
            <motion.div variants={inputVariants} initial="hidden" animate="visible">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse Email
              </label>
              <div className="relative">
                <Contact className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[rgba(254,175,48)] focus:border-[rgba(254,175,48)]"
                  placeholder="Numéro de Téléphone ou Email"
                  value={formData.email}
                  onChange={handleChange}
                  name='email'
                  required
                />
              </div>
            </motion.div>

            {/* Prénom */}
            <motion.div variants={inputVariants} initial="hidden" animate="visible">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de Passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[rgba(254,175,48)] focus:border-[rgba(254,175,48)]"
                  placeholder="Votre Mot de Passe"
                  value={formData.password}
                  onChange={handleChange}
                  name='password'
                  required
                />
              </div>
            </motion.div>
            <motion.div variants={inputVariants} initial="hidden" animate="visible" className="flex items-center justify-between flex-col">
              <Link to='/forgot-password' className="text-sm text-[rgba(254,175,48)] hover:underline">
                Mot de passe oublié ?
              </Link>
              <button
                type="submit"
                className="bg-[rgba(254,175,48,0.8)] text-white mt-2 px-6 py-2 rounded-md hover:bg-[rgba(254,175,48)] transition justify-center font-semibold flex items-center gap-2 w-full"
              >
                Se connecter <LogIn className="w-4 h-4" />
              </button>
            </motion.div>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Pas de compte ?{' '}
            <Link to="/register" className="text-[rgba(254,175,48)] hover:underline">
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login