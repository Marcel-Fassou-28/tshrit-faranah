import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import PanierVide from './PanierVide';
import CartItem from './CartItem';
import CheckoutSummary from './CheckoutSummary';
import { Toaster } from 'react-hot-toast';

function Panier() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();

    return (
        <div className='py-8 md:py-16'>
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
          <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
            <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
               <motion.div
               className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-3xl'
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.5, delay: 0.2}}>
                  {cartItems.length === 0 ? (
                    <PanierVide />
                  ) : (
                    <div className='space-y-4'>
                      {cartItems.map((item) => (
                        <CartItem key={item.id} item={item} />
                      ))}
                    </div>
                  )}
               </motion.div>
               {cartItems.length > 0 && (
            <CheckoutSummary cartTotal={cartTotal} />
          )}
            </div>
          </div>
        </div>
    );
}

export default Panier;
