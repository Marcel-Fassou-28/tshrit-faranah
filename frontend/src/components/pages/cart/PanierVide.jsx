import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"

function PanierVide() {
  return (
    <motion.div
    className="flex flex-col items-center justify-center space-y-4 py-16"
    initial={{opacity: 0, y: 20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.5}}>
        <ShoppingCart className="h-32 w-32 text-black/50" />
        <h3 className="text-2xl font-semibold">Votre panier est vide</h3>
        <p className="text-black/60">Il parait que vous n'avez rien ajouté à votre panier</p>
        <Link to={'/'}
        className="mt-4 rounded-md font-semibold px-6 py-2 transition-colors bg-[rgba(254,175,48,0.6)] hover:bg-[rgba(254,175,48)]">Ajouter des Articles</Link>
    </motion.div>
  )
}

export default PanierVide
