import { Router } from "express";
import { getSupabaseClient } from "../lib/supabase";

const ordersRouter = Router();

ordersRouter.post("/orders", async (req, res) => {
  try {
    const { sessionId, name, email, phone, address, city, zip, notes } = req.body;
    if (!sessionId || !name || !email || !address || !city || !zip) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const supabase = getSupabaseClient();

    // Fetch cart items to calculate total
    const { data: cartItems, error: cartError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("session_id", sessionId);

    if (cartError) throw cartError;
    if (!cartItems || cartItems.length === 0) {
      res.status(400).json({ error: "Cart is empty" });
      return;
    }

    const total = cartItems
      .reduce((sum: number, item: any) => sum + parseFloat(item.price) * item.quantity, 0)
      .toFixed(2);

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ session_id: sessionId, name, email, phone: phone || null, address, city, zip, notes: notes || null, total, status: "confirmed" })
      .select()
      .single();

    if (orderError) throw orderError;

    // Save order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      price: item.price,
      quantity: item.quantity,
    }));

    await supabase.from("order_items").insert(orderItems);

    // Clear the cart
    await supabase.from("cart_items").delete().eq("session_id", sessionId);

    res.status(201).json(order);
  } catch (error) {
    req.log.error(error, "Failed to create order");
    res.status(500).json({ error: "Failed to create order" });
  }
});

export default ordersRouter;
