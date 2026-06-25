import { createContext, useContext, useState, ReactNode } from "react";

interface CartContextType {
  count: number;
  addToCart: () => void;
  removeFromCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const addToCart = () => setCount((prev) => prev + 1);
  const removeFromCart = () => setCount((prev) => Math.max(0, prev - 1));
  const clearCart = () => setCount(0);

  return (
    <CartContext.Provider value={{ count, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
