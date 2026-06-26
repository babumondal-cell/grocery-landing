import { Router } from "express";
import { getSupabaseClient } from "../lib/supabase";

const categoriesRouter = Router();

categoriesRouter.get("/categories", async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    req.log.error(error, "Failed to fetch categories");
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default categoriesRouter;
