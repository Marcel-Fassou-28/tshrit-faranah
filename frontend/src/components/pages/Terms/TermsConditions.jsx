import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import termsImage from "/about.jpg";

function TermsConditions() {
  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };
  const sections = [
    {
      title: "1. Introduction",
      content:
        "Ces termes et conditions régissent l’utilisation du site web de Faranah Ma Ville, Ma Fierté et les achats effectués auprès de notre marque. En accédant à notre site ou en passant une commande, vous acceptez d’être lié par ces conditions. Si vous n’êtes pas d’accord, veuillez ne pas utiliser notre site. Notre mission est de célébrer Faranah à travers une mode authentique, et ces termes assurent une expérience transparente pour tous.",
    },
    {
      title: "2. Utilisation du Site",
      content:
        "Le contenu de ce site, y compris les textes, images et designs célébrant Faranah, est destiné à un usage personnel et non commercial. Toute reproduction, distribution ou utilisation non autorisée est interdite sans notre consentement écrit. Nous nous réservons le droit de modifier le contenu du site à tout moment.",
    },
    {
      title: "3. Commandes et Paiements",
      content:
        "Toutes les commandes sont soumises à disponibilité et à notre acceptation. Les prix sont indiqués en GNF. Les paiements se font à la livraison. Nous nous réservons le droit de refuser une commande pour des raisons telles que l’indisponibilité des stocks ou des erreurs de prix.",
    },
    {
      title: "4. Livraison",
      content:
        "Nous livrons à Faranah et dans toute la Guinée. Les délais de livraison sont estimatifs et varient selon votre localisation. Les frais de livraison sont calculés au moment du paiement. Soumah Shine n’est pas responsable des retards causés par des transporteurs tiers.",
    },
    {
      title: "5. Retours et Remboursements",
      content:
        "Vous disposez de 14 jours à compter de la réception de votre commande pour retourner les articles non portés, non endommagés et dans leur emballage d’origine. Les frais de retour sont à votre charge, sauf en cas d’erreur de notre part. Les remboursements sont effectués via le mode de paiement initial dans un délai de 10 jours après réception des articles retournés.",
    },
    {
      title: "6. Propriété Intellectuelle",
      content:
        "Tous les designs, logos et contenus liés à Faranah Ma Ville, Ma Fierté sont protégés par des droits d’auteur et des marques déposées. Toute utilisation non autorisée de ces éléments est interdite et peut entraîner des poursuites judiciaires. Nous célébrons l’héritage de Faranah, et nos créations sont uniques à notre marque.",
    },
    {
      title: "7. Limitation de Responsabilité",
      content:
        "Nous nous efforçons de garantir l’exactitude des informations sur notre site, mais ne pouvons être tenus responsables des erreurs ou omissions. Notre responsabilité est limitée au montant de votre commande. Nous ne sommes pas responsables des dommages indirects découlant de l’utilisation de nos produits.",
    },
    {
      title: "8. Droit Applicable",
      content:
        "Ces termes sont régis par le droit français. Tout litige sera soumis aux tribunaux compétents de Paris. Nous nous engageons à résoudre les différends de manière équitable dans la mesure du possible.",
    },
    {
      title: "9. Contact",
      content:
        "Pour toute question sur nos termes et conditions, contactez-nous à soumahc03@gmail.com. Nous sommes fiers de servir notre communauté et sommes disponibles pour répondre à vos préoccupations concernant votre expérience avec Faranah Ma Ville, Ma Fierté.",
    },
  ];

  return (
    <div className="relative min-h-screen text-black overflow-hidden bg-gray-50 -mt-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Termes et Conditions
          </motion.h1>
          <motion.div
            className="w-24 h-1 bg-[rgba(254,175,48)] mb-8"
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <motion.p
            className="text-lg font-light leading-relaxed max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Bienvenue chez <span className="font-semibold uppercase">Faranah Ma Ville, Ma Fierté</span>. Les termes suivants définissent les règles d’utilisation de notre site et de nos services. Lisez-les attentivement pour une expérience fluide et respectueuse.
          </motion.p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="py-16 px-8 md:px-20 lg:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Accordion Sections */}
          <div className="lg:col-span-2 space-y-4">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none"
                >
                  <h3 className="text-xl font-semibold text-[rgba(254,175,48)]">{section.title}</h3>
                  <span className="text-[rgba(254,175,48)]">
                    {openSection === index ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-17 7 7-7" />
                      </svg>
                    )}
                  </span>
                </button>
                <AnimatePresence>
                  {openSection === index && (
                    <motion.div
                      initial={{ height: "0", opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: "0", opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-4"
                    >
                      <p className="text-gray-700 text-lg leading-relaxed">{section.content}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Image Section */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={termsImage}
              alt="Faranah Ma Ville, Ma Fierté"
              className="rounded-xl shadow-xl w-full h-[400px] object-cover"
            />
            <p className="text-center text-gray-600 mt-4 text-sm">
              Célébrons Faranah avec style et fierté.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default TermsConditions;
