import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import instance from '../../config/Axios';
import ProductCard from '../utilities/ProductCard';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Toaster } from 'react-hot-toast';


function Category() {
    const { id } = useParams(); 
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Récupérer les détails de la catégorie et ses produits
    useEffect(() => {
        const fetchCategoryDetails = async () => {
            try {
                setLoading(true);
                const response = await instance.get(`/categories/${id}`);
                if (response.data.success) {
                    const { category: categoryData, produits } = response.data.data;
                    setCategory(categoryData);
                    
                    const formattedProducts = produits.map(product => ({
                        id: product.id,
                        name: product.nom_produit,
                        price: product.prix.toString(),
                        imageUrl: product.image_produit,
                        description: product.description || ''
                    }));
                    setProducts(formattedProducts);
                } else {
                    setError(response.data.message || 'Erreur lors de la récupération de la catégorie.');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Une erreur est survenue.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryDetails();
    }, [id]);

    // Afficher le spinner de chargement
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

    // Afficher un message d'erreur
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
        <div className="min-h-screen">
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    duration: 1000,
                    style: {
                        background: 'rgba(254,175,48)',
                        color: '#fff',
                        fontWeight: '550',
                    },
            }} />
            <div className="relative z-10 max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-10 py-14">
                <motion.h1
                    className="text-center text-4xl sm:text-5xl font-bold text-[rgba(254,175,48)]"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {category?.nom_categorie || 'Catégorie'}
                </motion.h1>
                <motion.p
                    className="text-center text-xl text-black/50 mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Découvrez les dernières nouveautés de nos marques
                </motion.p>
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 justify-items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {products.length === 0 && (
                        <h2 className="text-3xl font-semibold text-black/50 text-center col-span-full">
                            Aucun produit trouvé
                        </h2>
                    )}
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

export default Category;
