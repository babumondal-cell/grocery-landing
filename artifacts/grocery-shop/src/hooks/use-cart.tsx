import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAddToCart, useGetCart, useRemoveFromCart, useUpdateCartQuantity } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetCartQueryKey } from "@workspace/api-client-react";

function getSessionId(): string {
  let id = localStorage.getItem("freshmart_session");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("freshmart_session", id);
  }
  return id;
}

interface CartItem {
  id: number;
  productId: number;
  product_name: string;
  product_image: string;
  price: string;
  quantity: number;
  sessionId: string;
}

interface CartContextType {
  count: number;
  items: CartItem[];
  sessionId: string;
  addItem: (product: { id: number; name: string; image: string; price: string }) => void;
  removeItem: (cartItemId: number) => void;
  updateQuantity: (cartItemId: number, quantity: number) => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [sessionId] = useState(getSessionId);
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useGetCart(
    { sessionId },
    { query: { queryKey: getGetCartQueryKey({ sessionId }) } }
  );

  const addToCartMutation = useAddToCart({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
      },
    },
  });

  const removeFromCartMutation = useRemoveFromCart({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
      },
    },
  });

  const updateQtyMutation = useUpdateCartQuantity({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
      },
    },
  });

  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = (product: { id: number; name: string; image: string; price: string }) => {
    addToCartMutation.mutate({
      data: {
        sessionId,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        price: product.price,
        quantity: 1,
      },
    });
  };

  const removeItem = (cartItemId: number) => {
    removeFromCartMutation.mutate({ id: cartItemId });
  };

  const updateQuantity = (cartItemId: number, quantity: number) => {
    updateQtyMutation.mutate({ id: cartItemId, data: { quantity } });
  };

  return (
    <CartContext.Provider value={{ count, items: cartItems as CartItem[], sessionId, addItem, removeItem, updateQuantity, isLoading }}>
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
