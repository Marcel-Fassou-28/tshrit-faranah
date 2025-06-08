import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import UserInfoForm from "./UserInfoForm";
import instance from "../../config/Axios";
import toast from "react-hot-toast";
import { useAuth } from '../../context/AuthContext'

const CheckoutSummary = ({ cartTotal }) => {
  const { cartItems, updateSize, setCartItems, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const {user, token} = useAuth();
  const [showUserForm, setShowUserForm] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [guestId, setGuestId] = useState(null);
  const sizes = ["M", "L", "XL", "XXL"];

  const formattedTotal =
    typeof cartTotal === "number" && !isNaN(cartTotal)
      ? cartTotal.toLocaleString("fr-GN", {
          style: "currency",
          currency: "GNF",
          minimumFractionDigits: 0,
        })
      : "0 GNF";

  const handleSizeChange = (item, newSize) => {
    updateSize(item.id, item.size, newSize);
  };

  const handleUserInfoSubmit = (info) => {
    setUserInfo(info);
    setShowUserForm(false);
    setError(null);
  };

  const handleCheckout = async () => {
    const savedGuestId = localStorage.getItem('guest_id');
    setGuestId(savedGuestId);

    if (!userInfo) {
      setError("Veuillez renseigner vos informations.");
      setShowUserForm(true);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const commandData = {
        items: cartItems.map((item) => ({
          produit_id: item.id,
          quantity: item.quantity,
          taille: item.size,
        })),
        user: {
          nom: userInfo.nom,
          prenom: userInfo.prenom,
          email: userInfo.email,
          telephone: userInfo.telephone,
        },
        delivery: {
          telephone: userInfo.telephone,
          ville: userInfo.ville,
          adresse_1: userInfo.adresse_1,
          adresse_2: userInfo.adresse_2 || "",
        },
        user_id: user ? user.id : null,
        guest_id: guestId,
      };
       
      const response = await instance.post("/panier/commande", commandData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data.success) {
        await clearCart();
        toast.success("Commande passée avec succès !");
        setUserInfo(null);
        setShowUserForm(true);
      } else {
        setError(response.data.message || "Erreur lors de la commande.");
        toast.error(response.data.message || "Erreur lors de la commande.");
      }
    } catch (error) {
      setError("Erreur lors de la commande.");
      toast.error("Erreur lors de la commande.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="pt-10">
      {showUserForm ? (
        <UserInfoForm
          onSubmit={handleUserInfoSubmit}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <motion.div
          className="mt-8 lg:mt-0 rounded-lg border border-gray-200 bg-white/90 p-4 shadow-sm md:mt-0 md:sticky md:top-8 md:p-6 lg:w-[400px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-black mb-4">
            Résumé de la commande
          </h2>
          <div className="space-y-4">
            {/* User Info Summary */}
            <div className="text-sm text-gray-600 px-2 py-3 rounded-lg shadow-sm border-black/50">
              <p>
                <strong>Client:</strong> {userInfo.prenom} {userInfo.nom}
              </p>
              <p>
                <strong>Email:</strong> {userInfo.email}
              </p>
              <p>
                <strong>Téléphone:</strong> {userInfo.telephone}
              </p>
              <p>
                <strong>Adresse:</strong> {userInfo.adresse_1}, {userInfo.ville}
                {userInfo.adresse_2 && `, ${userInfo.adresse_2}`}
              </p>
              <button
                onClick={() => setShowUserForm(true)}
                className="text-[rgba(254,175,48)] hover:underline text-sm mt-2"
              >
                Modifier les informations
              </button>
            </div>

            {/* Liste des articles */}
            <div className="space-y-2">
              {cartItems.map((item) => (
                <motion.div
                  key={`${item.id}-${item.size}`}
                  className="flex justify-between items-center text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <p className="text-black">{item.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-black/50">Taille :</span>
                      <select
                        value={item.size}
                        onChange={(e) => handleSizeChange(item, e.target.value)}
                        className="text-sm text-black bg-white rounded-md border border-gray-200 focus:ring-[rgba(254,175,48)] focus:border-[rgba(254,175,48)]"
                      >
                        {sizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <p className="text-black">
                    {(item.price * item.quantity).toLocaleString("fr-GN", {
                      style: "currency",
                      currency: "GNF",
                      minimumFractionDigits: 0,
                    })}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Total */}
            <motion.div
              className="flex justify-between items-center"
              key={formattedTotal}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg text-black">Total</p>
              <p className="text-xl font-bold text-[rgba(254,175,48,1)]">
                {formattedTotal}
              </p>
            </motion.div>

            {/* Message d'erreur */}
            <AnimatePresence>
              {error && (
                <motion.p
                  className="text-sm text-red-500 text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Bouton de paiement */}
            <motion.button
              className="inline-flex items-center justify-center rounded-md border font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(254,175,48)] transition-colors bg-[rgba(254,175,48,1)] hover:bg-[rgba(254,175,48,0.8)] text-white w-full py-3 px-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCheckout}
              aria-label="Envoyer la commande"
              disabled={
                !userInfo ||
                typeof cartTotal !== "number" ||
                cartTotal <= 0 ||
                isLoading
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? (
                <motion.span
                  className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              ) : (
                "Envoyer la commande"
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CheckoutSummary;