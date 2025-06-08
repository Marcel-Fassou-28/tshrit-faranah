import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const UserInfoForm = ({ onSubmit, isLoading, error }) => {
  const [userInfo, setUserInfo] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    ville: "",
    adresse_1: "",
    adresse_2: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!userInfo.nom) errors.nom = "Le nom est requis.";
    if (!userInfo.prenom) errors.prenom = "Le prénom est requis.";
    if (!userInfo.email || !/\S+@\S+\.\S+/.test(userInfo.email))
      errors.email = "Un email valide est requis.";
    if (!userInfo.telephone || !/^\+?\d{9,15}$/.test(userInfo.telephone))
      errors.telephone = "Un numéro de téléphone valide est requis.";
    if (!userInfo.ville) errors.ville = "La ville est requise.";
    if (!userInfo.adresse_1) errors.adresse_1 = "L'adresse principale est requise.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(userInfo);
    }
  };

  return (
    <motion.div
      className="mt-8 lg:mt-0 rounded-lg border border-gray-200 bg-white/90 p-4 shadow-sm md:p-6 "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-black mb-4">
        Informations de commande
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-700">Nom</label>
            <input
              type="text"
              name="nom"
              value={userInfo.nom}
              onChange={handleChange}
              className={`w-full bg-white border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[rgba(254,175,48)] transition ${
                formErrors.nom ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {formErrors.nom && (
              <p className="text-sm text-red-500">{formErrors.nom}</p>
            )}
          </div>
          <div>
            <label className="text-gray-700">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={userInfo.prenom}
              onChange={handleChange}
              className={`w-full bg-white border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[rgba(254,175,48)] transition ${
                formErrors.prenom ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {formErrors.prenom && (
              <p className="text-sm text-red-500">{formErrors.prenom}</p>
            )}
          </div>
          <div>
            <label className="text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={userInfo.email}
              onChange={handleChange}
              className={`w-full bg-white border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[rgba(254,175,48)] transition ${
                formErrors.email ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {formErrors.email && (
              <p className="text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>
          <div>
            <label className="text-gray-700">Téléphone</label>
            <input
              type="text"
              name="telephone"
              value={userInfo.telephone}
              onChange={handleChange}
              className={`w-full bg-white border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[rgba(254,175,48)] transition ${
                formErrors.telephone ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {formErrors.telephone && (
              <p className="text-sm text-red-500">{formErrors.telephone}</p>
            )}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-700">Ville</label>
            <input
              type="text"
              name="ville"
              value={userInfo.ville}
              onChange={handleChange}
              className={`w-full bg-white border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[rgba(254,175,48)] transition ${
                formErrors.ville ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {formErrors.ville && (
              <p className="text-sm text-red-500">{formErrors.ville}</p>
            )}
          </div>
          <div>
            <label className="text-gray-700">Adresse principale</label>
            <input
              type="text"
              name="adresse_1"
              value={userInfo.adresse_1}
              onChange={handleChange}
              className={`w-full bg-white border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[rgba(254,175,48)] transition ${
                formErrors.adresse_1 ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {formErrors.adresse_1 && (
              <p className="text-sm text-red-500">{formErrors.adresse_1}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className="text-gray-700">Adresse secondaire (optionnel)</label>
            <input
              type="text"
              name="adresse_2"
              value={userInfo.adresse_2}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-[rgba(254,175,48)] transition"
            />
          </div>
        </div>

        {/* Error from Submission */}
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

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="w-full bg-[rgba(254,175,48,1)] text-white rounded-lg py-3 px-6 font-medium hover:bg-[rgba(254,175,48,0.8)] focus:ring-2 focus:ring-[rgba(254,175,48)] transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
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
            "Valider les informations"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default UserInfoForm;