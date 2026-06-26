import { Router } from "express";
import { getSupabaseClient } from "../lib/supabase";

const cartRouter = Router();

cartRouter.get("/cart", async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId || typeof sessionId !== "string") {
      res.status(400).json({ error: "sessionId is required" });
      return;
    }
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    req.log.error(error, "Failed to fetch cart");
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

cartRouter.post("/cart", async (req, res) => {
  try {
    const { sessionId, productId, productName, productImage, price, quantity } = req.body;
    if (!sessionId || !productId || !productName || !productImage || !price) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const supabase = getSupabaseClient();

    const { data: existing } = await supabase
      .from("cart_items")
      .select("*")
      .eq("session_id", sessionId)
      .eq("product_id", productId)
      .limit(1);

    if (existing && existing.length > 0) {
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity: existing[0].quantity + (quantity ?? 1) })
        .eq("id", existing[0].id)
        .select()
        .single();
      if (error) throw error;
      res.status(201).json(data);
      return;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .insert({ session_id: sessionId, product_id: productId, product_name: productName, product_image: productImage, price, quantity: quantity ?? 1 })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    req.log.error(error, "Failed to add to cart");
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

cartRouter.delete("/cart/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("cart_items").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    req.log.error(error, "Failed to remove from cart");
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

cartRouter.patch("/cart/:id/quantity", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      res.status(400).json({ error: "quantity must be >= 1" });
      return;
    }
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    req.log.error(error, "Failed to update cart quantity");
    res.status(500).json({ error: "Failed to update cart quantity" });
  }
});

export default cartRouter;
