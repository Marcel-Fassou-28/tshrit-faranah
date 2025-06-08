import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { FaTiktok, FaXTwitter, FaFacebook, FaInstagram } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import Logo from './../../assets/logo.PNG'

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[radial-gradient(ellipse_at_top,rgba(254,175,48,0.5)_0%,rgba(255,255,255,1)_45%,rgba(255,255,255,1)_100%)] text-[#1F2937] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Section 1 : À propos */}
          <div className='flex flex-col items-start'>
            <h3 className="text-xl uppercase cursor-pointer font-bold text-[rgba(254,175,48)] mb-4"><Link to={"/"}>Soumah Shine</Link></h3>
            <p className="text-base text-[#4B5563] font-semibold">
              Découvrez les dernières tendances en matière de t-shirts avec Soumah Shine. Qualité, style et confort garantis.
            </p>
            <img src={Logo} alt="Logo" className="h-20 cursor-pointer transform scale-125 sm:scale-150 ml-10"/>
          </div>

          {/* Section 2 : Navigation */}
          <div>
            <h3 className="text-xl font-bold text-[rgba(254,175,48)] mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-base font-semibold text-[#4B5563] hover:text-[rgba(254,175,48)] transition-colors duration-300"
                >
                  Accueil
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-base font-semibold text-[#4B5563] hover:text-[rgba(254,175,48)] transition-colors duration-300"
                >
                  Catégories
                </a>
              </li>
              <li>
                <a
                  href="/termes-et-conditions"
                  className="text-base font-semibold text-[#4B5563] hover:text-[rgba(254,175,48)] transition-colors duration-300"
                >
                  Nos termes et Conditions
                </a>
              </li>
              <li>
                <a
                  href="/a-propos"
                  className="text-base font-semibold text-[#4B5563] hover:text-[rgba(254,175,48)] transition-colors duration-300"
                >
                  A Propos de nous
                </a>
              </li>
            </ul>
          </div>

          {/* Section 3 : Contact & Social */}
          <div>
            <h3 className="text-xl font-bold text-[rgba(254,175,48)]  mb-4">Contactez-nous</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-base text-[#4B5563]">
                <Mail className="w-5 h-5 mr-2 text-[rgba(254,175,48)]" />
                <a href="mailto:soumahc03@gmail.com" className="hover:text-[rgba(254,175,48)] font-semibold transition-colors duration-300">
                  soumahc03@gmail.com
                </a>
              </li>
              <li className="flex items-center text-base text-[#4B5563]">
                <Phone className="w-5 h-5 mr-2 text-[rgba(254,175,48)]" />
                <a href="tel:+224123456789" className="hover:text-[rgba(254,175,48)] font-semibold transition-colors duration-300">
                  +224 123 456 789
                </a>
              </li>
            </ul>
            <div className="mt-6 flex space-x-4 items-center justify-center">
              <motion.a
                href="#"
                target='_blank'
                className="text-[#4B5563] font-semibold hover:text-[rgba(254,175,48)]"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaInstagram className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="https://www.facebook.com/share/1Aq3W3XiLu/"
                target='_blank'
                className="text-[#4B5563] font-semibold hover:text-[rgba(254,175,48)]"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaFacebook className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="#"
                target='_blank'
                className="text-[#4B5563] font-semibold hover:text-[rgba(254,175,48)]"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaXTwitter className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="#"
                target='_blank'
                className="text-[#4B5563] font-semibold hover:text-[rgba(254,175,48)]"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTiktok className="w-6 h-6" />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Bas du footer */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-200 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className="text-base text-black font-semibold">
            &copy; {currentYear} Soumah Shine. Tous droits réservés.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
