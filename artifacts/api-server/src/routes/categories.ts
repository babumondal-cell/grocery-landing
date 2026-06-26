import { Router } from "express";
import { db, categoriesTable } from "@workspace/db";

const categoriesRouter = Router();

categoriesRouter.get("/categories", async (req, res) => {
  try {
    const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.id);
    res.json(categories);
  } catch (error) {
    req.log.error(error, "Failed to fetch categories");
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default categoriesRouter;
