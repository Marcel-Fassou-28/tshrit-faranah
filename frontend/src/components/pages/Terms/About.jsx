import { motion } from "framer-motion"
import aboutAction from '/about-value.jpg'

function About() {
  return (
    <div className="relative min-h-screen text-black overflow-hidden -mt-6">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-8 md:px-16 ">
        <div className="max-w-6xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[rgba(254,175,48)]">FARANAH</span> MA VILLE, MA FIERTÉ
          </motion.h1>
          <motion.div 
            className="w-24 h-1 bg-[rgba(254,175,48)] mb-8"
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <motion.p 
            className="text-xl font-light leading-relaxed max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Avec <span className="font-semibold uppercase">Faranah ma ville, ma fierté </span>, nous faisons plus que créer des vêtements :
            nous célébrons l’identité, la culture et la fierté de toute une ville.
            Notre mission est de mettre en valeur Faranah à travers une mode authentique, engagée et inspirante.
          </motion.p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="py-16 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Notre Histoire */}
          <div className="mb-16">
            <motion.h2 
              className="text-3xl uppercase font-semibold mb-6 text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Notre Vision et Nos Valeurs
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-700 leading-relaxed mb-8 font-[400]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              À travers des créations originales et porteuses de sens, nous célébrons Faranah, son histoire, sa culture et son peuple.
              Notre marque s'adresse à toutes celles et ceux qui veulent affirmer leur identité, qu'ils soient natifs de la ville, membres de la diaspora ou simples admirateurs de son héritage.
              Chaque pièce est pensée avec passion pour allier style, qualité et fierté.
            </motion.p>
          </div>

          {/* Image et Valeurs */}
          <div className="flex flex-col lg:flex-row gap-12 items-center">

            <motion.div 
              className="lg:w-1/2 h-full"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <img 
                src={aboutAction} 
                alt="à propos de nos actions" 
                className="rounded-xl shadow-xl w-full h-auto object-cover" 
              />
            </motion.div> 
            <div className="lg:w-1/2 space-y-8">

                <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
                >
                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-[rgba(254,175,48)] mb-2">Fierté & Identité</h3>
                    <p className="text-gray-700">
                        Chaque vêtement est une déclaration d’amour à Faranah — ses racines, ses valeurs, et sa culture. Nous croyons en une mode qui porte un message fort et rassembleur.
                    </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-[rgba(254,175,48)] mb-2">Authenticité & Créativité</h3>
                    <p className="text-gray-700">
                        Nos collections s’inspirent de l’âme de Faranah, alliant design moderne et références culturelles. Chaque pièce est conçue pour être unique, porteuse de sens et de style.
                    </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-[rgba(254,175,48)] mb-2">Engagement Local</h3>
                    <p className="text-gray-700">
                        Nous travaillons avec des talents locaux et mettons en avant le savoir-faire de notre région pour créer une marque fièrement enracinée dans son territoire.
                    </p>
                    </div>
                </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[rgba(254,175,48)] text-black py-12 px-8 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-black/80 mb-6">Prêt à porter fièrement vos origines ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Explorez notre collection unique et affichez votre amour pour Faranah avec style et fierté.
          </p>
          <a href="/" className="bg-white cursor-pointer text-black font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-lg">
            Acheter maintenant
          </a>
        </div>
      </div> 
    </div>
  )
}

export default About
