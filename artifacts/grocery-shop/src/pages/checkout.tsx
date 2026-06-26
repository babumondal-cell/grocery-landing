import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, ArrowLeft, CheckCircle, ShoppingBag, CreditCard, Truck, Lock } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCreateOrder } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const { items, sessionId, isLoading } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    notes: "",
  });

  const createOrderMutation = useCreateOrder({
    mutation: {
      onSuccess: (order) => {
        setOrderId(order.id);
        setOrderPlaced(true);
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to place order. Please try again.", variant: "destructive" });
      },
    },
  });

  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const delivery = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + delivery;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast({ title: "Cart is empty", description: "Add items to your cart before checking out." });
      return;
    }
    createOrderMutation.mutate({
      data: {
        sessionId,
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        zip: form.zip,
        notes: form.notes,
      },
    });
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 text-center max-w-md w-full shadow-xl border border-muted"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="h-10 w-10 text-primary" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-2">Order Confirmed!</h2>
          {orderId && <p className="text-muted-foreground text-sm mb-4">Order #{orderId}</p>}
          <p className="text-muted-foreground mb-8">
            Thank you, <strong>{form.name}</strong>! Your fresh groceries are being prepared and will arrive at your door soon.
          </p>
          <div className="bg-muted/30 rounded-2xl p-4 mb-8 text-sm text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery to</span>
              <span className="font-medium text-right">{form.address}, {form.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Confirmation sent to</span>
              <span className="font-medium">{form.email}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1 border-t border-muted">
              <span>Total charged</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
          <Link href="/">
            <Button className="w-full rounded-full h-12 text-base">
              <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-muted sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-7 w-7 text-primary" />
            <span className="font-serif text-xl font-bold text-foreground">FreshMart</span>
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Checkout</h1>
          <Link href="/cart" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Cart
          </Link>
        </div>
      </header>

      {/* Steps */}
      <div className="bg-white border-b border-muted">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center gap-3 text-sm">
            {[{ icon: ShoppingBag, label: "Cart" }, { icon: Truck, label: "Delivery" }, { icon: CreditCard, label: "Payment" }].map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                {i > 0 && <div className="h-px w-8 bg-muted" />}
                <div className={`flex items-center gap-1.5 ${i === 1 ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                  <step.icon className="h-4 w-4" />
                  <span>{step.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 md:px-6 py-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted-foreground mb-4">Your cart is empty.</p>
            <Link href="/"><Button className="rounded-full">Shop Now</Button></Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Delivery & Contact */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact */}
                <div className="bg-white rounded-2xl border border-muted p-6">
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                    <span className="h-7 w-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">1</span>
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" name="name" placeholder="John Smith" required value={form.name} onChange={handleChange} data-testid="input-name" className="rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" name="email" type="email" placeholder="john@example.com" required value={form.email} onChange={handleChange} data-testid="input-email" className="rounded-xl" />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange} data-testid="input-phone" className="rounded-xl" />
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div className="bg-white rounded-2xl border border-muted p-6">
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                    <span className="h-7 w-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">2</span>
                    Delivery Address
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input id="address" name="address" placeholder="123 Main Street, Apt 4" required value={form.address} onChange={handleChange} data-testid="input-address" className="rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" name="city" placeholder="New York" required value={form.city} onChange={handleChange} data-testid="input-city" className="rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="zip">ZIP Code *</Label>
                      <Input id="zip" name="zip" placeholder="10001" required value={form.zip} onChange={handleChange} data-testid="input-zip" className="rounded-xl" />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="notes">Delivery Notes</Label>
                      <Input id="notes" name="notes" placeholder="Leave at door, ring bell, etc." value={form.notes} onChange={handleChange} data-testid="input-notes" className="rounded-xl" />
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="bg-white rounded-2xl border border-muted p-6">
                  <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                    <span className="h-7 w-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">3</span>
                    Payment
                  </h2>
                  <div className="bg-muted/40 rounded-xl p-4 flex items-center gap-3 text-sm text-muted-foreground">
                    <CreditCard className="h-5 w-5 flex-shrink-0" />
                    <span>Payment on delivery. Our driver will collect payment when your order arrives.</span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-muted p-6 sticky top-24">
                  <h3 className="text-lg font-bold mb-5">Order Summary</h3>
                  <div className="space-y-3 mb-5 max-h-60 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 text-sm">
                        <img src={item.productImage} alt={item.productName} className="h-10 w-10 rounded-lg object-cover bg-muted/30 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.productName}</p>
                          <p className="text-muted-foreground">x{item.quantity}</p>
                        </div>
                        <span className="font-semibold">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-muted pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span>{delivery === 0 ? <span className="text-primary font-semibold">Free</span> : `$${delivery.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-2 border-t border-muted">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-full h-12 text-base font-semibold mt-5"
                    disabled={createOrderMutation.isPending}
                    data-testid="button-place-order"
                  >
                    {createOrderMutation.isPending ? (
                      <span className="flex items-center gap-2"><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Placing Order...</span>
                    ) : (
                      <span className="flex items-center gap-2"><Lock className="h-4 w-4" /> Place Order — ${total.toFixed(2)}</span>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
                    <Lock className="h-3 w-3" /> Secure checkout
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
