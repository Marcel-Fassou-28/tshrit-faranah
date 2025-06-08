import { ShoppingCart } from "lucide-react";
import toast from 'react-hot-toast';
import { useAuth, slugify } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";

function ProductCard({ product }) {
    const { user } = useAuth();
    const { category, id} = useParams();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState("M"); // Taille par défaut

    const sizes = ["M", "L", "XL", "2XL"];

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image: product.imageUrl,
            size: selectedSize // Ajouter la taille
        });
    };

    return (
        <Link to={`/categories/${category}/${id}/${product.id}`} target="self" className="flex w-full relative flex-col overflow-hidden rounded-lg border-[rgba(254,175,48)] shadow-lg hover:transition-transform duration-300 hover:scale-105">
            <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
                <img src={product.imageUrl} alt="image produit" className="object-cover w-full" />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
            </div>
            <div className="mt-4 px-5 pb-5">
                <h5 className="text-xl font-semibold tracking-tight text-black/60">{product.name}</h5>
                <div className="mt-2 mb-5 flex items-center justify-between">
                    <p>
                        <span className="text-3xl font-bold text-[rgba(254,175,48)]">{product.price} GNF</span>
                    </p>
                </div>
                <div className="mb-4">
                    <label htmlFor="size-select" className="text-sm text-black/50 mr-2">Taille :</label>
                    <select
                        id="size-select"
                        value={selectedSize}
                        onClick={(e) => e.preventDefault()} // Empêche la navigation
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="rounded-md border border-gray-300 text-sm text-black bg-white focus:ring-[rgba(254,175,48)] focus:border-[rgba(254,175,48)]"
                    >
                        {sizes.map((size) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>
                <button
                    className="flex items-center justify-center rounded-lg bg-[rgba(254,175,48,0.8)] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[rgba(254,175,48)] focus:ring-4 focus:ring-[rgba(254,175,48)]"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart size={22} className="mr-2" />
                    Ajouter au panier
                </button>
            </div>
        </Link>
    );
}

export default ProductCard;
