import { Router } from "express";
import { getSupabaseClient } from "../lib/supabase";

const productsRouter = Router();

productsRouter.get("/products", async (req, res) => {
  try {
    const { categoryId, featured } = req.query;
    const supabase = getSupabaseClient();

    let query = supabase.from("products").select("*").order("id");

    if (categoryId) {
      query = query.eq("category_id", Number(categoryId));
    }
    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    req.log.error(error, "Failed to fetch products");
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

export default productsRouter;
