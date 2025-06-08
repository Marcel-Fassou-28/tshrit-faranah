import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';
import instance from '../config/Axios';

const CartContext = createContext();

export function CartProvider({ children }) {
    const { token, user } = useAuth();

    const getInitialCart = () => {
        try {
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            return [];
        }
    };

    const [cartItems, setCartItems] = useState(getInitialCart);
    const [guestId, setGuestId] = useState(null);

    useEffect(() => {
        if (token && user) {
            syncCartWithApi();
        } else {
            let savedGuestId = localStorage.getItem('guest_id');
            if (!savedGuestId) {
                savedGuestId = uuidv4();
                localStorage.setItem('guest_id', savedGuestId);
            }
            setGuestId(savedGuestId);
        }
    }, [token, user]);

    useEffect(() => {
        try {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        } catch (error) {
            throw new Error("Erreur")
        }
    }, [cartItems]);

        // Ajouter un produit au panier
    const addToCart = async (product) => {
        const existingItem = cartItems.find(
            item => item.id === product.id && item.size === product.size
        );
        let updatedCart;
        if (existingItem) {
            updatedCart = cartItems.map(item =>
                item.id === product.id && item.size === product.size
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            updatedCart = [...cartItems, { ...product, quantity: 1 }];
        }
        setCartItems(updatedCart);
        toast.success(`${product.name} ajouté au panier !`);
         
        try {
            const payload = {
               ...product,
               quantity: 1,
               user_id: user ? user.id : null,
               guest_id: guestId || token,
           };
            await instance.post('/panier', payload);

        } catch (error) {
            throw new Error("Erreur");
        }
    };


    const syncCartWithApi = async () => {
        try {
            const response = await instance.get('/panier');
            const apiItems = response.data?.data || [];

            const localItems = [...cartItems];
            const mergedItems = [];

            for (const apiItem of apiItems) {
                const localItem = localItems.find(
                    item => item.id === apiItem.produit_id && item.size === apiItem.taille
                );

                if (localItem) {
                    // Fusion : priorité aux données de l'API
                    mergedItems.push({
                        ...localItem,
                        quantity: parseInt(apiItem.quantity),
                        price: parseFloat(apiItem.price),
                        name: apiItem.name,
                        image: apiItem.image,
                    });
                } else {
                    // Ajout d’un item qui n’existe pas encore localement
                    mergedItems.push({
                        id: apiItem.produit_id,
                        name: apiItem.name || 'Produit inconnu',
                        price: parseFloat(apiItem.price || 0),
                        image: apiItem.image,
                        quantity: parseInt(apiItem.quantity || 1),
                        size: apiItem.taille || 'M'
                    });
                }
            }

            // Envoi des éléments locaux non encore en base
            for (const localItem of localItems) {
                const alreadySynced = mergedItems.find(
                    item => item.id === localItem.id && item.size === localItem.size
                );

                if (!alreadySynced) {
                    const itemToSend = {
                        ...localItem,
                        quantity: localItem.quantity || 1,
                        user_id: user ? user.id : null,
                        guest_id: guestId || token,
                    };

                    await instance.post('/panier', itemToSend);
                    mergedItems.push(localItem);
                }
            }

            if (JSON.stringify(mergedItems) !== JSON.stringify(cartItems)) {
                setCartItems(mergedItems);
            }

        } catch (error) {
            console.error("Erreur lors de la synchronisation du panier :", error);
        }
    };

    // Mettre à jour la quantité
    const updateQuantity = async (productId, size, newQuantity) => {
        if (newQuantity < 1) return removeFromCart(productId, size);

        const updatedCart = cartItems.map(item =>
            item.id === productId && item.size === size
                ? { ...item, quantity: newQuantity }
                : item
        );
        setCartItems(updatedCart);

        try {
            await instance.put(`/panier/${productId}`, {
                quantity: newQuantity,
                size,
                user_id: user ? user.id : null,
                guest_id: guestId,
            }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
        } catch (error) {
            toast.error("Erreur lors de la mise à jour de la quantité.");
        }
    };

    // Mettre à jour la taille
    const updateSize = async (productId, oldSize, newSize) => {
        const itemToUpdate = cartItems.find(item => item.id === productId && item.size === oldSize);
        if (!itemToUpdate) return;

        const existingWithNewSize = cartItems.find(item => item.id === productId && item.size === newSize);
        let updatedCart;

        if (existingWithNewSize) {
            updatedCart = cartItems.map(item => {
                if (item.id === productId && item.size === oldSize) return null;
                if (item.id === productId && item.size === newSize) {
                    return { ...item, quantity: item.quantity + itemToUpdate.quantity };
                }
                return item;
            }).filter(Boolean);
        } else {
            updatedCart = cartItems.map(item =>
                item.id === productId && item.size === oldSize
                    ? { ...item, size: newSize }
                    : item
            );
        }

        setCartItems(updatedCart);
        try {
            await instance.put(`/panier/size/${productId}`, {
                taille: newSize,
                user_id: user ? user.id : null,
                guest_id: guestId,
            }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
        } catch (error) {
            toast.error("Erreur lors de la mise à jour de la taille.");
        }
    };


    // Supprimer un produit
    const removeFromCart = async (productId, size) => {
        const updatedCart = cartItems.filter(item => !(item.id === productId && item.size === size));
        setCartItems(updatedCart);
        toast.success('Produit retiré du panier.');

        try {
            await instance.delete(`/panier/${productId}`, {
                data: {
                    size,
                    user_id: user ? user.id : null,
                    guest_id: guestId,
                },
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
        } catch (error) {
            toast.error('Erreur lors de la suppression.');
        }
    };

    // Vider le panier
    const clearCart = async () => {
        setCartItems([]);
        localStorage.removeItem('cart');

        try {
            await instance.post(`/panier/clear`, {
                user_id: user ? user.id : null,
                guest_id: guestId,
            }, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        } catch (error) {
            throw new Error("Erreur");
        }
    };


    // Calculer cartItemCount et cartTotal avec useMemo
    const cartItemCount = useMemo(
        () => cartItems.reduce((total, item) => total + item.quantity, 0),
        [cartItems]
    );
    const cartTotal = useMemo(
        () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
        [cartItems]
    );

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            updateQuantity,
            updateSize,
            removeFromCart,
            clearCart,
            cartItemCount,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}