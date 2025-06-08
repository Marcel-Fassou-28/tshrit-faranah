import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, RefreshCcw, ShoppingCart } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import instance from '../../config/Axios'; // Configuration Axios
import ProductCard from '../utilities/ProductCard';

const Product = () => {
    const { category, id, product } = useParams();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState('M');
    const [productData, setProductData] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const sizes = ['M', 'L', 'XL', '2XL'];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const productResponse = await instance.get(`/produits/${product}`);
                if (productResponse.data?.success) {
                    setProductData(productResponse.data.data);
                } else {
                    throw new Error('Produit non trouvé');
                }

                const relatedResponse = await instance.get(`/produits?category=${category}`);
                if (relatedResponse.data?.success) {

                    const filteredProducts = relatedResponse.data.data.filter(
                        item => item.id !== parseInt(id)
                    );
                    setRelatedProducts(filteredProducts);
                }
            } catch (err) {
                setError('Impossible de charger le produit.');
                toast.error('Erreur lors du chargement du produit.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, category]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error('Veuillez sélectionner une taille.');
            return;
        }
        addToCart({
            id: productData.id,
            name: productData.name,
            price: parseFloat(productData.price),
            image: productData.imageUrl,
            size: selectedSize
        });
    };

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
        <div className="py-16 px-4 md:px-8 lg:px-16 max-w-screen-xl mx-auto">

            {/* Détails du produit */}
            <motion.div
                className="grid md:grid-cols-2 gap-8 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
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
                {/* Image */}
                <div className="relative">
                    <img
                        src={productData.imageUrl}
                        alt={productData.name}
                        className="w-full h-[400px] md:h-[500px] object-cover rounded-lg shadow-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-10 rounded-lg" />
                </div>

                {/* Informations */}
                <div className="flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
                            {productData.name}
                        </h1>
                        <p className="text-black/50 text-lg mb-6">
                            {productData.description || 'Aucune description disponible.'}
                        </p>
                        <p className="text-2xl font-semibold text-[rgba(254,175,48)] mb-6">
                            {parseFloat(productData.price).toLocaleString('fr-GN', {
                                style: 'currency',
                                currency: 'GNF',
                                minimumFractionDigits: 0
                            })}
                        </p>
                    </div>
                    <div>
                        <div className="mb-4">
                            <label htmlFor="size-select" className="text-sm text-black/50 mr-2">
                                Taille :
                            </label>
                            <select
                                id="size-select"
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                className="rounded-md border border-gray-300 text-sm text-black bg-white focus:ring-[rgba(254,175,48)] focus:border-[rgba(254,175,48)] py-2 px-3"
                            >
                                {sizes.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                        <motion.button
                            className="flex items-center justify-center w-full rounded-lg bg-[rgba(254,175,48,0.8)] px-6 py-3 text-center text-base font-medium text-white hover:bg-[rgba(254,175,48)] focus:ring-4 focus:ring-[rgba(254,175,48)]"
                            onClick={handleAddToCart}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ShoppingCart size={24} className="mr-2" />
                            Ajouter au panier
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Autres produits de la même catégorie */}
            {relatedProducts.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold text-black mb-6">
                        Autres produits dans {category}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedProducts.slice(0, 6).map(relatedProduct => (
                            <ProductCard
                                key={relatedProduct.id}
                                product={relatedProduct}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Product;
