import { useEffect, useState } from 'react';
import instance from './../config/Axios';
import CategoryItem from './utilities/CategoryItem';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

function Home() {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les catégories au chargement du composant
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await instance.get('/categories');
        if (response.data.success) {
          const formattedCategories = response.data.data.map(category => ({
            href: `/${category.nom_categorie}/${category.id}`,
            name: category.nom_categorie,
            id: category.id,
            imageUrl: category.photo
          }));
          setCategories(formattedCategories);
        } else {
          setError(response.data.message || 'Erreur lors de la récupération des catégories.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Une erreur est survenue.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <div className="pt-16 flex flex-col md:flex-row min-h-screen">
          <main className="flex-1 p-6 md:p-8 flex justify-center items-center relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-[rgba(254,175,48)]"></div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen">
            <div className="relative z-15 max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-10 py-14">
                <motion.div
                    className="mx-auto max-w-lg rounded-lg border border-gray-200 bg-white/90 p-6 shadow-sm text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        x: [0, -10, 10, -5, 5, 0],
                    }}
                    transition={{
                        opacity: { duration: 0.8, ease: "easeOut" },
                        scale: { type: "spring", stiffness: 100, damping: 10 },
                        x: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
                    }}
                    role="alert"
                    aria-live="assertive"
                >
                    <AlertTriangle className="mx-auto w-12 h-12 text-red-500 mb-4" />
                    <h2 className="text-2xl font-semibold text-red-500 mb-2">
                        Une erreur est survenue
                    </h2>
                    <p className="text-lg text-black/50 mb-6">
                        {error || "Veuillez réessayer plus tard."}
                    </p>
                    <motion.button
                        className="inline-flex items-center justify-center rounded-md border font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(254,175,48)] transition-colors bg-[rgba(254,175,48,1)] hover:bg-[rgba(254,175,48,0.8)] text-white py-2 px-4 text-base"
                        onClick={() => window.location.reload()} // Simple retry action
                        aria-label="Réessayer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <RefreshCcw className="w-5 h-5 mr-2" />
                        Réessayer
                    </motion.button>
                </motion.div>
            </div>
        </div>
       );
   }

  return (
    <div className="relative min-h-screen text-black overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-[rgba(254,175,48)] mb-4">
          Explorer nos Catégories
        </h1>
        <p className="text-center text-xl text-black/50 mb-12">
          Découvrez les dernières nouveautés de nos marques
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <CategoryItem category={category} key={category.id} />
          ))}
        </div>
      </div>
      
    </div>
  );
}

export default Home;
