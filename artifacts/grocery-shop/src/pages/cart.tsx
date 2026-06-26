import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Leaf, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function CartPage() {
  const { items, removeItem, updateQuantity, isLoading } = useCart();
  const [, setLocation] = useLocation();

  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );
  const delivery = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + delivery;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-muted sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-7 w-7 text-primary" />
            <span className="font-serif text-xl font-bold text-foreground">FreshMart</span>
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Your Cart</h1>
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag className="h-20 w-20 text-muted-foreground/30 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add some fresh items from our shop.</p>
            <Link href="/">
              <Button size="lg" className="rounded-full px-8">Shop Now <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold mb-6">{items.length} item{items.length !== 1 ? "s" : ""} in your cart</h2>
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-muted shadow-sm"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="h-20 w-20 rounded-xl object-cover bg-muted/30 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{item.productName}</h3>
                      <p className="text-primary font-bold mt-1">${parseFloat(item.price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                        data-testid={`button-decrease-${item.id}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        data-testid={`button-increase-${item.id}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-right min-w-[70px]">
                      <p className="font-bold">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                      data-testid={`button-remove-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-muted p-6 sticky top-24 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Order Summary</h3>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-medium">
                      {delivery === 0 ? <span className="text-primary font-semibold">Free</span> : `$${delivery.toFixed(2)}`}
                    </span>
                  </div>
                  {delivery > 0 && (
                    <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
                      Add ${(50 - subtotal).toFixed(2)} more for free delivery
                    </p>
                  )}
                  <div className="border-t border-muted pt-3 flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  className="w-full rounded-full h-12 text-base font-semibold"
                  onClick={() => setLocation("/checkout")}
                  data-testid="button-checkout"
                >
                  Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link href="/">
                  <Button variant="ghost" className="w-full mt-3 rounded-full">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
