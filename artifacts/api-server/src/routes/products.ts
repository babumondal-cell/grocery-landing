import { Router } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, and, SQL } from "drizzle-orm";

const productsRouter = Router();

productsRouter.get("/products", async (req, res) => {
  try {
    const { categoryId, featured } = req.query;
    const conditions: SQL[] = [];

    if (categoryId) {
      conditions.push(eq(productsTable.categoryId, Number(categoryId)));
    }
    if (featured === "true") {
      conditions.push(eq(productsTable.isFeatured, true));
    }

    const products =
      conditions.length > 0
        ? await db.select().from(productsTable).where(and(...conditions)).orderBy(productsTable.id)
        : await db.select().from(productsTable).orderBy(productsTable.id);

    res.json(products);
  } catch (error) {
    req.log.error(error, "Failed to fetch products");
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

export default productsRouter;
