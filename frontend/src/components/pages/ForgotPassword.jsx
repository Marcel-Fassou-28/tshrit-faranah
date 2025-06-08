import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '../config/Axios';

function ForgotPassword() {
  const [formData, setFormData] = useState({ email: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/email', { email: formData.email });
      if (response.data.success) {
        setSuccess(response.data.message || 'Un lien de réinitialisation a été envoyé à votre adresse e-mail.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(response.data.message || 'Échec de l\'envoi du lien de réinitialisation.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="flex flex-col min-h-screen pt-16">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
      >
        <h2 className="mt-6 text-center text-3xl text-[rgba(254,175,48)] font-semibold">Mot de Passe Oublié</h2>
      </motion.div>
      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <p className="text-red-500 text-center font-semibold -mt-4 mb-2">{error}</p>}
          {success && <p className="text-green-500 text-center font-semibold -mt-4 mb-2">{success}</p>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <motion.div variants={inputVariants} initial="hidden" animate="visible">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[rgba(254,175,48)] focus:border-[rgba(254,175,48)]"
                  placeholder="Votre adresse email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </motion.div>
            <motion.div variants={inputVariants} initial="hidden" animate="visible" className="flex items-center justify-between flex-col">
              <Link to='/login' className="text-sm text-[rgba(254,175,48)] hover:underline">
                 Retour à la connexion
              </Link>
              <button
                type="submit"
                className="bg-[rgba(254,175,48,0.8)] text-white mt-2 px-6 py-2 rounded-md hover:bg-[rgba(254,175,48)] transition justify-center font-semibold flex items-center gap-2 w-full"
              >
                Réinitialiser son Mot de Passe <ArrowRight className="w-4 h-4" />
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
  );
}

export default ForgotPassword;