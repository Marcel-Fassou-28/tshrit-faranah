import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { memo } from "react";

const COLORS = {
  primary: "rgba(254,175,48,1)",
  primaryHover: "rgba(254,175,48,0.8)",
  textPrimary: "text-black",
  textSecondary: "text-black/50",
  error: "text-red-500",
};

const BUTTON_STYLES = {
  base: "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(254,175,48)] transition-colors",
  primary: `${COLORS.primary} hover:${COLORS.primaryHover}`,
  icon: "h-4 w-4",
};

const CartItem = ({ item }) => {
  const { updateQuantity, updateSize, removeFromCart } = useCart();
  const sizes = ["M", "L", "XL", "2XL"];

  const totalPrice = item.price * parseInt(item.quantity);

  const handleQuantityChange = (change) => {
    const newQuantity = parseInt(item.quantity) + change;
    if (newQuantity > 0) {
      updateQuantity(item.id, item.size, newQuantity);
    }
  };

  const handleSizeChange = (e) => {
    updateSize(item.id, item.size, e.target.value);
  };

  return (
    <div className="relative rounded-lg border border-gray-200 bg-white/90 p-4 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        {/* Image Section */}
        <div className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28">
          <img
            className="w-full h-full rounded object-cover"
            src={item.image}
            alt={item.name}
          />
        </div>

        {/* Details Section */}
        <div className="flex-1 space-y-3">
          <p className={`text-base font-semibold ${COLORS.textPrimary} hover:underline`}>
            {item.name}
          </p>
          <p className={`text-sm ${COLORS.textSecondary} line-clamp-2`}>
            {item.description || "Aucune description disponible"}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor={`size-${item.id}`} className="text-sm text-black/50">Taille :</label>
            <select
              id={`size-${item.id}`}
              value={item.size}
              onChange={handleSizeChange}
              className="text-sm text-black bg-white rounded-md border border-gray-200 focus:ring-[rgba(254,175,48)] focus:border-[rgba(254,175,48)]"
            >
              {sizes.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => removeFromCart(item.id, item.size)}
            className={`inline-flex items-center text-sm font-medium ${COLORS.error} hover:underline`}
            aria-label="Remove item from cart"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Supprimer
          </button>
        </div>

        {/* Quantity and Price Section */}
        <div className="flex items-center justify-between gap-6 md:flex-col md:items-end md:gap-4 md:min-w-[160px]">
          <div className="flex items-center gap-3">
            <button
              className={`${BUTTON_STYLES.base} ${BUTTON_STYLES.primary}`}
              onClick={() => handleQuantityChange(-1)}
              aria-label="Decrease quantity"
            >
              <Minus className={BUTTON_STYLES.icon} />
            </button>
            <span className={`w-8 text-center ${COLORS.textPrimary} font-medium`}>
              {item.quantity}
            </span>
            <button
              className={`${BUTTON_STYLES.base} ${BUTTON_STYLES.primary}`}
              onClick={() => handleQuantityChange(1)}
              aria-label="Increase quantity"
            >
              <Plus className={BUTTON_STYLES.icon} />
            </button>
          </div>
          <p className={`text-lg font-bold ${COLORS.primary}`}>
            {totalPrice.toLocaleString("fr-GN", {
              style: "currency",
              currency: "GNF",
              minimumFractionDigits: 0,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(CartItem);