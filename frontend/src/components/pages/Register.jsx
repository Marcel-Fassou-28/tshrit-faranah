import { useState } from "react"
import { User, Mail, Phone, MapPin, Calendar, Lock, UserPlus, ArrowRight } from 'lucide-react';
import {Link, useNavigate} from "react-router-dom"
import {motion} from "framer-motion"
import instance from "../config/Axios";

function Register() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({nom: '', prenom: '', email: '', telephone: '', password: '', confirmPassword: ''});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
    };
    try {
      const response = await instance.post('/register', submitData);
      if (response.data.success) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l’inscription');
    }
  };

  const [password, setPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (confirmPassword) {
      setPasswordMatchError(newPassword !== confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordMatchError(password !== newConfirmPassword);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex flex-col">
      <motion.div
      className="sm:mx-auto sm:w-full sm:max-w-md"
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.2, delay: 0.2}}
      >
        <h2 className="mt-6 text-center text-3xl text-[rgba(254,175,48)] font-semibold">Créer votre compte</h2>
      </motion.div>
      <motion.div
      className="mt-8 sm:mx-auto sm:w-full sm:max-w-md mb-6"
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.2, delay: 0.2}}>
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px:10">
          <form onSubmit={handleSubmit} className="space-y-2">
            {error && <p className="text-red-500 text-center font-semibold -mt-4 mb-2">{error}</p>}
            {/* Nom */}
            <motion.div variants={inputVariants} initial="hidden" animate="visible">
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="nom"
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[rgba(254,175,48)] focus:border-[rgba(254,175,48)]"
                  placeholder="Votre nom"
                  value={formData.nom}
                  onChange={handleChange}
                  name='nom'
                  required
                />
              </div>
            </motion.div>

            {/* Prénom */}
            <motion.div variants={inputVariants} initial="hidden" animate="visible">
              <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="prenom"
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[rgba(254,175,48)] focus:border-[rgba(254,175,48)]"
                  placeholder="Votre prénom"
                  value={formData.prenom}
                  onChange={handleChange}
                  name='prenom'
                  required
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={inputVariants} initial="hidden" animate="visible">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[rgba(254,175,48)] focus:border-[rgba(254,175,48)]"
                  placeholder="votre adresse adresse email"
                  value={formData.email}
                  onChange={handleChange}
                  name='email'                  
                  required
                />
              </div>
            </motion.div>

            {/* Numéro de téléphone */}
            <motion.div variants={inputVariants} initial="hidden" animate="visible">
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="telephone"
                    type="tel"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[rgba(254,175,48)] focus:border-[rgba(254,175,48)]"
                    placeholder="Votre Numéro de Téléphone"
                    value={formData.telephone}
                    onChange={handleChange}
                    name='telephone'                  
                    required
                  />
                </div>
            </motion.div>
            {/* Mot de passe */}
            <motion.div variants={inputVariants} initial="hidden" animate="visible">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  name='password'
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[rgba(254,175,48)] focus:border-[rgba(254,175,48)]"
                  placeholder="Entrer votre mot de passe"
                  required
                />
              </div>
            </motion.div>

            {/* Confirmation du mot de passe */}
            <motion.div variants={inputVariants} initial="hidden" animate="visible">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  name='confirmPassword'
                  onChange={handleConfirmPasswordChange}
                  className={`w-full pl-10 pr-4 py-2 border ${
                    passwordMatchError ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-2 focus:ring-[rgba(254,175,48)] focus:border-[rgba(254,175,48)]`}
                  placeholder="confirmer votre mot de passe"
                  required
                />
              </div>
              {passwordMatchError && (
                <motion.p
                  className="text-sm text-red-500 mt-1"
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                >
                  Les mots de passe ne correspondent pas
                </motion.p>
              )}
            </motion.div>

            <motion.div
              className="flex justify-end"
              variants={inputVariants}
              initial="hidden"
              animate="visible"
            >
              <button
                type="submit"
                className="bg-[rgba(254,175,48,0.8)] text-white w-full px-6 py-2 rounded-md hover:bg-[rgba(254,175,48)] transition flex font-semibold items-center gap-2 justify-center"
                disabled={passwordMatchError || !password || !confirmPassword}
              >
                S'inscrire <UserPlus className="w-4 h-4 font-semibold" />
              </button>
            </motion.div>
          </form>
          <motion.p
            className="mt-6 text-center text-sm text-gray-600"
            variants={inputVariants}
            initial="hidden"
            animate="visible"
          >
            Avez-vous déjà un compte ?{' '}<Link to="/login" className="text-[rgba(254,175,48)] hover:underline">Connectez-vous</Link>
          </motion.p>

        </div>
      </motion.div>
    </div>
  )
}

export default Register
